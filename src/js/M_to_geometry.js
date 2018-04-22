import {gui_params} from "./gui_handler";
import * as THREE from 'three';
import {WFG_W} from "./WFG_handler";

const pA = new THREE.Vector3();
const pB = new THREE.Vector3();
const pC = new THREE.Vector3();
const cb = new THREE.Vector3();
const ab = new THREE.Vector3();


function add_pos(positions, k, lp) {
    for (let i = 0; i < lp.length; i++) {
        positions[k++] = lp[i][0];
        positions[k++] = lp[i][1];
        positions[k++] = lp[i][2];
    }
}

function add_norm(normals, h, lp) {
    pA.set(lp[0][0], lp[0][1], lp[0][2]);
    pB.set(lp[1][0], lp[1][1], lp[1][2]);
    pC.set(lp[2][0], lp[2][1], lp[2][2]);
    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab);
    cb.normalize();
    let nx = cb.x;
    let ny = cb.y;
    let nz = cb.z;
    normals[h++] = nx * 32767;
    normals[h++] = ny * 32767;
    normals[h++] = nz * 32767;
    normals[h++] = nx * 32767;
    normals[h++] = ny * 32767;
    normals[h++] = nz * 32767;
    normals[h++] = nx * 32767;
    normals[h++] = ny * 32767;
    normals[h] = nz * 32767;
}

function M_to_positions_normals(positions, normals, M) {
    let k = 0;
    let h = 0;
    for (let i = 0; i < gui_params.resolution - 1; i++) {
        for (let j = 0; j < gui_params.resolution - 1; j++) {
            let i_eq = i - gui_params.resolution / 2;
            let j_eq = j - gui_params.resolution / 2;
            let a = [i_eq, M[i][j], j_eq];
            let b = [i_eq + 1, M[i + 1][j], j_eq];
            let c = [i_eq, M[i][j + 1], j_eq + 1];
            let d = [i_eq + 1, M[i + 1][j + 1], j_eq + 1];

            // positions
            add_pos(positions, k, [a, d, b]);
            k += 9;
            add_pos(positions, k, [a, d, c]);
            k += 9;

            // flat face normals
            add_norm(normals, h, [a, d, b]);
            h += 9;
            add_norm(normals, h, [a, d, c]);
            h += 9;
        }
    }
}

function M_to_geometry_init(M, geo) {
    const positions = [];
    const normals = [];

    M_to_positions_normals(positions, normals, M);

    const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
    const normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
    normalAttribute.normalized = true;
    geo.addAttribute('position', positionAttribute);
    geo.addAttribute('normal', normalAttribute);
}

function M_to_geometry(geometry, M) {
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;

    M_to_positions_normals(positions, normals, M);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
}

function M_to_border_position_normals(positions, normals, M) {
    let k = 0;
    let h = 0;
    for (let i = 0; i < gui_params.resolution - 1; i++) {
        let i_eq = i - gui_params.resolution / 2;
        const start = - gui_params.resolution / 2;
        const end = gui_params.resolution / 2 - 1;

        let a = [i_eq, M[i][0], start];
        let b = [i_eq + 1, M[i + 1][0], start];
        let c = [i_eq, 0, start];
        let d = [i_eq + 1, 0, start];
        // positions
        add_pos(positions, k, [a, d, b]);
        k += 9;
        add_pos(positions, k, [a, d, c]);
        k += 9;
        // flat face normals
        add_norm(normals, h, [a, d, b]);
        h += 9;
        add_norm(normals, h, [a, d, c]);
        h += 9;

        a = [start, M[0][i], i_eq];
        b = [start, M[0][i+1], i_eq + 1];
        c = [start, 0, i_eq];
        d = [start, 0, i_eq + 1];
        // positions
        add_pos(positions, k, [a, d, b]);
        k += 9;
        add_pos(positions, k, [a, d, c]);
        k += 9;
        // flat face normals
        add_norm(normals, h, [a, d, b]);
        h += 9;
        add_norm(normals, h, [a, d, c]);
        h += 9;

        a = [end, M[gui_params.resolution - 1][i], i_eq];
        b = [end, M[gui_params.resolution - 1][i + 1], i_eq + 1];
        c = [end, 0, i_eq];
        d = [end, 0, i_eq + 1];
        // positions
        add_pos(positions, k, [a, d, b]);
        k += 9;
        add_pos(positions, k, [a, d, c]);
        k += 9;
        // flat face normals
        add_norm(normals, h, [a, d, b]);
        h += 9;
        add_norm(normals, h, [a, d, c]);
        h += 9;

        a = [i_eq, M[i][gui_params.resolution - 1], end];
        b = [i_eq + 1, M[i + 1][gui_params.resolution - 1], end];
        c = [i_eq, 0, end];
        d = [i_eq + 1, 0, end];
        // positions
        add_pos(positions, k, [a, d, b]);
        k += 9;
        add_pos(positions, k, [a, d, c]);
        k += 9;
        // flat face normals
        add_norm(normals, h, [a, d, b]);
        h += 9;
        add_norm(normals, h, [a, d, c]);
        h += 9;
    }
}

function border_water_init(M, geo) {
    const positions = [];
    const normals = [];

    M_to_border_position_normals(positions, normals, M);
    const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
    const normalAttribute = new THREE.Int16BufferAttribute(normals, 3);
    normalAttribute.normalized = true;
    geo.addAttribute('position', positionAttribute);
    geo.addAttribute('normal', normalAttribute);
}

function border_water_update(geometry, M) {
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;

    M_to_border_position_normals(positions, normals, M);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
}

export {M_to_geometry_init, M_to_geometry, border_water_update, border_water_init};
