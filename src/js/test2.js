import '../css/test2.css';


const rot = 2.2


import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const loader = new THREE.FontLoader();
const fontjson = require("../json/osaucesansblk.json");






import * as dat from "dat.gui";
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
            if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
                obj.material[prop].dispose();
        })
        obj.material.dispose();
    }
}

class Box {
    constructor() {
        this.geom = new BoxGeometry(1.2, 1.2, 1.2);
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0
    }
}
/*

class TimoText {
    constructor() {
        this.geom = new THREE.TextBufferGeometry("TIMO\n CHUNG ", {
            size: 120,
            height: 90,
            bevelEnabled: true,
            bevelThickness: 8,
            bevelSize: 5,
            bevelOffset: -2,
            bevelSegments: 3,
            curveSegments: 60,
            font: new THREE.Font(fontJson)
        })

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
    }
}
*/

class Cone {
    constructor() {
        this.geom = new THREE.ConeBufferGeometry(0.6, 1.2, 32);
        this.rotationX = 0 //Math.random();
        this.rotationY = 0 //Math.random();
        this.rotationZ = radians(-180) //+ rot * (Math.random() - 0.5);
    }
}

class Icosahedron {
    constructor() {
        this.geom = new THREE.IcosahedronBufferGeometry(0.9, 0);
        this.rotationX = 0 //(Math.random() - .5);
        this.rotationY = 0;
        this.rotationZ = radians(-180) // + rot * (Math.random() - 0.5);
    }
}
class Cylinder {
    constructor() {
        this.geom = new THREE.CylinderGeometry(0.7, 0.7, 0.6, 80);
        this.rotationX = 0 //rot * (Math.random() - 0.5)
        this.rotationY = 0;
        this.rotationZ = 0 //radians(-180);
    }
}

class Torus {
    constructor() {
        this.geom = new THREE.TorusBufferGeometry(0.01, 0.01, 5, 32);
        this.rotationX = radians(90);
        this.rotationY = 0 //rot * Math.random();
        this.rotationZ = 0;
    }
}

class Scene {
    constructor() {
        // handles mouse coordinates mapping from 2D canvas to 3D world
        this.textGeo = 0
        this.raycaster = new THREE.Raycaster();
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.originalPRatio = window.devicePixelRatio
        this.renderer.setPixelRatio(this.originalPRatio);

        this.renderer.setClearColor('black', 1);
        //this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.spacing = 120

        const canvas = this.renderer.domElement;
        canvas.classList.add('webgl');
        document.body.appendChild(canvas);
        this.canvas = document.getElementsByClassName("webgl")[0]

        this.gutter = { size: 2 };
        this.meshes = [];
        //this.canvasWidth = this.canvas.offsetWidth;
        //this.canvasHeight = this.canvas.offsetHeight;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer.setSize(this.width, this.height);


        var colsNo = Math.floor(this.width / this.spacing)
        var rowsNo = Math.floor(this.height / this.spacing)


        this.grid = { cols: colsNo, rows: rowsNo };


        this.mouse3D = new THREE.Vector2();
        this.geometries = [
            new Box(),
            //new Torus(),
            new Cone(),
            new Icosahedron(),
            new Cylinder()
        ];

        //window.addEventListener('mousemove', this.DiagMouse.bind(this), { passive: false });

        //document.getElementsByClassName("webgl")[0].addEventListener('mousemove', this.onMouseMove.bind(this), { passive: false });
        //document.getElementsByClassName("webgl")[0].addEventListener('touchmove', this.onTouch.bind(this), { passive: false });
        //document.getElementsByClassName("webgl")[0].addEventListener('touchend', this.touchReset.bind(this), { passive: false });

        window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: false });
        window.addEventListener('touchmove', this.onTouch.bind(this), { passive: false });
        window.addEventListener('touchend', this.touchReset.bind(this), { passive: false });


        // we call this to simulate the initial position of the mouse cursor
        this.onMouseMove({ clientX: 0, clientY: 0 });
        this.init();

        this.animate();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    init() {
        this.amblight = '#2950af'
        this.spotlight = '#e000ff'
        this.rectlight = '#0047ff'
        this.plcolour = "#0f00ff"


        this.createCamera();
        this.createGrid();
        this.addAmbientLight();
        this.addSpotLight();
        this.addRectLight();
        this.addPointLight(this.plcolour, (5, 40, 40));
        this.addFloor();
        this.addEvents();


    }

    render() {

        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.draw();
        this.render();
    }

    onMouseMove({ clientX, clientY }) {
        this.mouse3D.x = (clientX / this.width) * 2 - 1;
        this.mouse3D.y = -(clientY / this.height) * 2 + 1;


    }

    /* DiagMouse({ clientX, clientY }) {
         let a = (clientX / this.width) * 2 - 1;
         let b = -(clientY / this.height) * 2 + 1;


     }*/

    onTouch({ changedTouches }) {
        this.mouse3D.x = (changedTouches[0].clientX / this.width) * 2 - 1;
        this.mouse3D.y = -(changedTouches[0].clientY / this.height) * 2 + 1;
    }

    touchReset() {
        this.mouse3D.x = 1;
        this.mouse3D.y = 1;
    }

    addEvents() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        clearThree(this.scene);
        this.originalPRatio = window.devicePixelRatio;
        this.renderer.setPixelRatio(this.originalPRatio);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer.setSize(this.width, this.height);


        var colsNo = Math.floor(this.width / this.spacing)
        var rowsNo = Math.floor(this.height / this.spacing)



        this.grid = { cols: colsNo, rows: rowsNo };

        this.createCamera();
        this.createGrid();
        this.addAmbientLight();
        this.addSpotLight();
        this.addRectLight();
        this.addPointLight(this.plcolour, (5, 40, 40));
        this.addFloor();
        this.addEvents();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(20, this.width / this.height, 1);

        // set the distance our camera will have from the grid
        this.camera.position.set(0, 65, 0);

        // we rotate our camera so we can get a view from the top
        this.camera.rotation.x = -1.57;

        this.scene.add(this.camera);
    }

    getRandomGeometry() {
        return this.geometries[Math.floor(Math.random() * Math.floor(this.geometries.length))];
    }

    getMesh(geometry, material) {
        const mesh = new THREE.Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }
    createGrid() {
        // create a basic 3D object to be used as a container for our grid elements so we can move all of them together
        this.groupMesh = new THREE.Object3D();

        const meshParams = {
            color: '#f0a5ff',
            metalness: .58,
            emissive: '#000000',
            roughness: .18,
        };


        // we create our material outside the loop to keep it more performant
        const material = new THREE.MeshPhysicalMaterial(meshParams);



        for (let row = 0; row < this.grid.rows; row++) {
            this.meshes[row] = [];

            for (let col = 0; col < this.grid.cols; col++) {

                if ((col === 0 && (row === this.grid.rows - 1))) {

                    var geometry = new Torus();
                    if (this.textGeo == 0) {
                        //var mesh = this.getMesh(geometry.geom, material);
                        var mesh = this.getMesh(geometry.geom, material);
                    } else {
                        var mesh = this.textGeo
                    }

                } else if ((col === 1 && (row === this.grid.rows - 1))) {
                    //continue;
                    var geometry = new Torus();
                    var mesh = this.getMesh(geometry.geom, material);

                } else {

                    var geometry = this.getRandomGeometry();
                    var mesh = this.getMesh(geometry.geom, material);
                }



                mesh.position.set(col + (col * this.gutter.size), 0, row + (row * this.gutter.size));
                mesh.rotation.x = geometry.rotationX;
                mesh.rotation.y = geometry.rotationY;
                mesh.rotation.z = geometry.rotationZ;

                // store the initial rotation values of each element so we can animate back
                mesh.initialRotation = {
                    x: mesh.rotation.x,
                    y: mesh.rotation.y,
                    z: mesh.rotation.z,
                };

                this.groupMesh.add(mesh);

                // store the element inside our array so we can get back when need to animate
                this.meshes[row][col] = mesh;
            }
        }

        //center on the X and Z our group mesh containing all the grid elements
        const centerX = ((this.grid.cols - 1) + ((this.grid.cols - 1) * this.gutter.size)) * .5;
        const centerZ = ((this.grid.rows - 1) + ((this.grid.rows - 1) * this.gutter.size)) * .5;
        this.groupMesh.position.set(-centerX, 0, -centerZ);

        this.scene.add(this.groupMesh);

    }

    addAmbientLight() {
        const light = new THREE.AmbientLight(this.amblight, 1);

        this.scene.add(light);
    }

    addSpotLight() {
        const ligh = new THREE.SpotLight(this.spotlight, 1, 1000);

        ligh.position.set(0, 100, 0);
        ligh.castShadow = true;

        this.scene.add(ligh);
    }

    addRectLight() {
        const light = new THREE.RectAreaLight(this.rectlight, 1, 2000, 2000);

        light.position.set(5, 50, 50);
        light.lookAt(0, 0, 0);

        this.scene.add(light);
    }

    addPointLight(color, position) {
        const light = new THREE.PointLight(color, 1, 1000, 1);

        light.position.set(position.x, position.y, position.z);

        this.scene.add(light);
    }

    addFloor() {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.ShadowMaterial({ opacity: .3 });

        this.floor = new THREE.Mesh(geometry, material);
        this.floor.position.y = 0;
        this.floor.receiveShadow = true;
        this.floor.rotateX(-Math.PI / 2);

        this.scene.add(this.floor);
    }

    draw() {
        // maps our mouse coordinates from the camera perspective
        this.raycaster.setFromCamera(this.mouse3D, this.camera);

        // checks if our mouse coordinates intersect with our floor shape
        const intersects = this.raycaster.intersectObjects([this.floor]);

        if (intersects.length) {

            // get the x and z positions of the intersection
            const { x, z } = intersects[0].point;

            for (let row = 0; row < this.grid.rows; row++) {
                for (let col = 0; col < this.grid.cols; col++) {

                    // extract out mesh base on the grid location
                    const mesh = this.meshes[row][col];

                    // calculate the distance from the intersection down to the grid element
                    const mouseDistance = distance(x, z,
                        mesh.position.x + this.groupMesh.position.x,
                        mesh.position.z + this.groupMesh.position.z);


                    // based on the distance we map the value to our min max Y position
                    // it works similar to a radius range

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


var test = new Scene();

var fontLoader = new THREE.FontLoader();
fontLoader.load(fontjson, function(tex) {
    var textGeo = new THREE.Mesh();
    textGeo.geometry = new THREE.TextGeometry("TIMO ", {
        size: 1,
        height: 1,
        /*
        bevelEnabled: true,
        bevelThickness: 8,
        bevelSize: 5,
        bevelOffset: -2,
        bevelSegments: 3,
        curveSegments: 60,*/
        font: tex
    });
    textGeo.material = new THREE.MeshPhysicalMaterial({
        //color: 'white',
        //emissive:'cyan',
        //roughness: 0,
        //shininess: 100,
        //metalness: 10,
        side: THREE.DoubleSide,
        //transparent: false,
        // opacity: 1,
        color: '#f0a5ff',
        metalness: .58,
        emissive: '#000000',
        roughness: .18,
    });

    textGeo.geometry.computeBoundingBox();
    textGeo.geometry
        .boundingBox
        .getCenter(textGeo.position)
        .multiplyScalar(-1);

    textGeo.matrixAutoUpdate = false;
    textGeo.updateMatrix();

    var textrow = test.grid.rows - 2

    const pivot = new THREE.Object3D();
    pivot.add(textGeo);



    //pivot.position.set(-3, 1, 7);


    //pivot.rotation.x = radians(270)
    //pivot.rotation.y = radians(90)
    // pivot.rotation.z = radians(90)


    test.textGeo = pivot
})