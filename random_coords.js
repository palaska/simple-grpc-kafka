'use strict';

module.exports = ({ latMin, latMax, lngMin, lngMax } = {}) => {
  if (!latMin || latMin < -90 || latMin > 90) { latMin = -90; }
  if (!latMax || latMax < -90 || latMax > 90) { latMax = 90; }
  if (!lngMin|| lngMin < -180 || lngMin > 180) { lngMin = -180; }
  if (!lngMax|| lngMax < -180 || lngMax > 180) { lngMax = 180; }

  const lat = (Math.random() * (latMax - latMin) + latMin).toFixed(3).toString();
  const lng = (Math.random() * (lngMax - lngMin) + lngMin).toFixed(3).toString();

  return {
    lat, lng
  };
}
