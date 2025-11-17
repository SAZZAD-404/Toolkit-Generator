// iOS Data
const iPhoneModels = [
  "iPhone12,1", "iPhone12,3", "iPhone12,5", "iPhone13,1", "iPhone13,2",
  "iPhone13,3", "iPhone13,4", "iPhone14,4", "iPhone14,5", "iPhone14,2",
  "iPhone14,3", "iPhone14,7", "iPhone14,8", "iPhone15,2", "iPhone15,3",
  "iPhone15,4", "iPhone15,5", "iPhone16,1", "iPhone16,2", "iPhone17,1",
  "iPhone17,2", "iPhone17,3", "iPhone17,4", "iPhone18,1", "iPhone18,2",
  "iPhone18,3", "iPhone18,4"
];

const iosVersions = [
  "16_5", "17_0", "17_1", "17_2", "17_3", "17_4", "17_5",
  "18_0", "18_1", "18_2", "18_3", "18_4", "18_5", "18_6", "18_6_1", "18_7_2", "26_0", "26_1"
];

const fbAppVersionsIOS = [
  "534.1.0", "534.0.0", "533.0.0", "532.0.0", "531.0.0", "536.0.0", "537.0.0","535.0.0","536.0.0","537.0.0","538.0.0"
  "534.1.0", "534.0.0", "533.0.0", "536.0.0", "537.0.0","535.0.0","536.0.0","537.0.0","538.0.0", "539.0.0"
];

const fbAppVersionsAndroid = [
  "530.0.0.48.74", "529.0.0.44.73", "535.0.0.49.72","536.0.0.46.77","534.0.0.56.76",
  "532.0.0.55.71", "533.0.0.49.79", "531.0.0.47.70","536.1.0.58.77","537.0.0.47.77",
  "538.0.0.53.70"
];

// Facebook Lite versions (different from main FB)
const fbLiteVersionsIOS = [
  "428.0.0", "429.0.0", "430.0.0", "431.0.0", "432.0.0", "433.0.0", "434.0.0"
];

const fbLiteVersionsAndroid = [
  "428.0.0.9.118", "429.0.0.8.117", "430.0.0.10.119",
  "431.0.0.11.120", "432.0.0.9.118", "433.0.0.10.121"
];

// Instagram versions
const igVersionsIOS = [
  "358.0.0", "359.0.0", "360.0.0", "361.0.0", "362.0.0", "363.0.0", "364.0.0"
];

const igVersionsAndroid = [
  "358.0.0.30.111", "359.0.0.31.112", "360.0.0.32.113",
  "361.0.0.33.114", "362.0.0.34.115", "363.0.0.35.116"
];

const locales = ["en_US", "es_US", "en_GB", "es_ES"];

// Android Data - USA, Canada, Japan, Europe Focus
const androidModels = [
  // 🇺🇸 Samsung Galaxy S (USA/Canada Best Sellers)
  "SM-S928U", "SM-S926U", "SM-S921U", "SM-S928B", "SM-S926B", "SM-S921B", // S24 Ultra, S24+, S24
  "SM-S918U", "SM-S916U", "SM-S911U", "SM-S918B", "SM-S916B", "SM-S911B", // S23 Ultra, S23+, S23
  "SM-G998U", "SM-G996U", "SM-G991U", "SM-G998B", "SM-G996B", "SM-G991B", // S21 Ultra, S21+, S21

  // 🇺🇸 Samsung Z Fold/Flip (Premium USA/Europe)
  "SM-F946U", "SM-F936U", "SM-F926U", "SM-F946B", "SM-F936B", // Z Fold 5, 4, 3
  "SM-F731U", "SM-F721U", "SM-F731B", "SM-F721B", // Z Flip 5, 4

  // 🇺🇸 Samsung A Series (USA/Canada)
  "SM-A546U", "SM-A536U", "SM-A526U", "SM-A346U", "SM-A146U", // A54, A53, A52, A34, A14

  // 🇺🇸 Google Pixel (USA/Canada/Japan)
  "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", // 2024
  "Pixel 8 Pro", "Pixel 8", "Pixel 8a", // 2023
  "Pixel 7 Pro", "Pixel 7", "Pixel 7a", // 2022
  "Pixel 6 Pro", "Pixel 6", "Pixel 6a", "Pixel 5", "Pixel 5a", // Older

  // 🇨🇦 OnePlus (USA/Canada/Europe)
  "CPH2609", "CPH2617", "CPH2449", "CPH2451", // OnePlus 12, 12R, 11, 11R
  "CPH2413", "CPH2423", "LE2125", "LE2123", "LE2121", // OnePlus 10 Pro, 10T, 9 Pro, 9, 9R
  "IN2025", "IN2023", "CPH2399", // OnePlus 8 Pro, 8, Nord 3

  // 🇯🇵 Sony Xperia (Japan/Europe)
  "XQ-DQ72", "XQ-DQ62", "XQ-DQ54", // Xperia 1 V, IV, III
  "XQ-CQ72", "XQ-CQ62", "XQ-CQ54", // Xperia 5 V, IV, III
  "XQ-BC72", "XQ-BC62", "XQ-BC52", // Xperia 10 V, IV, III

  // 🇯🇵 Sharp Aquos (Japan)
  "SH-51C", "SH-52B", "SH-53A", "SH-54C", "SH-53C", // Aquos R8, R7, R6, Sense 8, 7

  // 🇯🇵 Fujitsu (Japan)
  "F-52B", "F-51B", "F-42A", // Arrows NX9, We, 5G

  // 🇪🇺 Motorola (USA/Europe/Latin America)
  "XT2321-1", "XT2311-1", "XT2301-4", // Edge 40 Pro, Edge 40, Edge 30
  "XT2341-1", "XT2331-1", "XT2313-1", // Razr 40 Ultra, Razr 40, Edge 30 Ultra
  "XT2201-1", "XT2175-2", "XT2167-1", "XT2235-3", // Moto G73, G72, G71, G52

  // 🇪🇺 Nokia (Europe)
  "TA-1476", "TA-1428", "TA-1360", // Nokia X30, X20, X10
  "TA-1516", "TA-1488", "TA-1449", // Nokia G60, G50, G42

  // 🇪🇺 Nothing Phone (Europe/USA Viral)
  "A063", "A065", "A142", // Nothing Phone 2, 2a, 1

  // 🇪🇺 Xiaomi (Europe/Global)
  "23113RKC6G", "2211133G", "2210132G", // Xiaomi 14, 13, 12
  "23078PND5G", "22101316G", "21091116AG", // Redmi Note 13 Pro, 12 Pro, 11 Pro
  "23013RK75C", "22127RK46C", "21121119SG", // Poco F5, F4, F3

  // 🌏 Asus ROG (Gaming Global)
  "ASUS_AI2401", "ASUS_AI2205", "ASUS_I005D", // ROG Phone 8, 7, 6

  // 🌏 Xiaomi/Redmi (Asia/Global - More models)
  "23021RAAEG", "22071212AG", "21061119AG", // Redmi Note 12, 11, 10
  "M2101K6G", "M2007J20CG", "M2012K11AG", // Poco X3, F3, X4
  "2201123G", "2109119DG", "22011211G", // Redmi 11, 10, Mi 11

  // 🌏 Realme (Budget King - More models)
  "RMX3710", "RMX3708", "RMX3687", // Realme 11 Pro+, 11 Pro, 11
  "RMX3630", "RMX3506", "RMX3491", // Realme 10 Pro+, 10 Pro, 10
  "RMX3461", "RMX3430", "RMX3371", // Narzo 60, 50, GT Neo 3
  "RMX3363", "RMX3031", "RMX2205", // Realme 9 Pro+, 9 Pro, 9

  // 🌏 Oppo (Asia/Europe - More models)
  "CPH2531", "CPH2505", "CPH2487", // Reno 11, 10, 9
  "CPH2451", "CPH2437", "CPH2413", // Find X6, X5, X3
  "CPH2239", "CPH2219", "CPH2185", // A96, A76, A54

  // 🌏 Vivo (Asia/Europe - More models)
  "V2250", "V2227", "V2185", // X90, X80, X70
  "V2231", "V2207", "V2162", // V29, V27, V25
  "V2206", "V2154", "V2120", // Y77, Y35, Y21

  // 🌏 Honor (China/Europe)
  "LGE-LX1", "ANY-NX1", "LSA-AN00", "ALI-AN00", "NTN-AN00", "BMH-AN10",
];

const androidVersions = ["11", "12", "13", "14", "15"];

// Helper functions
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randChromeVer = () => `${randInt(137, 140)}.0.${randInt(5000, 9000)}.${randInt(100, 200)}`;
const randMobileBuild = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return `${randInt(15, 22)}${letters[randInt(0, 25)]}${randInt(100, 999)}`;
};

// Generate iOS UA for Facebook
function buildIOSUA() {
  const iosVer = randChoice(iosVersions);
  const iosDot = iosVer.replace(/_/g, '.');
  const device = randChoice(iPhoneModels);
  const fbav = randChoice(fbAppVersionsIOS);
  const fbav2 = `.${randInt(20, 40)}.${randInt(100, 250)}`;
  const fbbv = randInt(750000000, 770000000);
  const locale = randChoice(locales);
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

  return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/${build} [FBAN/FBIOS;FBAV/${fbav}${fbav2};FBBV/${fbbv};FBDV/${device};FBMD/iPhone;FBSN/iOS;FBSV/${iosDot};FBSS/${fbss};FBID/phone;FBLC/${locale}${extra}${fbrvPart}]`;
}

// Generate iOS UA for Facebook Lite (Messenger Lite style)
function buildIOSFBLiteUA() {
  const iosVer = randChoice(iosVersions);
  const iosDot = iosVer.replace(/_/g, '.');
  const device = randChoice(iPhoneModels);
  const fbav = randChoice(fbLiteVersionsIOS);
  const fbav2 = `.${randInt(10, 30)}.${randInt(50, 150)}`;
  const fbbv = randInt(650000000, 680000000);
  const locale = randChoice(locales);
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
function buildIOSInstagramUA() {
  const iosVer = randChoice(iosVersions);
  const iosDot = iosVer.replace(/_/g, '.');
  const device = randChoice(iPhoneModels);
  const locale = randChoice(locales);

  // Instagram version format: 367.0.0.23.104
  const igMajor = randInt(360, 370);
  const igMinor = randInt(0, 2);
  const igPatch = randInt(0, 2);
  const igBuild1 = randInt(20, 30);
  const igBuild2 = randInt(100, 120);
  const igVersion = `${igMajor}.${igMinor}.${igPatch}.${igBuild1}.${igBuild2}`;

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

// Build Android UA (FB_IAB style)
function buildAndroidUA() {
  const model = randChoice(androidModels);
  const os = randChoice(androidVersions);
  const chrome = randChromeVer();
  const fbav = randChoice(fbAppVersionsAndroid);
  const buildVer = `Build/${randInt(20, 30)}${String.fromCharCode(randInt(65, 90))}${randInt(100, 999)}`;
  const locale = randChoice(locales);

  let fbopPart = '';
  let fbrvPart = '';

  if (Math.random() < 0.1) {
    // 10% chance FBOP=80
    fbopPart = ';FBOP/80';
  } else {
    // 90% chance FBOP=5 + FBRV + optional IABMV
    fbopPart = ';FBOP/5';
    fbrvPart = `;FBRV/${randInt(760000000, 770000000)}`;
    if (Math.random() < 0.5) fbrvPart += ';IABMV/1';
  }

  return `Mozilla/5.0 (Linux; Android ${os}; ${model} ${buildVer}) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chrome} Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/${fbav}${fbopPart}${fbrvPart}]`;
}

// Build Android UA for Facebook Lite
function buildAndroidFBLiteUA() {
  const model = randChoice(androidModels);
  const os = randChoice(androidVersions);
  const chrome = randChromeVer();
  const fbav = randChoice(fbLiteVersionsAndroid);
  const buildVer = `Build/${randInt(20, 30)}${String.fromCharCode(randInt(65, 90))}${randInt(100, 999)}`;
  const locale = randChoice(locales);

  let fbrvPart = '';
  if (Math.random() < 0.8) {
    fbrvPart = `;FBRV/${randInt(650000000, 680000000)}`;
  }

  return `Mozilla/5.0 (Linux; Android ${os}; ${model} ${buildVer}) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chrome} Mobile Safari/537.36 [FB_IAB/Orca-Android;FBAV/${fbav};FBPN/com.facebook.lite;FBLC/${locale};FBOP/1${fbrvPart}]`;
}

// Build Android UA for Instagram (Real Instagram Format)
function buildAndroidInstagramUA() {
  const model = randChoice(androidModels);
  const os = randChoice(androidVersions);
  const chrome = randChromeVer();
  const locale = randChoice(locales);
  const dpi = randChoice([250, 320, 480, 560, 640]);
  const resolutions = ['720x1532', '1080x1920', '1080x2340', '1080x2400', '1440x2960', '1440x3200'];
  const resolution = randChoice(resolutions);

  // Instagram version format: 367.0.0.43.90
  const igMajor = randInt(360, 370);
  const igMinor = randInt(0, 2);
  const igPatch = randInt(0, 2);
  const igBuild1 = randInt(40, 50);
  const igBuild2 = randInt(80, 99);
  const igVersion = `${igMajor}.${igMinor}.${igPatch}.${igBuild1}.${igBuild2}`;

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

// Other browsers (Chrome, Instagram, etc.)
const browserVersions = {
  chrome: { latest: { min: 128, max: 131 }, recent: { min: 120, max: 127 }, old: { min: 110, max: 119 } },
  firefox: { latest: { min: 128, max: 132 }, recent: { min: 120, max: 127 }, old: { min: 110, max: 119 } },
  opera: { latest: { min: 108, max: 115 }, recent: { min: 100, max: 107 }, old: { min: 90, max: 99 } },
  uc: { latest: { min: 15, max: 16 }, recent: { min: 13, max: 14 }, old: { min: 11, max: 12 } },
  samsung: { latest: { min: 24, max: 26 }, recent: { min: 21, max: 23 }, old: { min: 18, max: 20 } },
  instagram: { latest: { min: 358, max: 368 }, recent: { min: 340, max: 357 }, old: { min: 320, max: 339 } },
};

const generateAndroidUA = (browser, version) => {
  // For Facebook, FB Lite, and Instagram, use dedicated functions
  if (browser === 'facebook') {
    return buildAndroidUA();
  }
  if (browser === 'facebook_lite') {
    return buildAndroidFBLiteUA();
  }
  if (browser === 'instagram') {
    return buildAndroidInstagramUA();
  }

  const device = randChoice(androidModels);
  const androidVer = randChoice(androidVersions);
  const { min, max } = browserVersions[browser][version];
  const browserVer = randInt(min, max);
  const chromeVer = randChromeVer();

  switch (browser) {
    case 'chrome':
      return `Mozilla/5.0 (Linux; Android ${androidVer}; ${device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer} Mobile Safari/537.36`;

    case 'firefox':
      // Real Firefox Android format: Mozilla/5.0 (Android 13; Mobile; rv:144.0) Gecko/144.0 Firefox/144.0
      return `Mozilla/5.0 (Android ${androidVer}; Mobile; rv:${browserVer}.0) Gecko/${browserVer}.0 Firefox/${browserVer}.0`;

    case 'opera':
      // Real Opera Mini format: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 OPR/92.0.0.0
      const operaDevice = device.includes(' ') ? 'K' : device; // Use 'K' for generic or actual device
      return `Mozilla/5.0 (Linux; Android ${androidVer}; ${operaDevice}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer} Mobile Safari/537.36 OPR/${browserVer}.0.0.0`;

    case 'uc':
      // Real UC Browser format: Mozilla/5.0 (Linux; U; Android 13; en-US; Infinix X6528 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/123.0.6312.80 UCBrowser/15.0.1.1377 Mobile Safari/537.36
      const buildPrefix = randChoice(['TP1A', 'TQ1A', 'TQ2A', 'TQ3A', 'UP1A']);
      const buildDate = `${randInt(220000, 240000)}.${String(randInt(1, 999)).padStart(3, '0')}`;
      const buildNumber = `${buildPrefix}.${buildDate}`;
      const ucVersion = `${browserVer}.0.${randInt(1, 9)}.${randInt(1000, 1999)}`;
      return `Mozilla/5.0 (Linux; U; Android ${androidVer}; en-US; ${device} Build/${buildNumber}) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chromeVer} UCBrowser/${ucVersion} Mobile Safari/537.36`;

    case 'samsung':
      // Real Samsung Browser format: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36
      const samsungDevice = device.includes('SM-') ? device : (device.includes(' ') ? 'K' : device);
      return `Mozilla/5.0 (Linux; Android ${androidVer}; ${samsungDevice}) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/${browserVer}.0 Chrome/${chromeVer} Mobile Safari/537.36`;

    default:
      return generateAndroidUA('chrome', version);
  }
};

const generateiPhoneUA = (browser, version) => {
  const device = randChoice(iPhoneModels);
  const iOSVer = randChoice(iosVersions);
  const iosDot = iOSVer.replace(/_/g, '.');
  const { min, max } = browserVersions[browser]?.[version] || browserVersions.chrome[version];
  const browserVer = randInt(min, max);
  const buildNumber = randInt(100000000, 999999999);

  switch (browser) {
    case 'chrome':
      return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iOSVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${browserVer}.0.${randInt(6000, 6999)}.${randInt(100, 200)} Mobile/15E148 Safari/604.1`;

    case 'firefox':
      return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iOSVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/${browserVer}.0 Mobile/15E148 Safari/605.1.15`;

    case 'facebook':
      return buildIOSUA();

    case 'facebook_lite':
      return buildIOSFBLiteUA();

    case 'instagram':
      return buildIOSInstagramUA();

    case 'opera':
      return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iOSVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPiOS/${browserVer}.0.${randInt(2000, 2999)}.${randInt(60000, 69999)} Mobile/15E148 Safari/9537.53`;

    case 'uc':
      return `Mozilla/5.0 (iPhone; CPU iPhone OS ${iOSVer} like Mac OS X; en-US) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/15E148 UCBrowser/${browserVer}.${randInt(0, 9)}.${randInt(0, 9)}.${randInt(1000, 1999)} Mobile Safari/537.51.1`;

    default:
      return generateiPhoneUA('chrome', version);
  }
};

export const generateUserAgents = (device, browser, version, count) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    if (device === 'android') {
      results.push(generateAndroidUA(browser, version));
    } else {
      results.push(generateiPhoneUA(browser, version));
    }
  }
  return results;
};
