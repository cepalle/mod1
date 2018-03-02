let c = 1;
let h = 1;
let t = 1;

function Mcube_water_handler(Mcube_water, U, V) {
  for (i = 0; i < Mcube_water.length; i++) {
    for (j = 0; j < Mcube_water[i].length; j++) {
      let tot_h = 0; // change bordr?
      tot_h += (i - 1 >= 0 ? U[i - 1][j] : U[i][j]);
      tot_h += (i + 1 < U.length ? U[i + 1][j] : U[i][j]);
      tot_h += (j - 1 >= 0 ? U[i][j - 1] : U[i][j]);
      tot_h += (j + 1 < U[i].length ? U[i][j + 1] : U[i][j]);
      V[i][j] += c ^ 2(tot_h - 4 * U[i][j]);
      if (V[i][j] < -1) {
        V[i][j] = -1;
      } else if (V[i][j] > 1) {
        V[i][j] = 1;
      }
      Mcube_water[i][j].position.y += V[i][j];
    }
  }
  for (i = 0; i < Mcube_water.length; i++) {
    for (j = 0; j < Mcube_water[i].length; j++) {
      U[i][j] = Mcube_water[i][j].position.y;
    }
  }
}