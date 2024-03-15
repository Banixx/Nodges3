import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { createGridHelpers } from './createGridHelpers.js';

// Initialisierung des CSS2DRenderers
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth-100, window.innerHeight-100);
}
//scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 6, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
raycaster.layers.set(0,3); 
const mouse = new THREE.Vector2();



let mouseX = 0, mouseY = 0; 

window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

createGridHelpers(scene);

//Example
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x40e0d0 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(2, 2, 2);
cube.castShadow = true;
cube.layers.enable(0);
cube.name = "cube";
window.myDebugCube = cube; 

scene.add(cube);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5dc, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, -0.5, 0);
plane.receiveShadow = true;
plane.name = "bode";
scene.add(plane);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);


const mouseOverPopup = document.createElement('div');
mouseOverPopup.id = 'mouseOverPopup';
document.body.appendChild(mouseOverPopup);

function updatePopupContent(content) {
    mouseOverPopup.innerHTML = content; // Setze den Inhalt des Popups
}

function showPopup(show = true) {
    mouseOverPopup.style.display = show ? 'block' : 'none';
}

window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    mouseOverPopup.style.left = `${event.clientX + 15}px`; 
    mouseOverPopup.style.top = `${event.clientY + 15}px`;

    
   
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 ) {
        const intersectedObject = intersects[0].object;
        updatePopupContent(`Objekt: ${intersectedObject.name}`); 
        showPopup(true);
    } else {
        showPopup(false);
    }
});



scene.children.forEach((child, index) => {
 
    console.log(`Objekt ${index}: Name = ${child.name}, Layer = ${child.layers.mask}`);
});


console.log(`Raycaster Layers: ${raycaster.layers.mask.toString(2)}`);


function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera); 
}
animate();