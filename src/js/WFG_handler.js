import {renderer_need_update} from "./renderer_handler";
import {gui_params} from "./gui_handler";


const WFG_W = [];            // Water description
const WFG_W_cp = [];
const WFG_G = [];            // Ground description
const WFG_F = [];                 // Flot description
const WFG_G_lp = [];         // list of points WFG_G description

function WFG_txt_to_G_lp(txt) {
    while (WFG_G_lp.length)
        WFG_G_lp.pop();

    WFG_G_lp.push(...(txt.split("\n").map(test_split =>
        test_split.split(' ').map(flt_txt =>
            parseFloat(flt_txt)
        ).map(flt => {
            if (flt < 0) {
                return 0;
            } else if (flt > 1) {
                return 1;
            } else {
                return flt;
            }
        })
    ).filter(coord => coord.length === 3)));
    renderer_need_update.value = true;
}

function WFG_textarea_to_G_lp() {
    let text = document.getElementById("input_G_lp").value;
    WFG_txt_to_G_lp(text);
}

function WFG_init() {
    while (WFG_W.length)
        WFG_W.pop();
    while (WFG_W_cp.length)
        WFG_W_cp.pop();
    while (WFG_G.length)
        WFG_G.pop();
    while (WFG_F.length)
        WFG_F.pop();

    for (let i = 0; i < gui_params.resolution; i++) {
        WFG_W.push([]);
        WFG_G.push([]);
        WFG_W_cp.push([]);
        WFG_F.push([]);
        for (let j = 0; j < gui_params.resolution; j++) {
            WFG_W[i][j] = -1;
            WFG_G[i][j] = 0;
            WFG_W_cp[i][j] = -1;
            WFG_F[i][j] = 0;
        }
    }
    G_lp_to_G();
}

function WFG_W_update() {
    if (gui_params.wave) {
        wave_update();
    }
    if (gui_params.rain) {
        rain_update();
    }
    if (gui_params.rising) {
        rising_update();
    }
    if (gui_params.leak) {
        leak_update();
    }

    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            let dv = 0;
            if (WFG_W[i][j] > WFG_G[i][j]) {
                dv += cal_dvu(i, j, i - 1, j, WFG_W, WFG_G) / 4;
                dv += cal_dvu(i, j, i + 1, j, WFG_W, WFG_G) / 4;
                dv += cal_dvu(i, j, i, j - 1, WFG_W, WFG_G) / 4;
                dv += cal_dvu(i, j, i, j + 1, WFG_W, WFG_G) / 4;
                WFG_F[i][j] = cal_v(WFG_F[i][j], dv);
                WFG_W_cp[i][j] = WFG_W[i][j] + WFG_F[i][j];
            } else {
                dv += cal_dvs(i, j, i - 1, j, WFG_W, WFG_G) / 4;
                dv += cal_dvs(i, j, i + 1, j, WFG_W, WFG_G) / 4;
                dv += cal_dvs(i, j, i, j - 1, WFG_W, WFG_G) / 4;
                dv += cal_dvs(i, j, i, j + 1, WFG_W, WFG_G) / 4;
                WFG_F[i][j] = cal_v(WFG_F[i][j], dv);
                if (WFG_F[i][j] > 0.01) {
                    WFG_W_cp[i][j] = WFG_G[i][j] + WFG_F[i][j];
                } else {
                    WFG_W_cp[i][j] = -1;
                }
            }
        }
    }
    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            WFG_W[i][j] = WFG_W_cp[i][j];
        }
    }
}


function cal_coef(a) {
    return 1 / (a * a * a);
}

function G_lp_to_G() {
    for (let i = 1; i < gui_params.resolution - 1; i++) {
        for (let j = 1; j < gui_params.resolution - 1; j++) {
            let deno = 0;
            let score = 0;
            deno += cal_coef(i);
            deno += cal_coef(gui_params.resolution - i);
            deno += cal_coef(j);
            deno += cal_coef(gui_params.resolution - j);
            for (let k = 0; k < WFG_G_lp.length; k++) {
                let S_lpkx = WFG_G_lp[k][0] * gui_params.resolution;
                let S_lpky = WFG_G_lp[k][1] * gui_params.resolution;
                let S_lpkz = WFG_G_lp[k][2] * gui_params.resolution;
                let dx = i - S_lpkx;
                let dz = j - S_lpkz;
                let dist = Math.sqrt(dx * dx + dz * dz);
                if (dist < 1) {
                    score = S_lpky;
                    deno = 1;
                    break;
                }
                let a = cal_coef(dist);
                deno += a;
                score += S_lpky * a;
            }
            if (deno > 0) {
                WFG_G[i][j] = score / deno;
            }
        }
    }
}

function wave_update() {
    for (let i = 0; i < gui_params.resolution; i++) {
        WFG_W[i][gui_params.resolution - 1] = gui_params.wave_height * gui_params.resolution;
        WFG_F[i][gui_params.resolution - 1] = 0;
    }
}

function rain_update() {
    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            if (Math.random() < gui_params.rain_speed) {
                if (WFG_W[i][j] > WFG_G[i][j]) {
                    WFG_W[i][j] += 0.1;
                } else {
                    WFG_W[i][j] = WFG_G[i][j] + 0.1;
                }
            }
        }
    }
}

function rising_update() {
    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            if (i === 0 || j === 0 ||
                    i === gui_params.resolution - 1 || j === gui_params.resolution - 1) {
                if (WFG_W[i][j] < WFG_G[i][j]) {
                  WFG_W[i][j] = WFG_G[i][j]
                }
                WFG_W[i][j] += gui_params.rising_speed;
                WFG_F[i][j] = 0;
            }
        }
    }
}

function leak_update() {
    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            if (WFG_W[i][j] > WFG_G[i][j]) {
                WFG_W[i][j] -= gui_params.leak_speed;
                WFG_W[i][j] = (WFG_W[i][j] > WFG_G[i][j] ? WFG_W[i][j] : -1);
            }
        }
    }
}

function cal_dvu(i, j, ii, jj) {
    if (ii < 0 || ii >= gui_params.resolution || jj < 0 || jj >= gui_params.resolution) {
        return 0;
    }
    if (WFG_G[ii][jj] > WFG_W[ii][jj]) {
        if (WFG_G[ii][jj] > WFG_W[i][j]) {
            return 0;
        }
        return WFG_G[ii][jj] - WFG_W[i][j];
    }
    let dv1 = WFG_W[ii][jj] - WFG_W[i][j];
    let dv2 = WFG_W[ii][jj] - WFG_G[ii][jj];
    return (dv1 > dv2 ? dv2 : dv1);
}

function cal_dvs(i, j, ii, jj) {
    if (ii < 0 || ii >= gui_params.resolution || jj < 0 || jj >= gui_params.resolution) {
        return 0;
    }
    if (WFG_G[ii][jj] > WFG_W[ii][jj]) {
        return 0;
    }
    if (WFG_W[ii][jj] > WFG_G[i][j]) {
        return WFG_W[ii][jj] - WFG_G[i][j];
    }
    return 0;
}

function cal_v(v_old, dv) {
    v_old += dv;
    v_old *= 0.99;
    return v_old;
}

export {WFG_W, WFG_G, WFG_G_lp, WFG_txt_to_G_lp, WFG_textarea_to_G_lp, WFG_init, WFG_W_update};
