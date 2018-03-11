let g_W;            // Water description
let g_W_cp;
let g_F;            // Flot description
let g_G;            // Ground description
let g_G_lp = [];    // list of points g_G description


function set_S(txt) {
    g_G_lp = txt.split("\n").map(test_split =>
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
    ).filter(coord => coord.length >= 3);
    g_renderer_need_update = true;
}

function set_input_S() {
    let text = document.getElementById("input_S_lp").value;
    set_S(text);
}

function cal_coef(a) {
    return 1 / (a * a * a);
}

function init_S() {
    for (let i = 1; i < g_gui_params.resolution - 1; i++) {
        for (let j = 1; j < g_gui_params.resolution - 1; j++) {
            let deno = 0;
            let score = 0;
            deno += cal_coef(i);
            deno += cal_coef(g_gui_params.resolution - i);
            deno += cal_coef(j);
            deno += cal_coef(g_gui_params.resolution - j);
            for (let k = 0; k < g_G_lp.length; k++) {
                let S_lpkx = g_G_lp[k][0] * g_gui_params.resolution;
                let S_lpky = g_G_lp[k][1] * g_gui_params.resolution;
                let S_lpkz = g_G_lp[k][2] * g_gui_params.resolution;
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
                g_G[i][j] = score / deno;
            }
        }
    }
}

function WFG_init() {
        g_W = [];
        g_W = [];
        g_F = [];
        g_G = [];

    for (let i = 0; i < g_gui_params.resolution; i++) {
        g_W.push([]);
        g_W_cp.push([]);
        g_F.push([]);
        g_G.push([]);
        for (let j = 0; j < g_gui_params.resolution; j++) {
            g_W[i][j] = -1;
            g_W_cp[i][j] = -1;
            g_F[i][j] = 0;
            g_G[i][j] = 0;
        }
    }
    init_S();
}

function wave_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        g_W[i][g_gui_params.resolution - 1] = g_gui_params.wave_height * g_gui_params.resolution;
        g_F[i][g_gui_params.resolution - 1] = 0;
    }
}

function rain_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (Math.random() < g_gui_params.rain_speed) {
                if (g_W[i][j] > g_G[i][j]) {
                    g_W[i][j] += 0.1;
                } else {
                    g_W[i][j] = g_G[i][j] + 0.1;
                }
            }
        }
    }
}

function rising_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (g_W[i][j] > g_G[i][j]) {
                g_W[i][j] += g_gui_params.rising_speed;
            } else if (g_G[i][j] < 2 && (i === 0 || j === 0 ||
                    i === g_gui_params.resolution - 1 || j === g_gui_params.resolution - 1)) {
                g_W[i][j] = 2;
            }
        }
    }
}

function leak_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (g_W[i][j] > g_G[i][j]) {
                g_W[i][j] -= g_gui_params.leak_speed;
                g_W[i][j] = (g_W[i][j] > g_G[i][j] ? g_W[i][j] : -1);
            }
        }
    }
}

function cal_dvu(i, j, ii, jj) {
    if (ii < 0 || ii >= g_gui_params.resolution || jj < 0 || jj >= g_gui_params.resolution) {
        return 0;
    }
    if (g_G[ii][jj] > g_W[ii][jj]) {
        if (g_G[ii][jj] > g_W[i][j]) {
            return 0;
        }
        return g_G[ii][jj] - g_W[i][j];
    }
    let dv1 = g_W[ii][jj] - g_W[i][j];
    let dv2 = g_W[ii][jj] - g_G[ii][jj];
    return (dv1 > dv2 ? dv2 : dv1);
}

function cal_dvs(i, j, ii, jj) {
    if (ii < 0 || ii >= g_gui_params.resolution || jj < 0 || jj >= g_gui_params.resolution) {
        return 0;
    }
    if (g_G[ii][jj] > g_W[ii][jj]) {
        return 0;
    }
    if (g_W[ii][jj] > g_G[i][j]) {
        /*
        let dv1 = g_W[ii][jj] - g_G[i][j];
        let dv2 = g_W[ii][jj] - g_G[ii][jj];
        return (dv1 > dv2 ? dv2 : dv1);
        */
        return g_W[ii][jj] - g_G[i][j];
    }
    return 0;
}

function cal_v(v_old, dv) {
    v_old += dv;
    v_old *= 0.99;
    return v_old;
}

function water_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            let dv = 0;
            if (g_W[i][j] > g_G[i][j]) {
                dv += cal_dvu(i, j, i - 1, j, g_W, g_G) / 4;
                dv += cal_dvu(i, j, i + 1, j, g_W, g_G) / 4;
                dv += cal_dvu(i, j, i, j - 1, g_W, g_G) / 4;
                dv += cal_dvu(i, j, i, j + 1, g_W, g_G) / 4;
                g_F[i][j] = cal_v(g_F[i][j], dv);
                g_W_cp[i][j] = g_W[i][j] + g_F[i][j];
            } else {
                dv += cal_dvs(i, j, i - 1, j, g_W, g_G) / 4;
                dv += cal_dvs(i, j, i + 1, j, g_W, g_G) / 4;
                dv += cal_dvs(i, j, i, j - 1, g_W, g_G) / 4;
                dv += cal_dvs(i, j, i, j + 1, g_W, g_G) / 4;
                g_F[i][j] = cal_v(g_F[i][j], dv);
                if (g_F[i][j] > 0.01) {
                    g_W_cp[i][j] = g_G[i][j] + g_F[i][j];
                } else {
                    g_W_cp[i][j] = -1;
                }
            }
        }
    }
    for (i = 0; i < g_gui_params.resolution; i++) {
        for (j = 0; j < g_gui_params.resolution; j++) {
            g_W[i][j] = g_W_cp[i][j];
        }
    }
}
