// ====== Import โมดูลหลักจาก Three.js ======
import * as THREE from "three"; // ใช้สำหรับสร้างวัตถุ 3D, แสง, กล้อง และเรนเดอร์
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // ควบคุมการหมุนกล้องด้วยเมาส์
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"; // ใช้โหลดโมเดล .glb หรือ .gltf

// ====== สร้าง Scene, Camera, Renderer ======
const scene = new THREE.Scene(); // ฉากหลักที่จะเก็บวัตถุทั้งหมด
scene.background = new THREE.Color(0xa0d8f0); // ตั้งสีพื้นหลังเป็นฟ้าอ่อน (ท้องฟ้า)

// ตั้งค่ากล้องมุมมอง Perspective (คล้ายสายตามนุษย์)
const camera = new THREE.PerspectiveCamera(
  60, // มุมมอง (องศา)
  window.innerWidth / window.innerHeight, // อัตราส่วนของหน้าจอ
  0.1, // ระยะใกล้สุดที่เห็น
  1000 // ระยะไกลสุดที่เห็น
);
camera.position.set(20, 15, 35); // ตั้งตำแหน่งกล้องให้เห็นภาพรวมของฉาก

// ตัวเรนเดอร์ ใช้ WebGL แสดงผลภาพบนหน้าจอ
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // เปิดใช้งานเงา
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // เงาแบบนุ่มนวล
document.body.appendChild(renderer.domElement); // เพิ่ม canvas ลงในหน้าเว็บ

// ====== พื้นดิน (ท้องนา) ======
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200), // สร้างพื้นขนาด 200x200
  new THREE.MeshStandardMaterial({ color: 0x4caf50 }) // สีเขียวเหมือนทุ่งนา
);
ground.rotation.x = -Math.PI / 2; // หมุนให้ราบกับพื้น
ground.receiveShadow = true; // ให้พื้นรับเงา
scene.add(ground);

// ====== แม่น้ำ (เรียบแบบในภาพ) ======
const riverGeometry = new THREE.PlaneGeometry(30, 200, 32, 32); // สร้างระนาบแคบยาวแทนแม่น้ำ
const riverMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e6eff, // น้ำเงินเข้มเหมือนน้ำ
  metalness: 0.1, // ทำให้น้ำสะท้อนแสงนิดๆ
});
const river = new THREE.Mesh(riverGeometry, riverMaterial);
river.rotation.x = -Math.PI / 2; // หมุนให้ขนานกับพื้น
river.position.set(-10, 0.02, 0); // ขยับให้สูงกว่าพื้นนิดหน่อย
scene.add(river);

// ====== แสงหลัก (Directional Light จำลองแสงจากดวงอาทิตย์) ======
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5); // แสงสีขาวเข้ม
sunLight.position.set(50, 80, 30); // วางตำแหน่งให้มาจากด้านบนขวา
sunLight.castShadow = true; // ให้แสงนี้สร้างเงาได้
sunLight.shadow.mapSize.width = 2048; // ความละเอียดของเงา
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// ====== แสงรอบข้าง (Ambient Light) ======
const ambient = new THREE.AmbientLight(0xffffff, 0.5); // เพิ่มความสว่างรวมทั้งฉาก
scene.add(ambient);

// ====== โหลดโมเดล (GLTFLoader) ======
const loader = new GLTFLoader();

// ====== โหลดภูเขา ======
loader.load("./ภูเขา.glb", (gltf) => {
  const mountain = gltf.scene;
  mountain.position.set(70, 0, -80); // วางไว้ด้านหลังฉาก
  mountain.scale.set(60, 60, 60); // ปรับขนาดให้ใหญ่
  mountain.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true; // ให้สร้างเงา
      o.receiveShadow = true; // ให้รับเงา
    }
  });
  scene.add(mountain);
});


// ====== โหลดบ้าน ======
loader.load("./house.glb", (gltf) => {
  const house = gltf.scene;
  house.position.set(30, 10, 10); // วางไว้ใกล้แม่น้ำ
  house.scale.set(15, 15, 15); // ขนาดใหญ่พอดีฉาก
  house.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  scene.add(house);
});

// ====== โหลดต้นไม้หลายต้นแบบสุ่ม ======
loader.load("./ต้นไม้.glb", (gltf) => {
  for (let i = 0; i < 90; i++) { // สุ่มสร้าง 90 ต้น
    const tree = gltf.scene.clone(); // โคลนต้นไม้จากโมเดลต้นฉบับ
    const x = Math.random() * 60 - 90; // กระจายไปทางซ้าย
    const z = Math.random() * 200 - 100; // กระจายไปตามความลึก
    tree.position.set(x, 0, z);
    tree.scale.set(5, 5, 5); // ปรับขนาดต้นไม้
    tree.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    scene.add(tree);
  }
});

// ====== พระอาทิตย์ ======
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(9, 32, 32), // สร้างทรงกลมขนาดใหญ่
  new THREE.MeshBasicMaterial({ color: 0xffdd33 }) // สีเหลืองทอง
);
sun.position.set(-40, 100, -100); // ตั้งไว้บนท้องฟ้า
scene.add(sun);

// ====== เมฆ ======
const cloudMat = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.85, // ความโปร่งเล็กน้อย
});
const clouds = [];
for (let i = 0; i < 9; i++) { // สร้างเมฆ 9 กลุ่ม
  const cloud = new THREE.Group();
  const parts = 3 + Math.floor(Math.random() * 3); // แต่ละกลุ่มมีหลายก้อน
  for (let j = 0; j < parts; j++) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(3 + Math.random() * 1.5, 16, 16), // ก้อนเมฆกลมๆ
      cloudMat
    );
    puff.position.set(j * 3 - 4, Math.random() * 2, Math.random() * 2);
    cloud.add(puff);
  }
  cloud.position.set(-40 + i * 20, 40 + Math.random() * 10, -40 + Math.random() * 20);
  cloud.scale.setScalar(1 + Math.random() * 0.5);
  scene.add(cloud);
  clouds.push(cloud);
}

// ====== Controls (ควบคุมการหมุนกล้อง) ======
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // ทำให้การหมุนกล้องนุ่มนวล

// ====== Animation (แอนิเมชันหลัก) ======
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.01;

  // เมฆลอยอย่างช้า ๆ จากซ้ายไปขวา
  clouds.forEach((c) => {
    c.position.x += 0.08;
    if (c.position.x > 100) c.position.x = -100; // วนกลับมาใหม่
  });

  controls.update(); // อัปเดตการควบคุมกล้อง
  renderer.render(scene, camera); // เรนเดอร์ฉาก
}
animate();

// ====== ปรับขนาดเมื่อหน้าจอเปลี่ยน ======
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
