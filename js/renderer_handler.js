let g_renderer_need_update = true;

let scene;
let geometry_water;
let geometry_sol;


const wdim = 0.9;
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


function init_geo(M, geo) {
    const positions = [];
    const normals = [];

    M_to_positions_normals(positions, normals, M);

    const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
    const normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
    normalAttribute.normalized = true;
    geo.addAttribute('position', positionAttribute);
    geo.addAttribute('normal', normalAttribute);
}

function scene_init() {
    WFG_init();

    scene = new THREE.Scene();
    scene.add(light1);
    geometry_water = new THREE.BufferGeometry();
    geometry_sol = new THREE.BufferGeometry();

    init_geo(g_W, geometry_water);
    const mesh_water = new THREE.Mesh(geometry_water, material_water);
    scene.add(mesh_water);

    init_geo(g_G, geometry_sol);
    const mesh_sol = new THREE.Mesh(geometry_sol, material_sol);
    scene.add(mesh_sol);
}

function geometry_upadte(geometry, M) {
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;

    M_to_positions_normals(positions, normals, M);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
}

function renderer_scene_update() {
    if (g_gui_params.wave) {
        wave_update();
    }
    if (g_gui_params.rain) {
        rain_update();
    }
    if (g_gui_params.rising) {
        rising_update();
    }
    if (g_gui_params.leak) {
        leak_update();
    }
    water_update();
    geometry_upadte(geometry_water, g_W);
}

function render_animate() {
    g_stats.begin();

    requestAnimationFrame(render_animate);

    if (g_renderer_need_update) {
        camera.position.set(
            g_gui_params.resolution * 1.5,
            g_gui_params.resolution * 1.5,
            g_gui_params.resolution * 1.5
        );
        controls.update();
        scene_init();
        g_renderer_need_update = false;
    }

    renderer_scene_update();
    renderer.render(scene, camera);
    g_stats.end();
}
