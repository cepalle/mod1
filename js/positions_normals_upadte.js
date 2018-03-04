const pA = new THREE.Vector3();
const pB = new THREE.Vector3();
const pC = new THREE.Vector3();
const cb = new THREE.Vector3();
const ab = new THREE.Vector3();

function add_pos(positions, k, lp) {
  for (let i = 0; i < lp.length; i++) {
    positions[k++] = lp[i][0];
    positions[k++] = lp[i][1];
    positions[k++] = lp[i][2];
  }
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
}

function positions_normals_upadte(positions, normals, U) {
  let k = 0;
  let h = 0;
  for (let i = 0; i < scene_res - 1; i++) {
    for (let j = 0; j < scene_res - 1; j++) {
      let a = [i, U[i][j], j];
      let b = [i + 1, U[i + 1][j], j];
      let c = [i, U[i][j + 1], j + 1];
      let d = [i + 1, U[i + 1][j + 1], j + 1];

      // positions
      add_pos(positions, k, [a, d, b]);
      k += 9;
      add_pos(positions, k, [a, d, c]);
      k += 9;

      // flat face normals
      add_norm(normals, h, [a, d, b]);
      h += 9;
      add_norm(normals, h, [a, d, c]);
      h += 9;
    }
  }
}