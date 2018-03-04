const scene_sqaure = 512;

const materialVert = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const materialBleau = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
});
const triangles = 512 * 512;

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
  let light1 = new THREE.DirectionalLight(0xffffff, 0.5);
  light1.position.set(1, 1, 0);
  scene.add(light1);
  let light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(0, 1, 1);
  scene.add(light2);

  let positions = [];
  let normals = [];

  positions_normals_upadte(positions, normals);

  let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  let normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
  normalAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
  geometry.addAttribute('position', positionAttribute);
  geometry.addAttribute('normal', normalAttribute);

  mesh = new THREE.Mesh(geometry, materialBleau);
  scene.add(mesh);
}

function positions_normals_upadte(positions, normals) {
  let n = 800,
    n2 = n / 2; // triangles spread in the cube
  let d = 12,
    d2 = d / 2; // individual triangle size
  let pA = new THREE.Vector3();
  let pB = new THREE.Vector3();
  let pC = new THREE.Vector3();
  let cb = new THREE.Vector3();
  let ab = new THREE.Vector3();
  let k = 0;
  let h = 0;
  for (let i = 0; i < triangles; i++) {
    // positions
    let x = Math.random() * n - n2;
    let y = Math.random() * n - n2;
    let z = Math.random() * n - n2;
    let ax = x + Math.random() * d - d2;
    let ay = y + Math.random() * d - d2;
    let az = z + Math.random() * d - d2;
    let bx = x + Math.random() * d - d2;
    let by = y + Math.random() * d - d2;
    let bz = z + Math.random() * d - d2;
    let cx = x + Math.random() * d - d2;
    let cy = y + Math.random() * d - d2;
    let cz = z + Math.random() * d - d2;
    positions[k++] = ax;
    positions[k++] = ay;
    positions[k++] = az;
    positions[k++] = bx;
    positions[k++] = by;
    positions[k++] = bz;
    positions[k++] = cx;
    positions[k++] = cy;
    positions[k++] = cz;
    // flat face normals
    pA.set(ax, ay, az);
    pB.set(bx, by, bz);
    pC.set(cx, cy, cz);
    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab);
    cb.normalize();
    let nx = cb.x;
    let ny = cb.y;
    let nz = cb.z;
    normals[h++] = nx * 32767;
    normals[h++] = ny * 32767;
    normals[h++] = nz * 32767;
    normals[h++] = nx * 32767;
    normals[h++] = ny * 32767;
    normals[h++] = nz * 32767;
    normals[h++] = nx * 32767;
    normals[h++] = ny * 32767;
    normals[h++] = nz * 32767;
  }
}

function geometry_upadte() {
  let positions = geometry.attributes.position.array;
  let normals = geometry.attributes.normal.array;

  positions_normals_upadte(positions, normals);
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
}

function scene_update(scene) {
  water_update(U, V, S);
  geometry_upadte();
}