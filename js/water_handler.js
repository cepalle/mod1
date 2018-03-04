function cal_dvu(i, j, ii, jj, U, S) {
  if (ii < 0 || ii >= scene_res || jj < 0 || jj >= scene_res) {
    return 0;
  }
  if (S[ii][jj] > U[ii][jj]) {
    if (S[ii][jj] > U[i][j]) {
      return 0;
    }
    return S[ii][jj] - U[i][j];
  }
  let dv1 = U[ii][jj] - U[i][j];
  let dv2 = U[ii][jj] - S[ii][jj];
  return (dv1 > dv2 ? dv2 : dv1);
}

function cal_dvs(i, j, ii, jj, U, S) {
  if (ii < 0 || ii >= scene_res || jj < 0 || jj >= scene_res) {
    return 0;
  }
  if (S[ii][jj] > U[ii][jj]) {
    return 0;
  }
  if (U[ii][jj] > S[i][j]) {
    let dv1 = U[ii][jj] - S[i][j];
    let dv2 = U[ii][jj] - S[ii][jj];
    return (dv1 > dv2 ? dv1 : dv1); // better with dv1
  }
  return 0;
}

function cal_v(v_old, dv) {
  v_old += dv;
  v_old *= s;
  v_old = (v_old < v_min ? v_min : v_old);
  v_old = (v_old > v_max ? v_max : v_old);
  return v_old;
}

function water_update(U, V, S) {
  const U_cp = [];
  for (i = 0; i < scene_res; i++) {
    U_cp.push([]);
    for (j = 0; j < scene_res; j++) {
      let dv = 0;
      if (U[i][j] > S[i][j]) {
        dv += cal_dvu(i, j, i - 1, j, U, S) / 4;
        dv += cal_dvu(i, j, i + 1, j, U, S) / 4;
        dv += cal_dvu(i, j, i, j - 1, U, S) / 4;
        dv += cal_dvu(i, j, i, j + 1, U, S) / 4;
        V[i][j] = cal_v(V[i][j], dv);
        U_cp[i][j] = U[i][j] + V[i][j];
      } else {
        dv += cal_dvs(i, j, i - 1, j, U, S) / 4;
        dv += cal_dvs(i, j, i + 1, j, U, S) / 4;
        dv += cal_dvs(i, j, i, j - 1, U, S) / 4;
        dv += cal_dvs(i, j, i, j + 1, U, S) / 4;
        V[i][j] = cal_v(V[i][j], dv);
        if (V[i][j] > 0.01) {
          U_cp[i][j] = S[i][j] + V[i][j];
        } else {
          U_cp[i][j] = -1;
        }
      }
    }
  }
  for (i = 0; i < scene_res; i++) {
    for (j = 0; j < scene_res; j++) {
      U[i][j] = U_cp[i][j];
    }
  }
}