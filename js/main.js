let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(scene_sqaure, scene_sqaure, scene_sqaure);
camera.lookAt(new THREE.Vector3(0, 0, 0));

let scene = new THREE.Scene();

scene_init(scene);

let animate = () => {
  requestAnimationFrame(animate);

  scene_update(scene);

  renderer.render(scene, camera);
};

animate();