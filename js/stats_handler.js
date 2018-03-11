let g_stats;


g_stats = new Stats();
g_stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(g_stats.dom);
