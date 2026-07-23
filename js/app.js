// Global variables
let map;
let userMarker;
let searchMarker;
let hospitalMarkers = [];
let currentDepartment = null;
const statusMessage = document.getElementById('status-message');
const refreshBtn = document.getElementById('refresh-btn');
const searchInput = document.getElementById('location-search');
const searchBtn = document.getElementById('search-btn');
const searchRadius = document.getElementById('search-radius');
const useMyLocationBtn = document.getElementById('use-my-location-btn');
const locateMeBtn = document.getElementById('locate-me-btn');
const hospitalList = document.getElementById('hospital-list');
const symptomDropdown = document.getElementById('symptom-dropdown');
const findBySymptomBtn = document.getElementById('find-by-symptom-btn');
const departmentInfo = document.getElementById('department-info');
const departmentName = document.getElementById('department-name');
const firstAidDropdown = document.getElementById('first-aid-dropdown');
const firstAidInfo = document.getElementById('first-aid-info');
const firstAidSymptom = document.getElementById('first-aid-symptom');
const firstAidDepartmentName = document.getElementById('first-aid-department-name');
const firstAidStepsList = document.getElementById('first-aid-steps-list');
const nearestHospitalsContainer = document.getElementById('nearest-hospitals-container');
const nearestHospitalsList = document.getElementById('nearest-hospitals-list');
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

// Symptom to department mapping
const symptomToDepartment = {
    "Chest Pain": "Cardiology",
    "Fracture": "Orthopedics",
    "Fever": "General Medicine",
    "Skin Rash": "Dermatology",
    "Toothache": "Dental",
    "Eye Irritation": "Ophthalmology",
    "Stomach Ache": "Gastroenterology",
    "Joint Pain": "Rheumatology",
    "Back Pain": "Orthopedics",
    "Cold / Cough": "Pulmonology",
    "Anxiety": "Psychiatry",
    "Pregnancy Checkup": "Obstetrics & Gynecology",
    "Seizures": "Neurology",
    "Headache / Migraine": "Neurology"
};

// Department to keywords mapping for better search results
const departmentToKeywords = {
    "Cardiology": ["cardio", "heart", "cardiac", "cardiovascular"],
    "Orthopedics": ["ortho", "bone", "joint", "fracture", "trauma"],
    "General Medicine": ["general", "medicine", "internal"],
    "Dermatology": ["derma", "skin"],
    "Dental": ["dental", "dentist", "tooth", "teeth"],
    "Ophthalmology": ["eye", "ophthal", "vision"],
    "Gastroenterology": ["gastro", "stomach", "digestive"],
    "Rheumatology": ["rheumatology", "arthritis", "autoimmune"],
    "Pulmonology": ["pulmo", "lung", "respiratory", "chest"],
    "Psychiatry": ["psych", "mental", "behavioral"],
    "Obstetrics & Gynecology": ["obgyn", "gynec", "obstetrics", "maternity", "women"],
    "Neurology": ["neuro", "brain", "nerve", "spinal"]
};

// First Aid information
const firstAidData = [
    {
        symptom: "Chest Pain",
        department: "Cardiology",
        firstAid: [
            "Have the person sit down, rest, and try to keep calm.",
            "Loosen tight clothing.",
            "If the person takes nitroglycerin for a heart condition, help them take it.",
            "If the pain persists for more than a few minutes, call emergency services immediately.",
            "If the person becomes unconscious, check for breathing and pulse, and begin CPR if necessary."
        ]
    },
    {
        symptom: "Fracture",
        department: "Orthopedics",
        firstAid: [
            "Keep the injured area immobile and supported.",
            "Apply ice wrapped in a cloth to reduce swelling and pain.",
            "If there is bleeding, apply pressure with a clean cloth.",
            "Do not attempt to realign the bone or push a bone that's sticking out back in.",
            "Seek medical attention immediately."
        ]
    },
    {
        symptom: "Fever",
        department: "General Medicine",
        firstAid: [
            "Rest and drink plenty of fluids.",
            "Take acetaminophen or ibuprofen as directed to reduce fever.",
            "Use a lukewarm sponge bath to help cool down.",
            "Dress in lightweight clothing and use lightweight bedding.",
            "Seek medical attention if fever is very high (above 103°F/39.4°C), lasts more than three days, or is accompanied by severe symptoms."
        ]
    },
    {
        symptom: "Burn",
        department: "Emergency Medicine",
        firstAid: [
            "Remove the person from the source of the burn.",
            "Cool the burn with cool (not cold) running water for 10-15 minutes.",
            "Remove jewelry or tight items from the burned area.",
            "Cover the burn with a sterile, non-stick bandage.",
            "Do not apply butter, oil, or ointments to the burn.",
            "Seek medical attention for severe burns or burns on the face, hands, feet, genitals, or over a joint."
        ]
    },
    {
        symptom: "Snake Bite",
        department: "Emergency Medicine",
        firstAid: [
            "Move the person away from the snake.",
            "Keep the bitten area below heart level if possible.",
            "Remove any jewelry or tight clothing near the bite.",
            "Clean the wound with soap and water.",
            "Cover the bite with a clean, dry dressing.",
            "Mark the edge of swelling on the skin and note the time.",
            "Get medical help immediately. Do NOT cut the wound, suck out venom, apply ice, or apply a tourniquet."
        ]
    },
    {
        symptom: "Bleeding",
        department: "Emergency Medicine",
        firstAid: [
            "Apply direct pressure on the wound with a clean cloth or bandage.",
            "If blood soaks through, add another cloth without removing the first one.",
            "If possible, elevate the wounded area above the heart.",
            "If bleeding is severe and doesn't stop with direct pressure, apply pressure to the artery supplying the area.",
            "Secure the dressing with a bandage or tape.",
            "Seek immediate medical attention for severe bleeding."
        ]
    },
    {
        symptom: "Difficulty Breathing",
        department: "Pulmonology",
        firstAid: [
            "Help the person into a comfortable position, usually sitting upright.",
            "Loosen any tight clothing around the neck or chest.",
            "If the person has asthma medication, help them use it.",
            "If the person has oxygen, help them use it as prescribed.",
            "If breathing difficulty is severe, call emergency services immediately.",
            "Be prepared to perform CPR if the person stops breathing."
        ]
    },
    {
        symptom: "Head Injury",
        department: "Neurology",
        firstAid: [
            "Keep the person still and lying down.",
            "If there's bleeding, apply pressure with a clean cloth.",
            "If the person is vomiting, turn their head to the side to prevent choking.",
            "Apply an ice pack wrapped in a cloth to reduce swelling.",
            "Monitor for changes in consciousness, breathing, or behavior.",
            "Seek immediate medical attention, especially if there was loss of consciousness, confusion, severe headache, or vomiting."
        ]
    },
    {
        symptom: "Vomiting",
        department: "Gastroenterology",
        firstAid: [
            "Have the person sit upright or lie on their side to prevent choking.",
            "Provide small sips of clear fluids like water or clear broth after vomiting stops.",
            "Avoid solid foods until vomiting has stopped for at least 6 hours.",
            "Gradually introduce bland foods like crackers or toast.",
            "Seek medical attention if vomiting persists for more than 24 hours, contains blood, or is accompanied by severe abdominal pain."
        ]
    },
    {
        symptom: "Fainting",
        department: "Neurology",
        firstAid: [
            "If you feel faint, lie down or sit down and put your head between your knees.",
            "If someone has fainted, lay them flat on their back and elevate their legs.",
            "Ensure the person has an open airway and is breathing.",
            "Loosen any tight clothing.",
            "Do not give the person anything to eat or drink.",
            "If the person doesn't regain consciousness within a minute, call emergency services."
        ]
    },
    {
        symptom: "Diarrhea",
        department: "Gastroenterology",
        firstAid: [
            "Ensure constant hydration with ORS or water.",
            "Avoid dairy and spicy food temporarily.",
            "Encourage rest.",
            "Watch for blood or dehydration signs.",
            "Consult a doctor if diarrhea persists."
        ]
    },
    {
        symptom: "Seizures",
        department: "Neurology",
        firstAid: [
            "Keep the person safe and remove nearby objects.",
            "Do not restrain or place anything in their mouth.",
            "Time the duration of the seizure.",
            "Place them on their side after it ends.",
            "Call emergency services if it lasts more than 5 minutes."
        ]
    },
    {
        symptom: "Sprain/Strain",
        department: "Orthopedics",
        firstAid: [
            "Rest the injured area.",
            "Apply an ice pack to reduce swelling.",
            "Compress using an elastic bandage.",
            "Elevate the limb above heart level.",
            "Avoid weight on the injured area and consult a doctor."
        ]
    },
    {
        symptom: "Electric Shock",
        department: "Emergency / ICU",
        firstAid: [
            "Ensure the person is no longer in contact with electricity.",
            "Do not touch with bare hands until power is off.",
            "Check for breathing and pulse.",
            "Begin CPR if needed.",
            "Call emergency services immediately."
        ]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    refreshBtn.addEventListener('click', fetchHospitals);
    searchBtn.addEventListener('click', handleLocationSearch);
    useMyLocationBtn.addEventListener('click', getUserLocation);
    symptomDropdown.addEventListener('change', updateDepartmentInfo);
    findBySymptomBtn.addEventListener('click', handleSymptomSearch);
    firstAidDropdown.addEventListener('change', displayFirstAidInfo);
    locateMeBtn.addEventListener('click', handleLocateMe);
    navbarToggle.addEventListener('click', toggleNavbar);
    
    // Add enter key support for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLocationSearch();
        }
    });
});

// Toggle mobile navbar
function toggleNavbar() {
    navbarMenu.classList.toggle('active');
}

// Initialize the map with a default view
function initMap() {
    // Check if map is already initialized
    if (map) {
        console.log("Map already initialized");
        return;
    }
    
    // Create map centered on a default location (will be updated with user's location)
    map = L.map('map').setView([0, 0], 2);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add geocoder control to the map
    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
        handleGeocodeResult(e.geocode);
    }).addTo(map);
    
    // Get user's location
    getUserLocation();
}

function handleLocationSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        statusMessage.innerHTML = '<p>Please enter a location to search.</p>';
        statusMessage.className = 'status-message error';
        return;
    }
    
    statusMessage.innerHTML = '<p>Searching for location...</p>';
    
    // Use Nominatim for geocoding (part of OpenStreetMap)
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1`;
    
    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                throw new Error('Location not found');
            }
            
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            
            // Update map view
            map.setView([lat, lng], 14);
            
            // Add or update search marker
            if (searchMarker) {
                searchMarker.setLatLng([lat, lng]);
            } else {
                searchMarker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'search-marker',
                        html: '<div style="background-color: #9b59b6; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
                        iconSize: [15, 15],
                        iconAnchor: [7.5, 7.5]
                    })
                }).addTo(map);
            }
            
            searchMarker.bindPopup(`Searched Location: ${result.display_name}`).openPopup();
            
            // Fetch hospitals near this location
            fetchHospitalsAtLocation(lat, lng);
            
            statusMessage.innerHTML = `<p>Location found: ${result.display_name}</p>`;
            statusMessage.className = 'status-message success';
        })
        .catch(error => {
            console.error('Error searching for location:', error);
            statusMessage.innerHTML = `<p>Error: ${error.message || 'Failed to find location'}</p>`;
            statusMessage.className = 'status-message error';
        });
}

// Function to handle geocode results from the map search
function handleGeocodeResult(result) {
    const latlng = result.center;
    
    // Update map view
    map.setView(latlng, 14);
    
    // Add or update search marker
    if (searchMarker) {
        searchMarker.setLatLng(latlng);
    } else {
        searchMarker = L.marker(latlng, {
            icon: L.divIcon({
                className: 'search-marker',
                html: '<div style="background-color: #9b59b6; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
                iconSize: [15, 15],
                iconAnchor: [7.5, 7.5]
            })
        }).addTo(map);
    }
    
    searchMarker.bindPopup(`Searched Location: ${result.name}`).openPopup();
    
    // Update search input
    searchInput.value = result.name;
    
    // Fetch hospitals near this location
    fetchHospitalsAtLocation(latlng.lat, latlng.lng);
    
    statusMessage.innerHTML = `<p>Location found: ${result.name}</p>`;
    statusMessage.className = 'status-message success';
}

// Function to display first aid information
function displayFirstAidInfo() {
    const selectedSymptom = firstAidDropdown.value;
    
    if (!selectedSymptom) {
        firstAidInfo.classList.add('hidden');
        return;
    }
    
    // Find the selected symptom in the data
    const symptomData = firstAidData.find(item => item.symptom === selectedSymptom);
    if (symptomData) {
        // Update the UI with the first aid information
        showSearchStatus(`Showing first aid information for ${selectedSymptom}`, 'firstaid');
        
        firstAidSymptom.textContent = symptomData.symptom;
        firstAidDepartmentName.textContent = symptomData.department;
        
        // Clear previous steps
        firstAidStepsList.innerHTML = '';
        
        // Add each first aid step to the list
        symptomData.firstAid.forEach(step => {
            const listItem = document.createElement('li');
            listItem.textContent = step;
            firstAidStepsList.appendChild(listItem);
        });
        
        // Show the first aid info section
        firstAidInfo.classList.remove('hidden');
    } else {
        firstAidInfo.classList.add('hidden');
    }
}

// Make focusHospital available globally
window.focusHospital = function(lat, lng, name) {
    map.setView([lat, lng], 16);
    
    // Find the marker for this hospital and open its popup
    hospitalMarkers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
            marker.openPopup();
        }
    });
    
    // Scroll to the top to see the map
    window.scrollTo({
        top: document.getElementById('map-container').offsetTop - 20,
        behavior: 'smooth'
    });
};

// Clear all hospital markers from the map
function clearHospitalMarkers() {
    hospitalMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    hospitalMarkers = [];
}

// Function to handle the "Locate Me" button click
function handleLocateMe() {
    if (navigator.geolocation) {
        // Update button to show loading state
        locateMeBtn.innerHTML = '<span class="loading-indicator"></span> Locating...';
        locateMeBtn.disabled = true;
        
        statusMessage.innerHTML = '<p>Detecting your location...</p>';
        
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                
                // Center map on user's location with higher zoom
                map.setView([latitude, longitude], 15);
                
                // Add or update marker for user's location
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
                    }).addTo(map);
                }
                
                userMarker.bindPopup('You are here').openPopup();
                
                // Remove search marker if it exists
                if (searchMarker) {
                    map.removeLayer(searchMarker);
                    searchMarker = null;
                }
                
                // Fetch nearby hospitals with distance sorting
                fetchNearbyHospitals(latitude, longitude);
                
                // Reset button state
                locateMeBtn.innerHTML = '📍 Locate Me';
                locateMeBtn.disabled = false;
            },
            error => {
                handleLocationError(error);
                
                // Reset button state
                locateMeBtn.innerHTML = '📍 Locate Me';
                locateMeBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        statusMessage.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
        statusMessage.className = 'status-message error';
    }
}

// Function to fetch nearby hospitals and sort by distance
function fetchNearbyHospitals(lat, lng) {
    // Clear existing hospital markers
    clearHospitalMarkers();
    
    statusMessage.innerHTML = '<p>Searching for nearby hospitals...</p>';
    
    // Fixed radius of 5km (5000m)
    const radius = 5000;
    
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
          
          // Include doctors with healthcare specialties
          node["amenity"="doctors"](around:${radius},${lat},${lng});
          way["amenity"="doctors"](around:${radius},${lat},${lng});
          relation["amenity"="doctors"](around:${radius},${lat},${lng});
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
            if (data.elements.length === 0) {
                statusMessage.innerHTML = '<p>No hospitals found within 5km. Try searching in a different location.</p>';
                hospitalList.innerHTML = '<p class="no-results">No hospitals found within 5km. Try searching in a different location.</p>';
                nearestHospitalsContainer.classList.add('hidden');
                return;
            }
            
            // Calculate distance for each hospital
            const hospitalsWithDistance = data.elements.map(hospital => {
                let hospitalLat, hospitalLng;
                
                // Extract coordinates based on element type
                if (hospital.type === 'node') {
                    hospitalLat = hospital.lat;
                    hospitalLng = hospital.lon;
                } else if (hospital.type === 'way' || hospital.type === 'relation') {
                    // For ways and relations, use the center point
                    if (hospital.center) {
                        hospitalLat = hospital.center.lat;
                        hospitalLng = hospital.center.lon;
                    } else {
                        // Skip if no coordinates
                        return null;
                    }
                }
                
                // Calculate distance using Leaflet's distanceTo method
                const userLatLng = L.latLng(lat, lng);
                const hospitalLatLng = L.latLng(hospitalLat, hospitalLng);
                const distance = userLatLng.distanceTo(hospitalLatLng); // in meters
                
                return {
                    ...hospital,
                    distance,
                    calculatedLat: hospitalLat,
                    calculatedLng: hospitalLng
                };
            }).filter(hospital => hospital !== null);
            
            // Sort hospitals by distance
            hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
            
            // Display all hospitals on the map and in the list
            displayHospitalsWithDistance(hospitalsWithDistance);
            
            // Display the nearest 5 hospitals in a separate list
            displayNearestHospitals(hospitalsWithDistance.slice(0, 5), lat, lng);
            
            statusMessage.innerHTML = `<p>Found ${hospitalsWithDistance.length} hospitals within 5km of your location.</p>`;
            statusMessage.className = 'status-message success';
        })
        .catch(error => {
            console.error('Error fetching hospital data:', error);
            statusMessage.innerHTML = '<p>Error fetching hospital data. Please try again later.</p>';
            statusMessage.className = 'status-message error';
            
            // Reset button state
            locateMeBtn.innerHTML = '📍 Locate Me';
            locateMeBtn.disabled = false;
        });
}

// Function to display hospitals with distance information
function displayHospitalsWithDistance(hospitalsWithDistance) {
    // Clear the hospital list
    hospitalList.innerHTML = '';
    
    // Clear existing hospital markers
    clearHospitalMarkers();
    
    hospitalsWithDistance.forEach((hospital, index) => {
        const hospitalLat = hospital.calculatedLat;
        const hospitalLng = hospital.calculatedLng;
        const distance = hospital.distance;
        
        // Get hospital name or use a default
        const hospitalName = hospital.tags && hospital.tags.name 
            ? hospital.tags.name 
            : 'Unnamed Hospital';
        
        // Create marker for the hospital
        const hospitalMarker = L.marker([hospitalLat, hospitalLng], {
            icon: L.divIcon({
                className: 'hospital-marker',
                html: '<div style="background-color: #e74c3c; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            })
        }).addTo(map);
        
        // Add popup with hospital information
        let popupContent = `<strong>${hospitalName}</strong><br>`;
        popupContent += `Distance: ${formatDistance(distance)}<br>`;
        
        // Add additional information if available
        if (hospital.tags) {
            if (hospital.tags['healthcare:speciality']) {
                popupContent += `Speciality: ${hospital.tags['healthcare:speciality']}<br>`;
            }
            if (hospital.tags.phone || hospital.tags['contact:phone']) {
                popupContent += `Phone: ${hospital.tags.phone || hospital.tags['contact:phone']}<br>`;
            }
            if (hospital.tags.website || hospital.tags['contact:website']) {
                popupContent += `<a href="${hospital.tags.website || hospital.tags['contact:website']}" target="_blank">Website</a><br>`;
            }
            if (hospital.tags.emergency && hospital.tags.emergency === 'yes') {
                popupContent += `<span style="color: #e74c3c;">Emergency Services Available</span><br>`;
            }
        }
        
        hospitalMarker.bindPopup(popupContent);
        hospitalMarkers.push(hospitalMarker);
        
        // Create hospital card with distance information
        createHospitalCardWithDistance(hospital, hospitalLat, hospitalLng, index, distance);
    });
}

// Function to create a hospital card with distance information
function createHospitalCardWithDistance(hospital, lat, lng, index, distance) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.id = `hospital-${index}`;
    
    const tags = hospital.tags || {};
    const name = tags.name || 'Unnamed Hospital';
    
    // Create the HTML content for the card
    let cardContent = `
        <h3>${name}</h3>
        <div class="hospital-distance">Distance: ${formatDistance(distance)}</div>
        <div class="hospital-info">
            <div class="hospital-details">
    `;
    
    // Add address information if available
    if (tags.address || tags['addr:street'] || tags['addr:housenumber'] || tags['addr:city']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Address:</span> `;
        
        if (tags.address) {
            cardContent += `${tags.address}`;
        } else {
            let addressParts = [];
            if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
            if (tags['addr:street']) addressParts.push(tags['addr:street']);
            if (tags['addr:city']) addressParts.push(tags['addr:city']);
            if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
            
            cardContent += addressParts.join(', ');
        }
        
        cardContent += `</div>`;
    }
    
    // Add phone if available
    if (tags.phone || tags['contact:phone']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Phone:</span> ${tags.phone || tags['contact:phone']}</div>`;
    }
    
    // Add website if available
    if (tags.website || tags['contact:website']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Website:</span> <a href="${tags.website || tags['contact:website']}" target="_blank">${tags.website || tags['contact:website']}</a></div>`;
    }
    
    // Add opening hours if available
    if (tags.opening_hours) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Hours:</span> ${tags.opening_hours}</div>`;
    }
    
    // Add specialties if available
    if (tags['healthcare:speciality']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Specialties:</span> ${tags['healthcare:speciality']}</div>`;
    } else if (tags.healthcare && tags.healthcare !== 'hospital') {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Specialty:</span> ${tags.healthcare}</div>`;
    }
    
    // Add emergency services badge if available
    if (tags.emergency === 'yes') {
        cardContent += `<div class="emergency-available">Emergency Services Available</div>`;
    }
    
    // Add view on map button
    cardContent += `<button class="view-on-map-btn" onclick="focusHospital(${lat}, ${lng}, '${name.replace(/'/g, "\\'")}')">View on Map</button>`;
    
    cardContent += `
            </div>
        </div>
    `;
    
    card.innerHTML = cardContent;
    hospitalList.appendChild(card);
}

// Function to display the nearest hospitals in a separate list
function displayNearestHospitals(nearestHospitals, userLat, userLng) {
    // Clear the nearest hospitals list
    nearestHospitalsList.innerHTML = '';
    
    if (nearestHospitals.length === 0) {
        nearestHospitalsContainer.classList.add('hidden');
        return;
    }
    
    // Show the container
    nearestHospitalsContainer.classList.remove('hidden');
    
    // Create cards for each of the nearest hospitals
    nearestHospitals.forEach((hospital, index) => {
        const hospitalLat = hospital.calculatedLat;
        const hospitalLng = hospital.calculatedLng;
        const distance = hospital.distance;
        const tags = hospital.tags || {};
        const name = tags.name || 'Unnamed Hospital';
        
        const card = document.createElement('div');
        card.className = 'nearest-hospital-card';
        
        let cardContent = `
            <h4>${name}</h4>
            <div class="nearest-hospital-distance">${formatDistance(distance)}</div>
        `;
        
        // Add specialties if available
        if (tags['healthcare:speciality']) {
            cardContent += `<div class="nearest-hospital-info"><strong>Specialties:</strong> ${tags['healthcare:speciality']}</div>`;
        }
        
        // Add phone if available
        if (tags.phone || tags['contact:phone']) {
            cardContent += `<div class="nearest-hospital-info"><strong>Phone:</strong> ${tags.phone || tags['contact:phone']}</div>`;
        }
        
        // Add view on map link
        cardContent += `<div class="view-on-map-link" onclick="focusHospital(${hospitalLat}, ${hospitalLng}, '${name.replace(/'/g, "\\'")}')">View on Map</div>`;
        
        card.innerHTML = cardContent;
        nearestHospitalsList.appendChild(card);
    });
}

// Helper functiofetchHospitalsByDepartmentn to format distance
function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    } else {
        return `${(meters / 1000).toFixed(1)} km`;
    }
}

// Get user's location
function getUserLocation() {
    if (navigator.geolocation) {
        statusMessage.innerHTML = '<p>Requesting your location...</p>';
        showSearchStatus('Requesting your location...', 'location');
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                
                // Center map on user's location
                map.setView([latitude, longitude], 14);
                
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
                    }).addTo(map);
                    userMarker.bindPopup('Your Location').openPopup();
                }
                
                // Remove search marker if it exists
                if (searchMarker) {
                    map.removeLayer(searchMarker);
                    searchMarker = null;
                }
                
                // Fetch nearby hospitals
                fetchHospitalsAtLocation(latitude, longitude);
                
                statusMessage.innerHTML = '<p>Location found! Searching for hospitals...</p>';
                statusMessage.className = 'status-message success';
            },
            error => {
                handleLocationError(error);
            }
        );
    } else {
        statusMessage.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
        statusMessage.className = 'status-message error';
        showSearchStatus('Geolocation is not supported by your browser.', 'location');
    }
}

// Handle geolocation errors
function handleLocationError(error) {
    let errorMessage;
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services or search for a location manually.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please try again or search for a location manually.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get your location timed out. Please try again or search for a location manually.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred. Please try again or search for a location manually.";
            break;
    }
    
    statusMessage.innerHTML = `<p>${errorMessage}</p>`;
    statusMessage.className = 'status-message error';
}

// Fetch hospitals at a specific location
function fetchHospitalsAtLocation(lat, lng) {
    // Clear existing hospital markers
    clearHospitalMarkers();
    
    statusMessage.innerHTML = '<p>Searching for hospitals...</p>';
    
    // Also show a search-specific status message above the map
    showSearchStatus('Searching for hospitals in your selected location...', 'location');
    
    // Get the selected radius
    const radius = parseInt(searchRadius.value);
    
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
          
          // Include doctors with healthcare specialties
          node["amenity"="doctors"](around:${radius},${lat},${lng});
          way["amenity"="doctors"](around:${radius},${lat},${lng});
          relation["amenity"="doctors"](around:${radius},${lat},${lng});
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
            displayHospitals(data);
        })
        .catch(error => {
            console.error('Error fetching hospital data:', error);
            statusMessage.innerHTML = '<p>Error fetching hospital data. Please try again later.</p>';
            statusMessage.className = 'status-message error';
        });
}

// Fetch hospitals (used by refresh button)
function fetchHospitals() {
    // Check if we have a user marker or search marker
    if (userMarker) {
        const latlng = userMarker.getLatLng();
        fetchHospitalsAtLocation(latlng.lat, latlng.lng);
    } else if (searchMarker) {
        const latlng = searchMarker.getLatLng();
        fetchHospitalsAtLocation(latlng.lat, latlng.lng);
    } else {
        statusMessage.innerHTML = '<p>Please set a location first by using "Use My Location" or searching for a location.</p>';
        statusMessage.className = 'status-message error';
    }
}

// Update department info based on symptom selection
function updateDepartmentInfo() {
    const selectedSymptom = symptomDropdown.value;
    
    if (!selectedSymptom) {
        departmentInfo.classList.add('hidden');
        return;
    }
    
    const department = symptomToDepartment[selectedSymptom];
    
    if (department) {
        departmentName.textContent = department;
        departmentInfo.classList.remove('hidden');
        currentDepartment = department;
    } else {
        departmentInfo.classList.add('hidden');
        currentDepartment = null;
    }
}

// Handle symptom search
function handleSymptomSearch() {
    const selectedSymptom = symptomDropdown.value;
    
    if (!selectedSymptom) {
        statusMessage.innerHTML = '<p>Please select a symptom first.</p>';
        statusMessage.className = 'status-message error';
        showSearchStatus('Please select a symptom first.', 'symptom');
        return;
    }
    
    const department = symptomToDepartment[selectedSymptom];
    
    if (!department) {
        statusMessage.innerHTML = '<p>No department mapping found for this symptom.</p>';
        statusMessage.className = 'status-message error';
        return;
    }
    
    // Check if we have a location set
    let searchLat, searchLng;
    
    if (userMarker) {
        const latlng = userMarker.getLatLng();
        searchLat = latlng.lat;
        searchLng = latlng.lng;
    } else if (searchMarker) {
        const latlng = searchMarker.getLatLng();
        searchLat = latlng.lat;
        searchLng = latlng.lng;
    } else {
        statusMessage.innerHTML = '<p>Please set a location first by using "Use My Location" or searching for a location.</p>';
        statusMessage.className = 'status-message error';
        return;
    }
    
    // Search for hospitals with this department
    fetchHospitalsByDepartment(searchLat, searchLng, department);
}

// Fetch hospitals by department
function fetchHospitalsByDepartment(lat, lng, department) {
    // Clear existing hospital markers
    clearHospitalMarkers();
    
    statusMessage.innerHTML = `<p>Searching for hospitals with ${department} department...</p>`;
    statusMessage.className = 'status-message success';
    
    // Also show a search-specific status message above the map
    showSearchStatus(`Searching for hospitals with ${department} department...`, 'symptom');
    
    // Get the selected radius
    const radius = parseInt(searchRadius.value);
    // Get keywords for the department
    const keywords = departmentToKeywords[department] || [department.toLowerCase()];
    
    // Build Overpass API query
    // First try to find hospitals with the specific department
    const overpassQuery = `
        [out:json];
        (
          // Try to find hospitals with specific healthcare speciality
          node["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          way["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          relation["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          
          // Also look for hospitals with department in name or other tags
          node["amenity"="hospital"]["name"~"${keywords.join('|')}",i](around:${radius},${lat},${lng});
          way["amenity"="hospital"]["name"~"${keywords.join('|')}",i](around:${radius},${lat},${lng});
          relation["amenity"="hospital"]["name"~"${keywords.join('|')}",i](around:${radius},${lat},${lng});
          
          // Include clinics with matching specialties
          node["amenity"="clinic"]["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          way["amenity"="clinic"]["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          relation["amenity"="clinic"]["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          
          // Include clinics with department in name
          node["amenity"="clinic"]["name"~"${keywords.join('|')}",i](around:${radius},${lat},${lng});
          way["amenity"="clinic"]["name"~"${keywords.join('|')}",i](around:${radius},${lat},${lng});
          relation["amenity"="clinic"]["name"~"${keywords.join('|')}",i](around:${radius},${lat},${lng});
          
          // Include doctors with matching specialties
          node["amenity"="doctors"]["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          way["amenity"="doctors"]["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
          relation["amenity"="doctors"]["healthcare:speciality"~"${keywords.join('|')}"](around:${radius},${lat},${lng});
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
            if (data.elements.length === 0) {
                // If no specialized hospitals found, fall back to all hospitals
                fetchAllHospitalsWithDepartmentHighlight(lat, lng, department);
            } else {
                displayHospitals(data, department);
            }
        })
        .catch(error => {
            console.error('Error fetching hospital data:', error);
            statusMessage.innerHTML = '<p>Error fetching hospital data. Please try again later.</p>';
            statusMessage.className = 'status-message error';
        });
}

// Fallback function to fetch all hospitals but highlight those that might have the department
function fetchAllHospitalsWithDepartmentHighlight(lat, lng, department) {
    statusMessage.innerHTML = `<p>No specialized ${department} facilities found. Showing all hospitals...</p>`;
    
    // Get the selected radius
    const radius = parseInt(searchRadius.value);
    
    // Build Overpass API query for all hospitals
    const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          relation["amenity"="hospital"](around:${radius},${lat},${lng});
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
            displayHospitals(data, department);
        })
        .catch(error => {
            console.error('Error fetching hospital data:', error);
            statusMessage.innerHTML = '<p>Error fetching hospital data. Please try again later.</p>';
            statusMessage.className = 'status-message error';
        });
}

// Create a hospital card for the list
function createHospitalCard(hospital, lat, lng, index, department = null) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.id = `hospital-${index}`;
    
    const tags = hospital.tags || {};
    const name = tags.name || 'Unnamed Hospital';
    
    // Check if this hospital matches the department
    let isDepartmentMatch = false;
    if (department) {
        const keywords = departmentToKeywords[department] || [department.toLowerCase()];
        
        // Check if hospital name or tags contain any of the department keywords
        const hospitalNameLower = name.toLowerCase();
        isDepartmentMatch = keywords.some(keyword => 
            hospitalNameLower.includes(keyword.toLowerCase()) || 
            (tags['healthcare:speciality'] && tags['healthcare:speciality'].toLowerCase().includes(keyword.toLowerCase()))
        );
        
        if (isDepartmentMatch) {
            card.className += ' symptom-match';
        }
    }
    
    // Create the HTML content for the card
    let cardContent = `
        <h3>${name}</h3>
        <div class="hospital-info">
            <div class="hospital-details">
    `;
    
    // Add department badge if applicable
    if (department) {
        if (isDepartmentMatch) {
            cardContent += `<div class="specialization-badge">${department} Specialist</div>`;
        } else {
            cardContent += `<div class="specialization-badge">General Hospital</div>`;
        }
    }
    
    // Add address information if available
    if (tags.address || tags['addr:street'] || tags['addr:housenumber'] || tags['addr:city']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Address:</span> `;
        
        if (tags.address) {
            cardContent += `${tags.address}`;
        } else {
            let addressParts = [];
            if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
            if (tags['addr:street']) addressParts.push(tags['addr:street']);
            if (tags['addr:city']) addressParts.push(tags['addr:city']);
            if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
            
            cardContent += addressParts.join(', ');
        }
        
        cardContent += `</div>`;
    }
    
    // Add phone if available
    if (tags.phone || tags['contact:phone']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Phone:</span> ${tags.phone || tags['contact:phone']}</div>`;
    }
    
    // Add website if available
    if (tags.website || tags['contact:website']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Website:</span> <a href="${tags.website || tags['contact:website']}" target="_blank">${tags.website || tags['contact:website']}</a></div>`;
    }
    
    // Add opening hours if available
    if (tags.opening_hours) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Hours:</span> ${tags.opening_hours}</div>`;
    }
    
    // Add operator/healthcare provider if available
    if (tags.operator) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Operator:</span> ${tags.operator}</div>`;
    }
    
    // Add specialties if available
    if (tags['healthcare:speciality']) {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Specialties:</span> ${tags['healthcare:speciality']}</div>`;
    } else if (tags.healthcare && tags.healthcare !== 'hospital') {
        cardContent += `<div class="hospital-detail-item"><span class="detail-label">Specialty:</span> ${tags.healthcare}</div>`;
    }
    
    // Add coordinates
    cardContent += `<div class="hospital-detail-item"><span class="detail-label">Coordinates:</span> ${lat.toFixed(6)}, ${lng.toFixed(6)}</div>`;
    
    // Add emergency services badge if available
    if (tags.emergency === 'yes') {
        cardContent += `<div class="emergency-available">Emergency Services Available</div>`;
    }
    
    // Add view on map button
    cardContent += `<button class="view-on-map-btn" onclick="focusHospital(${lat}, ${lng}, '${name.replace(/'/g, "\\'")}')">View on Map</button>`;
    
    cardContent += `
            </div>
            <div class="hospital-image">
                <div class="hospital-image-placeholder">Hospital Image<br>Not Available</div>
            </div>
        </div>
    `;
    
    card.innerHTML = cardContent;
    hospitalList.appendChild(card);
}

// Display hospitals on the map and in the list
function displayHospitals(data, department = null) {
    const hospitals = data.elements;
    
    if (hospitals.length === 0) {
        statusMessage.innerHTML = '<p>No hospitals found nearby. Try increasing the search radius.</p>';
        hospitalList.innerHTML = '<p class="no-results">No hospitals found nearby. Try increasing the search radius.</p>';
        return;
    }
    
    // Clear the hospital list
    hospitalList.innerHTML = '';
    
    // Sort hospitals by name
    hospitals.sort((a, b) => {
        const nameA = (a.tags && a.tags.name) ? a.tags.name : 'Unnamed Hospital';
        const nameB = (b.tags && b.tags.name) ? b.tags.name : 'Unnamed Hospital';
        return nameA.localeCompare(nameB);
    });
    
    // If department is specified, sort matching hospitals to the top
    if (department) {
        const keywords = departmentToKeywords[department] || [department.toLowerCase()];
        
        hospitals.sort((a, b) => {
            const nameA = (a.tags && a.tags.name) ? a.tags.name.toLowerCase() : '';
            const nameB = (b.tags && b.tags.name) ? b.tags.name.toLowerCase() : '';
            
            const aMatches = keywords.some(keyword => 
                nameA.includes(keyword.toLowerCase()) || 
                (a.tags && a.tags['healthcare:speciality'] && 
                 a.tags['healthcare:speciality'].toLowerCase().includes(keyword.toLowerCase()))
            );
            
            const bMatches = keywords.some(keyword => 
                nameB.includes(keyword.toLowerCase()) || 
                (b.tags && b.tags['healthcare:speciality'] && 
                 b.tags['healthcare:speciality'].toLowerCase().includes(keyword.toLowerCase()))
            );
            
            if (aMatches && !bMatches) return -1;
            if (!aMatches && bMatches) return 1;
            return 0;
        });
    }
    
    hospitals.forEach((hospital, index) => {
        let hospitalLat, hospitalLng, hospitalName;
        
        // Extract coordinates based on element type
        if (hospital.type === 'node') {
            hospitalLat = hospital.lat;
            hospitalLng = hospital.lon;
        } else if (hospital.type === 'way' || hospital.type === 'relation') {
            // For ways and relations, use the center point
            if (hospital.center) {
                hospitalLat = hospital.center.lat;
                hospitalLng = hospital.center.lon;
            } else {
                return; // Skip if no center coordinates
            }
        }
        
        // Get hospital name or use a default
        hospitalName = hospital.tags && hospital.tags.name 
            ? hospital.tags.name 
            : 'Unnamed Hospital';
        
        // Create marker for the hospital
        const hospitalMarker = L.marker([hospitalLat, hospitalLng], {
            icon: L.divIcon({
                className: 'hospital-marker',
                html: '<div style="background-color: #e74c3c; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            })
        }).addTo(map);
        
        // Add popup with hospital information
        let popupContent = `<strong>${hospitalName}</strong><br>`;
        
        // Add department information if applicable
        if (department) {
            const keywords = departmentToKeywords[department] || [department.toLowerCase()];
            const isDepartmentMatch = keywords.some(keyword => 
                hospitalName.toLowerCase().includes(keyword.toLowerCase()) || 
                (hospital.tags && hospital.tags['healthcare:speciality'] && 
                 hospital.tags['healthcare:speciality'].toLowerCase().includes(keyword.toLowerCase()))
            );
            
            if (isDepartmentMatch) {
                popupContent += `<span style="color: #9b59b6; font-weight: bold;">${department} Specialist</span><br>`;
            }
        }
        
        // Add additional information if available
        if (hospital.tags) {
            if (hospital.tags.phone) {
                popupContent += `Phone: ${hospital.tags.phone}<br>`;
            }
            if (hospital.tags.website) {
                popupContent += `<a href="${hospital.tags.website}" target="_blank">Website</a><br>`;
            }
            if (hospital.tags.emergency && hospital.tags.emergency === 'yes') {
                popupContent += `<span style="color: #e74c3c;">Emergency Services Available</span><br>`;
            }
        }
        
        hospitalMarker.bindPopup(popupContent);
        hospitalMarkers.push(hospitalMarker);
        
        // Create hospital card for the list
        createHospitalCard(hospital, hospitalLat, hospitalLng, index, department);
    });
    
    // Update status message
    if (department) {
        const matchingHospitals = hospitals.filter(hospital => {
            const hospitalName = (hospital.tags && hospital.tags.name) ? hospital.tags.name.toLowerCase() : '';
            const keywords = departmentToKeywords[department] || [department.toLowerCase()];
            
            return keywords.some(keyword => 
                hospitalName.includes(keyword.toLowerCase()) || 
                (hospital.tags && hospital.tags['healthcare:speciality'] && 
                 hospital.tags['healthcare:speciality'].toLowerCase().includes(keyword.toLowerCase()))
            );
        });
        
        if (matchingHospitals.length > 0) {
            statusMessage.innerHTML = `<p>Found ${matchingHospitals.length} hospitals with ${department} department out of ${hospitals.length} total hospitals.</p>`;
        } else {
            statusMessage.innerHTML = `<p>Found ${hospitals.length} hospitals, but none specifically mention ${department}. General hospitals may still offer this service.</p>`;
        }
    } else {
        statusMessage.innerHTML = `<p>Found ${hospitals.length} hospitals nearby.</p>`;
    }
    
    statusMessage.className = 'status-message success';
}


function showSearchStatus(message, searchType) {
    // Remove any existing search status messages
    const existingStatuses = document.querySelectorAll('.search-status');
    existingStatuses.forEach(status => status.remove());
    
    // Create a new search status element
    const searchStatus = document.createElement('div');
    searchStatus.className = 'search-status success';
    searchStatus.innerHTML = `<p>${message}</p>`;
    
    // Add it to the appropriate search tool
    if (searchType === 'symptom') {
        // Add to symptom search tool
        const symptomSearchTool = document.querySelector('.symptom-selector');
        symptomSearchTool.appendChild(searchStatus);
    } else if (searchType === 'location') {
        // Add to location search tool
        const locationSearchTool = document.querySelector('.search-container');
        locationSearchTool.appendChild(searchStatus);
    } else if (searchType === 'firstaid') {
        // Add to first aid search tool
        const firstAidSearchTool = document.querySelector('.first-aid-selector');
        firstAidSearchTool.appendChild(searchStatus);
    }
    
    // Auto-remove the status after 5 seconds
    setTimeout(() => {
        searchStatus.classList.add('fade-out');
        setTimeout(() => {
            searchStatus.remove();
        }, 500);
    }, 5000);
}

