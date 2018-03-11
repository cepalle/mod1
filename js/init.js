// Constants
const s = 0.99;
const PI = Math.PI;
const wdim = 0.9;

// Three.js g_variable
let g_scene;
let g_geometry_water;
let g_geometry_sol;

// Water, Flot, Groud matrice description
const g_W = [];
const g_W_cp = [];
const g_F = [];
const g_G = [];

// g_G list points ground description
let g_G_lp = [];

// for Resolution and Ground update
let g_need_update = true;

