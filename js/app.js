/**
 * MSMA Rainfall Station Finder — Main Application
 *
 * Coordinates all modules: stations, haversine, IDF, map, and chart.
 * Supports three modes: High ARI (default), Low ARI, and Standard (polynomial).
 */

const App = (() => {
  /** State */
  let nearestStations = [];
  let selectedStation = null;
  let idfChart = null;
  let currentMode = "highari"; // "highari", "lowari", or "standard"

  /** Quick location presets */
  const QUICK_LOCATIONS = [
    { name: "KL", lat: 3.139, lon: 101.687 },
    { name: "Shah Alam", lat: 3.073, lon: 101.493 },
    { name: "Ipoh", lat: 4.598, lon: 101.09 },
    { name: "Penang", lat: 5.416, lon: 100.333 },
    { name: "Johor Bahru", lat: 1.485, lon: 103.762 },
    { name: "Kota Bharu", lat: 6.121, lon: 102.294 },
    { name: "Kota Kinabalu", lat: 5.975, lon: 116.07 },
    { name: "Kuching", lat: 1.553, lon: 110.357 },
    { name: "Tawau", lat: 4.399, lon: 118.396 },
    { name: "Sibu", lat: 3.237, lon: 113.036 },
    { name: "Miri", lat: 4.883, lon: 114.939 },
    { name: "Kuantan", lat: 3.817, lon: 103.333 },
  ];

  /**
   * Get the active station list based on current mode
   */
  const getActiveStations = () => {
    if (currentMode === "lowari") return LOW_ARI_STATIONS;
    if (currentMode === "highari") return HIGH_ARI_STATIONS;
    return STATIONS; // standard
  };

  /**
   * Initialize the application
   */
  const init = () => {
    MapModule.init("map");
    MapModule.renderStations(HIGH_ARI_STATIONS); // default to High ARI
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
    document.getElementById("btnCalc").addEventListener("click", calculateIDF);

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
      // Re-run search if coordinates are set
      if (nearestStations.length > 0) {
        findNearest();
      }
    });
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
      eqLabel.textContent = "High ARI IDF Equation (Appendix 13.A)";
      eqFormula.innerHTML = "I<sub>T</sub>(t) = λ × t<sup>−κ</sup> × [1 + θ × K<sub>T</sub>]<sup>η</sup>";
      eqDesc.innerHTML = "λ, κ, θ, η = Station coefficients &nbsp;|&nbsp; K<sub>T</sub> = Gumbel frequency factor &nbsp;|&nbsp; t = Duration (min), valid 30–1000 min";
      idfTableHead.innerHTML = "<tr><th>ARI (yr)</th><th>λ</th><th>κ</th><th>θ</th><th>η</th></tr>";
      formulaNote.innerHTML = "<strong>📝 Note:</strong> The High ARI formula uses Lambda (λ), Kappa (κ), Theta (θ), and Eta (η) coefficients. Valid for 30 ≤ t ≤ 1000 min. K<sub>T</sub> = −ln(−ln(1 − 1/T)) from Gumbel distribution.";
    } else if (currentMode === "lowari") {
      eqLabel.textContent = "Low ARI IDF Equation (Appendix 13.A)";
      eqFormula.innerHTML = "I<sub>T</sub>(t) = λ × t<sup>−κ</sup> × [1 + θ × K<sub>T</sub>]<sup>η</sup>";
      eqDesc.innerHTML = "λ, κ, θ, η = Station coefficients &nbsp;|&nbsp; K<sub>T</sub> = Gumbel frequency factor &nbsp;|&nbsp; t = Duration (min), valid 30–1000 min";
      idfTableHead.innerHTML = "<tr><th>ARI (yr)</th><th>λ</th><th>κ</th><th>θ</th><th>η</th></tr>";
      formulaNote.innerHTML = "<strong>📝 Note:</strong> The Low ARI formula uses Lambda (λ), Kappa (κ), Theta (θ), and Eta (η) coefficients. Valid for 30 ≤ t ≤ 1000 min. K<sub>T</sub> = −ln(−ln(1 − 1/T)) from Gumbel distribution.";
    } else {
      eqLabel.textContent = "MSMA 2nd Edition IDF Polynomial (Eq. 13.2)";
      eqFormula.innerHTML = "ln(RI<sub>t</sub>) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³";
      eqDesc.innerHTML = "RI<sub>t</sub> = Rainfall Intensity (mm/hr), t = Duration (min), valid 30–1000 min, ARI 2–100 years";
      idfTableHead.innerHTML = "<tr><th>ARI (yr)</th><th>a</th><th>b</th><th>c</th><th>d</th></tr>";
      formulaNote.innerHTML = "<strong>📝 Short Duration (&lt; 30 min):</strong> Use Table 13.3 &amp; Eq. 13.3 from MSMA 2nd Edition. The polynomial is valid for 30 ≤ t ≤ 1000 min only.";
    }

    // Clear coefficient display
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

  /**
   * Set coordinates from quick location button
   */
  const setQuickLocation = (lat, lon) => {
    document.getElementById("lat").value = lat.toFixed(4);
    document.getElementById("lon").value = lon.toFixed(4);
  };

  /**
   * Find nearest stations
   */
  const findNearest = () => {
    const lat = parseFloat(document.getElementById("lat").value);
    const lon = parseFloat(document.getElementById("lon").value);

    if (isNaN(lat) || isNaN(lon)) {
      showAlert("Please enter valid coordinates.");
      return;
    }

    const stations = getActiveStations();

    // Find nearest
    nearestStations = Haversine.findNearest(lat, lon, stations, 3);
    selectedStation = nearestStations[0];

    // Update UI
    renderStationCards(lat, lon);
    renderIDFCoefficients(selectedStation);
    renderIDFChart(selectedStation);

    // Update map
    MapModule.setUserMarker(lat, lon);
    MapModule.drawLines(lat, lon, nearestStations);
    MapModule.fitToResults(lat, lon, nearestStations);

    // Show results
    document.getElementById("results").classList.add("active");
  };

  /**
   * Render station result cards
   */
  const renderStationCards = (userLat, userLon) => {
    const container = document.getElementById("stationResults");
    const medals = ["🥇", "🥈", "🥉"];

    container.innerHTML = nearestStations
      .map(
        (s, i) => `
      <div class="station-card ${i === 0 ? "nearest" : ""}">
        <div class="station-header">
          <div>
            <span class="station-id">${s.id}</span>
            <span class="station-name">${medals[i]} ${s.name}</span>
            <span class="station-region">${s.state} · ${s.region}</span>
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
      </div>
    `
      )
      .join("");
  };

  /**
   * Render IDF coefficients table
   */
  const renderIDFCoefficients = (station) => {
    document.getElementById("coeffTitle").textContent =
      `Coefficients — ${station.name}, ${station.state}`;

    if (currentMode === "standard") {
      renderStandardCoefficients(station);
    } else {
      renderLambdaCoefficients(station);
    }
  };

  /**
   * Render Standard mode coefficients (a, b, c, d per ARI)
   */
  const renderStandardCoefficients = (station) => {
    const c10 = station.idf?.[10];
    if (!c10) return;

    const grid = document.getElementById("coeffGrid");
    grid.innerHTML = [
      { sym: "a", name: "Constant a", val: c10.a.toFixed(4) },
      { sym: "b", name: "Coefficient b", val: c10.b.toFixed(4) },
      { sym: "c", name: "Coefficient c", val: c10.c.toFixed(4) },
      { sym: "d", name: "Coefficient d", val: c10.d.toFixed(4) },
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

  /**
   * Render Lambda/Kappa/Theta/Eta coefficients (for High ARI or Low ARI)
   */
  const renderLambdaCoefficients = (station) => {
    const grid = document.getElementById("coeffGrid");
    grid.innerHTML = [
      { sym: "λ", name: "Lambda", val: station.lambda.toFixed(3) },
      { sym: "κ", name: "Kappa", val: station.kappa.toFixed(3) },
      { sym: "θ", name: "Theta", val: station.theta.toFixed(3) },
      { sym: "η", name: "Eta", val: station.eta.toFixed(3) },
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
        <td><strong>All ARIs</strong></td>
        <td>${station.lambda.toFixed(3)}</td>
        <td>${station.kappa.toFixed(3)}</td>
        <td>${station.theta.toFixed(3)}</td>
        <td>${station.eta.toFixed(3)}</td>
      </tr>
    `;
  };

  /**
   * Render IDF curve chart
   */
  const renderIDFChart = (station) => {
    let chartData;

    if (currentMode === "standard") {
      chartData = IDFCalculator.generateChartData(station);
    } else {
      chartData = IDFCalculator.generateHighARIChartData(station);
    }

    if (!chartData) return;

    const ctx = document.getElementById("idfChart").getContext("2d");

    // Destroy previous chart
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
            text: `IDF Curves — ${station.name}, ${station.state}`,
            font: { size: 14, weight: "bold" },
            color: "#1a5276",
          },
          legend: {
            position: "bottom",
            labels: { usePointStyle: true, padding: 15 },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (items) => `Duration: ${items[0].label} min`,
              label: (item) => `${item.dataset.label}: ${item.formattedValue} mm/hr`,
            },
          },
        },
        scales: {
          x: {
            type: "logarithmic",
            title: {
              display: true,
              text: "Duration (minutes)",
              font: { weight: "bold" },
            },
            ticks: {
              callback: (val) => {
                const valid = [30, 60, 120, 180, 360, 720, 1000];
                return valid.includes(val) ? val : "";
              },
            },
            grid: { display: false },
          },
          y: {
            type: "logarithmic",
            title: {
              display: true,
              text: "Rainfall Intensity (mm/hr)",
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
   * Calculate IDF from calculator panel
   */
  const calculateIDF = () => {
    if (!selectedStation) {
      showAlert("Find nearest stations first!");
      return;
    }

    const dur = parseFloat(document.getElementById("calcDur").value);
    const ari = parseInt(document.getElementById("calcARI").value);

    if (isNaN(dur) || dur < IDFCalculator.MIN_DURATION || dur > IDFCalculator.MAX_DURATION) {
      showAlert(`Duration must be ${IDFCalculator.MIN_DURATION}–${IDFCalculator.MAX_DURATION} minutes.`);
      return;
    }

    let intensity;

    if (currentMode === "standard") {
      const coeffs = selectedStation.idf?.[ari];
      if (!coeffs) {
        showAlert("ARI not available for this station.");
        return;
      }
      intensity = IDFCalculator.calculateStandard(coeffs, dur);
    } else {
      intensity = IDFCalculator.calculateHighARI(selectedStation, dur, ari);
    }

    if (intensity === null) {
      showAlert("Calculation error. Check your inputs.");
      return;
    }

    document.getElementById("calcIntensity").textContent = `${intensity.toFixed(2)} mm/hr`;
    document.getElementById("calcDetail").textContent =
      `Station: ${selectedStation.name} | Duration: ${dur} min | ARI: ${ari} years`;
    document.getElementById("calcResult").classList.add("active");
  };

  /**
   * Clear all results
   */
  const clearAll = () => {
    document.getElementById("lat").value = "";
    document.getElementById("lon").value = "";
    document.getElementById("results").classList.remove("active");
    document.getElementById("calcResult").classList.remove("active");
    MapModule.clearAll();
    nearestStations = [];
    selectedStation = null;
    if (idfChart) {
      idfChart.destroy();
      idfChart = null;
    }
  };

  /**
   * Show alert message
   */
  const showAlert = (msg) => {
    alert(msg);
  };

  return { init, setQuickLocation, findNearest, calculateIDF, clearAll };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", App.init);
