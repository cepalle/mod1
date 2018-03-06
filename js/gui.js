// Gui variable
let scene_res = 128;
let wave = false;
let wave_height = 0.1;
let rain = false;
let rain_speed = 0.3;
let rising = false;
let rising_speed = 0.1;
let leak = false;
let leak_speed = 0.1;
let need_update = true;

// Gui params
const params = {
  resolution: 128,
  ground_1: function() {
    S_lp = [
      [0.5, 0.3, 0.5],
    ];
    need_update = true;
  },
  ground_2: function() {
    S_lp = [
      [0.5, 0.3, 0.5],
      [0.75, 0.005, 0.5],
      [0.75, 0.20, 0.75],
    ];
    need_update = true;
  },
  ground_3: function() {
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
  ground_4: function() {
    S_lp = [
      [0.50, 0.1, 0.50],
      [0.25, 0.25, 0.25],
      [0.25, 0.25, 0.75],
      [0.75, 0.25, 0.25],
      [0.75, 0.25, 0.75],
    ];
    need_update = true;
  },
  ground_5: function() {
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
  ground_6: function() {
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
  rain_speed: 0.3,
  rising: false,
  rising_speed: 0.1,
  leak: false,
  leak_speed: 0.1,
  restart: function() {
    need_update = true;
  }
};

// Gui construction
const gui = new dat.GUI();

gui.add(params, 'resolution').min(128).max(512).step(16).onFinishChange(function() {
  scene_res = params.resolution;
  need_update = true;
});

const ground_panel = gui.addFolder('Ground');
ground_panel.add(params, 'ground_1');
ground_panel.add(params, 'ground_2');
ground_panel.add(params, 'ground_3');
ground_panel.add(params, 'ground_4');
ground_panel.add(params, 'ground_5');
ground_panel.add(params, 'ground_6');
ground_panel.open();

const wave_panel = gui.addFolder('Wave');
wave_panel.add(params, 'wave_height').min(0).max(0.5).step(0.02).onFinishChange(function() {
  wave_height = params.wave_height;
});
wave_panel.add(params, 'wave').onFinishChange(function() {
  wave = params.wave;
});
wave_panel.open();

const rain_panel = gui.addFolder('Rain');
rain_panel.add(params, 'rain_speed').min(0.05).max(1).step(0.05).onFinishChange(function() {
  rain_speed = params.rain_speed;
});
rain_panel.add(params, 'rain').onFinishChange(function() {
  rain = params.rain;
});
rain_panel.open();

const rising_panel = gui.addFolder('Rising');
rising_panel.add(params, 'rising_speed').min(0.02).max(0.2).step(0.02).onFinishChange(function() {
  rising_speed = params.rising_speed;
});
rising_panel.add(params, 'rising').onFinishChange(function() {
  rising = params.rising;
});
rising_panel.open();

const leak_panel = gui.addFolder('Leak');
leak_panel.add(params, 'leak_speed').min(0.02).max(0.2).step(0.02).onFinishChange(function() {
  leak_speed = params.leak_speed;
});
leak_panel.add(params, 'leak').onFinishChange(function() {
  leak = params.leak;
});
leak_panel.open();

gui.add(params, 'restart');