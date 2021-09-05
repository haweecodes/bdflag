import { React, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const [width, height] = [600, 400];
let flag;
let center;
let flagBackground = "#006a4e";
let flagCircle = "#f42a41";
const [sizeW,sizeH,segW,segH] = [30,20,30,20];

function FlagComponent() {
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(
    new THREE.PerspectiveCamera(60, width / height, 1, 1000)
  );
  const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true }));

  useEffect(() => {
    new OrbitControls(camera, renderer.domElement);

    //set camera position
    camera.position.set(0, 0, 40);
    camera.lookAt(new THREE.Vector3(0, 0.0));
    renderer.setSize(width, height);
    document.getElementById("renderArea").appendChild(renderer.domElement);

    // set lights
    const light = new THREE.DirectionalLight("#FFFFFF");
    light.position.set(10, 50, 100);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight("#999999");
    scene.add(ambientLight);

    //set flag
    let geometry = new THREE.PlaneGeometry(sizeW,sizeH,segW,segH);
    let material = new THREE.MeshBasicMaterial({
      color: flagBackground,
      side: THREE.DoubleSide,
    });
    flag = new THREE.Mesh(geometry, material);
    scene.add(flag);

    // set flag center
    let geometry2 = new THREE.CircleGeometry(5, 32);
    let material2 = new THREE.MeshBasicMaterial({ color: flagCircle });
    center = new THREE.Mesh(geometry2, material2);
    center.translateZ(1.2);
    scene.add(center);

    update();
  }, [camera, renderer, scene]);

  function update() {
    const h = 0.5;
    const v = 0.3;
    const w = 0.2;
    const s = 0.5;

    for (let y = 0; y < segH + 1; y++) {
      for (let x = 0; x < segW + 1; x++) {
        const index = x + y * (segW + 1);
        const vertex = flag.geometry.vertices[index];
        const time = (Date.now() * s) / 50;
        vertex.z = (Math.sin(h * x + v * y - time) * w * x) / 4;
      }
    }
    for (let y = 0; y < 32 + 1; y++) {
        const index = y;
        const vertex = center.geometry.vertices[index];
        const time = (Date.now() * s) / 50;
        vertex.z = (Math.sin(h * vertex.x + v * y - time) * w * vertex.x) / 4;
    }
    
    center.geometry.verticesNeedUpdate = true;
    flag.geometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);
    window.requestAnimationFrame(update);
  }
  return (
    <div>
      <div id="renderArea"></div>
      <label>Use your mouse to move and see</label>
    </div>
  );
}

export default FlagComponent;
