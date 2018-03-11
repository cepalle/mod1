// Water, Flot, Groud matrice description
const g_W = [];
const g_W_cp = [];
const g_F = [];
const g_G = [];

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
    g_need_update = true;
}

function set_input_S() {
    let text = document.getElementById("input_S_lp").value;
    set_S(text);
}

function cal_coef(a) {
    return 1 / (a * a * a);
}

function init_S() {
    for (i = 1; i < g_gui_params.resolution - 1; i++) {
        for (j = 1; j < g_gui_params.resolution - 1; j++) {
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

function init_UVS() {
    while (g_W.length) {
        g_W.pop();
    }
    while (g_W_cp.length) {
        g_W_cp.pop();
    }
    while (g_F.length) {
        g_F.pop();
    }
    while (g_G.length) {
        g_G.pop();
    }

    for (i = 0; i < g_gui_params.resolution; i++) {
        g_W.push([]);
        g_W_cp.push([]);
        g_F.push([]);
        g_G.push([]);
        for (j = 0; j < g_gui_params.resolution; j++) {
            g_W[i][j] = -1;
            g_W_cp[i][j] = -1;
            g_F[i][j] = 0;
            g_G[i][j] = 0;
        }
    }
    init_S();
}
