const scene_sqaure = 512;

const materialVert = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const materialBleau = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
});

const U = [];
const V = [];
const S = [];
const geometry = new THREE.BufferGeometry();

init();

function init() {
  for (i = 0; i < scene_sqaure; i++) {
    U.push([]);
    V.push([]);
    S.push([]);
    for (j = 0; j < scene_sqaure; j++) {
      V[i][j] = 0;
      S[i][j] = -100;
      U[i][j] = (i ? -99 : -93);
    }
  }
}

function scene_init(scene) {
  let light1 = new THREE.DirectionalLight(0xffffff, 0.5);
  light1.position.set(1, 1, 0);
  scene.add(light1);
  let light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(0, 1, 1);
  scene.add(light2);

  let positions = [];
  let normals = [];

  positions_normals_upadte(positions, normals, U);

  let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  let normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
  normalAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
  geometry.addAttribute('position', positionAttribute);
  geometry.addAttribute('normal', normalAttribute);

  mesh = new THREE.Mesh(geometry, materialBleau);
  scene.add(mesh);
}

function geometry_upadte() {
  let positions = geometry.attributes.position.array;
  let normals = geometry.attributes.normal.array;

  positions_normals_upadte(positions, normals, U);
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
}

function scene_update(scene) {
  water_update(U, V, S);
  geometry_upadte();
}