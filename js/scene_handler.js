const U = [];
const V = [];
const S = [];
const geometry_water = new THREE.BufferGeometry();

init();

function init_S(S, lp) {
  for (let k = 0; k < lp.length; k++) {
    lp[k][0] *= scene_res;
    lp[k][1] *= (scene_res / 2);
    lp[k][2] *= scene_res;

    for (i = 0; i < scene_res; i++) {
      for (j = 0; j < scene_res; j++) {
        let h1 = 0;
        let h2 = 0;

        if (i < lp[k][0]) {
          h1 = lp[k][1] * (1 - Math.cos((i / lp[k][0]) * PI));
        } else {
          h1 = lp[k][1] * (1 - Math.cos(((scene_res - i) / (scene_res - lp[k][0])) * PI));
        }

        if (j < lp[k][2]) {
          h2 = lp[k][1] * (1 - Math.cos((j / lp[k][2]) * PI));
        } else {
          h2 = lp[k][1] * (1 - Math.cos(((scene_res - j) / (scene_res - lp[k][2])) * PI));
        }

        let h = Math.sqrt(h1 * h2);
        S[i][j] = (S[i][j] > h ? S[i][j] : h);
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
    [0.2, 0.1, 0.8],
    [0.2, 0.1, 0.2],
    [0, 0.3, 0],
    [0.5, 0.2, 0.5],
  ];
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
    U[0][i] = 30;
    V[0][i] = 0;
  }
  water_update(U, V, S);
  geometry_upadte(geometry_water, U);
}