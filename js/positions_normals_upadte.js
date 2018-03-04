const n = scene_sqaure;
const n2 = n / 2; // triangles spread in the cube
const d = scene_sqaure / 10;
const d2 = d / 2; // individual triangle size

const pA = new THREE.Vector3();
const pB = new THREE.Vector3();
const pC = new THREE.Vector3();
const cb = new THREE.Vector3();
const ab = new THREE.Vector3();

function positions_normals_upadte(positions, normals, U) {
  let s1;
  let s2;
  let s3;
  let s4;
  let k = 0;
  let h = 0;
  for (let i = 0; i < scene_sqaure - 1; i++) {
    for (let j = 0; j < scene_sqaure - 1; j++) {
      let ax = i;
      let az = j;
      let ay = U[ax][az];

      let bx = i + 1;
      let bz = j;
      let by = U[bx][bz];

      let cx = i;
      let cz = j + 1;
      let cy = U[cx][cz];

      // positions
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



}