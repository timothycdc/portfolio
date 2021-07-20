varying vec2 vUv;
uniform float uTime;

void main() {
  vUv = uv;

  float time = uTime * 1.0;

  vec3 transformed = position;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}