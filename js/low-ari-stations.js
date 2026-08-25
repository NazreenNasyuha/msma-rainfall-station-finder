/**
 * MSMA Low ARI Rainfall Station Database
 * Source: MSMA 2nd Edition — Appendix 13.A (Table 13.A1)
 *
 * IDF Equation (Low ARI):
 *   I_T(t) = λ × t^(-κ) × [1 + θ × K_T]^η
 *
 * Where:
 *   λ (Lambda), κ (Kappa), θ (Theta), η (Eta) = station coefficients
 *   K_T = Gumbel frequency factor = -ln(-ln(1 - 1/T))
 *   t = Duration (minutes), valid 30–1000 min
 *   T = ARI in years
 *
 * For preliminary reference only. Verify with official DID publications.
 */

const LOW_ARI_STATIONS = [
  // ═══════════════════════════════════════════════════════════
  // JOHOR
  // ═══════════════════════════════════════════════════════════
  { id: "1437116", name: "Stor JPS Johor Bahru", state: "Johor", region: "peninsular", lat: 1.4854, lon: 103.7618, lambda: 73.6792, kappa: 0.2770, theta: 0.2927, eta: 0.8620 },
  { id: "1534002", name: "Pusat Kem. Pekan Nenas", state: "Johor", region: "peninsular", lat: 1.5430, lon: 103.5800, lambda: 62.6514, kappa: 0.3231, theta: 0.1557, eta: 0.8212 },
  { id: "1541139", name: "Johor Silica", state: "Johor", region: "peninsular", lat: 1.5070, lon: 103.7600, lambda: 79.5355, kappa: 0.3363, theta: 0.2947, eta: 0.8097 },
  { id: "1636001", name: "Balai Polis Kg Seelong", state: "Johor", region: "peninsular", lat: 1.9200, lon: 103.2700, lambda: 61.2124, kappa: 0.3373, theta: 0.2375, eta: 0.8427 },
  { id: "1737001", name: "SM Bukit Besar", state: "Johor", region: "peninsular", lat: 2.0500, lon: 103.3500, lambda: 61.3513, kappa: 0.3027, theta: 0.2029, eta: 0.8240 },
  { id: "1829002", name: "Setor Daerah JPS Batu Pahat", state: "Johor", region: "peninsular", lat: 1.8522, lon: 102.9464, lambda: 62.1576, kappa: 0.3055, theta: 0.1423, eta: 0.8253 },
  { id: "1834124", name: "Ladang Ulu Remis", state: "Johor", region: "peninsular", lat: 2.2100, lon: 103.1200, lambda: 59.1713, kappa: 0.2935, theta: 0.1847, eta: 0.8380 },
  { id: "1839196", name: "Simpang Masai K. Sedili", state: "Johor", region: "peninsular", lat: 1.9300, lon: 104.0500, lambda: 71.7947, kappa: 0.2683, theta: 0.1863, eta: 0.8071 },
  { id: "1931003", name: "Emp. Semberong", state: "Johor", region: "peninsular", lat: 1.8700, lon: 103.4500, lambda: 66.8854, kappa: 0.3549, theta: 0.2107, eta: 0.8384 },
  { id: "2025001", name: "Pintu Kaw. Tg. Agas", state: "Johor", region: "peninsular", lat: 1.4300, lon: 103.3000, lambda: 77.7719, kappa: 0.3102, theta: 0.2806, eta: 0.8789 },
  { id: "2231001", name: "Ladang Chan Wing", state: "Johor", region: "peninsular", lat: 2.1200, lon: 103.5000, lambda: 66.1439, kappa: 0.3236, theta: 0.1778, eta: 0.8489 },
  { id: "2232001", name: "Ladang Kekayaan", state: "Johor", region: "peninsular", lat: 2.1500, lon: 103.5200, lambda: 66.7541, kappa: 0.3076, theta: 0.2270, eta: 0.8381 },
  { id: "2235163", name: "Ibu Bekalan Kahang", state: "Johor", region: "peninsular", lat: 2.0800, lon: 103.6200, lambda: 62.3394, kappa: 0.2786, theta: 0.1626, eta: 0.7389 },
  { id: "2237164", name: "Jalan Kluang-Mersing", state: "Johor", region: "peninsular", lat: 2.2000, lon: 103.7000, lambda: 73.2358, kappa: 0.3431, theta: 0.2198, eta: 0.7733 },
  { id: "2330009", name: "Ladang Labis", state: "Johor", region: "peninsular", lat: 2.2800, lon: 103.0200, lambda: 65.2220, kappa: 0.3947, theta: 0.2353, eta: 0.8455 },
  { id: "2528012", name: "Rmh. Tapis Segamat", state: "Johor", region: "peninsular", lat: 2.5100, lon: 102.8100, lambda: 63.6892, kappa: 0.3817, theta: 0.2586, eta: 0.8711 },
  { id: "2534160", name: "Kg Peta Hulu Sg Endau", state: "Johor", region: "peninsular", lat: 2.4500, lon: 103.3800, lambda: 69.9581, kappa: 0.3499, theta: 0.1808, eta: 0.7064 },
  { id: "2636170", name: "Setor JPS Endau", state: "Johor", region: "peninsular", lat: 2.6500, lon: 103.6200, lambda: 77.6302, kappa: 0.3985, theta: 0.2497, eta: 0.6927 },

  // ═══════════════════════════════════════════════════════════
  // KEDAH
  // ═══════════════════════════════════════════════════════════
  { id: "5507076", name: "Bt. 27, Jalan Baling", state: "Kedah", region: "peninsular", lat: 5.2700, lon: 100.9000, lambda: 62.7610, kappa: 0.2580, theta: 0.3040, eta: 0.8350 },
  { id: "5704055", name: "Kedah Peak", state: "Kedah", region: "peninsular", lat: 5.8000, lon: 100.7200, lambda: 58.5960, kappa: 0.3390, theta: 0.0640, eta: 0.6610 },
  { id: "5806066", name: "Klinik Jeniang", state: "Kedah", region: "peninsular", lat: 5.7300, lon: 100.6000, lambda: 67.1200, kappa: 0.3820, theta: 0.2380, eta: 0.8230 },
  { id: "5808001", name: "Bt. 61, Jalan Baling", state: "Kedah", region: "peninsular", lat: 5.3000, lon: 100.9500, lambda: 56.3990, kappa: 0.3880, theta: 0.2520, eta: 0.8030 },
  { id: "6103047", name: "Setor JPS Alor Setar", state: "Kedah", region: "peninsular", lat: 6.1167, lon: 100.3667, lambda: 67.6410, kappa: 0.3340, theta: 0.2740, eta: 0.8280 },
  { id: "6108001", name: "Kompleks Rumah Muda", state: "Kedah", region: "peninsular", lat: 6.0200, lon: 100.4000, lambda: 58.4040, kappa: 0.2780, theta: 0.2340, eta: 0.8290 },
  { id: "6206035", name: "Kuala Nerang", state: "Kedah", region: "peninsular", lat: 6.2500, lon: 100.6000, lambda: 62.9600, kappa: 0.3080, theta: 0.3590, eta: 0.8590 },
  { id: "6207032", name: "Ampang Padu", state: "Kedah", region: "peninsular", lat: 5.9500, lon: 100.3500, lambda: 70.9970, kappa: 0.2930, theta: 0.3820, eta: 0.8630 },
  { id: "6306031", name: "Padang Senai", state: "Kedah", region: "peninsular", lat: 5.6500, lon: 100.4200, lambda: 63.6150, kappa: 0.3130, theta: 0.3090, eta: 0.8520 },

  // ═══════════════════════════════════════════════════════════
  // KELANTAN
  // ═══════════════════════════════════════════════════════════
  { id: "4614001", name: "Brook", state: "Kelantan", region: "peninsular", lat: 5.8000, lon: 101.8500, lambda: 49.7311, kappa: 0.3159, theta: 0.1978, eta: 0.7924 },
  { id: "4915001", name: "Chabai", state: "Kelantan", region: "peninsular", lat: 5.4000, lon: 101.9500, lambda: 56.2957, kappa: 0.2986, theta: 0.1965, eta: 0.8384 },
  { id: "4923001", name: "Kg Aring", state: "Kelantan", region: "peninsular", lat: 5.0000, lon: 101.7000, lambda: 70.2651, kappa: 0.3810, theta: 0.2416, eta: 0.8185 },
  { id: "5120025", name: "Balai Polis Bertam", state: "Kelantan", region: "peninsular", lat: 5.6500, lon: 102.1500, lambda: 67.7195, kappa: 0.3271, theta: 0.2430, eta: 0.8424 },
  { id: "5216001", name: "Gob", state: "Kelantan", region: "peninsular", lat: 5.3000, lon: 101.7500, lambda: 47.4654, kappa: 0.2829, theta: 0.1531, eta: 0.7850 },
  { id: "5320038", name: "Dabong", state: "Kelantan", region: "peninsular", lat: 5.3800, lon: 102.0200, lambda: 67.7907, kappa: 0.3777, theta: 0.2740, eta: 0.8115 },
  { id: "5322044", name: "Kg Lalok", state: "Kelantan", region: "peninsular", lat: 5.2500, lon: 102.2000, lambda: 67.7660, kappa: 0.3288, theta: 0.2367, eta: 0.8188 },
  { id: "5522047", name: "JPS Kuala Krai", state: "Kelantan", region: "peninsular", lat: 5.5300, lon: 102.2000, lambda: 63.0690, kappa: 0.4681, theta: 0.3096, eta: 0.7833 },
  { id: "5718033", name: "Kg Jeli, Tanah Merah", state: "Kelantan", region: "peninsular", lat: 5.7700, lon: 101.9200, lambda: 73.8139, kappa: 0.3878, theta: 0.1161, eta: 0.7600 },
  { id: "5719001", name: "Kg Durian Daun Lawang", state: "Kelantan", region: "peninsular", lat: 5.8000, lon: 101.9500, lambda: 67.2398, kappa: 0.3651, theta: 0.1822, eta: 0.7531 },
  { id: "5722057", name: "JPS Machang", state: "Kelantan", region: "peninsular", lat: 5.7700, lon: 102.2200, lambda: 57.3756, kappa: 0.3441, theta: 0.1742, eta: 0.7085 },
  { id: "5824079", name: "Sg Rasau, Pasir Putih", state: "Kelantan", region: "peninsular", lat: 5.9000, lon: 102.4500, lambda: 68.5083, kappa: 0.4079, theta: 0.2019, eta: 0.7003 },
  { id: "6019004", name: "Rumah Kastam Rantau Pjg", state: "Kelantan", region: "peninsular", lat: 6.0000, lon: 102.1500, lambda: 65.3650, kappa: 0.4433, theta: 0.1582, eta: 0.7527 },

  // ═══════════════════════════════════════════════════════════
  // KUALA LUMPUR (Federal Territory)
  // ═══════════════════════════════════════════════════════════
  { id: "3015001", name: "Puchong Drop, K Lumpur", state: "Kuala Lumpur", region: "peninsular", lat: 3.0510, lon: 101.6210, lambda: 68.5873, kappa: 0.3519, theta: 0.1697, eta: 0.8494 },
  { id: "3116004", name: "Ibu Pejabat JPS", state: "Kuala Lumpur", region: "peninsular", lat: 3.1510, lon: 101.6940, lambda: 65.9923, kappa: 0.2857, theta: 0.1604, eta: 0.8341 },
  { id: "3116005", name: "SK Taman Maluri", state: "Kuala Lumpur", region: "peninsular", lat: 3.1600, lon: 101.7200, lambda: 74.4510, kappa: 0.2663, theta: 0.3120, eta: 0.8608 },
  { id: "3116006", name: "Ladang Edinburgh", state: "Kuala Lumpur", region: "peninsular", lat: 3.1700, lon: 101.6800, lambda: 64.5033, kappa: 0.2751, theta: 0.1814, eta: 0.8329 },
  { id: "3216001", name: "Kg. Sungai Tua", state: "Kuala Lumpur", region: "peninsular", lat: 3.2500, lon: 101.6700, lambda: 62.9398, kappa: 0.2579, theta: 0.1989, eta: 0.8374 },
  { id: "3216004", name: "SK Jenis Keb. Kepong", state: "Kuala Lumpur", region: "peninsular", lat: 3.2100, lon: 101.6400, lambda: 69.7878, kappa: 0.2955, theta: 0.1672, eta: 0.8508 },
  { id: "3217001", name: "Ibu Bek. KM16, Gombak", state: "Kuala Lumpur", region: "peninsular", lat: 3.2600, lon: 101.7100, lambda: 66.0685, kappa: 0.2565, theta: 0.2293, eta: 0.8401 },
  { id: "3217002", name: "Emp. Genting Kelang", state: "Kuala Lumpur", region: "peninsular", lat: 3.2700, lon: 101.7200, lambda: 66.2582, kappa: 0.2624, theta: 0.2423, eta: 0.8446 },
  { id: "3217003", name: "Ibu Bek. KM11, Gombak", state: "Kuala Lumpur", region: "peninsular", lat: 3.2200, lon: 101.7300, lambda: 73.9540, kappa: 0.2984, theta: 0.3241, eta: 0.8238 },
  { id: "3217004", name: "Kg. Kuala Seleh, H. Klang", state: "Kuala Lumpur", region: "peninsular", lat: 3.2300, lon: 101.6900, lambda: 64.3175, kappa: 0.2340, theta: 0.1818, eta: 0.8645 },
  { id: "3217005", name: "Kg. Kerdas, Gombak", state: "Kuala Lumpur", region: "peninsular", lat: 3.2400, lon: 101.7000, lambda: 68.8526, kappa: 0.2979, theta: 0.2024, eta: 0.8820 },
  { id: "3317001", name: "Air Terjun Sg. Batu", state: "Kuala Lumpur", region: "peninsular", lat: 3.2100, lon: 101.7500, lambda: 75.9351, kappa: 0.2475, theta: 0.2664, eta: 0.8668 },
  { id: "3317004", name: "Genting Sempah", state: "Kuala Lumpur", region: "peninsular", lat: 3.2600, lon: 101.7800, lambda: 55.3934, kappa: 0.2822, theta: 0.1835, eta: 0.8345 },

  // ═══════════════════════════════════════════════════════════
  // MALACCA
  // ═══════════════════════════════════════════════════════════
  { id: "2222001", name: "Bukit Sebukor", state: "Malacca", region: "peninsular", lat: 2.2800, lon: 102.2700, lambda: 78.1482, kappa: 0.2690, theta: 0.3677, eta: 0.8968 },
  { id: "2224038", name: "Chin Chin Tepi Jalan", state: "Malacca", region: "peninsular", lat: 2.2200, lon: 102.3500, lambda: 66.0589, kappa: 0.3363, theta: 0.3301, eta: 0.8905 },
  { id: "2321006", name: "Ladang Lendu", state: "Malacca", region: "peninsular", lat: 2.3500, lon: 102.1500, lambda: 64.7588, kappa: 0.2975, theta: 0.2896, eta: 0.8787 },

  // ═══════════════════════════════════════════════════════════
  // NEGERI SEMBILAN
  // ═══════════════════════════════════════════════════════════
  { id: "2719001", name: "Setor JPS Sikamat", state: "Negeri Sembilan", region: "peninsular", lat: 2.7200, lon: 101.8800, lambda: 60.4227, kappa: 0.2793, theta: 0.2694, eta: 0.8540 },
  { id: "2722202", name: "Kg Sawah Lebar K Pilah", state: "Negeri Sembilan", region: "peninsular", lat: 2.6800, lon: 102.2500, lambda: 49.3232, kappa: 0.2716, theta: 0.2164, eta: 0.8503 },
  { id: "2723002", name: "Sungai Kepis", state: "Negeri Sembilan", region: "peninsular", lat: 2.6500, lon: 102.1500, lambda: 61.3339, kappa: 0.2536, theta: 0.3291, eta: 0.8717 },
  { id: "2725083", name: "Ladang New Rompin", state: "Negeri Sembilan", region: "peninsular", lat: 2.5800, lon: 102.3500, lambda: 65.0249, kappa: 0.3575, theta: 0.3546, eta: 0.8750 },
  { id: "2920012", name: "Petaling K Kelawang", state: "Negeri Sembilan", region: "peninsular", lat: 2.8500, lon: 102.0500, lambda: 51.7343, kappa: 0.2919, theta: 0.2643, eta: 0.8630 },

  // ═══════════════════════════════════════════════════════════
  // PAHANG
  // ═══════════════════════════════════════════════════════════
  { id: "2630001", name: "Sungai Pukim Sungai", state: "Pahang", region: "peninsular", lat: 2.6500, lon: 103.0000, lambda: 63.9783, kappa: 0.3906, theta: 0.2556, eta: 0.8717 },
  { id: "2634193", name: "Anak Endau", state: "Pahang", region: "peninsular", lat: 2.5500, lon: 103.4500, lambda: 79.4310, kappa: 0.3639, theta: 0.1431, eta: 0.7051 },
  { id: "2828173", name: "Kg Gambir", state: "Pahang", region: "peninsular", lat: 2.8500, lon: 102.8500, lambda: 61.1933, kappa: 0.3857, theta: 0.1878, eta: 0.8237 },
  { id: "3026156", name: "Pos Iskandar", state: "Pahang", region: "peninsular", lat: 3.1500, lon: 102.6500, lambda: 59.9903, kappa: 0.3488, theta: 0.2262, eta: 0.8769 },
  { id: "3121143", name: "Simpang Pelangai", state: "Pahang", region: "peninsular", lat: 3.3500, lon: 101.8500, lambda: 64.9653, kappa: 0.3229, theta: 0.3003, eta: 0.8995 },
  { id: "3134165", name: "Dispensari Nenasi", state: "Pahang", region: "peninsular", lat: 3.5000, lon: 103.4500, lambda: 88.6484, kappa: 0.3830, theta: 0.4040, eta: 0.7614 },
  { id: "3231163", name: "Kg Unchang", state: "Pahang", region: "peninsular", lat: 3.3000, lon: 103.1500, lambda: 71.6472, kappa: 0.3521, theta: 0.1805, eta: 0.7886 },
  { id: "3424081", name: "JPS Temerloh", state: "Pahang", region: "peninsular", lat: 3.4500, lon: 102.4000, lambda: 62.2075, kappa: 0.3528, theta: 0.3505, eta: 0.8368 },
  { id: "3533102", name: "Rumah Pam Pahang Tua", state: "Pahang", region: "peninsular", lat: 3.5500, lon: 103.3500, lambda: 80.8887, kappa: 0.3611, theta: 0.4800, eta: 0.7578 },
  { id: "3628001", name: "Pintu Kaw. Pulau Kertam", state: "Pahang", region: "peninsular", lat: 3.6500, lon: 102.8500, lambda: 63.5073, kappa: 0.3830, theta: 0.2881, eta: 0.8202 },
  { id: "3818054", name: "Setor JPS Raub", state: "Pahang", region: "peninsular", lat: 3.7833, lon: 101.8667, lambda: 61.3432, kappa: 0.3692, theta: 0.3929, eta: 0.8445 },
  { id: "3924072", name: "Rmh Pam Paya Kangsar", state: "Pahang", region: "peninsular", lat: 3.9500, lon: 102.4500, lambda: 58.3761, kappa: 0.3334, theta: 0.2421, eta: 0.8430 },
  { id: "3930012", name: "Sungai Lembing PCC Mill", state: "Pahang", region: "peninsular", lat: 3.9300, lon: 103.0500, lambda: 77.0004, kappa: 0.4530, theta: 0.5701, eta: 0.8125 },
  { id: "4023001", name: "Kg Sungai Yap", state: "Pahang", region: "peninsular", lat: 4.0500, lon: 102.3500, lambda: 77.1488, kappa: 0.3725, theta: 0.3439, eta: 0.8810 },
  { id: "4127001", name: "Hulu Tekai Kwsn. B", state: "Pahang", region: "peninsular", lat: 4.1500, lon: 102.7500, lambda: 60.2235, kappa: 0.4650, theta: 0.1241, eta: 0.8020 },
  { id: "4219001", name: "Bukit Bentong", state: "Pahang", region: "peninsular", lat: 4.2500, lon: 101.9500, lambda: 67.6128, kappa: 0.2706, theta: 0.2459, eta: 0.8656 },
  { id: "4223115", name: "Kg Merting", state: "Pahang", region: "peninsular", lat: 4.2000, lon: 102.3500, lambda: 62.7511, kappa: 0.2843, theta: 0.3630, eta: 0.9024 },
  { id: "4513033", name: "Gunung Brinchang", state: "Pahang", region: "peninsular", lat: 4.3000, lon: 101.3800, lambda: 42.1757, kappa: 0.2833, theta: 0.1468, eta: 0.7850 },

  // ═══════════════════════════════════════════════════════════
  // PENANG
  // ═══════════════════════════════════════════════════════════
  { id: "5204048", name: "Sg Simpang Ampat", state: "Penang", region: "peninsular", lat: 5.3000, lon: 100.4800, lambda: 59.3122, kappa: 0.3394, theta: 0.3350, eta: 0.8090 },
  { id: "5302001", name: "Tangki Air Besar Sg Pinang", state: "Penang", region: "peninsular", lat: 5.3800, lon: 100.3000, lambda: 71.7482, kappa: 0.2928, theta: 0.2934, eta: 0.7779 },
  { id: "5302003", name: "Kolam Tkgn Air Hitam", state: "Penang", region: "peninsular", lat: 5.3700, lon: 100.3100, lambda: 56.1145, kappa: 0.2975, theta: 0.1778, eta: 0.7626 },
  { id: "5303001", name: "Rmh Kebajikan P Pinang", state: "Penang", region: "peninsular", lat: 5.4200, lon: 100.3500, lambda: 60.1084, kappa: 0.3575, theta: 0.2745, eta: 0.8303 },
  { id: "5303053", name: "Komplek Prai", state: "Penang", region: "peninsular", lat: 5.3900, lon: 100.3800, lambda: 49.4860, kappa: 0.3314, theta: 0.0518, eta: 0.7116 },
  { id: "5402001", name: "Klinik Bkt Bendera P Pinang", state: "Penang", region: "peninsular", lat: 5.4200, lon: 100.2700, lambda: 68.0999, kappa: 0.3111, theta: 0.1904, eta: 0.7662 },
  { id: "5402002", name: "Kolam Bersih P Pinang", state: "Penang", region: "peninsular", lat: 5.4100, lon: 100.3100, lambda: 62.7533, kappa: 0.2688, theta: 0.2488, eta: 0.7757 },
  { id: "5504035", name: "Lahar Ikan Mati Kepala Batas", state: "Penang", region: "peninsular", lat: 5.4700, lon: 100.2500, lambda: 60.8596, kappa: 0.3369, theta: 0.2316, eta: 0.7981 },

  // ═══════════════════════════════════════════════════════════
  // PERAK
  // ═══════════════════════════════════════════════════════════
  { id: "5005003", name: "JPS Teluk Intan", state: "Perak", region: "peninsular", lat: 4.0267, lon: 101.0333, lambda: 65.1854, kappa: 0.3681, theta: 0.2552, eta: 0.8458 },
  { id: "4010001", name: "JPS Setiawan", state: "Perak", region: "peninsular", lat: 4.2315, lon: 100.6967, lambda: 56.2695, kappa: 0.3434, theta: 0.2058, eta: 0.8465 },
  { id: "4207048", name: "Pejabat Daerah Kampar", state: "Perak", region: "peninsular", lat: 4.3000, lon: 101.1500, lambda: 79.2706, kappa: 0.1829, theta: 0.3048, eta: 0.8532 },
  { id: "4311001", name: "Rumah Pam Kubang Haji", state: "Perak", region: "peninsular", lat: 4.4000, lon: 100.6500, lambda: 47.8316, kappa: 0.3527, theta: 0.1038, eta: 0.8018 },
  { id: "4409091", name: "Politeknik Ungku Umar", state: "Perak", region: "peninsular", lat: 4.5500, lon: 101.0500, lambda: 62.9315, kappa: 0.3439, theta: 0.1703, eta: 0.8229 },
  { id: "4511111", name: "Bukit Larut Taiping", state: "Perak", region: "peninsular", lat: 4.8500, lon: 100.8000, lambda: 83.3964, kappa: 0.3189, theta: 0.1767, eta: 0.8166 },
  { id: "4807016", name: "Rancangan Belia Perlop", state: "Perak", region: "peninsular", lat: 4.8000, lon: 101.0500, lambda: 57.4914, kappa: 0.3199, theta: 0.2027, eta: 0.8696 },
  { id: "4811075", name: "Jln. Mtg. Buloh Bgn Serai", state: "Perak", region: "peninsular", lat: 5.0500, lon: 100.7000, lambda: 63.2357, kappa: 0.3176, theta: 0.3330, eta: 0.8462 },
  { id: "5207001", name: "Kolam Air JKR Selama", state: "Perak", region: "peninsular", lat: 5.2000, lon: 100.6000, lambda: 67.0499, kappa: 0.3164, theta: 0.2255, eta: 0.8080 },
  { id: "5210069", name: "Stesen Pem. Hutan Lawin", state: "Perak", region: "peninsular", lat: 5.2500, lon: 100.9500, lambda: 53.7310, kappa: 0.3372, theta: 0.2237, eta: 0.8347 },
  { id: "5411066", name: "Kuala Kenderong", state: "Perak", region: "peninsular", lat: 5.4000, lon: 100.8500, lambda: 68.5357, kappa: 0.4196, theta: 0.1558, eta: 0.8378 },
  { id: "5710061", name: "Dispensari Keroh", state: "Perak", region: "peninsular", lat: 5.7000, lon: 100.9000, lambda: 59.2197, kappa: 0.3265, theta: 0.1621, eta: 0.8522 },

  // ═══════════════════════════════════════════════════════════
  // PERLIS
  // ═══════════════════════════════════════════════════════════
  { id: "6401002", name: "Padang Katong, Kangar", state: "Perlis", region: "peninsular", lat: 6.4414, lon: 100.1986, lambda: 52.1510, kappa: 0.3573, theta: 0.1584, eta: 0.7858 },

  // ═══════════════════════════════════════════════════════════
  // SELANGOR
  // ═══════════════════════════════════════════════════════════
  { id: "2815001", name: "JPS Sungai Manggis", state: "Selangor", region: "peninsular", lat: 2.8200, lon: 101.3800, lambda: 57.3495, kappa: 0.2758, theta: 0.1693, eta: 0.8672 },
  { id: "2913001", name: "Pusat Kwln. JPS T Gong", state: "Selangor", region: "peninsular", lat: 2.9500, lon: 101.6200, lambda: 65.3556, kappa: 0.3279, theta: 0.3451, eta: 0.8634 },
  { id: "2917001", name: "Setor JPS Kajang", state: "Selangor", region: "peninsular", lat: 2.9967, lon: 101.7867, lambda: 62.9564, kappa: 0.3293, theta: 0.1298, eta: 0.8273 },
  { id: "3117070", name: "JPS Ampang", state: "Selangor", region: "peninsular", lat: 3.1500, lon: 101.7667, lambda: 69.1727, kappa: 0.2488, theta: 0.1918, eta: 0.8374 },
  { id: "3118102", name: "SK Sungai Lui", state: "Selangor", region: "peninsular", lat: 3.2000, lon: 101.8000, lambda: 68.4588, kappa: 0.3035, theta: 0.2036, eta: 0.8726 },
  { id: "3314001", name: "Rumah Pam JPS P Setia", state: "Selangor", region: "peninsular", lat: 3.3000, lon: 101.4000, lambda: 65.1864, kappa: 0.2816, theta: 0.2176, eta: 0.8704 },
  { id: "3411017", name: "Setor JPS Tj. Karang", state: "Selangor", region: "peninsular", lat: 3.4500, lon: 101.2000, lambda: 70.9914, kappa: 0.2999, theta: 0.2929, eta: 0.9057 },
  { id: "3416002", name: "Kg Kalong Tengah", state: "Selangor", region: "peninsular", lat: 3.4000, lon: 101.5000, lambda: 59.9750, kappa: 0.2444, theta: 0.1642, eta: 0.8072 },
  { id: "3516022", name: "Loji Air Kuala Kubu Baru", state: "Selangor", region: "peninsular", lat: 3.5583, lon: 101.6500, lambda: 66.8884, kappa: 0.2798, theta: 0.3489, eta: 0.8334 },
  { id: "3710006", name: "Rmh Pam Bagan Terap", state: "Selangor", region: "peninsular", lat: 3.7000, lon: 101.0000, lambda: 62.2644, kappa: 0.3168, theta: 0.2799, eta: 0.8665 },

  // ═══════════════════════════════════════════════════════════
  // TERENGGANU
  // ═══════════════════════════════════════════════════════════
  { id: "3933001", name: "Hulu Jabor, Kemaman", state: "Terengganu", region: "peninsular", lat: 4.2500, lon: 103.4000, lambda: 74.8046, kappa: 0.2170, theta: 0.2527, eta: 0.7281 },
  { id: "4131001", name: "Kg, Ban Ho, Kemaman", state: "Terengganu", region: "peninsular", lat: 4.3000, lon: 103.3500, lambda: 68.6659, kappa: 0.3164, theta: 0.1157, eta: 0.6969 },
  { id: "4234109", name: "JPS Kemaman Jambatan", state: "Terengganu", region: "peninsular", lat: 4.2200, lon: 103.4200, lambda: 75.8258, kappa: 0.2385, theta: 0.3811, eta: 0.7303 },
  { id: "4332001", name: "Tebak, Kem.", state: "Terengganu", region: "peninsular", lat: 4.3500, lon: 103.2500, lambda: 77.2826, kappa: 0.3460, theta: 0.3036, eta: 0.7301 },
  { id: "4529001", name: "Rmh Pam Paya Kempian", state: "Terengganu", region: "peninsular", lat: 4.5500, lon: 103.1000, lambda: 65.2791, kappa: 0.3642, theta: 0.1477, eta: 0.6667 },
  { id: "4631001", name: "Almuktafibillah Shah", state: "Terengganu", region: "peninsular", lat: 4.6500, lon: 103.2000, lambda: 81.8861, kappa: 0.3400, theta: 0.2600, eta: 0.7459 },
  { id: "4734079", name: "SM Sultan Omar, Dungun", state: "Terengganu", region: "peninsular", lat: 4.7500, lon: 103.4200, lambda: 66.4262, kappa: 0.3288, theta: 0.2152, eta: 0.7015 },
  { id: "4832077", name: "SK Jerangau", state: "Terengganu", region: "peninsular", lat: 4.8000, lon: 103.2000, lambda: 81.4981, kappa: 0.3736, theta: 0.4226, eta: 0.7586 },
  { id: "4930038", name: "Kg Menerong, Hulu Trg", state: "Terengganu", region: "peninsular", lat: 4.9500, lon: 103.0500, lambda: 80.9649, kappa: 0.3782, theta: 0.2561, eta: 0.7158 },
  { id: "5029034", name: "Kg Dura. Hulu Trg", state: "Terengganu", region: "peninsular", lat: 5.0000, lon: 102.9500, lambda: 62.7859, kappa: 0.3495, theta: 0.1103, eta: 0.6638 },
  { id: "5128001", name: "Sungai Gawi, Hulu Trg", state: "Terengganu", region: "peninsular", lat: 5.1000, lon: 102.8500, lambda: 59.3063, kappa: 0.4001, theta: 0.1312, eta: 0.6796 },
  { id: "5226001", name: "Sg Petualang, Hulu Trg", state: "Terengganu", region: "peninsular", lat: 5.2000, lon: 102.7000, lambda: 51.7862, kappa: 0.2968, theta: 0.0704, eta: 0.6587 },
  { id: "5328044", name: "Sungai Tong, Setiu", state: "Terengganu", region: "peninsular", lat: 5.3000, lon: 102.8000, lambda: 63.4136, kappa: 0.3864, theta: 0.0995, eta: 0.6540 },
  { id: "5331048", name: "Setor JPS K Terengganu", state: "Terengganu", region: "peninsular", lat: 5.3302, lon: 103.1408, lambda: 67.0267, kappa: 0.2844, theta: 0.2633, eta: 0.6690 },
  { id: "5426001", name: "Kg Seladang, Hulu Setiu", state: "Terengganu", region: "peninsular", lat: 5.4500, lon: 102.6500, lambda: 76.9088, kappa: 0.4513, theta: 0.1636, eta: 0.6834 },
  { id: "5428001", name: "Kg Bt. Hampar, Setiu", state: "Terengganu", region: "peninsular", lat: 5.4200, lon: 102.7500, lambda: 57.9456, kappa: 0.2490, theta: 0.0380, eta: 0.6000 },
  { id: "5524002", name: "SK Panchor, Setiu", state: "Terengganu", region: "peninsular", lat: 5.5000, lon: 102.6000, lambda: 75.1489, kappa: 0.4147, theta: 0.2580, eta: 0.6760 },
];
