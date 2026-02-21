function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3; // Earth's radius in meters
  const toRad = (x: number) => (x * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
}

function calculateSpeed(
  lat1: number,
  lon1: number,
  time1: number,
  lat2: number,
  lon2: number,
  time2: number
) {
  const distance = haversineDistance(lat1, lon1, lat2, lon2); // in meters
  const timeDiff = (time2 - time1) / 1000; // in seconds

  if (timeDiff === 0) return 0; // avoid divide-by-zero

  const speedMs = distance / timeDiff; // meters per second
  const speedKmh = speedMs * 3.6; // convert to km/h

  return speedKmh;
}

function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let θ = Math.atan2(y, x);
  let bearing = (toDeg(θ) + 360) % 360; // normalize to 0–360°

  return bearing; // in degrees
}

export { calculateSpeed, calculateBearing };
