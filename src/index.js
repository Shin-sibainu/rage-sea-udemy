import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shader/water/vertexShader";
import fragmentShader from "./shader/water/fragmentShader";
import * as dat from "lil-gui";
// import mountainImage from "./textures/mountain.jpg";

//デバッグ
const gui = new dat.GUI({ width: 300 });
const debugObject = {};

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Geometry
const geometry = new THREE.PlaneGeometry(12, 12, 512, 512);

//色
debugObject.depthColor = "#2d81ae";
debugObject.surfaceColor = "#66c1f9";

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(5, 2.5) },
    uBigWavesSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.03 },
    uColorMultiplier: { value: 7.6 },
  },
});

//デバッグ
gui
  .add(material.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequencyX");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequencyY");
gui
  .add(material.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uBigWavesSpeed");

gui.addColor(debugObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
gui
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");
gui
  .add(material.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");

gui.show(false);

// Mesh
const mesh = new THREE.Mesh(geometry, material);
//追加
mesh.rotation.x = -Math.PI * 0.5;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
//カメラの起点
camera.position.set(0, 0.23, 0);
// camera.lookAt(0, -3, 30);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//cursor
// const cursor = {};
// cursor.x = 0;
// cursor.y = 0;
// // console.log(cursor);
// window.addEventListener("mousemove", (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = event.clientY / sizes.height - 0.5;
//   // console.log(cursor);
// });

/**
 * Animate
 */
const clock = new THREE.Clock();
let clickCount = 1;
let isDive = false;

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  //カメラを円周上に周回させる。
  camera.position.x = Math.sin(elapsedTime * 0.17) * 3.0;
  camera.position.z = Math.cos(elapsedTime * 0.17) * 3.0;

  // controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);

  if (clickCount % 2 == 0 && isDive == false) {
    camera.position.y -= 0.01;

    // console.log(camera.position.y);
    if (camera.position.y <= -0.4) {
      isDive = true;
    }
  }

  if (clickCount % 2 == 1 && isDive == true) {
    camera.position.y += 0.01;

    // console.log(camera.position.y);
    if (camera.position.y >= 0.23) {
      isDive = false;
    }
  }
};

animate();

/* html script */
const diveButton = document.getElementById("diveButton");

diveButton.addEventListener("click", () => {
  // console.log("clicked");
  //カメラを移動
  clickCount++;
  console.log(clickCount);
});
