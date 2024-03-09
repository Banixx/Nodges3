// createGridHelpers.js
import * as THREE from 'three';

function createGridHelpers(scene) {
    const size = 10;
    const divisions = 10;
    const gridColorXY = 0x6666CC;
    const gridColorYZ = 0x66CC66;
    const gridColorXZ = 0xCC6666;

    // XY-Ebene
    const gridHelperXY = new THREE.GridHelper(size, divisions,gridColorXY,gridColorXY);
    gridHelperXY.rotation.x = Math.PI / 2
    gridHelperXY.position.z = -5;
    gridHelperXY.position.y = 5;

    scene.add(gridHelperXY);

    // YZ-Ebene
    const gridHelperYZ = new THREE.GridHelper(size, divisions,gridColorYZ,gridColorYZ);
    gridHelperYZ.rotation.z = Math.PI / 2;
    gridHelperYZ.position.x = -size / 2;
    gridHelperYZ.position.y = +5
    

    scene.add(gridHelperYZ);

    // XZ-Ebene (standardmäßig von Three.js bereitgestellt)
    const gridHelperXZ = new THREE.GridHelper(size, divisions,gridColorXZ,gridColorXZ);
    gridHelperXZ.position.y = 0
    scene.add(gridHelperXZ);
}

export { createGridHelpers };
