let geometry = new THREE.BoxGeometry(1, 1, 1);
let materialVert = new THREE.MeshBasicMaterial({
  color: 0x00ff00
});
let materialRouge = new THREE.MeshBasicMaterial({
  color: 0xff0000
});
let materialBleau = new THREE.MeshBasicMaterial({
  color: 0x0000ff
});

let U = [];
let V = [];
let Mcube_sol = [];
let Mcube_water = [];

for (i = 0; i < 50; i++) {
  U.push([]);
  V.push([]);
  Mcube_sol.push([]);
  Mcube_water.push([]);
  for (j = 0; j < 50; j++) {
    let cube_sol = new THREE.Mesh(geometry, (i + j) % 2 ? materialVert : materialRouge);
    cube_sol.position.x = i;
    cube_sol.position.z = j;
    cube_sol.position.y = -1;
    let cube_water = new THREE.Mesh(geometry, materialBleau);
    cube_water.matrixAutoUpdate = false;
    cube_water.position.x = i;
    cube_water.position.z = j;
    cube_water.position.y = (i ? 0 : 10);

    U[i][j] = cube_water.position.y;
    V[i][j] = 0;
    Mcube_sol[i][j] = cube_sol;
    Mcube_water[i][j] = cube_water;
  }
}

function scene_init(scene) {
  for (i = 0; i < Mcube_sol.length; i++) {
    for (j = 0; j < Mcube_sol[i].length; j++) {
      scene.add(Mcube_sol[i][j]);
      scene.add(Mcube_water[i][j]);
    }
  }
}

function scene_update(scene) {
  Mcube_water_update(Mcube_water, U, V);
}