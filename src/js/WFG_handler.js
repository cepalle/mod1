import {renderer_need_update} from "./renderer_handler";
import {gui_params} from "./gui_handler";


const WFG_W = [];            // Water description
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
    while (WFG_G.length)
        WFG_G.pop();
    while (WFG_F.length)
        WFG_F.pop();

    for (let i = 0; i < gui_params.resolution; i++) {
        WFG_W.push([]);
        WFG_G.push([]);
        WFG_F.push([]);
        for (let j = 0; j < gui_params.resolution; j++) {
            WFG_W[i][j] = -0.001;
            WFG_G[i][j] = 0;
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
            cal_dvw(i, j, i - 1, j);
            cal_dvw(i, j, i + 1, j);
            cal_dvw(i, j, i, j - 1);
            cal_dvw(i, j, i, j + 1);
        }
    }
    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            WFG_F[i][j] *= 0.99;
            if (WFG_G[i][j] > WFG_W[i][j] && WFG_F[i][j] > 0.001) {
                WFG_W[i][j] = WFG_G[i][j];
            }
            WFG_W[i][j] += WFG_F[i][j];
        }
    }
    W_ground_update();
}

function W_ground_update() {
    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            if (WFG_W[i][j] < WFG_G[i][j]) {
                WFG_W[i][j] = -1;
                WFG_F[i][j] = 0;
            }
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
            }
        }
    }
    W_ground_update();
}

function cal_dvw(i, j, ii, jj) {
    let df;
    if (ii < 0 || ii >= gui_params.resolution || jj < 0 || jj >= gui_params.resolution ||
        WFG_G[i][j] > WFG_W[i][j] ||
        WFG_G[ii][jj] > WFG_W[i][j] ||
        WFG_W[ii][jj] > WFG_W[i][j]) {
        return;
    }
    df = WFG_W[i][j] - Math.max(WFG_G[i][j], WFG_G[ii][jj], WFG_W[ii][jj]);
    WFG_F[ii][jj] += (df / 4);
    WFG_F[i][j] -= (df / 4);
}

export {WFG_W, WFG_G, WFG_G_lp, WFG_txt_to_G_lp, WFG_textarea_to_G_lp, WFG_init, WFG_W_update};
