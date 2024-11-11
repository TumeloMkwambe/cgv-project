import { Car } from './car.js';
import { Track } from './track.js';

export class Game {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.track = new Track(scene);
        this.car = new Car(scene);
        this.startTime = null;
        this.duration = 60; // Duration in seconds
    }

    start() {
        this.startTime = Date.now();
    }

    update() {
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        if (elapsedTime > this.duration) {
            console.log("Time's up!");
        } else {
            this.car.update();
        }
    }
}
