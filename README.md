# 🏥 HospitEase – Hospital Search and Comparison Platform

HospitEase is a web-based healthcare assistance platform designed to help users find nearby hospitals, explore healthcare facilities based on their location, get department recommendations based on symptoms, access basic first-aid guidance, and compare estimated treatment costs.

The platform combines **location-based hospital discovery, interactive maps, symptom-based recommendations, and cost estimation** to make healthcare information more accessible and easier to explore.

---

## 🚀 Features

### 📍 Location-Based Hospital Search

* Search for hospitals and healthcare facilities based on a selected location.
* Find hospitals within a configurable search radius.
* View nearby hospitals based on the user's current location.
* Calculate the approximate distance between the user and healthcare facilities.

### 🗺️ Interactive Map

* Displays hospitals and healthcare facilities on an interactive map.
* Uses **Leaflet.js** for map visualization.
* Uses **OpenStreetMap** for map data.
* Provides location markers for nearby healthcare facilities.
* Supports location-based exploration of hospitals.

### 📱 Use My Location

* Uses the browser's Geolocation API to detect the user's current location.
* Helps users quickly find hospitals near their current position.
* Users can allow location access through their browser.

### 🔎 Location Search

* Search for a specific location or address.
* Uses geocoding services to convert addresses into geographic coordinates.
* Displays hospitals near the searched location.

### 🏥 Hospital Information

* Displays available information about nearby healthcare facilities.
* Shows details such as hospital name, location, address, and contact information when available.
* Helps users identify healthcare facilities in their selected area.

### ❤️ Symptom-Based Department Recommendation

* Users can select or enter common symptoms.
* The system recommends a suitable medical department based on the selected symptoms.
* Helps users understand which type of healthcare department may be relevant to their situation.

### 🩹 First-Aid Guide

* Provides basic first-aid information for selected common situations.
* Gives users general guidance for initial assistance.
* The feature is intended for informational purposes and does not replace professional medical advice.

### 💰 Treatment Cost Estimator

* Provides estimated treatment or procedure costs.
* Allows users to explore approximate costs for selected procedures.
* Cost estimates are generated based on predefined procedure information and hospital tier/category.

### 🏨 Hospital Cost Comparison

* Helps users compare estimated treatment costs between nearby healthcare facilities.
* Displays estimated minimum and maximum costs.
* Allows users to consider both distance and estimated cost when exploring healthcare options.

### 📏 Distance-Based Results

* Calculates approximate distances between the searched/current location and hospitals.
* Helps users identify nearby healthcare facilities.
* Results can be explored based on proximity.

### 📱 Responsive Design

* Designed to provide a user-friendly experience across different screen sizes.
* Works on desktop and mobile browsers.

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Maps and Location

* Leaflet.js
* OpenStreetMap
* Nominatim Geocoding API
* Overpass API
* Browser Geolocation API

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Live Server

---

## 📂 Project Structure

```text
HospitEase/
│
├── index.html
├── cost-estimator.html
├── README.md
│
├── css/
│   ├── styles.css
│   └── cost_estimator.css
│
└── js/
    ├── app.js
    └── cost-estimator.js
```

---

## ⚙️ How to Run the Project

### Prerequisites

You only need:

* A modern web browser such as Google Chrome, Microsoft Edge, or Firefox.
* Visual Studio Code (recommended).
* Live Server extension for VS Code (recommended).

### Steps

1. Clone the repository:

```bash
git clone https://github.com/your-username/HospitEase.git
```

2. Open the project folder in Visual Studio Code.

3. Install the **Live Server** extension.

4. Open `index.html`.

5. Right-click on `index.html` and select:

```text
Open with Live Server
```

6. The application will open in your default browser.

You can also access the cost estimation module through:

```text
cost-estimator.html
```

---

## 🔄 How HospitEase Works

The overall workflow of the application is:

```text
User
  │
  ├── Search Location
  │
  ├── Use Current Location
  │
  └── Select Symptoms
          │
          ▼
   Location / Symptom Analysis
          │
          ├── Find Nearby Hospitals
          │
          ├── Recommend Medical Department
          │
          └── Provide First-Aid Information
          │
          ▼
    Display Healthcare Facilities
          │
          ├── Interactive Map
          ├── Hospital Details
          └── Distance Information
          │
          ▼
     Cost Estimation Module
          │
          ├── Select Procedure
          ├── Estimate Treatment Cost
          └── Compare Nearby Facilities
```

---

## 💡 Key Highlights

* 📍 Location-aware hospital discovery
* 🗺️ Interactive map-based hospital visualization
* 🔎 Location search and geocoding
* 📱 Current location detection
* 🏥 Nearby healthcare facility discovery
* ❤️ Symptom-based medical department recommendation
* 🩹 Basic first-aid guidance
* 💰 Treatment cost estimation
* 🏨 Estimated hospital cost comparison
* 📏 Distance calculation
* 📱 Responsive user interface

---

## ⚠️ Disclaimer

HospitEase is developed for **educational and informational purposes**.

* Hospital information depends on the availability and accuracy of data from external mapping services.
* Treatment costs displayed by the application are **estimated values** and may not represent actual hospital billing.
* Cost estimates should not be considered official quotations.
* First-aid information is provided for general awareness only.
* Users should consult qualified healthcare professionals for medical diagnosis, treatment, or emergencies.
* In an emergency, contact your local emergency services or visit the nearest appropriate healthcare facility.

---

## 🔮 Future Enhancements

The following features can be added in future versions:

* 🔐 User authentication and profiles
* 🗄️ Backend database for hospital management
* 📊 Real-time hospital availability
* 🛏️ Live bed availability
* 👨‍⚕️ Doctor search and appointment booking
* 💊 Pharmacy and medicine availability
* 🚑 Ambulance search and booking
* 💳 Integration with insurance information
* 🤖 AI-powered symptom analysis
* 📈 Machine learning-based treatment cost prediction
* ⭐ Hospital ratings and reviews
* 🏥 Verified hospital profiles
* 🔔 Emergency alerts and notifications
* 📱 Progressive Web App (PWA) support

---

## 🎯 Project Objective

The main objective of HospitEase is to create a simple and accessible platform that helps users make better-informed healthcare decisions by bringing together **hospital discovery, location services, symptom-based guidance, first-aid information, and estimated treatment cost comparison** in one platform.

