const material_sol = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const material_water = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
});

const U = [];
const V = [];
const S = [];
const geometry_water = new THREE.BufferGeometry();
const geometry_sol = new THREE.BufferGeometry();

init();

function init() {
  for (i = 0; i < scene_sqaure; i++) {
    U.push([]);
    V.push([]);
    S.push([]);
    for (j = 0; j < scene_sqaure; j++) {
      V[i][j] = 0;
      S[i][j] = (i > scene_sqaure / 3 && i < scene_sqaure * 2 / 3 &&
        j > scene_sqaure / 3 && j < scene_sqaure * 2 / 3 ? 50 : 0);
      //      S[i][j] = (i + j) / 20;
      U[i][j] = -1;
    }
  }
}

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

function scene_init(scene) {
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(1, 2, 0);
  scene.add(light1);

  init_geo(U, geometry_water);
  mesh_water = new THREE.Mesh(geometry_water, material_water);
  scene.add(mesh_water);

  init_geo(S, geometry_sol);
  mesh_sol = new THREE.Mesh(geometry_sol, material_sol);
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
  for (let i = 0; i < scene_sqaure; i++) {
    U[0][i] = 30;
    V[0][i] = 0;
  }
  water_update(U, V, S);
  geometry_upadte(geometry_water, U);
}