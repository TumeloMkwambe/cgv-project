import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export class Car {
    
    constructor(scene) {

        this.scene = scene;

        this.model = this.createCarModel();

        this.scene.add(this.model);

    }

    createCarModel() {
        const geometry = new THREE.BoxGeometry(1, 0.5, 2); // Width, Height, Depth
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
        const car = new THREE.Mesh(geometry, material);
        car.position.set(0, 0.25, 0); // Position it above the ground
        return car;
    }

    update() {
        this.model.position.z -= 0.1; // Move forward
    }
}
