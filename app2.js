import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createGridHelpers } from './createGridHelpers.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth-100, window.innerHeight-100);
}

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
const mouse = new THREE.Vector2();

let mouseX = 0, mouseY = 0; // Globale Variablen für die Mausposition in Pixeln

window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});



createGridHelpers(scene);
// Rotierender Würfel
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x40e0d0 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(2, 2, 2);
cube.castShadow = true;
cube.name = "wuerfel";
scene.add(cube);

// Ebene
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5dc, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, -0.5, 0);
plane.receiveShadow = true;
scene.add(plane);

// Gerichtetes Licht
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);
// cssrenderer
// Weiter unten im Code, nachdem der WebGLRenderer initialisiert wurde
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

function createLabelForObject(object, name, offset = 1.5) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = name;
    const label = new CSS2DObject(div);
    label.position.set(0, object.geometry.parameters.radius * offset, 0);
    object.add(label);
}
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
// Aktualisiere den Raycaster mit der aktuellen Mausposition
raycaster.setFromCamera(mouse, camera);

// Berechne Objekte, die vom Raycaster getroffen werden
const intersects = raycaster.intersectObjects(scene.children);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // Aktualisiere den Raycaster mit der aktuellen Mausposition
    raycaster.setFromCamera(mouse, camera);

    // Berechne Objekte, die vom Raycaster getroffen werden
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        console.log("intersects.length > 0 intersect!");
        const intersect = intersects[0];
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            console.log("tooltip!");
            tooltip.style.display = 'block';
            tooltip.textContent = `X: ${intersect.point.x.toFixed(2)}, Y: ${intersect.point.y.toFixed(2)}, Z: ${intersect.point.z.toFixed(2)}, Objekt: ${intersect.object.name}`;
        }
    } else {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    renderer.render(scene, camera);
}

}
animate();
