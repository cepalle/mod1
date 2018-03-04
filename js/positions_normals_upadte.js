const n = scene_sqaure;
const n2 = n / 2; // triangles spread in the cube
const d = scene_sqaure / 10;
const d2 = d / 2; // individual triangle size

const pA = new THREE.Vector3();
const pB = new THREE.Vector3();
const pC = new THREE.Vector3();
const cb = new THREE.Vector3();
const ab = new THREE.Vector3();

function add_pos(positions, k, lp) {
  let tot_add = 0;
  for (let i = 0; i < lp.length; i++) {
    positions[k + tot_add++] = lp[i][0];
    positions[k + tot_add++] = lp[i][1];
    positions[k + tot_add++] = lp[i][2];
  }
  return tot_add;
}

function add_norm(normals, h, lp) {
  pA.set(lp[0][0], lp[0][1], lp[0][2]);
  pB.set(lp[1][0], lp[1][1], lp[1][2]);
  pC.set(lp[2][0], lp[2][1], lp[2][2]);
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
  return 9;
}

function positions_normals_upadte(positions, normals, U) {
  let k = 0;
  let h = 0;
  for (let i = 0; i < scene_sqaure - 1; i++) {
    for (let j = 0; j < scene_sqaure - 1; j++) {
      let a = [i, U[i][j], j];
      let b = [i + 1, U[i + 1][j], j];
      let c = [i, U[i][j + 1], j + 1];
      let d = [i + 1, U[i + 1][j + 1], j + 1];

      // positions
      k += add_pos(positions, k, [a, d, b]);
      k += add_pos(positions, k, [a, d, c]);

      // flat face normals
      h += add_norm(normals, h, [a, d, b]);
      h += add_norm(normals, h, [a, d, c]);
    }
  }
}