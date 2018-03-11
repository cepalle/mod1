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

// Three.js g_variable
let g_scene;
let g_geometry_water;
let g_geometry_sol;


function init_geo(M, geo) {
    const positions = [];
    const normals = [];

    positions_normals_update(positions, normals, M);

    const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
    const normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
    normalAttribute.normalized = true;
    geo.addAttribute('position', positionAttribute);
    geo.addAttribute('normal', normalAttribute);
}

function scene_init() {
    init_UVS();

    g_scene = new THREE.Scene();
    g_scene.add(light1);
    g_geometry_water = new THREE.BufferGeometry();
    g_geometry_sol = new THREE.BufferGeometry();

    init_geo(g_W, g_geometry_water);
    const mesh_water = new THREE.Mesh(g_geometry_water, material_water);
    g_scene.add(mesh_water);

    init_geo(g_G, g_geometry_sol);
    const mesh_sol = new THREE.Mesh(g_geometry_sol, material_sol);
    g_scene.add(mesh_sol);
}

function geometry_upadte(geometry, M) {
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;

    positions_normals_update(positions, normals, M);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
}

function scene_update() {
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
    geometry_upadte(g_geometry_water, g_W);
}
