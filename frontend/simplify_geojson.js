const fs = require('fs');

const geojson = JSON.parse(fs.readFileSync('public/telangana_districts.json', 'utf8'));

const districts = geojson.features.map(f => {
  const name = f.properties.dtname;
  const geometry = f.geometry;
  
  const simplifyCoords = (coords) => {
    if (!Array.isArray(coords[0][0])) {
      // It's a ring of points [lon, lat]
      return coords.filter((_, i) => i % 8 === 0 || i === coords.length - 1);
    }
    return coords.map(simplifyCoords);
  };

  // Simple centroid calculation (average of all points in all rings)
  let sumLon = 0, sumLat = 0, count = 0;
  const processForCentroid = (coords) => {
    if (!Array.isArray(coords[0][0])) {
      coords.forEach(p => {
        sumLon += p[0];
        sumLat += p[1];
        count++;
      });
    } else {
      coords.forEach(processForCentroid);
    }
  };
  processForCentroid(geometry.coordinates);

  return {
    name,
    id: f.id,
    centroid: [sumLon / count, sumLat / count],
    geometry: {
      type: geometry.type,
      coordinates: simplifyCoords(geometry.coordinates)
    }
  };
});

fs.writeFileSync('src/data/telangana_districts_data.json', JSON.stringify(districts, null, 2));
console.log('Simplified data with centroids written to src/data/telangana_districts_data.json');
