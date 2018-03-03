const dim_view = 32;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(dim_view * 1.5, dim_view, dim_view * 1.5);
camera.lookAt(new THREE.Vector3(dim_view, 0, dim_view));

let scene = new THREE.Scene();

scene_init(scene);

let animate = () => {
  requestAnimationFrame(animate);

  scene_update(scene);

  renderer.render(scene, camera);
};

animate();