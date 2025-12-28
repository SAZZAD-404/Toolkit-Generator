const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateIPv4 = (ipClass) => {
  let octets = [];

  switch (ipClass) {
    case 'classA':
      // Class A: 1.0.0.0 to 126.255.255.255
      octets = [randomInt(1, 126), randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
      break;
    case 'classB':
      // Class B: 128.0.0.0 to 191.255.255.255
      octets = [randomInt(128, 191), randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
      break;
    case 'classC':
      // Class C: 192.0.0.0 to 223.255.255.255
      octets = [randomInt(192, 223), randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
      break;
    case 'private':
      // Private IP ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
      const privateRanges = [
        () => [10, randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)],
        () => [172, randomInt(16, 31), randomInt(0, 255), randomInt(0, 255)],
        () => [192, 168, randomInt(0, 255), randomInt(0, 255)],
      ];
      octets = privateRanges[randomInt(0, 2)]();
      break;
    case 'public':
    default:
      // Public IP (avoiding private ranges and special addresses)
      const first = randomInt(1, 223);
      if (first === 10 || first === 127 || (first >= 172 && first <= 172)) {
        octets = [randomInt(1, 9), randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
      } else if (first === 192) {
        octets = [192, randomInt(0, 167), randomInt(0, 255), randomInt(0, 255)];
      } else {
        octets = [first, randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
      }
      break;
  }

  return octets.join('.');
};

const generateIPv6 = () => {
  const segments = [];
  for (let i = 0; i < 8; i++) {
    segments.push(randomInt(0, 65535).toString(16).padStart(4, '0'));
  }
  return segments.join(':');
};

export const generateRandomIPs = (ipType, ipClass, count) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    if (ipType === 'ipv6') {
      results.push(generateIPv6());
    } else {
      results.push(generateIPv4(ipClass));
    }
  }
  return results;
};
