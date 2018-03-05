const geometry_water = new THREE.BufferGeometry();
const material_water = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
});
const mesh_water = new THREE.Mesh(geometry_water, material_water);

const geometry_sol = new THREE.BufferGeometry();
const material_sol = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const mesh_sol = new THREE.Mesh(geometry_sol, material_sol);

function init_geo(U, geo) {
  const positions = [];
  const normals = [];

  positions_normals_upadte(positions, normals, U);

  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  const normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
  normalAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
  geo.addAttribute('position', positionAttribute);
  geo.addAttribute('normal', normalAttribute);
}

function scene_init(scene, lp) {
  init_UVS(lp);

  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(1, 2, 0);
  scene.add(light1);

  init_geo(U, geometry_water);
  scene.add(mesh_water);

  init_geo(S, geometry_sol);
  scene.add(mesh_sol);
}

function geometry_upadte(geometry, U) {
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  positions_normals_upadte(positions, normals, U);
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
}

function scene_update(scene) {
  for (let i = 0; i < scene_res; i++) {
    U[0][i] = scene_res * 0.2;
    V[0][i] = 0;
  }
  water_update(U, V, S);
  geometry_upadte(geometry_water, U);
}