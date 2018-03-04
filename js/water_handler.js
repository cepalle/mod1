const t = 1;
const c = 1;
const h = 1;
const s = 0.90;
const v_min = -2;
const v_max = 2;

function cal_hu(i, j, ii, jj, U, S) {
  if (ii < 0 || ii >= scene_sqaure || jj < 0 || jj >= scene_sqaure) {
    return U[i][j];
  }
  if (S[ii][jj] > U[ii][jj]) {
    if (S[ii][jj] > U[i][j]) {
      return U[i][j];
    }
    return S[ii][jj];
  }
  return U[ii][jj];
}

function cal_hs(i, j, ii, jj, U, S) {
  if (ii < 0 || ii >= scene_sqaure || jj < 0 || jj >= scene_sqaure) {
    return S[i][j];
  }
  if (S[ii][jj] > U[ii][jj]) {
    return S[i][j];
  }
  if (U[ii][jj] > S[i][j]) {
    return U[ii][jj];
  }
  return S[i][j];
}

function cal_v(v_old, f) {
  v_old += f * t;
  v_old *= s;
  v_old = (v_old < v_min ? v_min : v_old);
  v_old = (v_old > v_max ? v_max : v_old);
  return v_old;
}

function water_update(U, V, S) {
  const U_cp = [];
  for (i = 0; i < scene_sqaure; i++) {
    U_cp.push([]);
    for (j = 0; j < scene_sqaure; j++) {
      if (U[i][j] > S[i][j]) {
        let tot_h = 0;
        tot_h += cal_hu(i, j, i - 1, j, U, S);
        tot_h += cal_hu(i, j, i + 1, j, U, S);
        tot_h += cal_hu(i, j, i, j - 1, U, S);
        tot_h += cal_hu(i, j, i, j + 1, U, S);
        let f = (tot_h - 4 * U[i][j]) * c * c / (h * h)
        V[i][j] = cal_v(V[i][j], f);
        U_cp[i][j] = U[i][j] + V[i][j] * t;
      } else {
        V[i][j] = 0;

        let tot_h = 0;
        tot_h += cal_hs(i, j, i - 1, j, U, S);
        tot_h += cal_hs(i, j, i + 1, j, U, S);
        tot_h += cal_hs(i, j, i, j - 1, U, S);
        tot_h += cal_hs(i, j, i, j + 1, U, S);
        let f = (tot_h - 4 * S[i][j]) * c * c / (h * h)
        V[i][j] = cal_v(V[i][j], f);
        if (V[i][j] > 0.01) {
          U_cp[i][j] = S[i][j] + V[i][j] * t;
        } else {
          V[i][j] = 0;
          U_cp[i][j] = -1;
        }
      }
    }
  }
  for (i = 0; i < scene_sqaure; i++) {
    for (j = 0; j < scene_sqaure; j++) {
      U[i][j] = U_cp[i][j];
    }
  }
}