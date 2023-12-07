import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('DOMContentLoaded', init);

// シーンの作成
const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color(0x404040);

function init() {
  ///////////////////////////////////////////////
  /////////////// websocket setting /////////////
  ///////////////////////////////////////////////
  const socket_url: string = `ws://${window.location.hostname}:5050`;
  const socket = new WebSocket(socket_url);
  socket.onopen = function(event) {
    console.log('WebSocket is connected.');
  }
  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    addBox(data.width, data.height, data.depth,
          Math.random()*500-1000, Math.random()*500-1000, 300);
  }
  socket.onerror = function(event) {
    console.log('WebSocket error: ', event);
  }

 
  ///////////////////////////////////////////////
  /////////////// three.js setting //////////////
  ///////////////////////////////////////////////
  // レンダラーを作成
  const width = 1280;
  const height = 720;
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  // レンダラーのサイズを設定
  renderer.setSize(width,height);
  renderer.setPixelRatio(window.devicePixelRatio);
  // canvasをbodyに追加
  document.body.appendChild(renderer.domElement);
 
  // カメラを作成
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60, width/height, 0.1, 10000);
  camera.up.set(0,0,1);
  var rot: number = 0;
  camera.position.set(600,0,600);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // カメラコントローラーを作成
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();


  // フィールドの作成
  // ----------------------
  {
    const geometry: THREE.BoxGeometry       = new THREE.BoxGeometry(
      1000, 1000, 10);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial( {
      color: 0xffffff
    } );
    const field: THREE.Mesh                  = new THREE.Mesh( geometry, material );
    field.position.set(0, 0, -geometry.parameters.depth/2);
    scene.add( field );
  }
 
  // キューブの作成
  // -----------------------
  const geometry: THREE.BoxGeometry       = new THREE.BoxGeometry( 100, 100, 100 );
  const edge_geometry: THREE.EdgesGeometry = new THREE.EdgesGeometry(geometry);
  const edge_material = new THREE.LineBasicMaterial({ color: 0x111111, linewidth: 1 });
  const edge_segments = new THREE.LineSegments(edge_geometry, edge_material);
  edge_segments.position.set(0, 0, 150);
  scene.add(edge_segments);
  const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial( {
    color: 0x00ff00, opacity: 0.5, transparent: true,
  } );
  const geometry2: THREE.BoxGeometry       = new THREE.BoxGeometry( 50, 50, 50 );
  const material2: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial( {
    color: 0xff00ff,
  } );

  // 上記のボックスジオメトリとマテリアルを使ってメッシュを生成
  const cube: THREE.Mesh                  = new THREE.Mesh( geometry, material );
  const cube2: THREE.Mesh                 = new THREE.Mesh( geometry2, material2);
 
  cube.position.set(0, 0, 150);
  cube2.position.set(0, 0, 150);
  // シーンにキューブを追加
  scene.add( cube );
  scene.add( cube2 );

  // エッジの作成
  const geometry3: THREE.BoxGeometry       = new THREE.BoxGeometry( 150, 150, 150 );
  const edge_geometry3: THREE.EdgesGeometry = new THREE.EdgesGeometry(geometry3);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x111111, linewidth: 2 });
  const lineSegments = new THREE.LineSegments(edge_geometry3, lineMaterial);
  lineSegments.position.set(0, 0, 150);
  scene.add(lineSegments);
  

 
  // 平行光源を生成
  const directional_light:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
  // 光源の位置を設定
  directional_light.position.set(0,0,1);
  // シーンに光源を追加
  scene.add(directional_light);

  // 環境光を生成
  const ambient_light:THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.2);
  // シーンに環境光を追加
  scene.add(ambient_light);

  // 座標軸表示
  const axes = new THREE.AxesHelper(400);
  scene.add(axes);
 
 
  // 毎フレーム更新関数
  const tick = ():void => {
    // 一定間隔で処理を繰り返す(引数に関数名を渡す)
    requestAnimationFrame(tick);
    // キューブの回転を変更
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    edge_segments.rotation.x = cube.rotation.x;
    edge_segments.rotation.y = cube.rotation.y;
    edge_segments.rotation.z = cube.rotation.z;
    cube2.rotation.x -= 0.01;
    cube2.rotation.y -= 0.01;
    cube2.rotation.z -= 0.01;
    lineSegments.rotation.x += 0.005;
    lineSegments.rotation.y -= 0.005;
    lineSegments.rotation.z += 0.005;
    rot += 0.3;
    const radian = (rot * Math.PI) / 180;
    // camera.position.x = 500 * Math.cos(radian);
    // camera.position.y = 500 * Math.sin(radian);
    // camera.lookAt(new THREE.Vector3(0,0,0));
 
    // 描画
    renderer.render(scene, camera);
  }
 
  // 毎フレーム更新関数を実行
  tick();
 
};

function addBox(width: number, height: number, depth: number,
                x: number, y: number, z: number) {
  const geometry: THREE.BoxGeometry       = new THREE.BoxGeometry(width, height, depth);
  const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial( {
    color: 0x555555
  } );
  const box: THREE.Mesh                  = new THREE.Mesh( geometry, material );
  box.position.set(x, y, z);
  scene.add( box );
}







///////////////////////////////////////////////
////////////// recorder setting ///////////////
///////////////////////////////////////////////

// recorder 設定
function processMediaWhenStop(stream: MediaStream, onStop: (blob: Blob) => void) {
  const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9") ? "video/webm; codecs=vp9" : "video/webm";
  const mediaRecorder = new MediaRecorder(stream, { mimeType: mime })
  // start record
  const chunks: BlobPart[] = []
  mediaRecorder.addEventListener('dataavailable', e => chunks.push(e.data))

  // call on stop callback
  mediaRecorder.addEventListener('stop', async () => {
    const blob = new Blob(chunks, { type: (chunks[0] as Blob).type })
    await onStop(blob)
  })

  return mediaRecorder
}

function downloadWebm(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'video.webm';
  a.click();
}

/*
録画開始時

stream = document.querySelector('canvas').captureStream()
recorder = processMediaWhenStop(stream, downloadWebm)
recorder.start() // 録画開始

録画停止時
recorder.stop() // 録画停止

*/
