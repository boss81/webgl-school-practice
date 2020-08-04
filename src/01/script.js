let stats, scene, renderer, camera, controls, raycaster, gui, axesHelper;
let run = true; // レンダリングループフラグ
let isDown = false; // スペースキーが押されているかどうかのフラグ

let geometry, material, selectedMaterial, texture, directionalLight, ambientLight;

let boxArray, boxGroup

const SCENE_PARAM = {
  fogColor: 0xffffff, // フォグの色
  fogNear: 5.0,       // フォグの掛かり始めるカメラからの距離
  fogFar: 15.0        // フォグが完全に掛かるカメラからの距離
}

const RENDERER_PARAM = {
  clearColor: 0xffffff, // フォグの色と合わせる
  width: window.innerWidth,
  height: window.innerHeight,
};

const CAMERA_PARAM = {
  fovy: 60, // 縦方向の視野角
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 30.0,
  x: 0.0,
  y: 5.0,
  z: 10.0,
  lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
};

const MATERIAL_PARAM = {
  color: 0x3399ff,
  specular: 0xff0000,
};

const SELECTED_MATERIAL_PARAM = {
  color: 0xffffff,
  specular: 0xff0000,
};

const DIRECTIONAL_LIGHT_PARAM = {
  color: 0xffffff, // 光の色
  intensity: 1.0, // 光の強度
  x: 1.0, // 光の向きを表すベクトルの X 要素
  y: 1.0, // 光の向きを表すベクトルの Y 要素
  z: 1.0, // 光の向きを表すベクトルの Z 要素
};

const AMBIENT_LIGHT_PARAM = {
  color: 0xffffff,
  intensity: 0.2,
};

window.addEventListener("DOMContentLoaded", () => {

  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "Escape":
        run = event.key !== "Escape";
        console.log(run);
        break;
      case " ":
        isDown = true;
        break;
      default:
    }
  });

  window.addEventListener("keyup", () => {
    isDown = false;
  });

  window.addEventListener("click", (event) => {
    const x = (event.clientX / window.innerWidth) * 2.0 - 1.0
    const y = (event.clientY / window.innerHeight) * 2.0 - 1.0
    const v = new THREE.Vector2(x, -y);
    raycaster.setFromCamera(v, camera)
    const intersects = raycaster.intersectObjects(boxArray)

    boxArray.forEach((mesh) => {
      mesh.material = material
    })

    if(intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.material = selectedMaterial;
      }
    }
  })

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })

  const loader = new THREE.TextureLoader()
  texture = loader.load("./sample.jpg", init)
});

function init() {
  // 統計情報
  stats = new Stats();
  document.body.appendChild(stats.dom);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(
    SCENE_PARAM.fogColor,
    SCENE_PARAM.fogNear,
    SCENE_PARAM.fogFar
  )
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
  renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);

  const wrapper = document.getElementById("webgl");
  wrapper.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    CAMERA_PARAM.fovy,
    CAMERA_PARAM.aspect,
    CAMERA_PARAM.near,
    CAMERA_PARAM.far
  );
  camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
  camera.lookAt(CAMERA_PARAM.lookAt);

  const count = 10;
  const width = 1.0;
  const start = width / 2 -(count * width / 2)
  boxArray = []
  boxGroup = new THREE.Group()

  // ジオメトリ
  geometry = new THREE.BoxGeometry(width, width, width);

  // マテリアル
  // material = new THREE.MeshBasicMaterial(MATERIAL_PARAM)
  // material = new THREE.MeshLambertMaterial(MATERIAL_PARAM) // 光の影響を受けるマテリアルに変更
  material = new THREE.MeshPhongMaterial(MATERIAL_PARAM); // 光の影響を受けるマテリアルに変更
  selectedMaterial = new THREE.MeshPhongMaterial(SELECTED_MATERIAL_PARAM);
  selectedMaterial.map = texture;

  for (let i = 0; i < count; i++) {
    const x = start + i * width;
    for (let j = 0; j < count; j++) {
      const y = start + j * width;
      const box = new THREE.Mesh(geometry, material);
      box.position.x = x;
      box.position.y = y;
      boxArray.push(box);
      boxGroup.add(box);
    }
  }

  scene.add(boxGroup);

  // // plane
  // geometry = new THREE.PlaneGeometry(2.0, 4.0);
  // plane = new THREE.Mesh(geometry, material);
  // plane.position.z = -4.0;
  // scene.add(plane);

  // ライト
  directionalLight = new THREE.DirectionalLight(
    DIRECTIONAL_LIGHT_PARAM.color,
    DIRECTIONAL_LIGHT_PARAM.intensity
  );
  directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
  directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
  directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
  scene.add(directionalLight);

  ambientLight = new THREE.AmbientLight(
    AMBIENT_LIGHT_PARAM.color,
    AMBIENT_LIGHT_PARAM.intensity
  );
  scene.add(ambientLight);

  axesHelper = new THREE.AxesHelper(5.0);
  scene.add(axesHelper);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  raycaster = new THREE.Raycaster()

  run = true;
  render();
}

function render() {
  // 再帰呼び出し
  if (run === true) {
    requestAnimationFrame(render);
  }
  if (isDown === true) {
    boxArray.forEach((box) => {
      box.rotation.x += 0.02;
      box.rotation.y += 0.02;
    })
    boxGroup.rotation.z += 0.02;
  }

  stats.begin();
  stats.end();
  // 描画
  renderer.render(scene, camera);
}
