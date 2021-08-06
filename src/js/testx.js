import '../css/test1.css';
const glsl = require('glslify');

const style = 'color:red; font-size:30px; font-weight: bold; -webkit-text-stroke: 1px black;'
console.log("%cUwu henlo this is TEST JS", style);


import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';




const settings = {
    speed: 0.1,
    density: 4.0,
    strength: 1.0,
    frequency: 0.8,
    amplitude: 0,
    intensity: 0.7,
};


const noise = `
  // GLSL textureless classic 3D noise "cnoise",
  // with an RSL-style periodic variant "pnoise".
  // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
  // Version: 2011-10-11
  //
  // Many thanks to Ian McEwan of Ashima Arts for the
  // ideas for permutation and gradient selection.
  //
  // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
  // Distributed under the MIT license. See LICENSE file.
  // https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
`;
const rotation = `
  mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }
  
  vec3 rotateY(vec3 v, float angle) {
    return rotation3dY(angle) * v;
  }  
`;


const vertexShader = `  
varying float vDistort;
  
uniform float uTime;
uniform float uSpeed;
uniform float uNoiseDensity;
uniform float uNoiseStrength;
uniform float uFrequency;
uniform float uAmplitude;

${noise}

${rotation}

void main() {
  float t = uTime * uSpeed;
  float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;

  vec3 pos = position + (normal * distortion);
  float angle = sin(uv.y * uFrequency + t) * uAmplitude;
  pos = rotateY(pos, angle);    
  
  vDistort = distortion;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}  
`;

const fragmentShader = `
varying vec2 vUv;
varying float vDistort;

uniform float uIntensity;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}   

void main() {
  float distort = vDistort * uIntensity;

  // These values are my fav combination, 
  // they remind me of Zach Lieberman's work.
  // You can find more combos in the examples from IQ:
  // https://iquilezles.org/www/articles/palettes/palettes.htm
  // Experiment with these!
  vec3 brightness = vec3(0.5, 0.5, 0.5);
  vec3 contrast = vec3(0.3, 0.3, 0.3);
  vec3 oscilation = vec3(1.2, 1, 0.1);
  vec3 phase = vec3(0.1, 0.05, 0);

  // Pass the distortion as input of cospalette
  vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase);

  gl_FragColor = vec4(color, 1.0);
}
`;

class Scene {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setClearColor('black', 0);
        this.x = 0
        this.y = 0
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowX = Math.round(window.innerWidth / 2);
        this.windowY = Math.round(window.innerHeight / 2);

        this.camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 4);

        this.scene = new THREE.Scene();

        this.clock = new THREE.Clock();
        //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.init();

        this.animate();
    }

    init() {
        this.addCanvas();
        this.addElements();
        this.addEvents();
    }

    coordinates(cX, cY) {
        this.mouseX = cX - this.windowX;
        this.mouseY = cY - this.windowY;


    }

    onMouseMove(dX, dY) {
        this.coordinates(dX, dY);


    }

    onTouchMove(eX, eY) {
        //        const touchX = e.changedTouches[0].clientX;
        //       const touchY = e.changedTouches[0].clientY;
        this.coordinates(eX, eY);
    }



    addCanvas() {
        const canvas = this.renderer.domElement;
        canvas.classList.add('webgl');
        var el = document.getElementById('blob')
        el.appendChild(canvas);
    }

    addElements() {
        const geometry = new THREE.IcosahedronBufferGeometry(1, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: settings.speed },
                uNoiseDensity: { value: settings.density },
                uNoiseStrength: { value: settings.strength },
                uFrequency: { value: settings.frequency },
                uAmplitude: { value: settings.amplitude },
                uIntensity: { value: settings.intensity },
            },
            wireframe: true,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    addEvents() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.windowX = Math.round(window.innerWidth / 2);
        this.windowY = Math.round(window.innerHeight / 2);

        this.camera.aspect = width / height;
        this.renderer.setSize(width, height);

        this.camera.updateProjectionMatrix();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render() {
        //this.controls.update();


        // Update uniforms
        this.mesh.material.uniforms.uTime.value = this.clock.getElapsedTime();
        this.mesh.material.uniforms.uSpeed.value = settings.speed;
        this.mesh.material.uniforms.uNoiseDensity.value = settings.density;
        this.mesh.material.uniforms.uNoiseStrength.value = settings.strength;
        this.mesh.material.uniforms.uFrequency.value = settings.frequency;
        this.mesh.material.uniforms.uAmplitude.value = settings.amplitude;
        this.mesh.material.uniforms.uIntensity.value = settings.intensity;

        const ct = 0.07;


        this.x += (this.mouseX - this.x) * ct;
        this.camera.position.x = this.x / 200
        this.y += (this.mouseY - this.y) * ct;
        this.camera.position.y = this.y / 200


        //this.camera.position.x += (this.mouseX - this.camera.position.x) * ct;
        // this.camera.position.y += (this.mouseY - this.camera.position.y) * ct;





        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

let testScene = new Scene();
document.addEventListener('mousemove', function(e) { testScene.onMouseMove(e.clientX, e.clientY) });
document.addEventListener('touchmove', function(e) { testScene.onTouchMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY) });