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


  var triangles = 500000;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var normals = [];
  var colors = [];
  var color = new THREE.Color();
  var n = 800,
    n2 = n / 2; // triangles spread in the cube
  var d = 12,
    d2 = d / 2; // individual triangle size
  var pA = new THREE.Vector3();
  var pB = new THREE.Vector3();
  var pC = new THREE.Vector3();
  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();
  for (var i = 0; i < triangles; i++) {
    // positions
    var x = Math.random() * n - n2;
    var y = Math.random() * n - n2;
    var z = Math.random() * n - n2;
    var ax = x + Math.random() * d - d2;
    var ay = y + Math.random() * d - d2;
    var az = z + Math.random() * d - d2;
    var bx = x + Math.random() * d - d2;
    var by = y + Math.random() * d - d2;
    var bz = z + Math.random() * d - d2;
    var cx = x + Math.random() * d - d2;
    var cy = y + Math.random() * d - d2;
    var cz = z + Math.random() * d - d2;
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
    var nx = cb.x;
    var ny = cb.y;
    var nz = cb.z;
    normals.push(nx * 32767, ny * 32767, nz * 32767);
    normals.push(nx * 32767, ny * 32767, nz * 32767);
    normals.push(nx * 32767, ny * 32767, nz * 32767);
    // colors
    var vx = (x / n) + 0.5;
    var vy = (y / n) + 0.5;
    var vz = (z / n) + 0.5;
    color.setRGB(vx, vy, vz);
    colors.push(color.r * 255, color.g * 255, color.b * 255);
    colors.push(color.r * 255, color.g * 255, color.b * 255);
    colors.push(color.r * 255, color.g * 255, color.b * 255);
  }
  var positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  var normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
  var colorAttribute = new THREE.Uint8BufferAttribute(colors, 3);
  normalAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
  colorAttribute.normalized = true;
  geometry.addAttribute('position', positionAttribute);
  geometry.addAttribute('normal', normalAttribute);
  geometry.addAttribute('color', colorAttribute);
  geometry.computeBoundingSphere();
  var material = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    vertexColors: THREE.VertexColors
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