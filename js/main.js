const dim_view = 16;

let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
//camera.position.set(dim_view * 1.5, dim_view, dim_view * 1.5);
//camera.lookAt(new THREE.Vector3(dim_view, 0, dim_view));

camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

let scene = new THREE.Scene();

scene_init(scene);

let animate = () => {
  requestAnimationFrame(animate);

  scene_update(scene);

  renderer.render(scene, camera);
};

animate();