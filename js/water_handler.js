function wave_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        U[i][g_gui_params.resolution - 1] = g_gui_params.wave_height * g_gui_params.resolution;
        V[i][g_gui_params.resolution - 1] = 0;
    }
}

function rain_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (Math.random() < g_gui_params.rain_speed) {
                if (U[i][j] > S[i][j]) {
                    U[i][j] += 0.1;
                } else {
                    U[i][j] = S[i][j] + 0.1;
                }
            }
        }
    }
}

function rising_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (U[i][j] > S[i][j]) {
                U[i][j] += g_gui_params.rising_speed;
            } else if (S[i][j] < 2 && (i === 0 || j === 0 ||
                    i === g_gui_params.resolution - 1 || j === g_gui_params.resolution - 1)) {
                U[i][j] = 2;
            }
        }
    }
}

function leak_update() {
    for (let i = 0; i < g_gui_params.resolution; i++) {
        for (let j = 0; j < g_gui_params.resolution; j++) {
            if (U[i][j] > S[i][j]) {
                U[i][j] -= g_gui_params.leak_speed;
                U[i][j] = (U[i][j] > S[i][j] ? U[i][j] : -1);
            }
        }
    }
}

function cal_dvu(i, j, ii, jj) {
    if (ii < 0 || ii >= g_gui_params.resolution || jj < 0 || jj >= g_gui_params.resolution) {
        return 0;
    }
    if (S[ii][jj] > U[ii][jj]) {
        if (S[ii][jj] > U[i][j]) {
            return 0;
        }
        return S[ii][jj] - U[i][j];
    }
    let dv1 = U[ii][jj] - U[i][j];
    let dv2 = U[ii][jj] - S[ii][jj];
    return (dv1 > dv2 ? dv2 : dv1);
}

function cal_dvs(i, j, ii, jj) {
    if (ii < 0 || ii >= g_gui_params.resolution || jj < 0 || jj >= g_gui_params.resolution) {
        return 0;
    }
    if (S[ii][jj] > U[ii][jj]) {
        return 0;
    }
    if (U[ii][jj] > S[i][j]) {
        /*
        let dv1 = U[ii][jj] - S[i][j];
        let dv2 = U[ii][jj] - S[ii][jj];
        return (dv1 > dv2 ? dv2 : dv1);
        */
        return U[ii][jj] - S[i][j];
    }
    return 0;
}

function cal_v(v_old, dv) {
    v_old += dv;
    v_old *= s;
    return v_old;
}

function water_update() {
    for (i = 0; i < g_gui_params.resolution; i++) {
        for (j = 0; j < g_gui_params.resolution; j++) {
            let dv = 0;
            if (U[i][j] > S[i][j]) {
                dv += cal_dvu(i, j, i - 1, j, U, S) / 4;
                dv += cal_dvu(i, j, i + 1, j, U, S) / 4;
                dv += cal_dvu(i, j, i, j - 1, U, S) / 4;
                dv += cal_dvu(i, j, i, j + 1, U, S) / 4;
                V[i][j] = cal_v(V[i][j], dv);
                U_cp[i][j] = U[i][j] + V[i][j];
            } else {
                dv += cal_dvs(i, j, i - 1, j, U, S) / 4;
                dv += cal_dvs(i, j, i + 1, j, U, S) / 4;
                dv += cal_dvs(i, j, i, j - 1, U, S) / 4;
                dv += cal_dvs(i, j, i, j + 1, U, S) / 4;
                V[i][j] = cal_v(V[i][j], dv);
                if (V[i][j] > 0.01) {
                    U_cp[i][j] = S[i][j] + V[i][j];
                } else {
                    U_cp[i][j] = -1;
                }
            }
        }
    }
    for (i = 0; i < g_gui_params.resolution; i++) {
        for (j = 0; j < g_gui_params.resolution; j++) {
            U[i][j] = U_cp[i][j];
        }
    }
}
