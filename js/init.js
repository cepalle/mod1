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

// UVS matrices for Height field Fluids
const g_W = [];
const g_W_cp = [];
const g_F = [];
const g_G = [];

// g_G ground description
let g_G_lp = [];

// Gui variable
let g_need_update = true;

