function set_S(txt) {
    S_lp = txt.split("\n").map(test_split =>
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
            for (let k = 0; k < S_lp.length; k++) {
                let S_lpkx = S_lp[k][0] * g_gui_params.resolution;
                let S_lpky = S_lp[k][1] * g_gui_params.resolution;
                let S_lpkz = S_lp[k][2] * g_gui_params.resolution;
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
                S[i][j] = score / deno;
            }
        }
    }
}

function init_UVS() {
    while (U.length) {
        U.pop();
    }
    while (U_cp.length) {
        U_cp.pop();
    }
    while (V.length) {
        V.pop();
    }
    while (S.length) {
        S.pop();
    }

    for (i = 0; i < g_gui_params.resolution; i++) {
        U.push([]);
        U_cp.push([]);
        V.push([]);
        S.push([]);
        for (j = 0; j < g_gui_params.resolution; j++) {
            U[i][j] = -1;
            U_cp[i][j] = -1;
            V[i][j] = 0;
            S[i][j] = 0;
        }
    }
    init_S();
}
