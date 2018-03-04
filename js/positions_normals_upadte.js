let n = 800;
let n2 = n / 2; // triangles spread in the cube
let d = 12;
let d2 = d / 2; // individual triangle size
let pA = new THREE.Vector3();
let pB = new THREE.Vector3();
let pC = new THREE.Vector3();
let cb = new THREE.Vector3();
let ab = new THREE.Vector3();

function positions_normals_upadte(positions, normals, U) {
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