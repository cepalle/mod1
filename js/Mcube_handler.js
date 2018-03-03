let t = 1;
let c = 1;
let h = 1;
let s = 0.99;

function Mcube_water_update(Mcube_water, U, V) {
  for (i = 0; i < Mcube_water.length; i++) {
    for (j = 0; j < Mcube_water[i].length; j++) {
      let tot_h = 0;
      tot_h += (i - 1 >= 0 ? U[i - 1][j] : U[i][j]);
      tot_h += (i + 1 < U.length ? U[i + 1][j] : U[i][j]);
      tot_h += (j - 1 >= 0 ? U[i][j - 1] : U[i][j]);
      tot_h += (j + 1 < U[i].length ? U[i][j + 1] : U[i][j]);
      let f = (tot_h - 4 * U[i][j]) * c * c / (h * h)
      V[i][j] += f * t;
      V[i][j] *= s;
      Mcube_water[i][j].position.y += V[i][j] * t;
      Mcube_water[i][j].updateMatrix();
    }
  }
  for (i = 0; i < Mcube_water.length; i++) {
    for (j = 0; j < Mcube_water[i].length; j++) {
      U[i][j] = Mcube_water[i][j].position.y;
    }
  }
}