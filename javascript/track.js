import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export class Track {
    constructor(scene) {
        this.scene = scene;
        this.model = this.createTrackModel();
        this.scene.add(this.model);
    }

    createTrackModel() {
        const geometry = new THREE.PlaneGeometry(10, 50); // Width, Height
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // Green color
        const track = new THREE.Mesh(geometry, material);
        track.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        track.position.set(0, 0, 0); // Position at origin
        return track;
    }
}
