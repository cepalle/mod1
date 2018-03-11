// EXTERN //

let g_WFG_W;            // Water description
let g_WFG_G;            // Ground description
let g_WFG_G_lp = [];    // list of points g_WFG_G description

function WFG_txt_to_G_lp(txt) {
    g_WFG_G_lp = txt.split("\n").map(test_split =>
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
    ).filter(coord => coord.length === 3);
    g_renderer_need_update = true;
}

function WFG_textarea_to_G_lp() {
    let text = document.getElementById("input_G_lp").value;
    WFG_txt_to_G_lp(text);
}

function WFG_init() {
    g_WFG_W = [];
    g_WFG_G = [];
    W_cp = [];
    F = [];

    for (let i = 0; i < g_gui_params.resolution; i++) {
        g_WFG_W.push([]);
        g_WFG_G.push([]);
        W_cp.push([]);
        F.push([]);
        for (let j = 0; j < g_gui_params.resolution; j++) {
            g_WFG_W[i][j] = -1;
            g_WFG_G[i][j] = 0;
            W_cp[i][j] = -1;
            F[i][j] = 0;
        }
    }
    G_lp_to_G();
}

function WFG_W_update() {
    if (g_gui_params.wave) {
        wave_update();
    }
    if (g_gui_params.rain) {
        rain_update();
    }
    if (g_gui_params.rising) {
        rising_update();
    }
    if (g_gui_params.leak) {
        leak_update();
    }

    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            let dv = 0;
            if (g_WFG_W[i][j] > g_WFG_G[i][j]) {
                dv += cal_dvu(i, j, i - 1, j, g_WFG_W, g_WFG_G) / 4;
                dv += cal_dvu(i, j, i + 1, j, g_WFG_W, g_WFG_G) / 4;
                dv += cal_dvu(i, j, i, j - 1, g_WFG_W, g_WFG_G) / 4;
                dv += cal_dvu(i, j, i, j + 1, g_WFG_W, g_WFG_G) / 4;
                F[i][j] = cal_v(F[i][j], dv);
                W_cp[i][j] = g_WFG_W[i][j] + F[i][j];
            } else {
                dv += cal_dvs(i, j, i - 1, j, g_WFG_W, g_WFG_G) / 4;
                dv += cal_dvs(i, j, i + 1, j, g_WFG_W, g_WFG_G) / 4;
                dv += cal_dvs(i, j, i, j - 1, g_WFG_W, g_WFG_G) / 4;
                dv += cal_dvs(i, j, i, j + 1, g_WFG_W, g_WFG_G) / 4;
                F[i][j] = cal_v(F[i][j], dv);
                if (F[i][j] > 0.01) {
                    W_cp[i][j] = g_WFG_G[i][j] + F[i][j];
                } else {
                    W_cp[i][j] = -1;
                }
            }
        }
    }
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            g_WFG_W[i][j] = W_cp[i][j];
        }
    }
}

// INTERN //

let F;                  // Flot description
let W_cp;

function cal_coef(a) {
    return 1 / (a * a * a);
}

function G_lp_to_G() {
    for (let i = 1; i < g_gui_params.resolution - 1; i++) {
        for (let j = 1; j < g_gui_params.resolution - 1; j++) {
            let deno = 0;
            let score = 0;
            deno += cal_coef(i);
            deno += cal_coef(g_gui_params.resolution - i);
            deno += cal_coef(j);
            deno += cal_coef(g_gui_params.resolution - j);
            for (let k = 0; k < g_WFG_G_lp.length; k++) {
                let S_lpkx = g_WFG_G_lp[k][0] * g_gui_params.resolution;
                let S_lpky = g_WFG_G_lp[k][1] * g_gui_params.resolution;
                let S_lpkz = g_WFG_G_lp[k][2] * g_gui_params.resolution;
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
                g_WFG_G[i][j] = score / deno;
            }
        }
    }
}


function wave_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        g_WFG_W[i][g_gui_params.resolution - 1] = g_gui_params.wave_height * g_gui_params.resolution;
        F[i][g_gui_params.resolution - 1] = 0;
    }
}

function rain_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (Math.random() < g_gui_params.rain_speed) {
                if (g_WFG_W[i][j] > g_WFG_G[i][j]) {
                    g_WFG_W[i][j] += 0.1;
                } else {
                    g_WFG_W[i][j] = g_WFG_G[i][j] + 0.1;
                }
            }
        }
    }
}

function rising_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (g_WFG_W[i][j] > g_WFG_G[i][j]) {
                g_WFG_W[i][j] += g_gui_params.rising_speed;
            } else if (g_WFG_G[i][j] < 2 && (i === 0 || j === 0 ||
                    i === g_gui_params.resolution - 1 || j === g_gui_params.resolution - 1)) {
                g_WFG_W[i][j] = 2;
            }
        }
    }
}

function leak_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (g_WFG_W[i][j] > g_WFG_G[i][j]) {
                g_WFG_W[i][j] -= g_gui_params.leak_speed;
                g_WFG_W[i][j] = (g_WFG_W[i][j] > g_WFG_G[i][j] ? g_WFG_W[i][j] : -1);
            }
        }
    }
}

function cal_dvu(i, j, ii, jj) {
    if (ii < 0 || ii >= g_gui_params.resolution || jj < 0 || jj >= g_gui_params.resolution) {
        return 0;
    }
    if (g_WFG_G[ii][jj] > g_WFG_W[ii][jj]) {
        if (g_WFG_G[ii][jj] > g_WFG_W[i][j]) {
            return 0;
        }
        return g_WFG_G[ii][jj] - g_WFG_W[i][j];
    }
    let dv1 = g_WFG_W[ii][jj] - g_WFG_W[i][j];
    let dv2 = g_WFG_W[ii][jj] - g_WFG_G[ii][jj];
    return (dv1 > dv2 ? dv2 : dv1);
}

function cal_dvs(i, j, ii, jj) {
    if (ii < 0 || ii >= g_gui_params.resolution || jj < 0 || jj >= g_gui_params.resolution) {
        return 0;
    }
    if (g_WFG_G[ii][jj] > g_WFG_W[ii][jj]) {
        return 0;
    }
    if (g_WFG_W[ii][jj] > g_WFG_G[i][j]) {
        return g_WFG_W[ii][jj] - g_WFG_G[i][j];
    }
    return 0;
}

function cal_v(v_old, dv) {
    v_old += dv;
    v_old *= 0.99;
    return v_old;
}
