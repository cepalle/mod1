const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(scene_sqaure * 1.5, scene_sqaure, scene_sqaure * 1.5);
camera.lookAt(new THREE.Vector3(scene_sqaure / 2, 0, scene_sqaure / 2));

const scene = new THREE.Scene();

scene_init(scene);

function animate() {
  requestAnimationFrame(animate);

  scene_update(scene);

  renderer.render(scene, camera);
};

animate();