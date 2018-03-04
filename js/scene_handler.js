const U = [];
const V = [];
const S = [];
const geometry_water = new THREE.BufferGeometry();

init();

function init_S(S, lp) {
  for (let k = 0; k < lp.length; k++) {
    lp[k][0] *= scene_res;
    lp[k][1] *= scene_res;
    lp[k][2] *= scene_res;

    let i_min = (lp[k][0] <= scene_res / 2 ? 0 : lp[k][0] * 2 - scene_res);
    let i_max = (lp[k][0] >= scene_res / 2 ? scene_res : lp[k][0] * 2);
    let j_min = (lp[k][2] <= scene_res / 2 ? 0 : lp[k][2] * 2 - scene_res);
    let j_max = (lp[k][2] >= scene_res / 2 ? scene_res : lp[k][2] * 2);

    for (i = 0; i < scene_res; i++) {
      for (j = 0; j < scene_res; j++) {
        if (i > i_min && i < i_max && j > j_min && j < j_max) {
          let k1 = 0;
          let k2 = 0;
          let i_eq = i - i_min;
          let j_eq = j - j_min;

          lpk0_ep = (i_max - i_min) / 2;
          k1 = (1 - Math.cos((i_eq / lpk0_ep) * PI)) / 2
          lpk2_ep = (j_max - j_min) / 2;
          k2 = (1 - Math.cos((j_eq / lpk2_ep) * PI)) / 2;

          let h = lp[k][1] * k2 * k1;
          S[i][j] = (S[i][j] > h ? S[i][j] : h);
        }
      }
    }
  }
}

function init() {
  for (i = 0; i < scene_res; i++) {
    U.push([]);
    V.push([]);
    S.push([]);
    for (j = 0; j < scene_res; j++) {
      V[i][j] = 0;
      S[i][j] = 0;
      U[i][j] = -1;
    }
  }
  lp = [
    [0.25, 0.35, 0.25],
    [0.25, 0.18, 0.37],
    [0.25, 0.18, 0.50],
    [0.25, 0.18, 0.62],
    [0.25, 0.35, 0.75],

    [0.37, 0.35, 0.25],
    [0.37, 0.35, 0.75],

    [0.50, 0.35, 0.25],
    [0.50, 0.35, 0.75],

    [0.62, 0.35, 0.25],
    [0.62, 0.35, 0.75],

    [0.75, 0.35, 0.25],
    [0.75, 0.35, 0.37],
    [0.75, 0.35, 0.50],
    [0.75, 0.35, 0.62],
    [0.75, 0.35, 0.75],
  ];
  /*
  lp = [
    [0.25, 0.35, 0.25],
    [0.65, 0.35, 0.65],
  ];
  */
  init_S(S, lp);
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

  const material_water = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
  });
  init_geo(U, geometry_water);
  mesh_water = new THREE.Mesh(geometry_water, material_water);
  scene.add(mesh_water);

  const geometry_sol = new THREE.BufferGeometry();
  const material_sol = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
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
  for (let i = 0; i < scene_res; i++) {
    U[0][i] = scene_res * 0.2;
    V[0][i] = 0;
  }
  water_update(U, V, S);
  geometry_upadte(geometry_water, U);
}