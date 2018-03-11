// Gui variable
let scene_res = 128;
let rising_speed = 0.1;
let leak_speed = 0.1;
let need_update = true;

// Gui g_params
const g_params = {
    resolution: 128,
    ground_1: function () {
        S_lp = [
            [0.5, 0.3, 0.5],
        ];
        need_update = true;
    },
    ground_2: function () {
        S_lp = [
            [0.5, 0.3, 0.5],
            [0.75, 0.005, 0.5],
            [0.75, 0.20, 0.75],
        ];
        need_update = true;
    },
    ground_3: function () {
        S_lp = [
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
        ];
        need_update = true;
    },
    ground_4: function () {
        S_lp = [
            [0.50, 0.1, 0.50],
            [0.25, 0.25, 0.25],
            [0.25, 0.25, 0.75],
            [0.75, 0.25, 0.25],
            [0.75, 0.25, 0.75],
        ];
        need_update = true;
    },
    ground_5: function () {
        S_lp = [
            [0.25, 0.2, 0.25],
            [0.25, 0.1, 0.37],
            [0.25, 0.1, 0.50],
            [0.25, 0.1, 0.62],
            [0.25, 0.2, 0.75],

            [0.37, 0.2, 0.25],
            [0.37, 0.2, 0.75],

            [0.50, 0.2, 0.25],
            [0.50, 0.2, 0.75],

            [0.62, 0.2, 0.25],
            [0.62, 0.2, 0.75],

            [0.75, 0.2, 0.25],
            [0.75, 0.2, 0.37],
            [0.75, 0.2, 0.50],
            [0.75, 0.2, 0.62],
            [0.75, 0.2, 0.75],
            [0.50, 0.0, 0.50],
        ];
        need_update = true;
    },
    ground_6: function () {
        S_lp = [
            [0.25, 0.25, 0.25],
            [0.25, 0.25, 0.75],
            [0.75, 0.20, 0.75],
            [0.75, 0.25, 0.25],

            [0.37, 0.15, 0.50],
            [0.37, 0.15, 0.75],
            [0.63, 0.15, 0.75],
            [0.63, 0.15, 0.50],

            [0.25, 0.25, 0.50],
            [0.75, 0.25, 0.50],
            [0.50, 0.10, 0.75],
            [0.50, 0.05, 0.63],

            [0.50, 0.10, 0.50],
            [0.50, 0.00, 0.37],
            [0.31, 0.00, 0.50],
            [0.69, 0.00, 0.50],

            [0.25, 0.25, 0.37],
            [0.75, 0.25, 0.37],
            [0.25, 0.25, 0.63],
            [0.75, 0.225, 0.63],
            [0.50, 0.25, 0.25],
        ];
        need_update = true;
    },
    wave: false,
    wave_height: 0.1,
    rain: false,
    rain_speed: 0.05,
    rising: false,
    rising_speed: 0.1,
    leak: false,
    leak_speed: 0.1,
    restart: function () {
        need_update = true;
    }
};

// Gui construction
const gui = new dat.GUI();

gui.add(g_params, 'resolution').min(128).max(512).step(16).onFinishChange(function () {
    scene_res = g_params.resolution;
    need_update = true;
});

const ground_panel = gui.addFolder('Ground');
ground_panel.add(g_params, 'ground_1');
ground_panel.add(g_params, 'ground_2');
ground_panel.add(g_params, 'ground_3');
ground_panel.add(g_params, 'ground_4');
ground_panel.add(g_params, 'ground_5');
ground_panel.add(g_params, 'ground_6');
ground_panel.open();

const wave_panel = gui.addFolder('Wave');
wave_panel.add(g_params, 'wave_height').min(0).max(0.5).step(0.02);
wave_panel.add(g_params, 'wave')
wave_panel.open();

const rain_panel = gui.addFolder('Rain');
rain_panel.add(g_params, 'rain_speed').min(0.01).max(0.1).step(0.01)
rain_panel.add(g_params, 'rain')
rain_panel.open();

const rising_panel = gui.addFolder('Rising');
rising_panel.add(g_params, 'rising_speed').min(0.02).max(0.2).step(0.02).onFinishChange(function () {
    rising_speed = g_params.rising_speed;
});
rising_panel.add(g_params, 'rising').onFinishChange(function () {
    rising = g_params.rising;
});
rising_panel.open();

const leak_panel = gui.addFolder('Leak');
leak_panel.add(g_params, 'leak_speed').min(0.02).max(0.2).step(0.02).onFinishChange(function () {
    leak_speed = g_params.leak_speed;
});
leak_panel.add(g_params, 'leak').onFinishChange(function () {
    leak = g_params.leak;
});
leak_panel.open();

gui.add(g_params, 'restart');
