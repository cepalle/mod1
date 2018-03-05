const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

const scene = new THREE.Scene();

let lp = [
  [0.25, 0.35, 0.25],
  [0.25, 0.18, 0.37],
  [0.25, 0.18, 0.50],
  [0.25, 0.18, 0.62],
  [0.25, 0.35, 0.75],

  [0.37, 0.35, 0.25],
  [0.37, 0.35, 0.75],

  [0.50, 0.35, 0.25],
  [0.50, 0.35, 0.75],

  [0.62, 0.35, 0.25],
  [0.62, 0.35, 0.75],

  [0.75, 0.35, 0.25],
  [0.75, 0.35, 0.37],
  [0.75, 0.35, 0.50],
  [0.75, 0.35, 0.62],
  [0.75, 0.35, 0.75],
];
/*
lp = [
  [0.9, 0.35, 0.1],
];
*/



function animate() {
  stats.begin();

  requestAnimationFrame(animate);

  if (need_update) {
    camera.position.set(scene_res * 1.5, scene_res * 1.5, scene_res * 1.5);
    camera.lookAt(new THREE.Vector3(scene_res / 2, 0, scene_res / 2));
    scene_init(scene, lp);
    need_update = false;
  }

  if (run) {
    scene_update(scene);
  }
  renderer.render(scene, camera);

  stats.end();
};

const params = {
  resolution: 128,
  wave: false,
  rain: false,
  rising: false,
  start: function() {
    run = true;
  },
  stop: function() {
    run = false;
  },
  restart: function() {
    run = true;
    need_update = true;
  }
};

let gui = new dat.GUI();

gui.add(params, 'resolution').min(128).max(256).step(16).onFinishChange(function() {
  scene_res = params.resolution;
  run = false;
  need_update = true;
});
gui.add(params, 'wave').onFinishChange(function() {
  console.log(params.wave);
  run = false;
  need_update = true;
});
gui.add(params, 'rain').onFinishChange(function() {
  console.log(params.rain);
  run = false;
  need_update = true;
});
gui.add(params, 'rising').onFinishChange(function() {
  console.log(params.rain);
  run = false;
  need_update = true;
});
gui.add(params, 'start');
gui.add(params, 'stop');
gui.add(params, 'restart');

/*
gui.add(params, 'interation').onFinishChange(function() {
  // refresh based on the new value of params.interation
})
gui.add(params, 'interation').name('Intertions')
gui.add(params, 'width').min(128).max(256).step(16)
*/





animate();