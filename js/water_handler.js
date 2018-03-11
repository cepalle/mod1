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
