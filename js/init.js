// Constants
const s = 0.99;
const PI = Math.PI;
const wdim = 0.9;

// Stats
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Threejs
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight * wdim);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight * wdim), 1, 2000);

function onWindowResize() {
  camera.aspect = window.innerWidth / (window.innerHeight * wdim);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * wdim);
}
window.addEventListener('resize', onWindowResize, false);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 2, 0);

const material_water = new THREE.MeshLambertMaterial({
  color: 0x1133dd,
  side: THREE.DoubleSide,
});
const material_sol = new THREE.MeshLambertMaterial({
  color: 0x33dd11,
  side: THREE.DoubleSide,
});

let scene;
let geometry_water;
let geometry_sol;

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

// UVS matrice for calcul water
const U = [];
const U_cp = [];
const V = [];
const S = [];

// S description
let S_lp = [];

// Gui
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
  wave: false,
  wave_height: 0.1,
  rain: false,
  rain_speed: 0.3,
  rising: false,
  rising_speed: 0.1,
  leak: false,
  leak_speed: 0.1,
  ground_4: function() {
    S_lp = [
      [0.25, 0.35, 0.25],
      [0.25, 0.18, 0.37],
      [0.25, 0.18, 0.50],
      [0.25, 0.18, 0.62],
      [0.25, 0.35, 0.75],

      [0.37, 0.35, 0.25],
      [0.37, 0.35, 0.75],

      [0.50, 0.35, 0.25],
      [0.50, 0.35, 0.75],

      [0.62, 0.35, 0.25],
      [0.62, 0.35, 0.75],

      [0.75, 0.35, 0.25],
      [0.75, 0.35, 0.37],
      [0.75, 0.35, 0.50],
      [0.75, 0.35, 0.62],
      [0.75, 0.35, 0.75],
      [0.50, 0.00, 0.50],
    ];
    need_update = true;
  },
  restart: function() {
    need_update = true;
  }
};

const gui = new dat.GUI();

gui.add(params, 'resolution').min(128).max(256).step(16).onFinishChange(function() {
  scene_res = params.resolution;
  need_update = true;
});
gui.add(params, 'ground_1');
gui.add(params, 'ground_2');
gui.add(params, 'ground_3');
gui.add(params, 'ground_4');

gui.add(params, 'wave_height').min(0).max(0.5).step(0.02).onFinishChange(function() {
  wave_height = params.wave_height;
});
gui.add(params, 'wave').onFinishChange(function() {
  wave = params.wave;
});
gui.add(params, 'rain_speed').min(0.05).max(1).step(0.05).onFinishChange(function() {
  rain_speed = params.rain_speed;
});
gui.add(params, 'rain').onFinishChange(function() {
  rain = params.rain;
});
gui.add(params, 'rising_speed').min(0.02).max(0.2).step(0.02).onFinishChange(function() {
  rising_speed = params.rising_speed;
});
gui.add(params, 'rising').onFinishChange(function() {
  rising = params.rising;
});
gui.add(params, 'leak_speed').min(0.02).max(0.2).step(0.02).onFinishChange(function() {
  leak_speed = params.leak_speed;
});
gui.add(params, 'leak').onFinishChange(function() {
  leak = params.leak;
});
gui.add(params, 'restart');