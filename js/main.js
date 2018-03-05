const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(scene_res * 1.5, scene_res * 1.5, scene_res * 1.5);
camera.lookAt(new THREE.Vector3(scene_res / 2, 0, scene_res / 2));

const scene = new THREE.Scene();
scene_init(scene);

function animate() {
  stats.begin();

  requestAnimationFrame(animate);
  scene_update(scene);

  renderer.render(scene, camera);
  stats.end();
};



var gui = new dat.GUI({
  height: 5 * 32 - 1
});









animate();