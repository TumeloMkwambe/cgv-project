import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import * as CANNON from "../cannon-es/dist/cannon-es.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { Reflector } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/objects/Reflector.js';

const selections = JSON.parse(sessionStorage.getItem("selections"));
console.log("Selections: ", selections.car);

class Time {
  constructor(time) {
    this.time = time;
    this.state = "start";
    this.count = 3;
    this.countdownInterval = null;
    this.timerInterval = null;
    this.isPaused = false;
    this.difference = 1;
  }

  // Method to stop the timer and show the game-over screen if time runs out
  stopTime() {
    if (this.time === 0 && this.state === "running") {
      clearInterval(this.timerInterval); // Stop the timer
      this.state = "stopped"; // Update the state
      window.location.href = "lostScreen3.html"; // Redirect to lost screen
    } else if (this.time != 0 && this.state === "stopped") {
      clearInterval(this.countdownInterval);
      window.location.href = "../html/winScreen3.html";
    }
  }

  pauseTime() {
    if (this.isPaused) {
      this.state = "paused";
      clearInterval(this.timerInterval);
      document.getElementById("countdown").innerHTML = `
        <button onclick="window.location.href='level3.html'">Restart</button>
        <button onclick="window.location.href='mainMenu.html'">Cancel</button>
      `;
      document.getElementById('pauseButton').innerHTML = '▶️';
    }
    else{
      document.getElementById("countdown").innerHTML = "";
      document.getElementById('pauseButton').innerHTML = '⏸️';
    }
  }

  // Method to start the main timer after the countdown finishes
  runTime() {
    this.state = "running"; // Update state to running
    this.timerInterval = setInterval(() => {
      this.time -= this.difference; // Decrease time
      document.getElementById("stopwatch").innerText = this.time; // Update stopwatch display
      this.pauseTime();
      this.stopTime(); // Check if time should stop
    }, 1000); // Update every second
  }

  // Method to handle the countdown from 3
  startTime() {
    this.countdownInterval = setInterval(() => {
      this.count -= 1; // Decrease countdown
      console.log(this.count);
      document.getElementById("countdown").innerText = this.count; // Update countdown display

      if (this.count === 0) {
        clearInterval(this.countdownInterval); // Stop the countdown
        document.getElementById("countdown").innerText = ""; // Clear the countdown display
        this.runTime(); // Start the main timer
      }
    }, 1000); // Update every second
  }
}

// GAME PARAMETERS
const maxSteerVal = Math.PI / 8;
const maxForce = 10;
const frictionCoefficient = 0.05;
const thirdPersonView = {
    fieldOfView: 75,
    aspect: window.innerWidth / window.innerHeight,
    nearPlane: 0.1,
    farPlane: 100,
};

// INPUT CONTROLS
const enableInputControls = (vehicle) => {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                vehicle.setWheelForce(maxForce, 0);
                vehicle.setWheelForce(maxForce, 1);
                break;
            case 'ArrowDown':
            case 's':
                vehicle.setWheelForce(-maxForce / 2, 0);
                vehicle.setWheelForce(-maxForce / 2, 1);
                break;
            case 'ArrowLeft':
            case 'a':
                vehicle.setSteeringValue(maxSteerVal, 0);
                vehicle.setSteeringValue(maxSteerVal, 1);
                break;
            case 'ArrowRight':
            case 'd':
                vehicle.setSteeringValue(-maxSteerVal, 0);
                vehicle.setSteeringValue(-maxSteerVal, 1);
                break;
        }
    });
    
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 's':
            case 'ArrowDown':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 'a':
            case 'ArrowLeft':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
            case 'd':
            case 'ArrowRight':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
        }
    });
};

const disableInputControls = (vehicle) => {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 'ArrowDown':
            case 's':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
            case 'ArrowRight':
            case 'd':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
        }
    });
    
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 's':
            case 'ArrowDown':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 'a':
            case 'ArrowLeft':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
            case 'd':
            case 'ArrowRight':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
        }
    });
};

let isPaused = false;

const pauseGame = (time) => {
  console.log(isPaused);
  time.isPaused = isPaused;
  if(time.isPaused){
    console.log("RESUME at T = ", time.time);
  }
  else{
    time.runTime();
  }
};

// PHYSICS WORLD
const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
});

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

// WHEEL CREATION FUNCTION (Refactored)
const addWheel = (vehicle, position, axisWidth) => {
    const wheelBody = new CANNON.Body({
        mass: 2,
        material: new CANNON.Material('wheel'),
    });
    wheelBody.addShape(new CANNON.Sphere(0.1));
    wheelBody.angularDamping = 0.4;
    vehicle.addWheel({
        body: wheelBody,
        position: new CANNON.Vec3(position.x, 0, position.z * axisWidth),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: new CANNON.Vec3(0, -1, 0),
    });
    return wheelBody;
};

const physicsCar = () => {
    const carBody = new CANNON.Body({
        mass: 20,
        shape: new CANNON.Box(new CANNON.Vec3(0.7, 0.05, 0.4)),
        position: new CANNON.Vec3(40, 0.1, 27.25),
    });

    const vehicle = new CANNON.RigidVehicle({
        chassisBody: carBody,
    });

    const axisWidth = 0.5;
    const wheelBody1 = addWheel(vehicle, { x: -0.7, z: 0.7 }, axisWidth);
    const wheelBody2 = addWheel(vehicle, { x: -0.7, z: -0.7 }, axisWidth);
    const wheelBody3 = addWheel(vehicle, { x: 0.7, z: -0.7 }, axisWidth);
    const wheelBody4 = addWheel(vehicle, { x: 0.7, z: 0.7 }, axisWidth);

    return { vehicle, wheelBody1, wheelBody2, wheelBody3, wheelBody4 };
};

const { vehicle, wheelBody1, wheelBody2, wheelBody3, wheelBody4 } = physicsCar();
vehicle.addToWorld(physicsWorld);

const createCannonPlane = (x, y, z) => {
    const roadWidth = 0.25;
    const roadLength = 2;
    const roadThickness = 0.05;
  
    const planeShape = new CANNON.Box(
      new CANNON.Vec3(roadWidth, roadThickness, roadLength)
    );
  
    const planeBody = new CANNON.Body({
      mass: 0,
    });
    planeBody.addShape(planeShape);
  
    planeBody.position.set(x, y, z);
  
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -Math.PI / 2);
  
    return planeBody;
  };
  
  const startBody = createCannonPlane(41.5, 0.2, 26.75);
  physicsWorld.addBody(startBody);

const boundaries = (positions) => {
    const mass = 1000;
    const body = new CANNON.Body({ mass });
    const s = 2;

    for(let i = 9171; i < 18133; i += 3){
        const sphereShape = new CANNON.Sphere(0.25);
        body.addShape(sphereShape, new CANNON.Vec3(positions[i]*s, positions[i+1]*s, positions[i+2]*s));
    }
    for(let i = 63117; i < 72115; i += 3){
        const sphereShape = new CANNON.Sphere(0.25);
        body.addShape(sphereShape, new CANNON.Vec3(positions[i]*s, positions[i+1]*s, positions[i+2]*s));
    }

    body.position.set(0, 0.5, 0)
    physicsWorld.addBody(body)
}

// M I N I M A P

const miniMap = document.getElementById('mini_map');
const miniMapRenderer = new THREE.WebGLRenderer({ antialias: true });
miniMapRenderer.setSize(miniMap.offsetWidth, miniMap.offsetHeight);
miniMap.appendChild(miniMapRenderer.domElement);

// Calculate the aspect ratio
const aspect = miniMap.offsetWidth / miniMap.offsetHeight;

// Adjust these values as needed for your scene size
const frustumSize = 182; // Total size of the camera view

const miniMapCamera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, // left
    frustumSize * aspect / 2,  // right
    frustumSize / 2,           // top
    frustumSize / -2,          // bottom
    0.1,                       // near
    100                        // far
);

miniMapCamera.position.set(0, 95, 0);
miniMapCamera.lookAt(0, 0, 0);

// OBSTACLE CREATION FUNCTION WHICH YOU MUST AVOID 
const createObstacles = (scene, physicsWorld) => {
  const obstacles = [];
  //const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color for obstacles
  const textureW = new THREE.TextureLoader().load("../images/obstacle.png");
  const obstacleMaterial= new THREE.MeshBasicMaterial({ map: textureW });

  const positions = [
    { x: 27, y: 0.5, z: 26 }, // 1st
    { x: 10, y: 0.5, z: 15 },
    { x: 1, y: 0.5, z: 25 },
    { x: -35, y: 0.5, z: 15 }, //4th
    { x: -60, y: 0.5, z: -8 },
    { x: -5, y: 0.5, z: -8 },
    { x: 20, y: 0.5, z: -26 },
    { x: 92, y: 0.5, z: -25 },

  ];

  positions.forEach((pos) => {
    // Create the visual representation
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Adjust size as needed
   
    const mesh = new THREE.Mesh(geometry, obstacleMaterial);
    mesh.position.set(pos.x, pos.y, pos.z);
    scene.add(mesh);

    // Create the physical body
    const body = new CANNON.Body({
      mass: 1, // Set to 0 for static obstacles
      position: new CANNON.Vec3(pos.x, pos.y, pos.z),
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), // Size must match the geometry
    });
    physicsWorld.addBody(body);

    obstacles.push({ mesh, body });
  });

  return obstacles;
};

const updateObstacles = (obstacles) => {
  obstacles.forEach((obstacle) => {
    obstacle.mesh.position.copy(obstacle.body.position);
    obstacle.mesh.quaternion.copy(obstacle.body.quaternion);
  });
};


const createObstacles1 = (scene, physicsWorld) => {
  const obstacles1 = [];
  //const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color for obstacles
  const texture1 = new THREE.TextureLoader().load("../images/steel.png");
  const obstacleMaterial1= new THREE.MeshBasicMaterial({ map: texture1,metalness:0.8,roughness:0.2  });

  const positions1 = [
    { x: -25, y: 0.5, z: 22 },
    { x: -10, y: 0.5, z: 30 }, //2nd
    { x: -55, y: 0.5, z: 14 },
    { x: -25, y: 0.5, z: -8 },
    { x: 5, y: 0.5, z: -22 },
    { x: 65, y: 0.5, z: -25 },
    { x: 72, y: 0.5, z: 2 },
    
  ];

  positions1.forEach((pos) => {
    // Create the visual representation
    const geometry1 = new THREE.BoxGeometry(1, 1, 1); // Adjust size as needed
   
    const mesh1 = new THREE.Mesh(geometry1, obstacleMaterial1);
    mesh1.position.set(pos.x, pos.y, pos.z);
    scene.add(mesh1);

    // Create the physical body
    const body1 = new CANNON.Body({
      mass: 0, // Set to 0 for static obstacles
      position: new CANNON.Vec3(pos.x, pos.y, pos.z),
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), // Size must match the geometry
    });
    physicsWorld.addBody(body1);

    obstacles1.push({ mesh1, body1 });
  });

  return obstacles1;
};

const updateObstacles1 = (obstacles1) => {
  obstacles1.forEach((obstacle1) => {
    obstacle1.mesh1.position.copy(obstacle1.body1.position);
    obstacle1.mesh1.quaternion.copy(obstacle1.body1.quaternion);
  });
};

// CAMERA FOLLOW LOGIC (Chase View)
const cameraOffset = new THREE.Vector3(-3, 2, 0); // Position to the side of the car
const smoothFactor = 0.5; // Factor for smooth camera follow
const fixedCameraY = 2; // Fixed height for the camera


// G A M E   W O R L D

const buildPlane = () => {
    const roadWidth = 300;
    const roadLength = 300;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
  
    // Load and apply an icy texture
    const textureLoader = new THREE.TextureLoader();
    const gravelTexture = textureLoader.load("../images/forest.png"); // Use an ice texture of your choice
    gravelTexture.wrapS = THREE.RepeatWrapping;
    gravelTexture.wrapT = THREE.RepeatWrapping;
    gravelTexture.repeat.set(4, 4);
  
    const material = new THREE.MeshStandardMaterial({
      map: gravelTexture,
      roughness: 0.5,
      metalness: 0.3,
    });
  
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
};

const finishPlane = (x, y, z) => {
    const roadWidth = 8;
    const roadLength = 2;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const textureLoader = new THREE.TextureLoader();
    const gravelTexture = textureLoader.load("../images/forest.png"); // Path to your icy texture
    gravelTexture.wrapS = THREE.RepeatWrapping;
    gravelTexture.wrapT = THREE.RepeatWrapping;
    gravelTexture.repeat.set(4, 4);
  
    const material = new THREE.MeshStandardMaterial({
      map: gravelTexture,
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.3,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(x, y, z);
    plane.rotation.y = -Math.PI / 2;
    return plane;
};

const loader = new FBXLoader();

const loadFlag = () => {
    return new Promise((resolve, reject) => {
      loader.load(
        "../Models/Finish_Line.fbx",
        (fbx) => resolve(fbx),
        (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
        (error) => reject(error)
      );
    });
  };

const loadTrack = () => {
    return new Promise((resolve, reject) => {
        loader.load(
            '../Models/Formula_Track.fbx',
            (fbx) => resolve(fbx),
            (xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
            (error) => reject(error)
        );
    });

};

const loadCarModel = async (scene) => {
    if (selections.car == "Car A") {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          "../Models/tesla_s.glb",
          (gltf) => {
            const car = gltf.scene;
            car.scale.set(0.008, 0.008, 0.008);
            car.position.set(1000, 1000, 1000);
            car.position.y += 0.05;
            car.traverse((child) => {
              if (child.isMesh) {
                //child.material = new THREE.MeshStandardMaterial({
                //  color: 0xb22222,
                //});
                child.rotateZ(-91.1);
              }
            });
            resolve(car);
          },
          undefined,
          (error) => reject(error)
        );
      });
    } else if (selections.car == "Car B") {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          "../Models/mazda_rx7_stylised.glb",
          (gltf) => {
            const car = gltf.scene;
            car.scale.set(0.003, 0.003, 0.003); // Scale car
            car.position.set(1000, 1000, 1000); // Position car
            car.position.y += 0.05; // Slightly raises car above the track to avoid z-fighting
            car.rotateX(-90); // Rotate car
            car.traverse((child) => {
              //if (child.isMesh) {
              //child.material = new THREE.MeshStandardMaterial({
              //  color: 0xb22222,
              //});
              //}
            });
            resolve(car);
          },
          undefined,
          (error) => reject(error)
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          "../Models/cyberpunk_car.glb",
          (gltf) => {
            const car = gltf.scene;
            car.scale.set(0.003, 0.003, 0.003); // Scale car
            car.position.set(1000, 1000, 1000); // Position car
            car.position.y += 0.05; // Slightly raises car above the track to avoid z-fighting
            car.rotateX(-90); // Rotate car
            car.traverse((child) => {
              if (child.isMesh) {
                //child.material = new THREE.MeshStandardMaterial({
                //  color: 0xb22222,
                //});
                child.rotateY(89.5);
              }
            });
            resolve(car);
          },
          undefined,
          (error) => reject(error)
        );
      });
    }
  };

const loadSkybox = (scene) => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../skybox/px.png', // Right
        '../skybox/nx.png', // Left
        '../skybox/py.png', // Top
        '../skybox/ny.png', // Bottom
        '../skybox/pz.png', // Front
        '../skybox/nz.png', // Back
    ]);

    scene.background = texture; // Set the skybox as the scene background
};

let isFirstPerson = false; // Start with 3rd person by default

// CAMERA OFFSET FOR BOTH VIEWS
const thirdPersonOffset = new THREE.Vector3(-3, 2, 0); // Third-person view (chase view)
const firstPersonOffset = new THREE.Vector3(1, 1, 0); // First-person view (inside car)

const smoothCameraFollow = (camera, car) => {
  if (isFirstPerson) {
    const carDirection = new THREE.Vector3();
    car.getWorldDirection(carDirection);
    const carRight = new THREE.Vector3()
      .crossVectors(carDirection, new THREE.Vector3(0, 1, 0))
      .normalize();

    const targetPosition = car.position
      .clone()
      .add(carRight.clone().multiplyScalar(firstPersonOffset.x))
      .setY(car.position.y + 0.5);

    camera.position.lerp(new THREE.Vector3(car.position.x, car.position.y + 0.7, car.position.z), smoothFactor);
    camera.lookAt(targetPosition);
  } else {
    // 3rd person view: Chase view logic
    const carDirection = new THREE.Vector3();
    car.getWorldDirection(carDirection); // Get the car's forward direction
    const carRight = new THREE.Vector3()
      .crossVectors(carDirection, new THREE.Vector3(0, 1, 0))
      .normalize(); // Get the right direction of the car

    const targetPosition = car.position
      .clone()
      .add(carRight.clone().multiplyScalar(thirdPersonOffset.x)) // Move to the side
      .setY(fixedCameraY); // Set a fixed height for the camera

    camera.position.lerp(targetPosition, smoothFactor);
    camera.lookAt(car.position);
  }
};

// TOGGLE CAMERA VIEW ON 'P' KEY PRESS
window.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
        isFirstPerson = !isFirstPerson; // Toggle between 1st and 3rd person
    }
});

// Function to load a house model
const loadHouseModel = async (path, scale, position) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            const house = gltf.scene;
            house.scale.set(...scale); // Set scale using spread operator
            house.position.set(...position); // Set position using spread operator
            resolve(house);
        }, undefined, (error) => reject(error));
    });
};

const createHouse = async (modelPath, scale, position, rotation = { x: 0, y: 0, z: 0 }) => {
    const house = await loadHouseModel(modelPath, scale, position);
    house.rotation.set(rotation.x, rotation.y, rotation.z); // Apply rotation
    return house;
};
// CREATE ENVIRONMENT
const create3DEnvironment = async () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        thirdPersonView.fieldOfView,
        thirdPersonView.aspect,
        thirdPersonView.nearPlane,
        thirdPersonView.farPlane
    );
    camera.position.set(0, 10, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    const scene = new THREE.Scene();

    loadSkybox(scene);

    const plane = buildPlane();
    const model = await loadTrack();
    const flag = await loadFlag();
    const car = await loadCarModel(scene);

    const createMirror = (scene) => {
        const mirrorOptions={
        clipBias:0.003,
        textureWidth:window.innerWidth*window.devicePixelRatio,
        textureHeight:window.innerWidth*window.devicePixelRatio,
        color:0x889999,
        multisample:4,
    
        };
    
        const mirrorGeometry = new THREE.PlaneGeometry(5, 5);
        const mirror =new Reflector(mirrorGeometry,mirrorOptions);
        mirror.rotateY(Math.PI/4);
        mirror.position.set(70, 0.005, -21);
        scene.add(mirror);
        
      };
        //const scene = new THREE.Scene();
    createMirror(scene);

    const track = model.children[0].children[7];
    const textureLoader = new THREE.TextureLoader();
    const trackTexture = textureLoader.load("../Textures/gravel.png");
    const trackMaterial = new THREE.MeshStandardMaterial({
      map: trackTexture,
    //   color: 0xffffff,
      roughness: 0.4,
      metalness: 0.5,
    });

    track.scale.set(2, 2, 2);
    flag.scale.set(0.3, 0.3, 0.3);
    flag.position.set(45, 0.1, 26.6);
    flag.rotateY(29.8);
    flag.rotateY(-160.2);
    track.material[4] = trackMaterial;
    track.material[5].emissive = 0xffffff;
    const t = model.children[0].children[7];
    boundaries(t.geometry.attributes.position.array);
    const finish = finishPlane(45, 0.1, 27.5);
    finish.receiveShadow=true;
    scene.add(finish);

    // Add the plane, track, car to the scene
    scene.add(plane);
    scene.add(track);
    scene.add(flag)
    scene.add(car);
    // Add all houses to the scene

    // L I G H T I N G
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(1, 1, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(10, 200, 10);
    directionalLight.target.position.set(0,0,0);
    //directionalLight.castShadow = true;
    scene.add(directionalLight);

    const obstacles = createObstacles(scene, physicsWorld);
    const obstacles1 = createObstacles1(scene, physicsWorld);
    //const obstacles2 = createObstacles2(scene, physicsWorld);

    //const cannonDebugger = new CannonDebugger(scene, physicsWorld);
    const time = new Time(75, vehicle);
    time.startTime();
    document.getElementById("pauseButton").onclick = function togglePause() {
      console.log("CLICKED!");
      isPaused = !isPaused;
      pauseGame(time);
    };
    enableInputControls(vehicle);

  const waypoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(0, 0, 10),
    // Add more waypoints as needed
];



// Track the current waypoint index and completed laps
let currentWaypointIndex = 0;
let completedLaps = 0;

// Function to check if the car is close to the next waypoint
const checkWaypointProgress = (carPosition) => {
    const currentWaypoint = waypoints[currentWaypointIndex];
    const distance = carPosition.distanceTo(currentWaypoint);document.getElementById("pauseButton").onclick = function togglePause() {
      console.log("CLICKED!");
      isPaused = !isPaused;
      pauseGame(time);
    };

    if (distance < 1) { // If close enough to the waypoint
        currentWaypointIndex++; // Move to the next waypoint

        // If all waypoints are completed, reset to the start and increase lap count
        if (currentWaypointIndex >= waypoints.length) {
            currentWaypointIndex = 0; // Reset to first waypoint
            completedLaps++; // Increase lap count
            time.checkWinCondition(completedLaps); // Check for win condition
        }
    }
};

const renderMiniMap = () => {
  miniMapRenderer.render(scene, miniMapCamera);
};

// Inside your animate function, after updating the car's position:
const animate = () => {
    window.requestAnimationFrame(animate);
    if(time.isPaused){
      physicsWorld.step(1 / 60);
      renderer.render(scene, camera);
    }
    else{
      physicsWorld.fixedStep();
      //cannonDebugger.update();
      car.position.copy(vehicle.chassisBody.position);
      car.quaternion.copy(vehicle.chassisBody.quaternion);
      controls.update();
    }
    checkWaypointProgress(car.position);

    // Existing friction handling
    if (!window.keyIsPressed) {
        const velocity = vehicle.chassisBody.velocity;
        velocity.x *= (1 - frictionCoefficient);
        velocity.z *= (1 - frictionCoefficient);
    }

      const boundingBox = new THREE.Box3().setFromObject(car);
      const finishBox = new THREE.Box3().setFromObject(finish);
      if (boundingBox.intersectsBox(finishBox)) {
        console.log('crossed finish line');
        time.state = "stopped";
      }
    

    // Smooth camera follow the car
    smoothCameraFollow(camera, car);


    // Render the scene
    renderer.render(scene, camera);
    renderMiniMap();
};
animate();
};


window.keyIsPressed = false;
window.addEventListener('keydown', () => { window.keyIsPressed = true; });
window.addEventListener('keyup', () => { window.keyIsPressed = false; });

create3DEnvironment();


  //  // Create an array to hold house models
  //  const houses = [];
    
  //  // Load houses and add them to the array
  //  //Tiny House

  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-10, 0.1, 25]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-20, 0.1, 25]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [0, 0.1, 15]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [15, 0.1, 10]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [20, 0.1, 15]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [25, 0.1, 18]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [30, 0.1, 15]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [35, 0.1, 22]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [40, 0.1, 22]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [45, 0.1, 22]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [50, 0.1, 21]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [55, 0.1, 20]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [60, 0.1, 19]));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [65, 0.1, 15]));

  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-30, 0.1, 30], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-35, 0.1, 25], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [15, 0.1, 30], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [20, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [25, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [30, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [35, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [40, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [45, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [50, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [55, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [60, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
  //  houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [65, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));


  //  //Shanty House
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-75, 0.1, -15], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-65, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-55, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-45, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-35, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-25, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-15, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-5, 0.1, -25], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [5, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [15, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [25, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [35, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [45, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [55, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [65, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));

  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-55, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-45, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-35, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-25, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-15, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-5, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [5, 0.1, -10], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [15, 0.1, -15], {x: 0, y: -Math.PI / 2, z: 0 }));
  //  houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [25, 0.1, -15], {x: 0, y: -Math.PI / 2, z: 0 }));

  //  // Bar

  //  houses.push(await createHouse('../Models/bar_shack.glb', [0.015, 0.015, 0.015], [10, 0.1, 11]));

  //  houses.push(await createHouse('../Models/grass.glb', [2, 2, 2], [15, 0.1, 10]));
  //  houses.push(await createHouse('../Models/grass.glb', [2, 2, 2], [15, 0.1, 20]));
  //  houses.push(await createHouse('../Models/grass.glb', [2, 2, 2], [15, 0.1, 30]));

  //  houses.push(await createHouse('../Models/soccer_field.glb', [0.5, 0.5, 0.5], [50, 0.1, -10], {x: 0, y: Math.PI / 2, z: 0}));
  //  houses.push(await createHouse('../Models/playground.glb', [1.5, 1.5, 1.5], [85, 0.1, -30], {x: 0, y: Math.PI / 2, z: 0}));
