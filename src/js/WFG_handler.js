import {gui_params} from "./gui_handler";


const WFG_W = [];            // Water description
const WFG_G = [];            // Ground description
const WFG_F = [];            // Flot description
const WFG_G_lp = [
    [0.2, 0.1, 0.2],
    [0.4, 0.0, 0.2],
    [0.6, 0.1, 0.2],
    [0.8, 0.01, 0.2],
    [0.2, 0.025, 0.4],
    [0.4, 0.1, 0.4],
    [0.6, 0.01, 0.4],
    [0.8, 0.1, 0.4],
    [0.2, 0.1, 0.6],
    [0.4, 0.0, 0.6],
    [0.6, 0.1, 0.6],
    [0.8, 0.01, 0.6],
];         // list of points WFG_G description

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
            WFG_F[i][j] *= (1 - 0.02);
            if (WFG_G[i][j] > WFG_W[i][j] && WFG_F[i][j] > 0.001) {
                WFG_W[i][j] = WFG_G[i][j];
            }
            WFG_W[i][j] += WFG_F[i][j];
            if (WFG_W[i][j] < WFG_G[i][j]) {
                WFG_W[i][j] = -1;
            }
        }
    }
}

function wave_update() {
    for (let i = 0; i < gui_params.resolution; i++) {
        WFG_W[0][i] = gui_params.wave_height * gui_params.resolution;
        WFG_F[0][i] = 0;
    }
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

function rain_update() {
    for (let i = 0; i < gui_params.resolution; i++) {
        for (let j = 0; j < gui_params.resolution; j++) {
            if (Math.random() < gui_params.rain_speed / 300) {
                if (WFG_W[i][j] > WFG_G[i][j]) {
                    WFG_W[i][j] += 3;
                } /*else {
                    WFG_W[i][j] = WFG_G[i][j] + 0.1;
                    WFG_F[i][j] = 0
                }*/
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
                if (WFG_W[i][j] < WFG_G[i][j]) {
                    WFG_W[i][j] = -1;
                    WFG_F[i][j] = 0;
                }
            }
        }
    }
}

export {WFG_W, WFG_G, WFG_G_lp, WFG_init, WFG_W_update};
