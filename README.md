# 🌧️ MSMA Rainfall Station Finder

A professional web-based tool for Malaysian hydrological engineers to find the nearest MSMA 2nd Edition & SUStoM rainfall stations, visualize IDF curves, and compute rainfall intensities.

## 🚀 Quick Start

1. Clone the repository
2. Open `index.html` in any modern browser
3. No server required — fully client-side

```bash
git clone https://github.com/your-username/msma-rainfall-station-finder.git
cd msma-rainfall-station-finder
open index.html
```

## ✨ Features

### 📍 Station Finder
- Enter project site coordinates (latitude/longitude)
- Find **3 nearest rainfall stations** using the Haversine formula
- Quick-select buttons for 12+ major Malaysian cities

### 🗺️ Interactive Map
- **Leaflet.js** map with 65+ stations across Malaysia
- Color-coded markers by region (Peninsular / Sabah / Sarawak)
- **Polyline indicators** from your site to the 3 nearest stations
- Click markers for station details
- Region filter: All | Peninsular | Sabah | Sarawak

### 📉 IDF Curve Visualization
- **Chart.js** interactive IDF curves (log-log scale)
- 6 ARI curves: 2, 5, 10, 20, 50, 100 years
- Hover tooltips showing intensity at any duration

### 🧮 IDF Rainfall Intensity Calculator
- Compute intensity (mm/hr) for any duration (30–1000 min) and ARI
- Uses the MSMA polynomial equation:
  ```
  ln(RI_t) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³
  ```

### 📊 IDF Coefficients
- Full polynomial coefficients (a, b, c, d) for all 6 ARIs
- Based on **MSMA 2nd Edition Appendix 13.A** and **SUStoM (2018)**

## 📁 Project Structure

```
msma-rainfall-station-finder/
├── index.html              # Main HTML entry point
├── css/
│   └── styles.css          # All styles (CSS custom properties)
├── js/
│   ├── stations.js         # Station database (65+ stations)
│   ├── haversine.js        # Distance & bearing calculations
│   ├── idf-calculator.js   # IDF polynomial calculator
│   ├── map.js              # Leaflet map module
│   └── app.js              # Main application controller
├── README.md
└── .gitignore
```

## 📊 Database Coverage

| Region | Stations | Source |
|--------|----------|--------|
| Peninsular Malaysia | 40+ | MSMA 2nd Edition (2012) |
| Sabah | 14 | SUStoM / HP26 (2018) |
| Sarawak | 12 | SUStoM / HP26 (2018) |

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox
- **JavaScript (ES6+)** — Modular architecture (IIFE pattern)
- **Leaflet.js** — Interactive maps
- **Chart.js** — IDF curve visualization

## 📖 References

- **MSMA 2nd Edition (2012)** — Urban Stormwater Management Manual for Malaysia, DID
- **SUStoM (2018)** — Estimation of Design Rainstorm in Sabah and Sarawak
- **HP26 (1984/2018)** — Hydrological Procedure No. 26

## ⚠️ Disclaimer

This tool is for **preliminary reference only**. Station coordinates are approximate. Always verify data with official DID publications for actual design purposes.

## 📜 License

This project uses publicly available data from Malaysian DID publications. For educational and reference purposes.

---

**Built with ❤️ for Malaysian Hydrological Engineering**
