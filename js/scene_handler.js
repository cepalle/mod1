const scene_sqaure = 250;

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
//let geometry = new THREE.BufferGeometry();

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


  let triangles = 500000;
  let geometry = new THREE.BufferGeometry();
  let positions = [];
  let normals = [];
  let colors = [];
  let color = new THREE.Color();
  let n = 800,
    n2 = n / 2; // triangles spread in the cube
  let d = 12,
    d2 = d / 2; // individual triangle size
  let pA = new THREE.Vector3();
  let pB = new THREE.Vector3();
  let pC = new THREE.Vector3();
  let cb = new THREE.Vector3();
  let ab = new THREE.Vector3();
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
    positions.push(ax, ay, az);
    positions.push(bx, by, bz);
    positions.push(cx, cy, cz);
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
    normals.push(nx * 32767, ny * 32767, nz * 32767);
    normals.push(nx * 32767, ny * 32767, nz * 32767);
    normals.push(nx * 32767, ny * 32767, nz * 32767);
  }
  var positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  var normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
  normalAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
  geometry.addAttribute('position', positionAttribute);
  geometry.addAttribute('normal', normalAttribute);
  geometry.computeBoundingSphere();





  var material = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide, // use full?
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function positions_upadte() {
  //let positions = geometry.attributes.position.array;
  //positions[17] = 2;
}

function scene_update(scene) {
  water_update(U, V, S);
  //positions_upadte();
  //geometry.attributes.position.needsUpdate = true;
}