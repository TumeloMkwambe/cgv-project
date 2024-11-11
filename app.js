import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { Game } from './javascript/game';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up controls
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 5, 10);
controls.update();

// Initialize game
const game = new Game(scene, camera, renderer);
game.start();

// Animation loop
const animate = function () {

    requestAnimationFrame(animate);
    controls.update();
    game.update(); 
    renderer.render(scene, camera);  
};

animate();