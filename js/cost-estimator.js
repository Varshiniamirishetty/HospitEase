// Global variables
let costMap;
let userMarker;
let searchMarker;
let hospitalMarkers = [];
const statusMessage = document.getElementById('cost-status');
const procedureSelect = document.getElementById('procedureSelect');
const showHospitalsBtn = document.getElementById('show-hospitals-btn');
const useMyLocationBtn = document.getElementById('cost-use-my-location-btn');
const searchRadius = document.getElementById('cost-search-radius');
const locationSearch = document.getElementById('cost-location-search');
const searchBtn = document.getElementById('cost-search-btn');
const hospitalCostList = document.getElementById('hospital-cost-list');
const hospitalCostContainer = document.getElementById('hospital-cost-container');

// Procedure cost data (base costs in INR)
const procedureCosts = {
    "General Consultation": 500,
    "MRI Scan": 8000,
    "CT Scan": 5000,
    "Ultrasound": 2000,
    "Blood Test Panel": 1500,
    "ECG": 800,
    "X-Ray": 1000,
    "Knee Replacement": 250000,
    "Cataract Surgery": 30000,
    "Angioplasty": 200000,
    "Appendectomy": 50000,
    "Dialysis (per session)": 3000,
    "Cesarean Delivery": 60000
};

// Procedure details for what's included/excluded
const procedureDetails = {
    "General Consultation": {
        included: "Basic consultation with a general physician",
        excluded: "Specialist consultation, tests, medications"
    },
    "MRI Scan": {
        included: "Basic MRI scan of one body part",
        excluded: "Contrast agent, specialist consultation, additional scans"
    },
    "CT Scan": {
        included: "Basic CT scan of one body part",
        excluded: "Contrast agent, specialist consultation, additional scans"
    },
    "Ultrasound": {
        included: "Basic ultrasound of one body part",
        excluded: "Specialist consultation, additional scans"
    },
    "Blood Test Panel": {
        included: "Basic blood test panel (CBC, lipid profile, liver function)",
        excluded: "Specialized tests, consultation"
    },
    "ECG": {
        included: "Basic electrocardiogram",
        excluded: "Specialist consultation, additional cardiac tests"
    },
    "X-Ray": {
        included: "Basic X-ray of one body part",
        excluded: "Multiple X-rays, specialist consultation"
    },
    "Knee Replacement": {
        included: "Surgery, basic implant, 3-5 days hospital stay",
        excluded: "Premium implants, extended stay, physiotherapy sessions"
    },
    "Cataract Surgery": {
        included: "Basic surgery, standard lens implant",
        excluded: "Premium lenses, pre-op tests, post-op medications"
    },
    "Angioplasty": {
        included: "Basic procedure, one stent",
        excluded: "Multiple stents, ICU stay beyond 24 hours, medications"
    },
    "Appendectomy": {
        included: "Surgery, 2-3 days hospital stay",
        excluded: "Extended stay, complications, additional treatments"
    },
    "Dialysis (per session)": {
        included: "Standard hemodialysis session",
        excluded: "Medications, additional tests, specialist consultation"
    },
    "Cesarean Delivery": {
        included: "Surgery, 3-4 days hospital stay",
        excluded: "Anesthesia, complications, NICU care if needed"
    }
};

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Handle mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    navbarToggle.addEventListener('click', function() {
        navbarMenu.classList.toggle('active');
    });
    
    // Add event listeners
    showHospitalsBtn.addEventListener('click', handleShowHospitals);
    useMyLocationBtn.addEventListener('click', getUserLocation);
    searchBtn.addEventListener('click', handleLocationSearch);
    
    // Add geocoder control to the map
    addGeocoder();
});

// Initialize the map
function initMap() {
    // Create a map centered on a default location (will be updated with user's location)
    costMap = L.map('cost-map').setView([0, 0], 2);
    
    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(costMap);
}

// Add geocoder control to the map
function addGeocoder() {
    // Create a geocoder control
    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: "Search for a location...",
        errorMessage: "Nothing found.",
        suggestMinLength: 3,
        suggestTimeout: 250,
        queryMinLength: 1
    }).addTo(costMap);
    
    // Handle geocoding results
    geocoder.on('markgeocode', function(e) {
        const result = e.geocode;
        const latlng = result.center;
        
        // Update the search input with the found location name
        locationSearch.value = result.name;
        
        // Set the map view to the found location
        costMap.setView(latlng, 14);
        
        // Add or update the search marker
        if (searchMarker) {
            searchMarker.setLatLng(latlng);
        } else {
            searchMarker = L.marker(latlng, {
                icon: L.divIcon({
                    className: 'search-marker',
                    html: '<div style="background-color: #e74c3c; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
                    iconSize: [15, 15],
                    iconAnchor: [7.5, 7.5]
                })
            }).addTo(costMap);
        }
        
        // If a procedure is selected, fetch hospitals
        if (procedureSelect.value) {
            fetchHospitalsForCostEstimation(latlng.lat, latlng.lng);
        }
    });
}

// Get user's location
function getUserLocation() {
    if (navigator.geolocation) {
        statusMessage.innerHTML = '<p><span class="loading-spinner"></span> Detecting your location...</p>';
        statusMessage.className = 'status-message';
        
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                
                // Center map on user's location
                costMap.setView([latitude, longitude], 14);
                
                // Add marker for user's location
                if (userMarker) {
                    userMarker.setLatLng([latitude, longitude]);
                } else {
                    userMarker = L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: 'user-marker',
                            html: '<div style="background-color: #3498db; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
                            iconSize: [15, 15],
                            iconAnchor: [7.5, 7.5]
                        })
                    }).addTo(costMap);
                    userMarker.bindPopup('You are here').openPopup();
                }
                
                // Remove search marker if it exists
                if (searchMarker) {
                    costMap.removeLayer(searchMarker);
                    searchMarker = null;
                }
                
                // If a procedure is selected, fetch hospitals
                if (procedureSelect.value) {
                    fetchHospitalsForCostEstimation(latitude, longitude);
                } else {
                    statusMessage.innerHTML = '<p>Your location has been set. Please select a medical procedure to see cost estimates.</p>';
                    statusMessage.className = 'status-message success';
                }
            },
            error => {
                handleLocationError(error);
            }
        );
    } else {
        statusMessage.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
        statusMessage.className = 'status-message error';
    }
}

// Handle location search
function handleLocationSearch() {
    const searchText = locationSearch.value.trim();
    
    if (!searchText) {
        statusMessage.innerHTML = '<p>Please enter a location to search.</p>';
        statusMessage.className = 'status-message error';
        return;
    }
    
    statusMessage.innerHTML = '<p><span class="loading-spinner"></span> Searching for location...</p>';
    statusMessage.className = 'status-message';
    
    // Use OpenStreetMap Nominatim API for geocoding
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`;
    
    fetch(nominatimUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                statusMessage.innerHTML = '<p>Location not found. Please try a different search term.</p>';
                statusMessage.className = 'status-message error';
                return;
            }
            
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            
            // Center map on the found location
            costMap.setView([lat, lng], 14);
            
            // Add or update the search marker
            if (searchMarker) {
                searchMarker.setLatLng([lat, lng]);
            } else {
                searchMarker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'search-marker',
                        html: '<div style="background-color: #e74c3c; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
                        iconSize: [15, 15],
                        iconAnchor: [7.5, 7.5]
                    })
                }).addTo(costMap);
            }
            searchMarker.bindPopup(`Searched: ${result.display_name}`).openPopup();
            
            // Remove user marker if it exists
            if (userMarker) {
                costMap.removeLayer(userMarker);
                userMarker = null;
            }
            
            // If a procedure is selected, fetch hospitals
            if (procedureSelect.value) {
                fetchHospitalsForCostEstimation(lat, lng);
            } else {
                statusMessage.innerHTML = '<p>Location found. Please select a medical procedure to see cost estimates.</p>';
                statusMessage.className = 'status-message success';
            }
        })
        .catch(error => {
            console.error('Error searching for location:', error);
            statusMessage.innerHTML = '<p>Error searching for location. Please try again later.</p>';
            statusMessage.className = 'status-message error';
        });
}

// Handle show hospitals button click
function handleShowHospitals() {
    const selectedProcedure = procedureSelect.value;
    
    if (!selectedProcedure) {
        statusMessage.innerHTML = '<p>Please select a medical procedure first.</p>';
        statusMessage.className = 'status-message error';
        return;
    }
    
    // Check if we have a user marker or search marker
    if (userMarker) {
        const latlng = userMarker.getLatLng();
        fetchHospitalsForCostEstimation(latlng.lat, latlng.lng);
    } else if (searchMarker) {
        const latlng = searchMarker.getLatLng();
        fetchHospitalsForCostEstimation(latlng.lat, latlng.lng);
    } else {
        // No location set, try to get user's location
        getUserLocation();
    }
}

// Handle geolocation errors
function handleLocationError(error) {
    let errorMessage;
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services to find hospitals near you.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please try again later.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get your location timed out. Please try again.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred. Please try again.";
            break;
    }
    
    statusMessage.innerHTML = `<p>${errorMessage}</p>`;
    statusMessage.className = 'status-message error';
}

// Fetch hospitals for cost estimation
function fetchHospitalsForCostEstimation(lat, lng) {
    // Clear existing hospital markers
    clearHospitalMarkers();
    
    const selectedProcedure = procedureSelect.value;
    const radius = parseInt(searchRadius.value);
    
    statusMessage.innerHTML = `<p><span class="loading-spinner"></span> Searching for hospitals that offer ${selectedProcedure}...</p>`;
    statusMessage.className = 'status-message';
    
    // Build Overpass API query
    const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          relation["amenity"="hospital"](around:${radius},${lat},${lng});
          
          // Also include clinics
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          way["amenity"="clinic"](around:${radius},${lat},${lng});
          relation["amenity"="clinic"](around:${radius},${lat},${lng});
        );
        out center;
    `;
    
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(overpassQuery);
    const apiUrl = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
    
    // Fetch data from Overpass API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayHospitalsWithCostEstimates(data, lat, lng, selectedProcedure);
        })
        .catch(error => {
            console.error('Error fetching hospital data:', error);
            statusMessage.innerHTML = '<p>Error fetching hospital data. Please try again later.</p>';
            statusMessage.className = 'status-message error';
        });
}

// Clear hospital markers from the map
function clearHospitalMarkers() {
    hospitalMarkers.forEach(marker => {
        costMap.removeLayer(marker);
    });
    hospitalMarkers = [];
    
    // Clear hospital cost list
    hospitalCostList.innerHTML = '';
    hospitalCostContainer.classList.add('hidden');
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in meters
}

// Format distance for display
function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    } else {
        return `${(meters / 1000).toFixed(1)} km`;
    }
}

// Display hospitals with cost estimates
function displayHospitalsWithCostEstimates(data, userLat, userLng, selectedProcedure) {
    const hospitals = data.elements;
    
    // Clear the hospital list
    hospitalCostList.innerHTML = '';
    
    if (hospitals.length === 0) {
        statusMessage.innerHTML = '<p>No hospitals found nearby. Try searching in a different area or increasing the search radius.</p>';
        statusMessage.className = 'status-message warning';
        hospitalCostContainer.classList.add('hidden');
        return;
    }
    
    // Show success message
    statusMessage.innerHTML = `<p>Found ${hospitals.length} healthcare facilities near you!</p>`;
    statusMessage.className = 'status-message success';
    
    // Show the hospital list container
    hospitalCostContainer.classList.remove('hidden');
    
    // Calculate distances and sort by distance
    const hospitalsWithDistance = hospitals.map(hospital => {
        // Get hospital coordinates
        let hospitalLat, hospitalLng;
        
        if (hospital.type === 'node') {
            hospitalLat = hospital.lat;
            hospitalLng = hospital.lon;
        } else {
            // For ways and relations, use the center point
            hospitalLat = hospital.center.lat;
            hospitalLng = hospital.center.lon;
        }
        
        // Calculate distance using Haversine formula
        const distance = calculateDistance(userLat, userLng, hospitalLat, hospitalLng);
        
        return {
            ...hospital,
            calculatedLat: hospitalLat,
            calculatedLng: hospitalLng,
            distance: distance
        };
    });
    
    // Sort hospitals by distance
    hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Display each hospital with cost estimate
    hospitalsWithDistance.forEach((hospital, index) => {
        const hospitalLat = hospital.calculatedLat;
        const hospitalLng = hospital.calculatedLng;
        const distance = hospital.distance;
        
        // Get hospital name or use a default
        const hospitalName = hospital.tags && hospital.tags.name 
            ? hospital.tags.name 
            : 'Unnamed Healthcare Facility';
        
        // Determine hospital tier based on tags (mock data for now)
        const hospitalTier = determineHospitalTier(hospital);
        
        // Calculate cost estimate for the selected procedure
        const { minCost, maxCost } = calculateCostEstimate(selectedProcedure, hospitalTier, hospital);
        
        // Create marker for the hospital
        const hospitalMarker = L.marker([hospitalLat, hospitalLng], {
            icon: L.divIcon({
                className: 'hospital-marker',
                html: `<div class="hospital-marker-icon" style="background-color: ${getMarkerColor(hospitalTier)}"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            })
        }).addTo(costMap);
        
        hospitalMarkers.push(hospitalMarker);
        
        // Add popup with hospital information
        let popupContent = `
            <strong>${hospitalName}</strong><br>
            <span class="hospital-tier">Tier ${hospitalTier}</span><br>
            <span class="cost-estimate">₹${minCost.toLocaleString()} - ₹${maxCost.toLocaleString()}</span><br>
            Distance: ${formatDistance(distance)}<br>
        `;
        
        // Add address if available
        if (hospital.tags) {
            if (hospital.tags.address || hospital.tags['addr:street'] || hospital.tags['addr:housenumber'] || hospital.tags['addr:city']) {
                popupContent += 'Address: ';
                
                if (hospital.tags.address) {
                    popupContent += `${hospital.tags.address}<br>`;
                } else {
                    const addressParts = [];
                    if (hospital.tags['addr:housenumber']) addressParts.push(hospital.tags['addr:housenumber']);
                    if (hospital.tags['addr:street']) addressParts.push(hospital.tags['addr:street']);
                    if (hospital.tags['addr:city']) addressParts.push(hospital.tags['addr:city']);
                    
                    popupContent += `${addressParts.join(', ')}<br>`;
                }
            }
            
            // Add phone if available
            if (hospital.tags.phone) {
                popupContent += `Phone: ${hospital.tags.phone}<br>`;
            }
            
            // Add website if available
            if (hospital.tags.website) {
                popupContent += `Website: <a href="${hospital.tags.website}" target="_blank">Visit Website</a><br>`;
            }
        }
        
        // Add procedure details
        popupContent += `<hr>
            <strong>${selectedProcedure} Details:</strong><br>
            <span style="color: #2ecc71;">✓ Included:</span> ${procedureDetails[selectedProcedure].included}<br>
            <span style="color: #e74c3c;">✗ Excluded:</span> ${procedureDetails[selectedProcedure].excluded}
        `;
        
        hospitalMarker.bindPopup(popupContent);
        
        // Create hospital card for the list
        const hospitalCard = document.createElement('div');
        hospitalCard.className = 'hospital-cost-card';
        hospitalCard.innerHTML = `
            <h4>${hospitalName}</h4>
            <div class="hospital-tier">Tier ${hospitalTier}</div>
            <div class="hospital-cost-estimate">₹${minCost.toLocaleString()} - ₹${maxCost.toLocaleString()}</div>
            <div class="hospital-cost-info">Distance: ${formatDistance(distance)}</div>
            ${hospital.tags && hospital.tags.phone ? `<div class="hospital-cost-info">Phone: ${hospital.tags.phone}</div>` : ''}
            <button class="view-on-map-btn" onclick="focusHospitalOnMap(${hospitalLat}, ${hospitalLng})">View on Map</button>
        `;
        
        hospitalCostList.appendChild(hospitalCard);
    });
}

// Determine hospital tier based on tags (mock data for demonstration)
function determineHospitalTier(hospital) {
    const tags = hospital.tags || {};
    
    // Check for specializations
    const hasEmergency = tags.emergency === 'yes';
    const hasICU = tags.icu === 'yes' || tags.intensive_care === 'yes';
    const hasSurgery = tags.surgery === 'yes';
    const isMultiSpecialty = tags.healthcare === 'hospital' || tags.hospital === 'general';
    
    // Count specializations
    let specializationCount = 0;
    
    // Check for specific departments
    const departments = [
        'cardiology', 'orthopedic', 'neurology', 'oncology', 'pediatrics',
        'gynecology', 'dermatology', 'ophthalmology', 'ent', 'urology',
        'psychiatry', 'dental', 'radiology', 'pathology'
    ];
    
    departments.forEach(dept => {
        if (tags[dept] === 'yes' || tags[`department:${dept}`] === 'yes') {
            specializationCount++;
        }
    });
    
    // Add points for facilities
    if (hasEmergency) specializationCount += 2;
    if (hasICU) specializationCount += 2;
    if (hasSurgery) specializationCount += 1;
    if (isMultiSpecialty) specializationCount += 1;
    
    // Check for additional quality indicators
    const hasWheelchair = tags.wheelchair === 'yes';
    const has24Hours = tags.opening_hours === '24/7' || tags.opening_hours?.includes('24');
    const hasParking = tags.parking === 'yes' || tags.parking_fee === 'no';
    const isTeaching = tags.teaching === 'yes' || (tags.name && tags.name.toLowerCase().includes('teaching'));
    const isGovernment = tags.operator === 'government' || (tags.name && tags.name.toLowerCase().includes('government'));
    
    // Add points for additional facilities
    if (hasWheelchair) specializationCount += 0.5;
    if (has24Hours) specializationCount += 1;
    if (hasParking) specializationCount += 0.5;
    if (isTeaching) specializationCount += 2;
    
    // Determine tier based on specialization count
    if (specializationCount >= 5) return 'A';
    if (specializationCount >= 3) return 'B';
    return 'C';
}

function calculateCostEstimate(procedure, hospitalTier, hospital) {
    const baseCost = procedureCosts[procedure];
    const tags = hospital.tags || {};
    
    // Tier multipliers
    const tierMultipliers = {
        'A': { min: 1.3, max: 1.8 },
        'B': { min: 1.0, max: 1.3 },
        'C': { min: 0.7, max: 1.0 }
    };
    
    // Get specialization count
    let specializationFactor = 0;
    if (hospital.tags) {
        // Count healthcare-related tags
        Object.keys(hospital.tags).forEach(tag => {
            if (tag.includes('healthcare') || tag.includes('medical') || 
                tag.includes('department') || tag.includes('facility')) {
                specializationFactor++;
            }
        });
    }
    
    // Ensure minimum specialization factor
    specializationFactor = Math.max(1, specializationFactor);
    
    // Location-based adjustments
    let locationFactor = 1.0;
    
    // Check for urban/rural indicators
    if (tags.addr && tags.addr.city) {
        // Major cities tend to have higher costs
        const majorCities = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 
                            'pune', 'ahmedabad', 'jaipur', 'surat'];
        
        const cityName = tags.addr.city.toLowerCase();
        if (majorCities.some(city => cityName.includes(city))) {
            locationFactor = 1.2;
        }
    }
    
    // Check for hospital type (private vs public)
    let operatorFactor = 1.0;
    if (tags.operator === 'private' || (tags.name && /private|corporate/i.test(tags.name))) {
        operatorFactor = 1.3;
    } else if (tags.operator === 'government' || (tags.name && /government|municipal|district/i.test(tags.name))) {
        operatorFactor = 0.7;
    }
    
    // Reputation factor (based on available data)
    let reputationFactor = 1.0;
    if (tags.name) {
        const name = tags.name.toLowerCase();
        // Check for keywords indicating prestige
        if (/apollo|fortis|max|medanta|aiims|manipal|narayana|kokilaben|jaslok/i.test(name)) {
            reputationFactor = 1.4;
        }
        // Check for teaching/university hospitals
        if (/college|university|institute|research|medical school/i.test(name)) {
            reputationFactor = 1.2;
        }
    }
    
    // Add some randomness to make estimates more varied (±10%)
    const randomFactor = 0.9 + (Math.random() * 0.2);
    
    // Calculate min and max costs with all factors
    const tierMultiplier = tierMultipliers[hospitalTier];
    const combinedFactor = locationFactor * operatorFactor * reputationFactor * randomFactor;
    
    const minCost = Math.round(baseCost * tierMultiplier.min * combinedFactor + specializationFactor * 200);
    const maxCost = Math.round(baseCost * tierMultiplier.max * combinedFactor + specializationFactor * 500);
    
    return { minCost, maxCost };
}

// Get marker color based on hospital tier
function getMarkerColor(tier) {
    switch(tier) {
        case 'A': return '#e74c3c'; // Red for top tier
        case 'B': return '#f39c12'; // Orange for mid tier
        case 'C': return '#3498db'; // Blue for basic tier
        default: return '#95a5a6';  // Gray for unknown
    }
}

// Focus on a hospital on the map
window.focusHospitalOnMap = function(lat, lng) {
    costMap.setView([lat, lng], 16);
    
    // Find the marker for this hospital and open its popup
    hospitalMarkers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
            marker.openPopup();
        }
    });
    
    // Scroll to the top to see the map
    window.scrollTo({
        top: document.getElementById('cost-map-container').offsetTop - 20,
        behavior: 'smooth'
    });
};