function animate() {
    stats.begin();

    requestAnimationFrame(animate);

    if (g_need_update) {
        camera.position.set(g_gui_params.resolution * 1.5, g_gui_params.resolution * 1.5, g_gui_params.resolution * 1.5);
        controls.update();
        scene_init();
        g_need_update = false;
    }

    scene_update();
    renderer.render(scene, camera);
    stats.end();
};

animate();
