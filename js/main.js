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


function animate() {
    stats.begin();

    requestAnimationFrame(animate);

    if (g_need_update) {
        camera.position.set(g_gui_params.resolution * 1.5, g_gui_params.resolution * 1.5, g_gui_params.resolution * 1.5);
        controls.update();
        scene_init();
        g_need_update = false;
    }

    scene_update();
    renderer.render(g_scene, camera);
    stats.end();
};

animate();
