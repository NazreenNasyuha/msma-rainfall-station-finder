/**
 * MSMA Rainfall Station Finder & Hydrological Calculator — Main Application
 * Compliant with:
 * - MSMA 2nd Edition (2012) Chapters 13 & 14
 * - DID Hydrological Procedure No. 1 (HP1) & Technical Guideline on Climate Change Factor
 *
 * Coordinates:
 * - Station Database (Standard polynomial, High ARI, Low ARI)
 * - Haversine distance calculator
 * - MSMA Table 13.3 Short Duration adjustment (5 ≤ t < 30 min)
 * - Rational Method Peak Flow calculation (Q = CIA / 360)
 * - Interactive Leaflet Map with map clicks, geolocation, and search
 * - Chart.js log-log IDF Curves
 * - Multi-ARI comparison & Engineering Submission Report export
 */

const App = (() => {
  /** Application State */
  let nearestStations = [];
  let selectedStation = null;
  let idfChart = null;
  let currentMode = "highari"; // "highari", "lowari", or "standard"
  let activeStationIndex = 0;

  /** Quick location presets covering Peninsular, Sabah, & Sarawak */
  const QUICK_LOCATIONS = [
    { name: "Kuala Lumpur", lat: 3.1390, lon: 101.6869 },
    { name: "Shah Alam", lat: 3.0733, lon: 101.4930 },
    { name: "Petaling Jaya", lat: 3.1073, lon: 101.6067 },
    { name: "Putrajaya", lat: 2.9264, lon: 101.6964 },
    { name: "Johor Bahru", lat: 1.4854, lon: 103.7618 },
    { name: "Melaka", lat: 2.1896, lon: 102.2501 },
    { name: "Seremban", lat: 2.7258, lon: 101.9424 },
    { name: "Ipoh", lat: 4.5975, lon: 101.0901 },
    { name: "Penang (Georgetown)", lat: 5.4164, lon: 100.3327 },
    { name: "Alor Setar", lat: 6.1248, lon: 100.3678 },
    { name: "Kuantan", lat: 3.8077, lon: 103.3260 },
    { name: "Kota Bharu", lat: 6.1211, lon: 102.2940 },
    { name: "Kuala Terengganu", lat: 5.3117, lon: 103.1324 },
    { name: "Kota Kinabalu", lat: 5.9750, lon: 116.0700 },
    { name: "Sandakan", lat: 5.8402, lon: 118.1179 },
    { name: "Kuching", lat: 1.5533, lon: 110.3570 },
    { name: "Miri", lat: 4.8830, lon: 114.9390 },
    { name: "Bintulu", lat: 3.1667, lon: 113.0333 },
  ];

  /** Malaysian City/Town search index */
  const MALAYSIA_CITIES = [
    { name: "Kuala Lumpur (Federal Territory)", lat: 3.1390, lon: 101.6869, type: "City" },
    { name: "Putrajaya (Federal Territory)", lat: 2.9264, lon: 101.6964, type: "City" },
    { name: "Cyberjaya, Selangor", lat: 2.9213, lon: 101.6559, type: "Town" },
    { name: "Shah Alam, Selangor", lat: 3.0733, lon: 101.4930, type: "City" },
    { name: "Petaling Jaya, Selangor", lat: 3.1073, lon: 101.6067, type: "City" },
    { name: "Subang Jaya, Selangor", lat: 3.0567, lon: 101.5851, type: "City" },
    { name: "Klang, Selangor", lat: 3.0449, lon: 101.4456, type: "City" },
    { name: "Kajang, Selangor", lat: 2.9927, lon: 101.7909, type: "Town" },
    { name: "Bangi, Selangor", lat: 2.9649, lon: 101.7725, type: "Town" },
    { name: "Rawang, Selangor", lat: 3.3211, lon: 101.5768, type: "Town" },
    { name: "Ampang, Selangor", lat: 3.1499, lon: 101.7617, type: "Town" },
    { name: "Johor Bahru, Johor", lat: 1.4854, lon: 103.7618, type: "City" },
    { name: "Iskandar Puteri, Johor", lat: 1.4230, lon: 103.6590, type: "City" },
    { name: "Pasir Gudang, Johor", lat: 1.4724, lon: 103.8824, type: "City" },
    { name: "Kulai, Johor", lat: 1.6633, lon: 103.6033, type: "Town" },
    { name: "Batu Pahat, Johor", lat: 1.8548, lon: 102.9325, type: "Town" },
    { name: "Muar, Johor", lat: 2.0442, lon: 102.5689, type: "Town" },
    { name: "Kluang, Johor", lat: 2.0251, lon: 103.3328, type: "Town" },
    { name: "Segamat, Johor", lat: 2.5065, lon: 102.8158, type: "Town" },
    { name: "Ipoh, Perak", lat: 4.5975, lon: 101.0901, type: "City" },
    { name: "Taiping, Perak", lat: 4.8517, lon: 100.7410, type: "Town" },
    { name: "Teluk Intan, Perak", lat: 4.0259, lon: 101.0213, type: "Town" },
    { name: "Kuala Kangsar, Perak", lat: 4.7667, lon: 100.9500, type: "Town" },
    { name: "Seremban, Negeri Sembilan", lat: 2.7258, lon: 101.9424, type: "City" },
    { name: "Port Dickson, Negeri Sembilan", lat: 2.5228, lon: 101.7964, type: "Town" },
    { name: "Nilai, Negeri Sembilan", lat: 2.8167, lon: 101.7981, type: "Town" },
    { name: "Melaka (Bandar Melaka)", lat: 2.1896, lon: 102.2501, type: "City" },
    { name: "Alor Gajah, Melaka", lat: 2.3804, lon: 102.2089, type: "Town" },
    { name: "Georgetown, Pulau Pinang", lat: 5.4164, lon: 100.3327, type: "City" },
    { name: "Butterworth, Pulau Pinang", lat: 5.3991, lon: 100.3638, type: "Town" },
    { name: "Bukit Mertajam, Pulau Pinang", lat: 5.3630, lon: 100.4667, type: "Town" },
    { name: "Alor Setar, Kedah", lat: 6.1248, lon: 100.3678, type: "City" },
    { name: "Sungai Petani, Kedah", lat: 5.6470, lon: 100.4877, type: "Town" },
    { name: "Kulim, Kedah", lat: 5.3647, lon: 100.5618, type: "Town" },
    { name: "Langkawi, Kedah", lat: 6.3500, lon: 99.8000, type: "Island/Town" },
    { name: "Kangar, Perlis", lat: 6.4414, lon: 100.1986, type: "Town" },
    { name: "Kuantan, Pahang", lat: 3.8077, lon: 103.3260, type: "City" },
    { name: "Temerloh, Pahang", lat: 3.4492, lon: 102.4172, type: "Town" },
    { name: "Bentong, Pahang", lat: 3.5218, lon: 101.9080, type: "Town" },
    { name: "Kota Bharu, Kelantan", lat: 6.1211, lon: 102.2940, type: "City" },
    { name: "Kuala Terengganu, Terengganu", lat: 5.3117, lon: 103.1324, type: "City" },
    { name: "Kemaman / Chukai, Terengganu", lat: 4.2333, lon: 103.4167, type: "Town" },
    { name: "Kota Kinabalu, Sabah", lat: 5.9750, lon: 116.0700, type: "City" },
    { name: "Sandakan, Sabah", lat: 5.8402, lon: 118.1179, type: "Town" },
    { name: "Tawau, Sabah", lat: 4.3990, lon: 118.3960, type: "Town" },
    { name: "Lahad Datu, Sabah", lat: 5.0268, lon: 118.3270, type: "Town" },
    { name: "Kuching, Sarawak", lat: 1.5533, lon: 110.3570, type: "City" },
    { name: "Miri, Sarawak", lat: 4.8830, lon: 114.9390, type: "City" },
    { name: "Sibu, Sarawak", lat: 3.2370, lon: 113.0360, type: "Town" },
    { name: "Bintulu, Sarawak", lat: 3.1667, lon: 113.0333, type: "Town" },
    { name: "Labuan (Federal Territory)", lat: 5.2831, lon: 115.2308, type: "Island/Town" },
  ];

  /**
   * Get active stations list based on current mode
   */
  const getActiveStations = () => {
    if (currentMode === "lowari") return LOW_ARI_STATIONS;
    if (currentMode === "highari") return HIGH_ARI_STATIONS;
    return STATIONS; // standard
  };

  /**
   * Initialize application
   */
  const init = () => {
    MapModule.init("map");
    MapModule.renderStations(getActiveStations());
    MapModule.setOnMapClick((lat, lon) => {
      setCoordinates(lat, lon);
      findNearest();
    });

    bindEvents();
    renderQuickLocations();
    updateModeUI();
  };

  /**
   * Bind DOM event listeners
   */
  const bindEvents = () => {
    document.getElementById("btnFind").addEventListener("click", findNearest);
    document.getElementById("btnClear").addEventListener("click", clearAll);
    document.getElementById("btnCalc").addEventListener("click", calculateAll);
    document.getElementById("btnLocate").addEventListener("click", useCurrentLocation);

    // Search bar input
    const searchInput = document.getElementById("siteSearch");
    searchInput.addEventListener("input", handleSearchInput);
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        closeSearchResults();
      }
    });

    // Enter key triggers search
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && document.activeElement.closest(".input-grid")) {
        findNearest();
      }
    });

    // Region filter buttons
    document.querySelectorAll("[data-region]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll("[data-region]").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        MapModule.filterByRegion(e.target.dataset.region, getActiveStations());
      });
    });

    // Mode switcher
    document.getElementById("modeSwitch").addEventListener("change", (e) => {
      currentMode = e.target.value;
      updateModeUI();
      MapModule.renderStations(getActiveStations());
      if (nearestStations.length > 0) {
        findNearest();
      }
    });

    // Short duration 2P24h selection change
    const p24Select = document.getElementById("calcP24");
    if (p24Select) {
      p24Select.addEventListener("change", () => {
        if (selectedStation) calculateAll();
      });
    }

    // Climate change factor change
    const ccfSelect = document.getElementById("calcCCF");
    if (ccfSelect) {
      ccfSelect.addEventListener("change", () => {
        if (selectedStation) calculateAll();
      });
    }

    // Runoff coefficient preset selector change
    const runCPreset = document.getElementById("runoffCPreset");
    if (runCPreset) {
      runCPreset.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val !== "custom") {
          document.getElementById("runoffC").value = val;
          if (selectedStation) calculateAll();
        }
      });
    }

    // Catchment area inputs
    const areaInput = document.getElementById("catchmentArea");
    if (areaInput) {
      areaInput.addEventListener("input", () => {
        if (selectedStation) calculateAll();
      });
    }

    const areaUnitSelect = document.getElementById("areaUnit");
    if (areaUnitSelect) {
      areaUnitSelect.addEventListener("change", () => {
        if (selectedStation) calculateAll();
      });
    }

    // Rational C manual input
    const runoffCInput = document.getElementById("runoffC");
    if (runoffCInput) {
      runoffCInput.addEventListener("input", () => {
        document.getElementById("runoffCPreset").value = "custom";
        if (selectedStation) calculateAll();
      });
    }

    // Duration change helper
    const durInput = document.getElementById("calcDur");
    if (durInput) {
      durInput.addEventListener("input", checkDurationNotice);
    }

    // Export buttons
    const btnCopy = document.getElementById("btnCopySheet");
    if (btnCopy) btnCopy.addEventListener("click", copyCalculationSheet);

    const btnCsv = document.getElementById("btnExportCSV");
    if (btnCsv) btnCsv.addEventListener("click", exportCSV);

    const btnPrint = document.getElementById("btnPrintReport");
    if (btnPrint) btnPrint.addEventListener("click", printReport);
  };

  /**
   * Search input handler with autocomplete
   */
  const handleSearchInput = (e) => {
    const query = e.target.value.trim().toLowerCase();
    const dropdown = document.getElementById("searchResults");

    if (query.length < 2) {
      dropdown.style.display = "none";
      dropdown.innerHTML = "";
      return;
    }

    const matches = [];

    // Search cities
    MALAYSIA_CITIES.forEach((c) => {
      if (c.name.toLowerCase().includes(query)) {
        matches.push({
          label: c.name,
          sub: `${c.type} · ${c.lat.toFixed(4)}°N, ${c.lon.toFixed(4)}°E`,
          lat: c.lat,
          lon: c.lon,
          isStation: false,
        });
      }
    });

    // Search active stations
    const stations = getActiveStations();
    stations.forEach((s) => {
      if (
        s.name.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query) ||
        s.state.toLowerCase().includes(query)
      ) {
        matches.push({
          label: `Station ${s.id}: ${s.name}`,
          sub: `${s.state} · Lat: ${s.lat.toFixed(4)}, Lon: ${s.lon.toFixed(4)}`,
          lat: s.lat,
          lon: s.lon,
          isStation: true,
          stationId: s.id,
        });
      }
    });

    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="search-item muted">No locations or stations found for "${query}"</div>`;
      dropdown.style.display = "block";
      return;
    }

    dropdown.innerHTML = matches
      .slice(0, 10)
      .map(
        (m, idx) => `
        <div class="search-item" onclick="App.selectSearchResult(${m.lat}, ${m.lon}, '${m.stationId || ""}')">
          <div class="search-item-title">${m.isStation ? "🌧️" : "📍"} ${m.label}</div>
          <div class="search-item-sub">${m.sub}</div>
        </div>
      `
      )
      .join("");

    dropdown.style.display = "block";
  };

  const closeSearchResults = () => {
    const dropdown = document.getElementById("searchResults");
    if (dropdown) dropdown.style.display = "none";
  };

  const selectSearchResult = (lat, lon, stationId) => {
    setCoordinates(lat, lon);
    closeSearchResults();
    findNearest();
    if (stationId) {
      setTimeout(() => selectStationById(stationId), 100);
    }
  };

  /**
   * Geolocation API to find nearest stations from user's current GPS location
   */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const btn = document.getElementById("btnLocate");
    const originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Locating...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        setCoordinates(pos.coords.latitude, pos.coords.longitude);
        findNearest();
      },
      (err) => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert(`Unable to get location: ${err.message}. Please enter coordinates manually.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  /**
   * Check duration notice for MSMA Table 13.3 short duration
   */
  const checkDurationNotice = () => {
    const dur = parseFloat(document.getElementById("calcDur").value);
    const notice = document.getElementById("shortDurationBadge");
    const p24Group = document.getElementById("p24Group");

    if (!isNaN(dur) && dur < 30) {
      if (notice) notice.style.display = "block";
      if (p24Group) p24Group.style.display = "block";
    } else {
      if (notice) notice.style.display = "none";
      if (p24Group) p24Group.style.display = "none";
    }
  };

  /**
   * Update UI elements based on current mode
   */
  const updateModeUI = () => {
    const eqLabel = document.getElementById("eqLabel");
    const eqFormula = document.getElementById("eqFormula");
    const eqDesc = document.getElementById("eqDesc");
    const idfTableHead = document.getElementById("idfTableHead");
    const coeffGrid = document.getElementById("coeffGrid");
    const formulaNote = document.getElementById("formulaNote");

    if (currentMode === "highari") {
      eqLabel.textContent = "High ARI IDF Equation (MSMA 2nd Ed. Appendix 13.A & Table 13.A1)";
      eqFormula.innerHTML = "I<sub>T</sub>(t) = λ × t<sup>−κ</sup> × [1 + θ × K<sub>T</sub>]<sup>η</sup>";
      eqDesc.innerHTML = "λ, κ, θ, η = Station coefficients &nbsp;|&nbsp; K<sub>T</sub> = −ln(−ln(1 − 1/T)) &nbsp;|&nbsp; Short duration (d &lt; 30 min) adjusted via MSMA Eq. 13.3";
      idfTableHead.innerHTML = "<tr><th>ARI (yr)</th><th>λ (Lambda)</th><th>κ (Kappa)</th><th>θ (Theta)</th><th>η (Eta)</th></tr>";
      formulaNote.innerHTML = "<strong>📝 MSMA Standard:</strong> High ARI formula is valid for 30 ≤ t ≤ 1000 min. For t &lt; 30 min (down to 5 min), MSMA Eq. 13.3 &amp; Table 13.3 short-duration adjustment is applied automatically.";
    } else if (currentMode === "lowari") {
      eqLabel.textContent = "Low ARI IDF Equation (MSMA 2nd Ed. Appendix 13.A & Table 13.A1)";
      eqFormula.innerHTML = "I<sub>T</sub>(t) = λ × t<sup>−κ</sup> × [1 + θ × K<sub>T</sub>]<sup>η</sup>";
      eqDesc.innerHTML = "λ, κ, θ, η = Station coefficients &nbsp;|&nbsp; K<sub>T</sub> = −ln(−ln(1 − 1/T)) &nbsp;|&nbsp; Short duration (d &lt; 30 min) adjusted via MSMA Eq. 13.3";
      idfTableHead.innerHTML = "<tr><th>ARI (yr)</th><th>λ (Lambda)</th><th>κ (Kappa)</th><th>θ (Theta)</th><th>η (Eta)</th></tr>";
      formulaNote.innerHTML = "<strong>📝 MSMA Standard:</strong> Low ARI formula is valid for 30 ≤ t ≤ 1000 min. For t &lt; 30 min (down to 5 min), MSMA Eq. 13.3 &amp; Table 13.3 short-duration adjustment is applied automatically.";
    } else {
      eqLabel.textContent = "MSMA 2nd Edition IDF Polynomial Equation (Eq. 13.2)";
      eqFormula.innerHTML = "ln(RI<sub>t</sub>) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³";
      eqDesc.innerHTML = "RI<sub>t</sub> = Rainfall Intensity (mm/hr), t = Duration (min) &nbsp;|&nbsp; Short duration (d &lt; 30 min) adjusted via MSMA Eq. 13.3";
      idfTableHead.innerHTML = "<tr><th>ARI (yr)</th><th>a</th><th>b</th><th>c</th><th>d</th></tr>";
      formulaNote.innerHTML = "<strong>📝 MSMA Standard:</strong> The polynomial is valid for 30 ≤ t ≤ 1000 min. For short durations (5 ≤ t &lt; 30 min), Eq. 13.3 &amp; Table 13.3 short-duration adjustment is applied automatically.";
    }

    coeffGrid.innerHTML = "";
    document.getElementById("coeffTitle").textContent = "Select a station to view coefficients";
  };

  /**
   * Render quick location buttons
   */
  const renderQuickLocations = () => {
    const container = document.getElementById("quickLocations");
    container.innerHTML = QUICK_LOCATIONS.map(
      (loc) =>
        `<button class="quick-btn" onclick="App.setQuickLocation(${loc.lat}, ${loc.lon})">${loc.name}</button>`
    ).join("");
  };

  const setCoordinates = (lat, lon) => {
    document.getElementById("lat").value = Number(lat).toFixed(4);
    document.getElementById("lon").value = Number(lon).toFixed(4);
  };

  const setQuickLocation = (lat, lon) => {
    setCoordinates(lat, lon);
    findNearest();
  };

  /**
   * Find nearest stations
   */
  const findNearest = () => {
    const lat = parseFloat(document.getElementById("lat").value);
    const lon = parseFloat(document.getElementById("lon").value);

    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid latitude and longitude coordinates, or click a quick location / on the map.");
      return;
    }

    const stations = getActiveStations();
    nearestStations = Haversine.findNearest(lat, lon, stations, 3);
    activeStationIndex = 0;
    selectedStation = nearestStations[0];

    // Auto-suggest 2P24h depth based on station region / state
    autoSelectP24(selectedStation);

    // Update UI components
    renderStationCards(lat, lon);
    renderIDFCoefficients(selectedStation);
    renderIDFChart(selectedStation);

    // Update Map
    MapModule.setUserMarker(lat, lon);
    MapModule.drawLines(lat, lon, nearestStations);
    MapModule.fitToResults(lat, lon, nearestStations);

    // Show Results
    document.getElementById("results").classList.add("active");

    // Run calculations
    calculateAll();
  };

  /**
   * Auto-select appropriate 2P24h depth based on station region
   * (East Coast, Sabah, Sarawak typically have higher 2P24h depths: 150-180mm)
   */
  const autoSelectP24 = (station) => {
    const p24Select = document.getElementById("calcP24");
    if (!p24Select || !station) return;

    const eastCoastStates = ["Kelantan", "Terengganu", "Pahang"];
    if (station.region === "sabah" || station.region === "sarawak") {
      p24Select.value = "150";
    } else if (eastCoastStates.includes(station.state)) {
      p24Select.value = "150";
    } else {
      p24Select.value = "120"; // West Coast Peninsular default
    }
  };

  /**
   * Select a station by index from Top 3
   */
  const selectStationByIndex = (index) => {
    if (!nearestStations || index >= nearestStations.length) return;
    activeStationIndex = index;
    selectedStation = nearestStations[index];

    // Highlight card
    document.querySelectorAll(".station-card").forEach((card, idx) => {
      card.classList.toggle("active-station", idx === index);
    });

    renderIDFCoefficients(selectedStation);
    renderIDFChart(selectedStation);
    MapModule.highlightStation(selectedStation.id);
    calculateAll();
  };

  /**
   * Select station by ID (e.g. from map marker popup or search)
   */
  const selectStationById = (stationId) => {
    const stations = getActiveStations();
    const st = stations.find((s) => s.id === stationId);
    if (!st) return;

    // Check if it's already in nearestStations
    const existingIdx = nearestStations.findIndex((s) => s.id === stationId);
    if (existingIdx !== -1) {
      selectStationByIndex(existingIdx);
      return;
    }

    // Otherwise prepend as active selected station
    const userLat = parseFloat(document.getElementById("lat").value) || st.lat;
    const userLon = parseFloat(document.getElementById("lon").value) || st.lon;
    const dist = Haversine.distance(userLat, userLon, st.lat, st.lon);
    const stationWithDist = { ...st, dist };

    nearestStations = [stationWithDist, ...nearestStations.slice(0, 2)];
    activeStationIndex = 0;
    selectedStation = stationWithDist;

    renderStationCards(userLat, userLon);
    renderIDFCoefficients(selectedStation);
    renderIDFChart(selectedStation);
    calculateAll();
    MapModule.highlightStation(st.id);
  };

  /**
   * Render station result cards
   */
  const renderStationCards = (userLat, userLon) => {
    const container = document.getElementById("stationResults");
    const medals = ["🥇", "🥈", "🥉"];
    const rankLabels = ["Nearest Station", "2nd Nearest", "3rd Nearest"];

    container.innerHTML = nearestStations
      .map(
        (s, i) => `
      <div class="station-card ${i === activeStationIndex ? "active-station" : ""}" onclick="App.selectStationByIndex(${i})">
        <div class="station-header">
          <div>
            <span class="station-rank-badge">${medals[i]} ${rankLabels[i]}</span>
            <span class="station-id">${s.id}</span>
            <span class="station-name">${s.name}</span>
            <span class="station-region">${s.state} · ${s.region.toUpperCase()}</span>
          </div>
          <div class="distance-badge">📏 ${s.dist.toFixed(2)} km</div>
        </div>
        <div class="station-info">
          <div class="info-item">
            <div class="info-label">Latitude</div>
            <div class="info-value">${s.lat.toFixed(4)}°N</div>
          </div>
          <div class="info-item">
            <div class="info-label">Longitude</div>
            <div class="info-value">${s.lon.toFixed(4)}°E</div>
          </div>
          <div class="info-item">
            <div class="info-label">Distance</div>
            <div class="info-value">${s.dist.toFixed(2)} km</div>
          </div>
          <div class="info-item">
            <div class="info-label">Bearing</div>
            <div class="info-value">${Haversine.bearing(userLat, userLon, s.lat, s.lon)}</div>
          </div>
        </div>
        <div class="station-select-hint">
          ${i === activeStationIndex ? "✅ Active Station for IDF & Discharge Calculations" : "👉 Click to make this the active station"}
        </div>
      </div>
    `
      )
      .join("");
  };

  /**
   * Render IDF coefficients table & summary
   */
  const renderIDFCoefficients = (station) => {
    document.getElementById("coeffTitle").textContent =
      `Coefficients — ${station.name} (${station.id}), ${station.state}`;

    if (currentMode === "standard") {
      renderStandardCoefficients(station);
    } else {
      renderLambdaCoefficients(station);
    }
  };

  const renderStandardCoefficients = (station) => {
    const c10 = station.idf?.[10];
    if (!c10) return;

    const grid = document.getElementById("coeffGrid");
    grid.innerHTML = [
      { sym: "a", name: "Constant a (10-yr)", val: c10.a.toFixed(4) },
      { sym: "b", name: "Coefficient b (10-yr)", val: c10.b.toFixed(4) },
      { sym: "c", name: "Coefficient c (10-yr)", val: c10.c.toFixed(4) },
      { sym: "d", name: "Coefficient d (10-yr)", val: c10.d.toFixed(4) },
    ]
      .map(
        (x) => `
      <div class="coeff-card">
        <div class="coeff-symbol">${x.sym}</div>
        <div class="coeff-name">${x.name}</div>
        <div class="coeff-value">${x.val}</div>
      </div>
    `
      )
      .join("");

    const tbody = document.getElementById("idfBody");
    tbody.innerHTML = IDFCalculator.VALID_ARIS.map((ari) => {
      const cc = station.idf[ari];
      if (!cc) return "";
      return `
        <tr>
          <td><strong>${ari} yr</strong></td>
          <td>${cc.a.toFixed(4)}</td>
          <td>${cc.b.toFixed(4)}</td>
          <td>${cc.c.toFixed(4)}</td>
          <td>${cc.d.toFixed(4)}</td>
        </tr>
      `;
    }).join("");
  };

  const renderLambdaCoefficients = (station) => {
    const grid = document.getElementById("coeffGrid");
    grid.innerHTML = [
      { sym: "λ", name: "Lambda (λ)", val: station.lambda.toFixed(3) },
      { sym: "κ", name: "Kappa (κ)", val: station.kappa.toFixed(3) },
      { sym: "θ", name: "Theta (θ)", val: station.theta.toFixed(3) },
      { sym: "η", name: "Eta (η)", val: station.eta.toFixed(3) },
    ]
      .map(
        (x) => `
      <div class="coeff-card">
        <div class="coeff-symbol">${x.sym}</div>
        <div class="coeff-name">${x.name}</div>
        <div class="coeff-value">${x.val}</div>
      </div>
    `
      )
      .join("");

    const tbody = document.getElementById("idfBody");
    tbody.innerHTML = `
      <tr>
        <td><strong>All ARIs (2–100 yr)</strong></td>
        <td>${station.lambda.toFixed(3)}</td>
        <td>${station.kappa.toFixed(3)}</td>
        <td>${station.theta.toFixed(3)}</td>
        <td>${station.eta.toFixed(3)}</td>
      </tr>
    `;
  };

  /**
   * Render IDF curve chart with log-spaced points from 5 to 1000 min
   */
  const renderIDFChart = (station) => {
    const p24Depth = parseFloat(document.getElementById("calcP24")?.value || 120);
    let chartData;

    if (currentMode === "standard") {
      chartData = IDFCalculator.generateChartData(station, p24Depth);
    } else {
      chartData = IDFCalculator.generateHighARIChartData(station, p24Depth);
    }

    if (!chartData) return;

    const ctx = document.getElementById("idfChart").getContext("2d");

    if (idfChart) {
      idfChart.destroy();
    }

    idfChart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `MSMA IDF Curves — ${station.name}, ${station.state} (5 to 1000 min)`,
            font: { size: 14, weight: "bold" },
            color: "#1a5276",
          },
          legend: {
            position: "bottom",
            labels: { usePointStyle: true, padding: 12 },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (items) => `Storm Duration: ${items[0].label} min`,
              label: (item) => `${item.dataset.label}: ${item.formattedValue} mm/hr`,
            },
          },
        },
        scales: {
          x: {
            type: "logarithmic",
            title: {
              display: true,
              text: "Storm Duration (minutes)",
              font: { weight: "bold" },
            },
            ticks: {
              callback: (val) => {
                const keyTicks = [5, 10, 15, 30, 60, 120, 240, 480, 1000];
                return keyTicks.includes(val) ? val : "";
              },
            },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          y: {
            type: "logarithmic",
            title: {
              display: true,
              text: "Rainfall Intensity, I (mm/hr)",
              font: { weight: "bold" },
            },
            grid: { color: "rgba(0,0,0,0.06)" },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    });
  };

  /**
   * Comprehensive calculation: IDF, Climate Change Factor, Rational Method, and Multi-ARI table
   */
  const calculateAll = () => {
    if (!selectedStation) return;

    const durInput = document.getElementById("calcDur");
    let dur = parseFloat(durInput.value);

    if (isNaN(dur) || dur < IDFCalculator.MIN_DURATION || dur > IDFCalculator.MAX_DURATION) {
      dur = 60; // default to 60 min if invalid or empty
      durInput.value = "60";
    }

    const ari = parseInt(document.getElementById("calcARI").value) || 10;
    const p24Depth = parseFloat(document.getElementById("calcP24")?.value || 120);
    const ccfPercent = parseFloat(document.getElementById("calcCCF")?.value || 0);

    checkDurationNotice();

    // 1. Calculate Base Intensity
    let baseIntensity;
    if (currentMode === "standard") {
      const coeffs = selectedStation.idf?.[ari];
      if (!coeffs) {
        alert("ARI not available for this station.");
        return;
      }
      baseIntensity = IDFCalculator.calculateStandard(coeffs, dur, p24Depth);
    } else {
      baseIntensity = IDFCalculator.calculateHighARI(selectedStation, dur, ari, p24Depth);
    }

    if (baseIntensity === null || isNaN(baseIntensity)) {
      alert("Calculation error. Check your inputs.");
      return;
    }

    // 2. Climate Change Adjusted Intensity
    const climateIntensity = IDFCalculator.applyCCF(baseIntensity, ccfPercent);

    // 3. Catchment Area & Rational Method Peak Flow
    const rawArea = parseFloat(document.getElementById("catchmentArea")?.value || 0);
    const areaUnit = document.getElementById("areaUnit")?.value || "ha";
    const areaHa = areaUnit === "m2" ? rawArea / 10000 : rawArea;
    const runoffC = parseFloat(document.getElementById("runoffC")?.value || 0.70);

    const baseRational = areaHa > 0 ? IDFCalculator.calculateRational(runoffC, baseIntensity, areaHa) : null;
    const climateRational = areaHa > 0 ? IDFCalculator.calculateRational(runoffC, climateIntensity, areaHa) : null;

    // 4. Update Result UI Cards
    updateIntensityCard(baseIntensity, climateIntensity, ccfPercent, dur, ari);
    updateRationalCard(baseRational, climateRational, ccfPercent, runoffC, areaHa);
    renderMultiARITable(dur, p24Depth, ccfPercent, runoffC, areaHa);
    renderCalculationBreakdown(selectedStation, dur, ari, baseIntensity, climateIntensity, ccfPercent, runoffC, areaHa, p24Depth);

    document.getElementById("calcResult").classList.add("active");
  };

  /**
   * Update IDF Intensity result UI
   */
  const updateIntensityCard = (baseI, climateI, ccf, dur, ari) => {
    const intensityEl = document.getElementById("calcIntensity");
    const detailEl = document.getElementById("calcDetail");
    const depth = (baseI * dur) / 60;

    if (ccf > 0) {
      intensityEl.innerHTML = `
        <span>${climateI.toFixed(2)} mm/hr</span>
        <span class="ccf-tag">+${ccf}% CCF</span>
      `;
      detailEl.innerHTML = `
        Baseline: <b>${baseI.toFixed(2)} mm/hr</b> | Depth: <b>${depth.toFixed(2)} mm</b><br>
        Station: <b>${selectedStation.name}</b> | Duration: <b>${dur} min</b> | ARI: <b>${ari} yr</b>
      `;
    } else {
      intensityEl.textContent = `${baseI.toFixed(2)} mm/hr`;
      detailEl.innerHTML = `
        Total Rainfall Depth: <b>${depth.toFixed(2)} mm</b><br>
        Station: <b>${selectedStation.name}</b> | Duration: <b>${dur} min</b> | ARI: <b>${ari} yr</b>
      `;
    }
  };

  /**
   * Update Rational Method Peak Flow UI
   */
  const updateRationalCard = (baseQ, climateQ, ccf, C, areaHa) => {
    const qSection = document.getElementById("rationalResults");
    if (!qSection) return;

    if (!baseQ || areaHa <= 0) {
      qSection.innerHTML = `
        <div class="empty-rational-hint">
          ℹ️ Enter catchment area above to compute Peak Discharge <b>Q (m³/s)</b> per MSMA Chapter 14.
        </div>
      `;
      return;
    }

    const qDisplay = ccf > 0 ? climateQ : baseQ;
    const isOver80 = baseQ.isOver80ha;

    qSection.innerHTML = `
      <div class="rational-metrics-grid">
        <div class="rational-metric">
          <div class="metric-label">Peak Discharge (Q)</div>
          <div class="metric-val highlight">${qDisplay.Q_m3s} <span class="metric-unit">m³/s</span></div>
          <div class="metric-sub">${qDisplay.Q_Ls.toLocaleString()} L/s</div>
        </div>
        <div class="rational-metric">
          <div class="metric-label">Runoff Coefficient (C)</div>
          <div class="metric-val">${C.toFixed(2)}</div>
          <div class="metric-sub">Catchment: ${areaHa.toFixed(2)} ha</div>
        </div>
        ${
          ccf > 0
            ? `
        <div class="rational-metric">
          <div class="metric-label">Baseline Q (No CCF)</div>
          <div class="metric-val">${baseQ.Q_m3s} <span class="metric-unit">m³/s</span></div>
          <div class="metric-sub">${baseQ.Q_Ls.toLocaleString()} L/s</div>
        </div>
        `
            : ""
        }
      </div>
      ${
        isOver80
          ? `<div class="msma-warning">⚠️ <b>MSMA Section 14.1 Notice:</b> Catchment area (${areaHa.toFixed(
              2
            )} ha) exceeds 80 hectares. The Rational Method is primarily intended for catchments ≤ 80 ha. Hydrograph / Unit Hydrograph routing (MSMA Chapter 15) is recommended for larger basins.</div>`
          : ""
      }
    `;
  };

  /**
   * Render comprehensive multi-ARI summary table
   */
  const renderMultiARITable = (dur, p24Depth, ccf, C, areaHa) => {
    const tbody = document.getElementById("multiARIBody");
    if (!tbody) return;

    const rows = IDFCalculator.VALID_ARIS.map((ari) => {
      let iVal;
      if (currentMode === "standard") {
        const c = selectedStation.idf?.[ari];
        iVal = c ? IDFCalculator.calculateStandard(c, dur, p24Depth) : null;
      } else {
        iVal = IDFCalculator.calculateHighARI(selectedStation, dur, ari, p24Depth);
      }

      if (iVal === null) return "";

      const depth = (iVal * dur) / 60;
      const iClimate = ccf > 0 ? IDFCalculator.applyCCF(iVal, ccf) : iVal;
      const qVal = areaHa > 0 ? IDFCalculator.calculateRational(C, iClimate, areaHa) : null;

      return `
        <tr>
          <td><strong>${ari} Years</strong></td>
          <td><b>${iVal.toFixed(2)}</b></td>
          ${ccf > 0 ? `<td><span class="badge-ccf">${iClimate.toFixed(2)}</span></td>` : ""}
          <td>${depth.toFixed(2)}</td>
          <td>${qVal ? `<b>${qVal.Q_m3s}</b> (${qVal.Q_Ls} L/s)` : "—"}</td>
        </tr>
      `;
    }).join("");

    tbody.innerHTML = rows;

    const ccfHeader = document.getElementById("thCCFIntensity");
    if (ccfHeader) {
      ccfHeader.style.display = ccf > 0 ? "table-cell" : "none";
    }
  };

  /**
   * Render Step-by-Step Mathematical Breakdown for Engineering Submission
   */
  const renderCalculationBreakdown = (station, dur, ari, baseI, climateI, ccf, C, areaHa, p24Depth) => {
    const box = document.getElementById("calcBreakdownContent");
    if (!box) return;

    const KT = IDFCalculator.gumbelK(ari);
    const depth = (baseI * dur) / 60;
    const isShort = dur < 30;
    const Fd = isShort ? IDFCalculator.getFd(dur, p24Depth) : 0;

    let mathHTML = `
      <div class="breakdown-step">
        <h4>1. Station Metadata & Selection</h4>
        <p>• Station Name: <b>${station.name}</b> (ID: <b>${station.id}</b>)</p>
        <p>• Location: <b>${station.lat.toFixed(4)}°N, ${station.lon.toFixed(4)}°E</b> | State: <b>${station.state}</b> (${station.region.toUpperCase()})</p>
        <p>• Distance to Site: <b>${station.dist ? station.dist.toFixed(2) + " km" : "Selected"}</b></p>
      </div>

      <div class="breakdown-step">
        <h4>2. MSMA Rainfall Intensity Formulation</h4>
    `;

    if (currentMode === "standard") {
      const cc = station.idf?.[ari];
      mathHTML += `
        <p>• Formula (MSMA 2nd Ed. Eq. 13.2): <code>ln(I) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³</code></p>
        <p>• Duration (t): <b>${dur} min</b> | ARI (T): <b>${ari} yr</b></p>
        <p>• Coefficients: a = <b>${cc.a.toFixed(4)}</b>, b = <b>${cc.b.toFixed(4)}</b>, c = <b>${cc.c.toFixed(4)}</b>, d = <b>${cc.d.toFixed(4)}</b></p>
      `;
    } else {
      mathHTML += `
        <p>• Formula (${currentMode === "highari" ? "High ARI" : "Low ARI"}, MSMA Appendix 13.A): <code>I_T(t) = λ × t^(−κ) × [1 + θ × K_T]^η</code></p>
        <p>• Duration (t): <b>${dur} min</b> | ARI (T): <b>${ari} yr</b></p>
        <p>• Coefficients: λ = <b>${station.lambda.toFixed(3)}</b>, κ = <b>${station.kappa.toFixed(3)}</b>, θ = <b>${station.theta.toFixed(3)}</b>, η = <b>${station.eta.toFixed(3)}</b></p>
        <p>• Gumbel Frequency Factor (K_T): <code>K_${ari} = −ln(−ln(1 − 1/${ari})) = <b>${KT.toFixed(4)}</b></code></p>
      `;
    }

    if (isShort) {
      const i30 = currentMode === "standard"
        ? IDFCalculator.calculateStandardBase(station.idf[ari], 30)
        : IDFCalculator.calculateHighARIBase(station, 30, ari);
      const i60 = currentMode === "standard"
        ? IDFCalculator.calculateStandardBase(station.idf[ari], 60)
        : IDFCalculator.calculateHighARIBase(station, 60, ari);
      const p30 = i30 * 0.5;
      const p60 = i60 * 1.0;
      const pd = p30 - Fd * (p60 - p30);

      mathHTML += `
        <div class="short-step-box">
          <p><b>⚡ Short Duration Storm Adjustment (t = ${dur} min &lt; 30 min):</b></p>
          <p>• MSMA 2nd Ed. Eq. 13.3: <code>P_d = P_30 − F_D × (P_60 − P_30)</code></p>
          <p>• 2P24h Depth: <b>${p24Depth} mm</b> → Adjustment Factor F_D (Table 13.3): <b>${Fd.toFixed(3)}</b></p>
          <p>• P_30 = ${i30.toFixed(2)} × 0.5 = <b>${p30.toFixed(2)} mm</b> | P_60 = ${i60.toFixed(2)} × 1.0 = <b>${p60.toFixed(2)} mm</b></p>
          <p>• P_${dur} = ${p30.toFixed(2)} − ${Fd.toFixed(3)} × (${p60.toFixed(2)} − ${p30.toFixed(2)}) = <b>${pd.toFixed(2)} mm</b></p>
          <p>• Intensity: <code>I = P_${dur} / (${dur}/60) = <b>${baseI.toFixed(2)} mm/hr</b></code></p>
        </div>
      `;
    } else {
      mathHTML += `
        <p>• Calculated Intensity (I): <b>${baseI.toFixed(2)} mm/hr</b></p>
        <p>• Total Rainfall Depth (P): <code>P = I × (t/60) = ${baseI.toFixed(2)} × (${dur}/60) = <b>${depth.toFixed(2)} mm</b></code></p>
      `;
    }

    mathHTML += `</div>`;

    if (ccf > 0) {
      mathHTML += `
        <div class="breakdown-step">
          <h4>3. Climate Change Factor (CCF) Adjustment</h4>
          <p>• DID Technical Guideline CCF: <b>+${ccf}%</b></p>
          <p>• Adjusted Intensity: <code>I_climate = I × (1 + ${ccf}/100) = ${baseI.toFixed(2)} × ${(1 + ccf / 100).toFixed(2)} = <b>${climateI.toFixed(2)} mm/hr</b></code></p>
        </div>
      `;
    }

    if (areaHa > 0) {
      const qDesign = ccf > 0 ? climateI : baseI;
      const qVal = IDFCalculator.calculateRational(C, qDesign, areaHa);
      mathHTML += `
        <div class="breakdown-step">
          <h4>${ccf > 0 ? "4" : "3"}. Rational Method Peak Flow (MSMA Chapter 14)</h4>
          <p>• Peak Flow Formula (Eq. 14.1): <code>Q = (C × I × A) / 360</code></p>
          <p>• Parameters: C = <b>${C.toFixed(2)}</b>, I = <b>${qDesign.toFixed(2)} mm/hr</b>, A = <b>${areaHa.toFixed(2)} ha</b></p>
          <p>• Calculation: <code>Q = (${C.toFixed(2)} × ${qDesign.toFixed(2)} × ${areaHa.toFixed(2)}) / 360 = <b>${qVal.Q_m3s} m³/s</b> (${qVal.Q_Ls.toLocaleString()} L/s)</code></p>
        </div>
      `;
    }

    box.innerHTML = mathHTML;
  };

  /**
   * Copy Calculation Sheet to Clipboard
   */
  const copyCalculationSheet = () => {
    if (!selectedStation) return;
    const dur = document.getElementById("calcDur").value;
    const ari = document.getElementById("calcARI").value;
    const baseI = document.getElementById("calcIntensity").innerText;
    const area = document.getElementById("catchmentArea").value;
    const unit = document.getElementById("areaUnit").value;
    const runoffC = document.getElementById("runoffC").value;
    const ccf = document.getElementById("calcCCF").value;

    const text = `
=== MSMA DRAINAGE CALCULATION SHEET ===
Source: Urban Stormwater Management Manual for Malaysia (MSMA 2nd Edition)
Station: ${selectedStation.name} (ID: ${selectedStation.id})
State: ${selectedStation.state} (${selectedStation.region.toUpperCase()})
Coordinates: ${selectedStation.lat.toFixed(4)}°N, ${selectedStation.lon.toFixed(4)}°E
Distance: ${selectedStation.dist ? selectedStation.dist.toFixed(2) + " km" : "Selected"}
IDF Mode: ${currentMode.toUpperCase()}

DESIGN RAINSTORM:
Storm Duration (t): ${dur} minutes
Average Recurrence Interval (ARI): ${ari} years
Rainfall Intensity (I): ${baseI}
Climate Change Factor (CCF): +${ccf}%

RATIONAL METHOD PEAK DISCHARGE:
Runoff Coefficient (C): ${runoffC}
Catchment Area: ${area} ${unit}
Design Peak Flow (Q): Q = (C * I * A) / 360
Generated by MSMA Rainfall Station Finder
=======================================
`.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Calculation sheet copied to clipboard!");
    });
  };

  /**
   * Export IDF Curves and Summary to CSV file
   */
  const exportCSV = () => {
    if (!selectedStation) return;

    const dur = parseFloat(document.getElementById("calcDur").value) || 60;
    const p24Depth = parseFloat(document.getElementById("calcP24")?.value || 120);

    let csvContent = `data:text/csv;charset=utf-8,`;
    csvContent += `"MSMA IDF Data Export"\n`;
    csvContent += `"Station","${selectedStation.name}","ID","${selectedStation.id}","State","${selectedStation.state}"\n`;
    csvContent += `"Mode","${currentMode}"\n\n`;

    // Header: Duration vs ARIs
    csvContent += `"Duration (min)",` + IDFCalculator.VALID_ARIS.map((a) => `"${a}-yr ARI (mm/hr)"`).join(",") + `\n`;

    IDFCalculator.CHART_DURATIONS.forEach((d) => {
      const row = [d];
      IDFCalculator.VALID_ARIS.forEach((ari) => {
        let val;
        if (currentMode === "standard") {
          const c = selectedStation.idf?.[ari];
          val = c ? IDFCalculator.calculateStandard(c, d, p24Depth) : "";
        } else {
          val = IDFCalculator.calculateHighARI(selectedStation, d, ari, p24Depth);
        }
        row.push(val !== null ? val.toFixed(2) : "");
      });
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MSMA_IDF_${selectedStation.id}_${selectedStation.name.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Print Report (clean print view)
   */
  const printReport = () => {
    window.print();
  };

  /**
   * Clear all results
   */
  const clearAll = () => {
    document.getElementById("lat").value = "";
    document.getElementById("lon").value = "";
    document.getElementById("siteSearch").value = "";
    document.getElementById("results").classList.remove("active");
    document.getElementById("calcResult").classList.remove("active");
    MapModule.clearAll();
    nearestStations = [];
    selectedStation = null;
    activeStationIndex = 0;
    if (idfChart) {
      idfChart.destroy();
      idfChart = null;
    }
  };

  return {
    init,
    setQuickLocation,
    selectSearchResult,
    selectStationByIndex,
    selectStationById,
    useCurrentLocation,
    findNearest,
    calculateAll,
    copyCalculationSheet,
    exportCSV,
    printReport,
    clearAll,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", App.init);
