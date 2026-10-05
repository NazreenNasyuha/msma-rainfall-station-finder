# 🌧️ MSMA Rainfall Station Finder & Hydrological Engineering Toolkit

Find the nearest Malaysian rainfall stations, view IDF curves (5 to 1000 min), calculate design rainfall intensity, and compute peak stormwater runoff via the Rational Method.

Compliant with the **Urban Stormwater Management Manual for Malaysia (MSMA 2nd Edition, 2012)** published by the Department of Irrigation and Drainage (DID / JPS Malaysia) and **JPS Hydrological Procedure No. 1 (HP1)**.

**🔗 [Live Demo](https://nazreennasyuha.github.io/msma-rainfall-station-finder/)**

---

## 🚀 Features

- **📍 Station Finder** — Instant Haversine geodesic distance calculation to 300+ JPS rainfall stations across Peninsular Malaysia, Sabah, and Sarawak.
- **🗺️ Interactive Map (Leaflet.js)** — Circle markers color-coded by region, connection lines, station marker popups, region filters, and **click-on-map coordinate picking**.
- **🔎 Autocomplete Search** — Search Malaysian cities/towns (e.g. Subang Jaya, Cyberjaya, Putrajaya, Kuantan) or search stations by name / ID directly.
- **📱 GPS Geolocation** — Locate your current site coordinates via browser GPS in one click.
- **📉 IDF Curves & Log-Log Chart (Chart.js)** — High-precision log-log curve visualization for ARI 2, 5, 10, 20, 50, and 100 years spanning **5 to 1000 minutes**.
- **⚡ Short-Duration Adjustment (5 ≤ t < 30 min)** — Fully compliant with **MSMA 2nd Edition Section 13.2.3, Eq. 13.3 & Table 13.3** using short-duration adjustment factors ($F_D$).
- **🌊 Rational Method Peak Flow ($Q = \frac{CIA}{360}$)** — Automated runoff computation per **MSMA Chapter 14**, featuring preset runoff coefficients ($C$) for commercial, industrial, high/medium/low-density residential, paved surfaces, roofs, and open spaces, with MSMA $A \le 80$ ha compliance notices.
- **🌡️ Climate Change Factor (CCF)** — Incorporate DID Technical Guidelines climate change factor allowances (+0% to +30%) for flood and infrastructure resilience.
- **📊 Multi-ARI Comparison Table** — Immediate overview of baseline intensity, CCF intensity, total rainfall depth ($P$), and peak flow ($Q$) across all standard return periods (2 to 100 years).
- **📝 Step-by-Step Submission Breakdown** — Transparent algebraic derivations and intermediate substitutions ready for copy-pasting into Drainage Impact Assessment (DIA) submission reports.
- **📥 Export Tools** — One-click markdown copy to clipboard, CSV IDF curve dataset download, and `@media print` optimized PDF/print view.

---

## 📐 Hydrological Formulations

### 1. High ARI & Low ARI Equation (MSMA Appendix 13.A & Table 13.A1)
For $30 \le t \le 1000$ minutes:
$$I_T(t) = \lambda \cdot t^{-\kappa} \cdot [1 + \theta \cdot K_T]^\eta$$
Where:
- $\lambda, \kappa, \theta, \eta$ = Station-specific coefficients
- $K_T$ = Gumbel reduced variate $= -\ln(-\ln(1 - 1/T))$
- $t$ = Storm duration (minutes)
- $T$ = Average Recurrence Interval (ARI in years)

### 2. Short-Duration Rainfall Depth (MSMA Eq. 13.3 & Table 13.3)
For $5 \le t < 30$ minutes:
$$P_d = P_{30} - F_D \cdot (P_{60} - P_{30})$$
$$I_d = \frac{P_d}{d / 60}$$
Where:
- $P_{30}, P_{60}$ = Rainfall depths for 30-min and 60-min durations (mm)
- $F_D$ = Short-duration adjustment factor from MSMA Table 13.3 based on storm duration and 2-year 24-hour rainfall depth ($^2P_{24h}$)

### 3. Standard Polynomial Equation (MSMA Eq. 13.2)
$$\ln(I) = a + b\ln(t) + c[\ln(t)]^2 + d[\ln(t)]^3$$
Where $a, b, c, d$ are polynomial fitting constants for major Malaysian urban centres.

### 4. Rational Method Peak Discharge (MSMA Eq. 14.1)
$$Q = \frac{C \cdot I \cdot A}{360}$$
Where:
- $Q$ = Peak discharge ($\text{m}^3\text{/s}$)
- $C$ = Catchment runoff coefficient (dimensionless, MSMA Table 14.3 / 14.4)
- $I$ = Rainfall intensity (mm/hr) for storm duration equal to time of concentration $t_c$
- $A$ = Catchment area (hectares, ha; $1\text{ ha} = 10,000\text{ m}^2$)

---

## 📚 Technical Data Sources

| Source | Scope | Year | Reference |
|--------|-------|------|-----------|
| **MSMA 2nd Edition** | Peninsular Malaysia & Urban Centres | 2012 | Chapter 13 & 14, Table 13.3, Eq 13.2–13.3, Table 14.3 |
| **MSMA Appendix 13.A / HP1** | High ARI & Low ARI Extended Network (150+ stations) | 2012 / 2015 | DID Hydrological Procedure No. 1 |
| **SUStoM / HP26** | Sabah (14 stations) & Sarawak (12 stations) | 2018 | Sabah Urban Stormwater Manual / JPS |
| **DID Climate Change Factor** | Regional CCF Allowances (+5% to +30%) | 2021 | DID Technical Guidelines |

---

## 💻 Tech Stack

- **Vanilla HTML5 & CSS3** — Fully responsive, zero dependencies, no build step or node package manager required.
- **Leaflet.js (v1.9.4)** — High-performance interactive maps with OpenStreetMap tiles.
- **Chart.js (v4.4.4)** — Interactive dual-axis log-log charts with responsive canvas rendering.

---

## 📄 License & Disclaimer

- **License:** MIT License
- **Disclaimer:** This application is intended for preliminary hydrological engineering estimates and screening. Always verify data against official Department of Irrigation and Drainage (DID / JPS Malaysia) gazetted publications for statutory submissions and final detailed design.
