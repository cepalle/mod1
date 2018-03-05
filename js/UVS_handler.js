function init_S() {
  for (let k = 0; k < lp.length; k++) {
    lp[k][0] *= scene_res;
    lp[k][1] *= scene_res;
    lp[k][2] *= scene_res;

    let i_min = (lp[k][0] <= scene_res / 2 ? 0 : lp[k][0] * 2 - scene_res);
    let i_max = (lp[k][0] >= scene_res / 2 ? scene_res : lp[k][0] * 2);
    let j_min = (lp[k][2] <= scene_res / 2 ? 0 : lp[k][2] * 2 - scene_res);
    let j_max = (lp[k][2] >= scene_res / 2 ? scene_res : lp[k][2] * 2);

    for (i = 0; i < scene_res; i++) {
      for (j = 0; j < scene_res; j++) {
        if (i > i_min && i < i_max && j > j_min && j < j_max) {
          let k1 = 0;
          let k2 = 0;
          let i_eq = i - i_min;
          let j_eq = j - j_min;

          lpk0_ep = (i_max - i_min) / 2;
          k1 = (1 - Math.cos((i_eq / lpk0_ep) * PI)) / 2
          lpk2_ep = (j_max - j_min) / 2;
          k2 = (1 - Math.cos((j_eq / lpk2_ep) * PI)) / 2;

          let h = lp[k][1] * k2 * k1;
          S[i][j] = (S[i][j] > h ? S[i][j] : h);
        }
      }
    }
  }
}

function init_UVS() {
  while (U.length) {
    U.pop();
  }
  while (V.length) {
    V.pop();
  }
  while (S.length) {
    S.pop();
  }

  for (i = 0; i < scene_res; i++) {
    U.push([]);
    V.push([]);
    S.push([]);
    for (j = 0; j < scene_res; j++) {
      V[i][j] = 0;
      S[i][j] = 0;
      U[i][j] = -1;
    }
  }
  init_S();
}