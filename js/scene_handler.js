const scene_sqaure = 16;

const materialVert = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const materialBleau = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
});

let U = [];
let V = [];
let S = [];
let geometry = new THREE.BufferGeometry();

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
  let light = new THREE.DirectionalLight(0xffffff, 1, 100);
  scene.add(light);


  // create a simple square shape. We duplicate the top left and bottom right
  // vertices because each vertex needs to appear once per triangle.

  let positions = new Float32Array([
    0, 0, 0,
    1, 0, 0,
    1, 0, 1,

    0, 0, 0,
    0, 0, 1,
    1, 0, 1,
  ]);

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.attributes.position.needsUpdate = true;
  let mesh = new THREE.Mesh(geometry, materialBleau);
  scene.add(mesh);
}

function positions_upadte() {
  let positions = geometry.attributes.position.array;
  positions[17] = 2;
}

function scene_update(scene) {
  water_update(U, V, S);
  positions_upadte();
  geometry.attributes.position.needsUpdate = true;
}