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

animate();