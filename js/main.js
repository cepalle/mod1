function animate() {
    stats.begin();

    requestAnimationFrame(animate);

    if (need_update) {
        camera.position.set(scene_res * 1.5, scene_res * 1.5, scene_res * 1.5);
        controls.update();
        scene_init();
        need_update = false;
    }

    scene_update();
    renderer.render(scene, camera);
    stats.end();
};

animate();
