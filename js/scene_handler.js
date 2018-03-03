const scene_sqaure = 32;

const geometry = new THREE.BoxGeometry(1, 100, 1);
const materialVert = new THREE.MeshStandardMaterial({
  color: 0x00ff00
});
const materialBleau = new THREE.MeshStandardMaterial({
  color: 0x0000ff
});

let U = [];
let V = [];
let S = [];
let Mcube_sol = [];
let Mcube_water = [];

init();

function cube_sol_create(i, j) {
  let cube_sol = new THREE.Mesh(geometry, materialVert);
  cube_sol.position.x = i;
  cube_sol.position.z = j;
  cube_sol.position.y = -100;
  return cube_sol;
}

function cube_water_create(i, j) {
  let cube_water = new THREE.Mesh(geometry, materialBleau);
  cube_water.position.x = i;
  cube_water.position.z = j;
  cube_water.position.y = (i ? -99 : -93);
  return cube_water;
}

function init() {
  for (i = 0; i < scene_sqaure; i++) {
    U.push([]);
    V.push([]);
    S.push([]);
    Mcube_sol.push([]);
    Mcube_water.push([]);
    for (j = 0; j < scene_sqaure; j++) {
      V[i][j] = 0;

      let cube_sol = cube_sol_create(i, j);
      S[i][j] = cube_sol.position.y;
      Mcube_sol[i][j] = cube_sol;

      let cube_water = cube_water_create(i, j);
      U[i][j] = cube_water.position.y;
      Mcube_water[i][j] = cube_water;
    }
  }
}

function scene_init(scene) {
  let light = new THREE.DirectionalLight(0xffffff, 1, 100);
  scene.add(light);

  for (i = 0; i < scene_sqaure; i++) {
    for (j = 0; j < scene_sqaure; j++) {
      scene.add(Mcube_sol[i][j]);
      scene.add(Mcube_water[i][j]);
    }
  }
}

function scene_update(scene) {
  Mcube_water_update(Mcube_water, U, V);
}