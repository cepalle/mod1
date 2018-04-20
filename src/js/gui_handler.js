import dat from 'dat.gui';
import {renderer_need_update} from "./renderer_handler";
import {WFG_G_lp} from "./WFG_handler";

const gui_params = {
    resolution: 128,
    ground_1: function () {
        while (WFG_G_lp.length)
            WFG_G_lp.pop();
        WFG_G_lp.push(
            [0.5, 0.3, 0.5],
        );
        renderer_need_update.value = true;
    },
    ground_2: function () {
        while (WFG_G_lp.length)
            WFG_G_lp.pop();
        WFG_G_lp.push(
            [0.5, 0.3, 0.5],
            [0.75, 0.005, 0.5],
            [0.75, 0.20, 0.75],
        );
        renderer_need_update.value = true;
    },
    ground_3: function () {
        while (WFG_G_lp.length)
            WFG_G_lp.pop();
        WFG_G_lp.push(
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
        );
        renderer_need_update.value = true;
    },
    ground_4: function () {
        while (WFG_G_lp.length)
            WFG_G_lp.pop();
        WFG_G_lp.push(
            [0.50, 0.1, 0.50],
            [0.25, 0.25, 0.25],
            [0.25, 0.25, 0.75],
            [0.75, 0.25, 0.25],
            [0.75, 0.25, 0.75],
        );
        renderer_need_update.value = true;
    },
    ground_5: function () {
        while (WFG_G_lp.length)
            WFG_G_lp.pop();
        WFG_G_lp.push(
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
        );
        renderer_need_update.value = true;
    },
    ground_6: function () {
        while (WFG_G_lp.length)
            WFG_G_lp.pop();
        WFG_G_lp.push(
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
        );
        renderer_need_update.value = true;
    },
    wave: true,
    wave_height: 0.08,
    rain: false,
    rain_speed: 0.01,
    rising: false,
    rising_speed: 0.1,
    leak: false,
    leak_speed: 0.1,
    restart: function () {
        renderer_need_update.value = true;
    }
};

const gui = new dat.GUI();

gui.add(gui_params, 'resolution').min(64).max(256).step(16).onFinishChange(function () {
    renderer_need_update.value = true;
});

const ground_panel = gui.addFolder('Ground');
ground_panel.add(gui_params, 'ground_1');
ground_panel.add(gui_params, 'ground_2');
ground_panel.add(gui_params, 'ground_3');
ground_panel.add(gui_params, 'ground_4');
ground_panel.add(gui_params, 'ground_5');
ground_panel.add(gui_params, 'ground_6');
ground_panel.open();

const wave_panel = gui.addFolder('Wave');
wave_panel.add(gui_params, 'wave_height').min(0).max(0.5).step(0.02);
wave_panel.add(gui_params, 'wave');
wave_panel.open();

const rain_panel = gui.addFolder('Rain');
rain_panel.add(gui_params, 'rain_speed').min(0.01).max(0.04).step(0.01);
rain_panel.add(gui_params, 'rain');
rain_panel.open();

const rising_panel = gui.addFolder('Rising');
rising_panel.add(gui_params, 'rising_speed').min(0.02).max(0.5).step(0.02);
rising_panel.add(gui_params, 'rising');
rising_panel.open();

const leak_panel = gui.addFolder('Leak');
leak_panel.add(gui_params, 'leak_speed').min(0.02).max(0.5).step(0.02);
leak_panel.add(gui_params, 'leak');
leak_panel.open();

gui.add(gui_params, 'restart');

export {gui_params};
