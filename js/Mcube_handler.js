let t = 1;
let c = 1;
let h = 1;
let s = 0.99;

function water_update(U, V, S) {
  let U_cp = [];
  for (i = 0; i < U.length; i++) {
    U_cp.push([]);
    for (j = 0; j < U[i].length; j++) {
      let tot_h = 0;
      tot_h += (i - 1 >= 0 ? U[i - 1][j] : U[i][j]);
      tot_h += (i + 1 < U.length ? U[i + 1][j] : U[i][j]);
      tot_h += (j - 1 >= 0 ? U[i][j - 1] : U[i][j]);
      tot_h += (j + 1 < U[i].length ? U[i][j + 1] : U[i][j]);
      let f = (tot_h - 4 * U[i][j]) * c * c / (h * h)
      V[i][j] += f * t;
      V[i][j] *= s;
      U_cp[i][j] = U[i][j] + V[i][j] * t;
    }
  }
  for (i = 0; i < U.length; i++) {
    for (j = 0; j < U[i].length; j++) {
      U[i][j] = U_cp[i][j];
    }
  }
}