// iOS Data
const iPhoneModels = ["iPhone12,1","iPhone12,3","iPhone12,5","iPhone13,1",
  "iPhone13,2","iPhone13,3","iPhone13,4","iPhone14,4","iPhone14,5",
  "iPhone14,2","iPhone14,3","iPhone14,7","iPhone14,8","iPhone15,2",
  "iPhone15,3","iPhone15,4","iPhone15,5","iPhone16,1","iPhone16,2",
  "iPhone17,1","iPhone17,2","iPhone17,3","iPhone17,4","iPhone18,1",
  "iPhone18,2","iPhone18,3","iPhone18,4"];

const iosVersions = ["16_5","16_6","16_7","17_0","17_1","17_2","17_3","17_4","17_5","17_6","17_7","18_0","18_1","18_2","18_3","18_4","18_5","18_6"];

// Version-based Facebook App versions
const fbVersionsByType = {
  latest: {
    ios: ["540.0.0", "541.0.0", "542.0.0"],
    android: ["542.0.0.46.151", "541.0.0.85.79", "540.0.0.49.148"]
  },
  old: {
    ios: ["532.0.0", "533.0.0", "534.0.0", "535.0.0", "536.0.0", "537.0.0", "538.0.0", "539.0.0"],
    android: ["535.0.0.49.72", "536.0.0.46.77", "532.0.0.55.71", "536.1.0.58.77", "537.0.0.47.77", "538.0.0.53.70", "539.0.0.54.69"]
  }
};

// Facebook Lite versions - Updated Nov 2025
const fbLiteVersionsByType = {
  latest: {
    ios: ["443.0.0", "437.0.0", "438.0.0", "439.0.0", "440.0.0", "441.0.0", "442.0.0"],
    android: ["445.0.0.19.133", "444.0.0.14.132", "443.0.0.18.131", "442.0.0.17.130", "441.0.0.13.129", "440.0.0.16.128",  "439.0.0.15.127", "440.0.0.16.128"]
  },
  old: {
    ios: ["430.0.0", "431.0.0", "432.0.0", "433.0.0", "434.0.0", "435.0.0", "436.0.0"],
    android: ["428.0.0.9.118", "429.0.0.8.117", "430.0.0.10.119", "431.0.0.11.120", "432.0.0.9.118", "433.0.0.10.121", "434.0.0.12.122", "435.0.0.11.123", "436.0.0.13.124", "437.0.0.14.125", "438.0.0.12.126"]
  }
};

// Instagram versions - Updated Dec 2025
const igVersionsByType = {
  latest: {
    ios: ["410.0.0", "409.1.0", "409.0.0", "408.0.0", "408.1.0","407.0.0","406.1.0","406.0.0","405.1.0"],
    android: ["410.1.0.63.71", "409.1.0.49.170", "410.0.0.53.71", "408.0.0.51.78", "409.0.0.48.170","407.0.0.55.243","406.0.0.58.159","406.0.0.53.159","405.1.0.57.77","405.0.0.52.77","404.0.0.48.76"]
  },
  old: {
    ios: ["404.0.0", "403.0.0", "402.0.0", "401.0.0", "400.1.0", "400.0.0", "399.0.0", "398.1.0", "398.0.0"],
    android: ["403.0.0.49.74", "402.0.0.49.70", "401.0.0.48.79", "400.0.0.49.68", "399.0.0.51.85", "398.1.0.53.77", "398.0.0.45.77", "397.0.0.46.81", "397.1.0.52.81","396.0.0.46.242","395.0.0.56.165"]
  }
};

// Country-specific locales
const localesByCountry = {
  usa: ["en_US", "es_US"], // USA English and Spanish
  canada: ["en_CA", "fr_CA"], // Canadian English and French
  japan: ["ja_JP", "en_JP"], // Japanese and English
  global: ["en_US", "en_GB", "es_ES", "fr_FR", "de_DE"] // Mixed global
};

// Country-based Android Models (Mid-Range to High-End Focus)
const androidModelsByCountry = {
  usa: [
    // Samsung Galaxy S Series (Mainstream)
    "SM-S938U", "SM-S936U", "SM-S931U", // Galaxy S25 Ultra, S25+, S25 (2025)
    "SM-S928U", "SM-S926U", "SM-S921U", // Galaxy S24 Ultra, S24+, S24
    "SM-S918U", "SM-S916U", "SM-S911U", // Galaxy S23 Ultra, S23+, S23
    "SM-S908U", "SM-S906U", "SM-S901U", // Galaxy S22 Ultra, S22+, S22
    "SM-G998U", "SM-G996U", "SM-G991U", // S21 Ultra, S21+, S21
    "SM-G988U", "SM-G986U", "SM-G981U", // S20 Ultra, S20+, S20
    
    // Samsung Galaxy Z Series (Foldables)
    "SM-F958U", "SM-F956U", // Galaxy Z Fold 7, Fold 6 (2025/2024)
    "SM-F946U", "SM-F936U", "SM-F926U", "SM-F916U", // Z Fold 5, 4, 3, 2
    "SM-F741U", "SM-F731U", "SM-F721U", "SM-F711U", // Z Flip 6, 5, 4, 3
    
    // Samsung Galaxy Note Series
    "SM-N986U", "SM-N981U", "SM-N976U", "SM-N971U", // Note 20 Ultra, Note 20, Note 10+, Note 10
    
    // Samsung A Series (Mid-Range Only)
    "SM-A546U", "SM-A536U", "SM-A526U", "SM-A516U", // A54, A53, A52, A51
    "SM-A736U", "SM-A726U", "SM-A716U", // A73, A72, A71
    
    // Google Pixel (Mainstream)
    "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", // 2024
    "Pixel 9 Pro Fold", "Pixel 9a", // 2025
    "Pixel 8 Pro", "Pixel 8", "Pixel 8a", // 2023
    "Pixel 7 Pro", "Pixel 7", "Pixel 7a", // 2022
    "Pixel 6 Pro", "Pixel 6", "Pixel 6a", // 2021
    "Pixel 5", "Pixel 5a", "Pixel 4a 5G", "Pixel 4a", // 2020
    
    // OnePlus (Mid to High-End)
    "CPH2611", "CPH2617", // OnePlus 13, 12R (2025)
    "CPH2609", "CPH2617", // OnePlus 12, 12R
    "CPH2449", "CPH2451", // OnePlus 11, 11R
    "CPH2413", "CPH2423", // OnePlus 10 Pro, 10T
    "LE2125", "LE2123", "LE2121", // OnePlus 9 Pro, 9, 9R
    "IN2025", "IN2023", "IN2021", // OnePlus 8 Pro, 8, 8T
    "HD1905", "HD1907", "HD1901", // OnePlus 7 Pro, 7T, 7
    
    // Xiaomi (Mid to High-End)
    "2201123G", "2211133G", "2210132G", // Mi 12 Ultra, 12 Pro, 12
    "2107113SG", "2106118C", "2012123G", // Mi 11 Ultra, 11 Pro, 11
    "23013RK75G", "23078RKD5G", "23090RA98G", // Xiaomi 13 Ultra, 13 Pro, 13
    "M2101K9G", "M2102K1G", "M2007J3SY", // Mi 10 series
    "22041219NY", "22041219I", "22101219G", // Redmi Note 11 Pro series
    
    // Nothing Phone
    "A063", "A065", "A142", // Nothing Phone (2), (2a), (1)
    "A075", // Nothing Phone (3) 2025
    
    // Motorola (Mid-Range and Up)
    "XT2565-1", "XT2563-1", // Moto Razr 50 Ultra, Razr 50 (2024)
    "XT2341-1", "XT2331-1", "XT2313-1", // Razr 40 Ultra, Razr 40, Edge 30 Ultra
    "XT2321-1", "XT2311-1", "XT2301-4", // Edge 40 Pro, Edge 40, Edge 30
    "XT2201-1", "XT2175-2", "XT2167-1", // Moto G73, G72, G71
    "XT2235-3", "XT2215-1", "XT2163-4", // Moto G52, G51, G50
    
    // Sony Xperia (Mid to High-End)
    "XQ-DQ72", "XQ-DQ62", "XQ-DQ54", // Xperia 1 V, IV, III
    "XQ-CQ72", "XQ-CQ62", "XQ-CQ54", // Xperia 5 V, IV, III
    "XQ-BC72", "XQ-BC62", "XQ-BC52", // Xperia 10 V, IV, III
  ],
  
  canada: [
    // Samsung Galaxy S Series (Mainstream)
    "SM-S938W", "SM-S936W", "SM-S931W", // Galaxy S25 Ultra, S25+, S25 (2025)
    "SM-S928W", "SM-S926W", "SM-S921W", // S24 series
    "SM-S918W", "SM-S916W", "SM-S911W", // S23 series
    "SM-S908W", "SM-S906W", "SM-S901W", // S22 series
    "SM-G998W", "SM-G996W", "SM-G991W", // S21 series
    
    // Samsung Galaxy Z Series (Foldables)
    "SM-F958W", "SM-F956W", // Galaxy Z Fold 7, Fold 6 (2025/2024)
    "SM-F946W", "SM-F936W", "SM-F926W", // Z Fold 5, 4, 3
    "SM-F741W", "SM-F731W", "SM-F721W", // Z Flip 6, 5, 4
    
    // Samsung A Series (Mid-Range)
    "SM-A546W", "SM-A536W", "SM-A346W", // A series
    "SM-A526W", "SM-A516W", "SM-A326W", // A series
    
    // Google Pixel (Mainstream)
    "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", // 2024
    "Pixel 9 Pro Fold", "Pixel 9a", // 2025
    "Pixel 8 Pro", "Pixel 8", "Pixel 8a", // 2023
    "Pixel 7 Pro", "Pixel 7", "Pixel 7a", // 2022
    "Pixel 6 Pro", "Pixel 6", "Pixel 6a", // 2021
    
    // OnePlus (Mid to High-End)
    "CPH2611", "CPH2617", // OnePlus 13, 12R (2025)
    "CPH2609", "CPH2617", "CPH2449", "CPH2451", // OnePlus 12, 12R, 11, 11R
    "LE2125", "LE2123", "LE2121", // OnePlus 9 series
    "IN2025", "IN2023", "IN2021", // OnePlus 8 series
    
    // Xiaomi (Mid to High-End)
    "2201123G", "2211133G", "2210132G", // Mi 12 series
    "23013RK75G", "23078RKD5G", "23090RA98G", // Xiaomi 13 series
    "22041219NY", "22041219I", "22101219G", // Redmi Note 11 Pro series
    
    // Nothing Phone
    "A063", "A065", "A142", // Nothing Phone (2), (2a), (1)
    "A075", // Nothing Phone (3) 2025
    
    // Motorola (Mid-Range and Up)
    "XT2565-1", "XT2563-1", // Moto Razr 50 Ultra, Razr 50 (2024)
    "XT2341-1", "XT2331-1", // Razr 40 Ultra, Razr 40
    "XT2321-1", "XT2311-1", "XT2301-4", // Edge 40 Pro, Edge 40, Edge 30
  ],
  
  japan: [
    // Sony Xperia (Mid to High-End Japan)
    "XQ-DQ72", "XQ-DQ62", "XQ-DQ54", // Xperia 1 V, IV, III
    "XQ-CQ72", "XQ-CQ62", "XQ-CQ54", // Xperia 5 V, IV, III
    "XQ-BC72", "XQ-BC62", "XQ-BC52", // Xperia 10 V, IV, III
    "XQ-CT72", "XQ-CT62", "XQ-CT54", // Xperia Pro-I series
    
    // Sharp Aquos (Mid to High-End Japan)
    "SH-51C", "SH-52B", "SH-53A", "SH-54C", "SH-53C", // Aquos R series
    "SH-RM19", "SH-RM18", "SH-RM17", // Aquos Zero series
    "SH-M24", "SH-M23", "SH-M22", // Aquos Sense series
    
    // Samsung (Japan Mid to High-End)
    "SM-S928N", "SM-S926N", "SM-S921N", // S24 series Japan
    "SM-G998SC", "SM-G996SC", "SM-G991SC", // S21 series Japan
    "SM-F956N", "SM-F946N", "SM-F936N", // Z Fold series Japan
    "SM-A546SC", "SM-A536SC", "SM-A526SC", // A series Japan
    
    // Google Pixel (Japan)
    "Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro", "Pixel 8",
    "Pixel 7 Pro", "Pixel 7", "Pixel 6 Pro", "Pixel 6",
    "Pixel 5a", "Pixel 4a", // Mid-range Pixels
    
    // OnePlus (Japan Mid to High-End)
    "CPH2447", "CPH2413", "LE2125", // OnePlus Japan models
    "CPH2399", "CPH2401", // OnePlus Nord Japan
    
    // Xiaomi (Japan Mid to High-End)
    "2201123G", "23013RK75G", "24031PN0DC", // Mi/Xiaomi flagship Japan
    "22041219NY", "22041219I", "22101219G", // Redmi Note series Japan
    
    // OPPO (Japan Mid-Range)
    "CPH2309", "CPH2305", "CPH2365", // OPPO A series Japan
    "CPH2371", "CPH2373", "CPH2385", // OPPO Reno series Japan
  ],
  
  global: [
    // Mainstream Mix (Mid-Range to High-End)
    "SM-S928U", "SM-S926U", "SM-S921U", // Samsung S24 series
    "SM-G998U", "SM-G988U", "SM-F956U", // Samsung S21, S20, Z Fold 6
    "SM-A546U", "SM-A536U", "SM-A526U", // Samsung A series
    "Pixel 9 Pro", "Pixel 8 Pro", "Pixel 7 Pro", // Google Pixel Pro
    "Pixel 8a", "Pixel 7a", "Pixel 6a", // Google Pixel a-series
    "CPH2609", "CPH2617", "CPH2449", // OnePlus
    "LE2125", "LE2123", "IN2025", // OnePlus older
    "2201123G", "23013RK75G", "22041219NY", // Xiaomi/Redmi
    "XQ-DQ72", "XQ-CQ72", "XQ-BC72", // Sony Xperia
    "A063", "A065", "A142", // Nothing Phone
    "XT2321-1", "XT2311-1", "XT2201-1", // Motorola
  ]
};

const androidVersions = ["11", "12", "13", "14", "15"];

// Helper functions
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randChromeVer = () => `${randInt(138, 143)}.0.${randInt(5000, 9000)}.${randInt(100, 200)}`;
const randMobileBuild = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return `${randInt(15, 22)}${letters[randInt(0, 25)]}${randInt(100, 999)}`;
};

// Version selection helper
const getVersionsByType = (browser, platform, versionType) => {
  if (versionType === 'mix') {
    // For mix, combine all versions
    const allVersions = [];
    if (browser === 'facebook') {
      allVersions.push(...fbVersionsByType.latest[platform]);
      allVersions.push(...fbVersionsByType.old[platform]);
    } else if (browser === 'facebook_lite') {
      allVersions.push(...fbLiteVersionsByType.latest[platform]);
      allVersions.push(...fbLiteVersionsByType.old[platform]);
    } else if (browser === 'instagram') {
      allVersions.push(...igVersionsByType.latest[platform]);
      allVersions.push(...igVersionsByType.old[platform]);
    }
    return allVersions;
  }
  
  // For specific version types (latest or old)
  if (browser === 'facebook') {
    return fbVersionsByType[versionType]?.[platform] || fbVersionsByType.latest[platform];
  } else if (browser === 'facebook_lite') {
    return fbLiteVersionsByType[versionType]?.[platform] || fbLiteVersionsByType.latest[platform];
  } else if (browser === 'instagram') {
    return igVersionsByType[versionType]?.[platform] || igVersionsByType.latest[platform];
  }
  
  // Fallback to latest
  return fbVersionsByType.latest[platform];
};

// Generate iOS UA for Facebook
function buildIOSUA(country = 'global', version = 'latest') {
  const iosVer = randChoice(iosVersions);
  const iosDot = iosVer.replace(/_/g, '.');
  const device = randChoice(iPhoneModels);
  
  // Get version-specific Facebook app version
  const versionArray = getVersionsByType('facebook', 'ios', version);
  const fbav = randChoice(versionArray);
  
  const fbav2 = `.${randInt(20, 40)}.${randInt(100, 250)}`;
  const fbbv = randInt(750000000, 770000000);
  
  // Country-specific locale
  const countryLocales = localesByCountry[country] || localesByCountry.global;
  const locale = randChoice(countryLocales);
  
  const build = randMobileBuild();
  const fbss = randChoice([2, 3]);

  let extra = '';
  let fbrvPart = '';

  if (Math.random() < 0.1) {
    extra = ';FBOP/80';
  } else {
    const fbrvUnique = randInt(100000000, 999999999);
    fbrvPart = `;FBOP/5;FBRV/${fbrvUnique};IABMV/1`;
  }

  // 60% chance to include Safari version, 40% chance to exclude it
  const includeSafari = Math.random() < 0.6;
  
  if (includeSafari) {
    // Generate Safari version based on iOS version
    const safariVersions = {
      '16_5': '604.1', '16_6': '604.1', '16_7': '604.1',
      '17_0': '605.1.15', '17_1': '605.1.15', '17_2': '605.1.15', '17_3': '605.1.15', 
      '17_4': '605.1.15', '17_5': '605.1.15', '17_6': '605.1.15', '17_7': '605.1.15',
      '18_0': '605.1.15', '18_1': '605.1.15', '18_2': '605.1.15', '18_3': '605.1.15', 
      '18_4': '605.1.15', '18_5': '605.1.15', '18_6': '605.1.15'
    };
    
    const safariVer = safariVersions[iosVer] || '605.1.15';
    return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/${build} Safari/${safariVer} [FBAN/FBIOS;FBAV/${fbav}${fbav2};FBBV/${fbbv};FBDV/${device};FBMD/iPhone;FBSN/iOS;FBSV/${iosDot};FBSS/${fbss};FBID/phone;FBLC/${locale}${extra}${fbrvPart}]`;
  } else {
    return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/${build} [FBAN/FBIOS;FBAV/${fbav}${fbav2};FBBV/${fbbv};FBDV/${device};FBMD/iPhone;FBSN/iOS;FBSV/${iosDot};FBSS/${fbss};FBID/phone;FBLC/${locale}${extra}${fbrvPart}]`;
  }
}

// Generate iOS UA for Facebook Lite (Messenger Lite style)
function buildIOSFBLiteUA(country = 'global', version = 'latest') {
  const iosVer = randChoice(iosVersions);
  const iosDot = iosVer.replace(/_/g, '.');
  const device = randChoice(iPhoneModels);
  
  // Get version-specific Facebook Lite version
  const versionArray = getVersionsByType('facebook_lite', 'ios', version);
  const fbav = randChoice(versionArray);
  
  const fbav2 = `.${randInt(10, 30)}.${randInt(50, 150)}`;
  const fbbv = randInt(650000000, 680000000);
  
  // Country-specific locale
  const countryLocales = localesByCountry[country] || localesByCountry.global;
  const locale = randChoice(countryLocales);
  
  const build = randMobileBuild();
  const fbss = randChoice([2, 3]);

  let fbrvPart = '';
  if (Math.random() < 0.7) {
    const fbrvUnique = randInt(100000000, 999999999);
    fbrvPart = `;FBRV/${fbrvUnique}`;
  }

  return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/${build} [FBAN/MessengerLiteForiOS;FBAV/${fbav}${fbav2};FBBV/${fbbv};FBDV/${device};FBMD/iPhone;FBSN/iOS;FBSV/${iosDot};FBSS/${fbss};FBID/phone;FBLC/${locale};FBOP/0${fbrvPart}]`;
}

// Generate iOS UA for Instagram (Real Instagram Format)
function buildIOSInstagramUA(country = 'global', version = 'latest') {
  const iosVer = randChoice(iosVersions);
  const iosDot = iosVer.replace(/_/g, '.');
  const device = randChoice(iPhoneModels);
  
  // Country-specific locale
  const countryLocales = localesByCountry[country] || localesByCountry.global;
  const locale = randChoice(countryLocales);

  // Get version-specific Instagram version
  const versionArray = getVersionsByType('instagram', 'ios', version);
  const igVersion = randChoice(versionArray);

  // iOS Build number format: 21F90
  const buildPrefix = randInt(19, 22);
  const buildLetter = String.fromCharCode(randInt(65, 90)); // A-Z
  const buildNumber = randInt(10, 999);
  const iosBuild = `${buildPrefix}${buildLetter}${buildNumber}`;

  // Scale based on device
  const scales = {
    'iPhone12,1': '2.00', // iPhone 11
    'iPhone12,3': '3.00', // iPhone 11 Pro
    'iPhone12,5': '3.00', // iPhone 11 Pro Max
    'iPhone13,1': '2.00', // iPhone 12 mini
    'iPhone13,2': '2.00', // iPhone 12
    'iPhone13,3': '3.00', // iPhone 12 Pro
    'iPhone13,4': '3.00', // iPhone 12 Pro Max
    'iPhone14,4': '2.00', // iPhone 13 mini
    'iPhone14,5': '2.00', // iPhone 13
    'iPhone14,2': '3.00', // iPhone 13 Pro
    'iPhone14,3': '3.00', // iPhone 13 Pro Max
    'iPhone14,7': '2.00', // iPhone 14
    'iPhone14,8': '2.00', // iPhone 14 Plus
    'iPhone15,2': '3.00', // iPhone 14 Pro
    'iPhone15,3': '3.00', // iPhone 14 Pro Max
    'iPhone15,4': '2.00', // iPhone 15
    'iPhone15,5': '2.00', // iPhone 15 Plus
    'iPhone16,1': '3.00', // iPhone 15 Pro
    'iPhone16,2': '3.00', // iPhone 15 Pro Max
    'iPhone17,1': '2.00', // iPhone 16
    'iPhone17,2': '2.00', // iPhone 16 Plus
    'iPhone17,3': '3.00', // iPhone 16 Pro
    'iPhone17,4': '3.00', // iPhone 16 Pro Max
  };

  const scale = scales[device] || '3.00';

  // Resolution based on device
  const resolutions = {
    'iPhone12,1': '828x1792',   // iPhone 11
    'iPhone12,3': '1125x2436',  // iPhone 11 Pro
    'iPhone12,5': '1242x2688',  // iPhone 11 Pro Max
    'iPhone13,1': '1080x2340',  // iPhone 12 mini
    'iPhone13,2': '1170x2532',  // iPhone 12
    'iPhone13,3': '1170x2532',  // iPhone 12 Pro
    'iPhone13,4': '1284x2778',  // iPhone 12 Pro Max
    'iPhone14,4': '1080x2340',  // iPhone 13 mini
    'iPhone14,5': '1170x2532',  // iPhone 13
    'iPhone14,2': '1170x2532',  // iPhone 13 Pro
    'iPhone14,3': '1284x2778',  // iPhone 13 Pro Max
    'iPhone14,7': '1170x2532',  // iPhone 14
    'iPhone14,8': '1284x2778',  // iPhone 14 Plus
    'iPhone15,2': '1179x2556',  // iPhone 14 Pro
    'iPhone15,3': '1290x2796',  // iPhone 14 Pro Max
    'iPhone15,4': '1179x2556',  // iPhone 15
    'iPhone15,5': '1290x2796',  // iPhone 15 Plus
    'iPhone16,1': '1179x2556',  // iPhone 15 Pro
    'iPhone16,2': '1290x2796',  // iPhone 15 Pro Max
    'iPhone17,1': '1179x2556',  // iPhone 16
    'iPhone17,2': '1290x2796',  // iPhone 16 Plus
    'iPhone17,3': '1206x2622',  // iPhone 16 Pro
    'iPhone17,4': '1320x2868',  // iPhone 16 Pro Max
  };

  const resolution = resolutions[device] || '1170x2532';

  // Instagram build number (9 digits)
  const igBuildNum = randInt(690000000, 700000000);

  // Language format
  const lang = locale.split('_')[0];
  const region = locale.split('_')[1];
  const langFormat = `${lang}-${region}`;

  return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/${iosBuild} Instagram ${igVersion} (${device}; iOS ${iosDot}; ${locale}; ${langFormat}; scale=${scale}; ${resolution}; ${igBuildNum})`;
}

// Build Android UA (FB_IAB style) - Real format
function buildAndroidUA(country = 'global', version = 'latest') {
  const models = androidModelsByCountry[country] || androidModelsByCountry.global;
  const model = randChoice(models);
  const os = randChoice(androidVersions);
  const chrome = randChromeVer();
  
  // Get version-specific Facebook app version
  const versionArray = getVersionsByType('facebook', 'android', version);
  const fbav = randChoice(versionArray);
  
  // Real build format: TP1A.220624.014
  const buildPrefix = randChoice(['TP1A', 'TQ1A', 'TQ2A', 'TQ3A', 'UP1A', 'UQ1A']);
  const buildDate = `${randInt(220000, 240000)}.${String(randInt(1, 999)).padStart(3, '0')}`;
  const buildVer = `Build/${buildPrefix}.${buildDate}`;
  
  // Real format: Only FBAV and optional IABMV, no FBOP/FBRV
  let fbParams = `FBAV/${fbav}`;
  
  // 50% chance to add IABMV/1
  if (Math.random() < 0.9) {
    fbParams += ';IABMV/1';
  }
  
  // Real format includes "; wv)" and ends with ";]"
  return `Mozilla/5.0 (Linux; Android ${os}; ${model} ${buildVer}; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chrome} Mobile Safari/537.36 [FB_IAB/FB4A;${fbParams};]`;
}

// Build Android UA for Facebook Lite
function buildAndroidFBLiteUA(country = 'global', version = 'latest') {
  const models = androidModelsByCountry[country] || androidModelsByCountry.global;
  const model = randChoice(models);
  const os = randChoice(androidVersions);
  const chrome = randChromeVer();
  
  // Get version-specific Facebook Lite version
  const versionArray = getVersionsByType('facebook_lite', 'android', version);
  const fbav = randChoice(versionArray);
  
  const buildVer = `Build/${randInt(20, 30)}${String.fromCharCode(randInt(65, 90))}${randInt(100, 999)}`;
  
  // Country-specific locale
  const countryLocales = localesByCountry[country] || localesByCountry.global;
  const locale = randChoice(countryLocales);

  let fbrvPart = '';
  if (Math.random() < 0.8) {
    fbrvPart = `;FBRV/${randInt(650000000, 680000000)}`;
  }

  return `Mozilla/5.0 (Linux; Android ${os}; ${model} ${buildVer}) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chrome} Mobile Safari/537.36 [FB_IAB/Orca-Android;FBAV/${fbav};FBPN/com.facebook.lite;FBLC/${locale};FBOP/1${fbrvPart}]`;
}

// Build Android UA for Instagram (Real Instagram Format)
function buildAndroidInstagramUA(country = 'global', version = 'latest') {
  const models = androidModelsByCountry[country] || androidModelsByCountry.global;
  const model = randChoice(models);
  const os = randChoice(androidVersions);
  const chrome = randChromeVer();
  
  // Country-specific locale
  const countryLocales = localesByCountry[country] || localesByCountry.global;
  const locale = randChoice(countryLocales);
  
  const dpi = randChoice([250, 320, 480, 560, 640]);
  const resolutions = ['720x1532', '1080x1920', '1080x2340', '1080x2400', '1440x2960', '1440x3200'];
  const resolution = randChoice(resolutions);

  // Get version-specific Instagram version
  const versionArray = getVersionsByType('instagram', 'android', version);
  const igVersion = randChoice(versionArray);

  // Build number format: TP1A.220624.014
  const buildPrefix = randChoice(['TP1A', 'TQ1A', 'TQ2A', 'TQ3A', 'UP1A']);
  const buildDate = `${randInt(220000, 240000)}.${String(randInt(1, 999)).padStart(3, '0')}`;
  const buildNumber = `${buildPrefix}.${buildDate}`;

  // Manufacturer and model name
  const manufacturers = [
    { name: 'INFINIX', prefix: 'Infinix' },
    { name: 'SAMSUNG', prefix: 'samsung' },
    { name: 'XIAOMI', prefix: 'Xiaomi' },
    { name: 'OPPO', prefix: 'OPPO' },
    { name: 'VIVO', prefix: 'vivo' },
    { name: 'REALME', prefix: 'realme' },
    { name: 'ONEPLUS', prefix: 'OnePlus' }
  ];

  const mfg = randChoice(manufacturers);
  const modelCode = model.includes(' ') ? model.replace(/ /g, '') : model;
  const deviceName = model.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Instagram build number (9 digits)
  const igBuildNum = randInt(690000000, 700000000);

  // Android API level (matches Android version)
  const apiLevel = os === '11' ? 30 : os === '12' ? 31 : os === '13' ? 33 : os === '14' ? 34 : 35;

  return `Mozilla/5.0 (Linux; Android ${os}; ${model} Build/${buildNumber}; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chrome} Mobile Safari/537.36 Instagram ${igVersion} Android (${apiLevel}/${os}; ${dpi}dpi; ${resolution}; ${mfg.name}/${mfg.prefix}; ${model}; ${deviceName}; ${modelCode}; ${locale}; ${igBuildNum})`;
}

// Generate Android User Agent
const generateAndroidUA = (browser, version, country = 'global') => {
  // Only Facebook, FB Lite, and Instagram supported
  if (browser === 'facebook') {
    return buildAndroidUA(country, version);
  }
  if (browser === 'facebook_lite') {
    return buildAndroidFBLiteUA(country, version);
  }
  if (browser === 'instagram') {
    return buildAndroidInstagramUA(country, version);
  }
  
  // Default to Facebook if invalid browser
  return buildAndroidUA(country, version);
};

// Generate iPhone User Agent
const generateiPhoneUA = (browser, version, country = 'global') => {
  // Only Facebook, FB Lite, and Instagram supported
  if (browser === 'facebook') {
    return buildIOSUA(country, version);
  }
  if (browser === 'facebook_lite') {
    return buildIOSFBLiteUA(country, version);
  }
  if (browser === 'instagram') {
    return buildIOSInstagramUA(country, version);
  }
  
  // Default to Facebook if invalid browser
  return buildIOSUA(country, version);
};

export const generateUserAgents = (device, browser, version, count, country = 'global') => {
  const results = [];
  for (let i = 0; i < count; i++) {
    if (device === 'android') {
      results.push(generateAndroidUA(browser, version, country));
    } else {
      results.push(generateiPhoneUA(browser, version, country));
    }
  }
  return results;
};

// Export available countries
export const availableCountries = [
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'japan', label: 'Japan' },
  { value: 'global', label: 'Global (Mixed)' }
];