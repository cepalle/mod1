import {gui_params} from "./gui_handler";
import {M_to_geometry, M_to_geometry_init, border_water_update, border_water_init} from "./M_to_geometry";
import {WFG_G, WFG_init, WFG_W, WFG_W_update} from "./WFG_handler";
import {stats} from "./stats_handler";
import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);

let scene;
let geometry_water;
let geometry_sol;
let geometry_border_water;
const renderer_need_update = {value: true};

const light = new THREE.DirectionalLight(0xffffff, 0.9);
light.position.set(1, 2, 1);
const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
light2.position.set(-1, 1, -1);

const material_water = new THREE.MeshLambertMaterial({
    color: 0x1133dd,
    side: THREE.DoubleSide,
});
const material_sol = new THREE.MeshLambertMaterial({
    color: 0x33dd11,
    side: THREE.DoubleSide,
});

const wh_dim = 0.9;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight * wh_dim);

document.getElementById("iframe").appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / (window.innerHeight * wh_dim), 1, 2000);

function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight * wh_dim);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * wh_dim);
}

window.addEventListener('resize', onWindowResize, false);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;


function scene_init() {
    WFG_init();

    scene = new THREE.Scene();
    scene.add(light);
    scene.add(light2);
    geometry_water = new THREE.BufferGeometry();
    geometry_sol = new THREE.BufferGeometry();
    geometry_border_water = new THREE.BufferGeometry();

    M_to_geometry_init(WFG_W, geometry_water);
    const mesh_water = new THREE.Mesh(geometry_water, material_water);
    scene.add(mesh_water);

    M_to_geometry_init(WFG_G, geometry_sol);
    const mesh_sol = new THREE.Mesh(geometry_sol, material_sol);
    scene.add(mesh_sol);

    border_water_init(WFG_W, geometry_border_water);
    const mesh_border = new THREE.Mesh(geometry_border_water, material_water);
    scene.add(mesh_border);
}

function scene_update() {
    WFG_W_update();
    M_to_geometry(geometry_water, WFG_W);
    border_water_update(geometry_border_water, WFG_W);
}

function render_animate() {
    stats.begin();

    requestAnimationFrame(render_animate);

    if (renderer_need_update.value) {
        camera.position.set(
            gui_params.resolution * 1.5,
            gui_params.resolution * 1.5,
            gui_params.resolution * 1.5
        );
        controls.update();
        scene_init();
        renderer_need_update.value = false;
    }

    scene_update();
    renderer.render(scene, camera);
    stats.end();
}

export {render_animate, renderer_need_update};
