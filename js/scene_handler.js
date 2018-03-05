function init_geo(M, geo) {
  const positions = [];
  const normals = [];

  positions_normals_upadte(positions, normals, M);

  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  const normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
  normalAttribute.normalized = true;
  geo.addAttribute('position', positionAttribute);
  geo.addAttribute('normal', normalAttribute);
}

function scene_init() {
  init_UVS();

  scene = new THREE.Scene();
  scene.add(light1);
  geometry_water = new THREE.BufferGeometry();
  geometry_sol = new THREE.BufferGeometry();

  init_geo(U, geometry_water);
  const mesh_water = new THREE.Mesh(geometry_water, material_water);
  scene.add(mesh_water);

  init_geo(S, geometry_sol);
  const mesh_sol = new THREE.Mesh(geometry_sol, material_sol);
  scene.add(mesh_sol);
}

function geometry_upadte(geometry, M) {
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  positions_normals_upadte(positions, normals, M);
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
}

function scene_update() {
  if (wave) {
    wave_update();
  }
  if (rain) {
    rain_update();
  }
  if (rising) {
    rising_update();
  }
  if (leak) {
    leak_update();
  }
  water_update(U, V, S);
  geometry_upadte(geometry_water, U);
}