'use strict'


let mic, fft, spectrum;
function setup() {
    noCanvas();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  meshAudio();
}

const meshAudio = () => {
    //fft
    //fps 
    const stats = new Stats();
    document.body.appendChild(stats.domElement); 

    const scene = new THREE.Scene();

    let camera  = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    

    if(renderer.vr.isPresenting()) {
        document.body.appendChild( VRButton.createButton( renderer ) );
        renderer.vr.enabled = true;
        } else {
        document.body.appendChild(renderer.domElement); 
        }
    
    const onWindowResize = () => {
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    window.addEventListener( 'resize', onWindowResize, false );
    //helper functions
    const simplex = new SimplexNoise(Math.random());
    
    const map =(value,  min1,  max1,  min2,  max2)=> {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    //materials
    const jLmat = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('textures/metalTex_COLOR.png'), 
        side: THREE.FrontSide,
        aoMap: new THREE.TextureLoader().load('textures/metalTex_OCC.png'),
        aoMapIntensity: 8,
        wireframe: false
    });
    
   const sphere = new THREE.Mesh((new THREE.SphereGeometry(2,10,10)), jLmat);
   sphere.position.set(0,0,-10);
   scene.add(sphere);

   const light1 = new THREE.DirectionalLight('rgb(255,255,255)',1,100);
   light1.position.set(-4,0,10);
   scene.add(light1);
 
  
  

const render = () => {
    renderer.render(scene, camera);
}
let speed =0;
const update = () => {
     spectrum = fft.analyze();
    
    speed = speed + 1;
    
    let s1 = map(Math.sin(speed/200),-1,1,0,5);
    let s2 = map(Math.sin(speed/100),-1,1,0,1);
    let s3 = map(Math.sin(speed/150),-1,1,0,1);
    let bass = map(spectrum[100],0,150,0,2);
    let n1 = map(simplex.noise2D((speed/100),(speed/500)),-1,1,-5,5);
    let n2 = map(simplex.noise2D((speed/100),(speed/1000)),-1,1,-5,5);
  
    makeRoughBall(sphere,(speed*50),2,2,1,0.5,0.6,0.2);
    sphere.position.x = n1;
    sphere.position.y = n2;
    sphere.rotation.x += 0.02;
    sphere.rotation.z -= (0.01);
   
    // console.log(bass);
  
}
  
const makeRoughBall = (mesh,time, bassFr, treFr, amp, sp1, sp2, sp3) => { 
    
    mesh.geometry.vertices.forEach(function (vertex, i) {
    var offset = mesh.geometry.parameters.radius;
    
    vertex.normalize();
    var distance = (offset + bassFr ) + simplex.noise3D(
          (vertex.x * i%2) + time * (0.0007)*sp1,
          (vertex.y * i%2)  + time * (0.0008)*sp2,
          (vertex.z * i%2)  + time * (0.0009)*sp3
    ) * amp * treFr;
    vertex.multiplyScalar(distance);
  });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
}

const drawtoScreen = () => {
    renderer.setAnimationLoop(drawtoScreen);
    update();
    stats.update(); 
    render();
}
   
    drawtoScreen();
}

console.log('hi');











