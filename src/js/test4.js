import '../css/test2.css';


const rot = 2.2


import * as THREE from 'three';
import { gsap } from 'gsap';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const loader = new THREE.FontLoader();
const fontjson = require("../json/osaucesansblk.json");

//import * as dat from "dat.gui";
import { BoxGeometry } from 'three';

const radians = (degrees) => {
    return degrees * Math.PI / 180;
}

const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

const map = (value, start1, stop1, start2, stop2) => {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
}

function clearThree(obj) {
    while (obj.children.length > 0) {
        clearThree(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();

    if (obj.material) {
        //in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach(prop => {
            if (!obj.material[prop])
                return;
            if (obj.material[prop] && typeof obj.material[prop].dispose === 'function')
                obj.material[prop].dispose();
        })
        obj.material.dispose();
    }
}

function randAngle() {
    return (Math.random() - 0.50) * 6.283
}

class Box {
    constructor() {
        this.geom = new BoxGeometry(1.2, 1.2, 1.2);
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
    }
}




class Cone {
    constructor() {
        this.geom = new THREE.ConeBufferGeometry(0.7, 1.2, 32);
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0; //radians(-180);
    }
}

class Icosahedron {
    constructor() {
        this.geom = new THREE.OctahedronBufferGeometry(0.9, 0);
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = radians(-180);
    }
}
class Cylinder {
    constructor() {
        this.geom = new THREE.CylinderGeometry(0.7, 0.7, 0.6, 80);
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
    }
}

class Torus {
    constructor() {
        this.geom = new THREE.TorusBufferGeometry(0.01, 0.0, 5, 32);
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
    }
}

class Torus2 {
    constructor() {
        this.geom = new THREE.TorusBufferGeometry(.5, .2, 30, 200);
        this.rotationX = radians(90);
        this.rotationY = 0;
        this.rotationZ = 0;
    }
}

//LETS GOOOOOOOOOOOOO TOP LEVEL

var raycaster = new THREE.Raycaster();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });

var originalPRatio = window.devicePixelRatio
renderer.setPixelRatio(originalPRatio);

renderer.setClearColor('black', 1);
//renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
var width = window.innerWidth;
var height = window.innerHeight;

var factor = height / width
var spacing = 120;
var fov = 25;



if (((factor) <= 1.5) && ((factor) >= 0.8)) {
    spacing = 175
}

if (((factor) <= 1.9) && ((factor) >= 1.5)) {
    spacing = 100
}

if (((factor) <= 2.2) && ((factor) >= 1.9)) {
    spacing = 90
}

if (((factor) <= 0.3) && ((factor) >= 0.2)) {
    fov = 10
}
if (((factor) <= 0.5) && ((factor) >= 0.3)) {
    fov = 14
}

var canvas = renderer.domElement;
canvas.classList.add('webgl');
document.body.appendChild(canvas);
canvas = document.getElementsByClassName("webgl")[0]

var gutter = { size: 2 };
var meshes = [];
var groupMesh = new THREE.Object3D();



renderer.setSize(width, height);


var colsNo = Math.floor(width / spacing)
var rowsNo = Math.floor(height / spacing)


var grid = { cols: colsNo, rows: rowsNo };


var mouse3D = new THREE.Vector2();
var geometries = [
    new Box(),
    new Torus2(),
    new Cone(),
    new Icosahedron(),
    new Cylinder()
];



window.addEventListener('mousemove', function(e) { onMouseMove({ clientX: e.clientX, clientY: e.clientY }) });
window.addEventListener('touchmove', function(e) { onTouch({ changedTouches: e.changedTouches }) });
window.addEventListener('touchend', touchReset());
window.addEventListener('resize', resize);


// we call this to simulate the initial position of the mouse cursor
onMouseMove({ clientX: 0, clientY: 0 });
var amblight = '#2950af'
var spotlight = '#a000ff'
var spotlight2 = '#001818'
var rectlight = '#0077ff'
var plcolour = "#0f00ff"










var camera = new THREE.PerspectiveCamera(fov, width / height, 1);
//var controls = new OrbitControls(camera, renderer.domElement);
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.ShadowMaterial({ opacity: .3 });

var floor = new THREE.Mesh(geometry, material);
floor.position.y = 0;
floor.receiveShadow = true;
floor.rotateX(-Math.PI / 2);

scene.add(floor);

// set the distance our camera will have from the grid
camera.position.set(0, 65, 0);

// we rotate our camera so we can get a view from the top
camera.rotation.x = -1.57;

scene.add(camera);
init();
animate();



function init() {
    createGrid();
    addAmbientLight(amblight);
    addSpotLight(spotlight);
    addRectLight(rectlight);
    addPointLight(plcolour, (15, 50, 50));



}

function render() {
    //controls.update();
    draw(groupMesh);
    renderer.render(scene, camera);

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function onMouseMove({ clientX, clientY }) {
    mouse3D.x = (clientX / width) * 2 - 1;
    mouse3D.y = -(clientY / height) * 2 + 1;

}

/* DiagMouse({ clientX, clientY }) {
     let a = (clientX / this.width) * 2 - 1;
     let b = -(clientY / this.height) * 2 + 1;


 }*/

function onTouch({ changedTouches }) {
    mouse3D.x = (changedTouches[0].clientX / width) * 2 - 1;
    mouse3D.y = -(changedTouches[0].clientY / height) * 2 + 1;
}

function touchReset() {
    mouse3D.x = 1;
    mouse3D.y = 1;
}




function resize() {
    /*
        meshes = []
        groupMesh = new THREE.Object3D();
        clearThree(scene);

        //originalPRatio = window.devicePixelRatio;
        renderer.setPixelRatio(originalPRatio);

        width = window.innerWidth;
        height = window.innerHeight;

        renderer.setSize(width, height);


        colsNo = Math.floor(width / spacing)
        rowsNo = Math.floor(height / spacing)

        camera.aspect = (width / height);
        camera.updateProjectionMatrix();


        grid = { cols: colsNo, rows: rowsNo };

        scene.add(floor)
            //scene.add(camera)
        init();

    */
    window.location.reload()


}



function getRandomGeometry() {
    return geometries[Math.floor(Math.random() * Math.floor(geometries.length))];
}

function getMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}

function createGrid() {
    // create a basic 3D object to be used as a container for our grid elements so we can move all of them together


    // const meshParams = {
    //     color: '#e085ef',
    //     metalness: .58,
    //     emissive: '#000000',
    //     roughness: .18,
    // };


    // we create our material outside the loop to keep it more performant
    const material = new THREE.MeshNormalMaterial();
    meshes = []


    for (let row = 0; row < grid.rows; row++) {
        meshes[row] = [];

        for (let col = 0; col < grid.cols; col++) {
            if ((col === 0 && (row === grid.rows - 1))) {
                var geometry = new Torus();


                var fontLoader = new THREE.FontLoader();
                fontLoader.load(fontjson, function(tex) {
                    var textGeo = new THREE.Mesh();
                    textGeo.geometry = new THREE.TextBufferGeometry(" TIMO ", {
                        size: 1.2,
                        height: 0.7,

                        font: tex
                    });
                    textGeo.material = new THREE.MeshNormalMaterial({
                        //color: 'white',
                        //emissive:'cyan',
                        //roughness: 0,
                        //shininess: 100,
                        //metalness: 10,
                        // color: '#f0a5ff',
                        // metalness: .58,
                        // emissive: '#000000',
                        // roughness: .18,
                        // side: THREE.DoubleSide,
                        // transparent: false,
                        // opacity: 1,
                    });

                    textGeo.geometry.computeBoundingBox();


                    // textGeo.geometry
                    //     .boundingBox
                    //     .getCenter(textGeo.position)
                    //     .multiplyScalar(-1);

                    textGeo.matrixAutoUpdate = false;
                    textGeo.updateMatrix();
                    var mesh = new THREE.Group();
                    mesh.add(textGeo);

                    mesh.position.set(-1, -3, 0.6 + row + (row * gutter.size));
                    mesh.rotation.x = radians(270)
                    mesh.rotation.y = 0
                    mesh.rotation.z = 0

                    // store the initial rotation values of each element so we can animate back
                    mesh.initialRotation = {
                        x: mesh.rotation.x,
                        y: mesh.rotation.y,
                        z: mesh.rotation.z,
                    };

                    groupMesh.add(mesh);


                    // store the element inside our array so we can get back when need to animate
                    meshes[row][col] = mesh;


                })
                groupMesh.add(mesh);
                meshes[row][col] = mesh;
                continue



            } else if ((col === 1 && (row === grid.rows - 1))) {

                var geometry = new Torus();
                var mesh = getMesh(geometry.geom, material);

            } else {

                var geometry = getRandomGeometry();
                var mesh = getMesh(geometry.geom, material);
            }



            mesh.position.set(col + (col * gutter.size), 0, row + (row * gutter.size));
            mesh.rotation.x = geometry.rotationX;
            mesh.rotation.y = geometry.rotationY;
            mesh.rotation.z = geometry.rotationZ;

            // store the initial rotation values of each element so we can animate back
            mesh.initialRotation = {
                x: mesh.rotation.x,
                y: mesh.rotation.y,
                z: mesh.rotation.z,
            };

            groupMesh.add(mesh);

            // store the element inside our array so we can get back when need to animate
            meshes[row][col] = mesh;
        }
    }

    //center on the X and Z our group mesh containing all the grid elements
    const centerX = ((grid.cols - 1) + ((grid.cols - 1) * gutter.size)) * .5;
    const centerZ = ((grid.rows - 1) + ((grid.rows - 1) * gutter.size)) * .5;
    groupMesh.position.set(-centerX, 0, -centerZ);

    scene.add(groupMesh);

}

function addAmbientLight(amblight) {
    const light = new THREE.AmbientLight(amblight, 1);

    scene.add(light);
}

function addSpotLight(spotlight) {
    const light = new THREE.SpotLight(spotlight, 1, 500);
    light.angle = radians(200)
    light.position.set(-40, 150, 2);
    light.castShadow = true;
    scene.add(light);

    const light2 = new THREE.SpotLight(spotlight, 1, 1000);
    light2.position.set(0, 33, 0);
    light2.castShadow = true;
    scene.add(light2);

    const light3 = new THREE.SpotLight(spotlight2, 1, 1000);
    light3.position.set(0, 30, 0);
    light3.castShadow = true;
    scene.add(light3);



}

function addRectLight(rectlight) {
    const light = new THREE.RectAreaLight(rectlight, 1, 2000, 2000);

    light.position.set(5, 50, 50);
    light.lookAt(0, 0, 0);

    scene.add(light);

    /*const light2 = new THREE.RectAreaLight(rectlight, 1, 2000, 2000);

    light2.position.set(5, -50, 50);
    light2.lookAt(0, 0, 0);

    scene.add(light2);*/
}

function addPointLight(color, position) {
    const light = new THREE.PointLight(color, 1, 2000, 10);

    light.position.set(position.x, position.y, position.z);

    scene.add(light);
}


function draw(groupMesh) {
    // maps our mouse coordinates from the camera perspective
    raycaster.setFromCamera(mouse3D, camera);

    // checks if our mouse coordinates intersect with our floor shape
    const intersects = raycaster.intersectObjects([floor]);

    if (intersects.length) {

        // get the x and z positions of the intersection
        const { x, z } = intersects[0].point;

        for (let row = 0; row < grid.rows; row++) {
            for (let col = 0; col < grid.cols; col++) {

                // extract out mesh base on the grid location

                const mesh = meshes[row][col];

                // calculate the distance from the intersection down to the grid element
                const mouseDistance = distance(x, z,
                    mesh.position.x + groupMesh.position.x,
                    mesh.position.z + groupMesh.position.z);


                // based on the distance we map the value to our min max Y position
                // it works similar to a radius range
                if ((col === 0 && (row === grid.rows - 1))) {


                    const maxPositionY = 3;
                    const minPositionY = 0;
                    const startDistance = 6;
                    const endDistance = 0;
                    const y = map(mouseDistance, startDistance, endDistance, minPositionY, maxPositionY);
                    let j = y < 1 ? 1 : y


                    // based on the y position we animate the mesh.position.y
                    // we don´t go below position y of 1
                    gsap.to(mesh.position, .4, { y: j });





                } else {
                    const maxPositionY = 10;
                    const minPositionY = 0;
                    const startDistance = 6;
                    const endDistance = 0;
                    const y = map(mouseDistance, startDistance, endDistance, minPositionY, maxPositionY);
                    const j = y < 1 ? 1 : y
                        // based on the y position we animate the mesh.position.y
                        // we don´t go below position y of 1
                    gsap.to(mesh.position, .4, { y: j });

                    // create a scale factor based on the mesh.position.y
                    const scaleFactor = mesh.position.y / 3;

                    // to keep our scale to a minimum size of 1 we check if the scaleFactor is below 1
                    const scale = scaleFactor < 1 ? 1 : scaleFactor;

                    // animates the mesh scale properties
                    gsap.to(mesh.scale, .9, {
                        ease: "Back.easeOut(1.7)",
                        x: scale,
                        y: scale,
                        z: scale,
                    });
                    // rotate our element
                    gsap.to(mesh.rotation, 0.7, {
                        ease: "Back.easeOut(1.7)",
                        x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x),
                        z: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.z),
                        y: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.y),
                    });
                }
            }
        }
    }
}