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

const params = {
  resolution: 128,
  wave: false,
  rain: false,
  rising: false,
  start: function() {
    console.log('start');
  },
  stop: function() {
    console.log('stop');
  }
};

let gui = new dat.GUI({
  height: 5 * 32 - 1
});

gui.add(params, 'resolution').min(128).max(256).step(16);
gui.add(params, 'wave').onFinishChange(function() {
  console.log(params.wave);
});
gui.add(params, 'rain').onFinishChange(function() {
  console.log(params.rain);
});
gui.add(params, 'rising').onFinishChange(function() {
  console.log(params.rain);
});
gui.add(params, 'start');
gui.add(params, 'stop');

/*
gui.add(params, 'interation').onFinishChange(function() {
  // refresh based on the new value of params.interation
})
gui.add(params, 'interation').name('Intertions')
gui.add(params, 'width').min(128).max(256).step(16)
*/





animate();