


// const three_globe_logo_container = document.getElementById("three-logo-container");


// var container_width, container_height;


// let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(45, three_globe_logo_container.offsetWidth / three_globe_logo_container.offsetHeight, 1, 2000);
// camera.position.set(0.5, 0.5, 1).setLength(14);
// let renderer = new THREE.WebGLRenderer({
//   antialias: true
// });
// renderer.setSize(three_globe_logo_container.offsetWidth, three_globe_logo_container.offsetHeight);
// renderer.setClearColor(0xFFFFFF);


// three_globe_logo_container.appendChild(renderer.domElement);


// window.addEventListener("resize", onWindowResize);

// let controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enablePan = false;
// controls.minDistance = 6;
// controls.maxDistance = 15;
// controls.enableDamping = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed *= 0.25;

// let globalUniforms = {
//   time: { value: 0 }
// };

// // <GLOBE>
// // https://web.archive.org/web/20120107030109/http://cgafaq.info/wiki/Evenly_distributed_points_on_sphere#Spirals
// let counter = 1900000;
// let rad = 5;
// let sph = new THREE.Spherical();

// let r = 0;
// let dlong = Math.PI * (3 - Math.sqrt(5));
// let dz = 2 / counter;
// let long = 0;
// let z = 1 - dz / 2;

// let pts = [];
// let clr = [];
// let c = new THREE.Color();
// let uvs = [];

// for (let i = 0; i < counter; i++) {
//   r = Math.sqrt(1 - z * z);
//   let p = new THREE.Vector3(
//     Math.cos(long) * r,
//     z,
//     -Math.sin(long) * r
//   ).multiplyScalar(rad);
//   pts.push(p);
//   z = z - dz;
//   long = long + dlong;

//   //c.setHSL(0.45, 0.5, Math.random() * 0.25 + 0.25);
//   c.setStyle("#7DF9FF")
//   c.toArray(clr, i * 3);

//   sph.setFromVector3(p);
//   uvs.push((sph.theta + Math.PI) / (Math.PI * 2), 1.0 - sph.phi / Math.PI);
// }

// let g = new THREE.BufferGeometry().setFromPoints(pts);
// g.setAttribute("color", new THREE.Float32BufferAttribute(clr, 3));
// g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
// let m = new THREE.PointsMaterial({
//   size: 0.1,
//   vertexColors: true,
//   onBeforeCompile: (shader) => {
//     shader.uniforms.globeTexture = {
//       value: new THREE.TextureLoader().load(imgData)
//     };
//     shader.vertexShader = `
//     	uniform sampler2D globeTexture;
//       varying float vVisibility;
//       varying vec3 vNormal;
//       varying vec3 vMvPosition;
//       ${shader.vertexShader}
//     `.replace(
//       `gl_PointSize = size;`,
//       `
//       	vVisibility = texture(globeTexture, uv).g; // get value from texture
//         gl_PointSize = size * (vVisibility < 0.5 ? 1. : 0.75); // size depends on the value
//         vNormal = normalMatrix * normalize(position);
//         vMvPosition = -mvPosition.xyz;
//         gl_PointSize *= 0.4 + (dot(normalize(vMvPosition), vNormal) * 0.6); // size depends position in camera space
//       `
//     );
//     //console.log(shader.vertexShader);
//     shader.fragmentShader = `
//     	varying float vVisibility;
//       varying vec3 vNormal;
//       varying vec3 vMvPosition;
//       ${shader.fragmentShader}
//     `.replace(
//       `vec4 diffuseColor = vec4( diffuse, opacity );`,
//       `
//       	bool circ = length(gl_PointCoord - 0.5) > 0.5; // make points round
//         bool vis = dot(vMvPosition, vNormal) < 0.; // visible only on the front side of the sphere
//       	if (circ || vis) discard;
        
//         vec3 col = diffuse + (vVisibility > 0.5 ? 0.5 : 0.); // make oceans brighter
        
//         vec4 diffuseColor = vec4( col, opacity );
//       `
//     );
//     //console.log(shader.fragmentShader);
//   }
// });
// let globe = new THREE.Points(g, m);
// scene.add(globe);

//   // <ICOSAHEDRON>
//   let icshdrn = new THREE.Mesh(new THREE.IcosahedronGeometry(rad, 1), new THREE.MeshBasicMaterial({color: 0x647f7f, wireframe: false}));
//   globe.add(icshdrn);
//   // </ICOSAHEDRON>
// // </GLOBE>

// // <Markers>
// const markerCount = 0;
// let markerInfo = []; // information on markers
// let gMarker = new THREE.PlaneGeometry();
// let mMarker = new THREE.MeshBasicMaterial({
//   color: 0xff3232,
//   onBeforeCompile: (shader) => {
//     shader.uniforms.time = globalUniforms.time;
//     shader.vertexShader = `
//     	attribute float phase;
//       varying float vPhase;
//       ${shader.vertexShader}
//     `.replace(
//       `#include <begin_vertex>`,
//       `#include <begin_vertex>
//       	vPhase = phase; // de-synch of ripples
//       `
//     );
//     //console.log(shader.vertexShader);
//     shader.fragmentShader = `
//     	uniform float time;
//       varying float vPhase;
//     	${shader.fragmentShader}
//     `.replace(
//       `vec4 diffuseColor = vec4( diffuse, opacity );`,
//       `
//       vec2 lUv = (vUv - 0.5) * 2.;
//       float val = 0.;
//       float lenUv = length(lUv);
//       val = max(val, 1. - step(0.25, lenUv)); // central circle
//       val = max(val, step(0.4, lenUv) - step(0.5, lenUv)); // outer circle
      
//       float tShift = fract(time * 0.5 + vPhase);
//       val = max(val, step(0.4 + (tShift * 0.6), lenUv) - step(0.5 + (tShift * 0.5), lenUv)); // ripple
      
//       if (val < 0.5) discard;
      
//       vec4 diffuseColor = vec4( diffuse, opacity );`
//     );
//     //console.log(shader.fragmentShader)
//   }
// });
// mMarker.defines = { USE_UV: " " }; // needed to be set to be able to work with UVs
// let markers = new THREE.InstancedMesh(gMarker, mMarker, markerCount);

// let dummy = new THREE.Object3D();
// let phase = [];
// for (let i = 0; i < markerCount; i++) {
//   dummy.position.randomDirection().setLength(rad + 0.1);
//   dummy.lookAt(dummy.position.clone().setLength(rad + 1));
//   dummy.updateMatrix();
//   markers.setMatrixAt(i, dummy.matrix);
//   phase.push(Math.random());

//   markerInfo.push({
//     id: i + 1,
//     mag: THREE.MathUtils.randInt(1, 10),
//     crd: dummy.position.clone()
//   });
// }
// gMarker.setAttribute(
//   "phase",
//   new THREE.InstancedBufferAttribute(new Float32Array(phase), 1)
// );

// scene.add(markers);
// // </Markers>

// // <Label>

// // </Label>



// let clock = new THREE.Clock();

// renderer.setAnimationLoop(() => {
//   let t = clock.getElapsedTime();
//   globalUniforms.time.value = t;
//   controls.update();
//   renderer.render(scene, camera);
// });

// function onWindowResize() {
//   camera.aspect = three_globe_logo_container.offsetWidth / three_globe_logo_container.offsetHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(three_globe_logo_container.offsetWidth, three_globe_logo_container.offsetHeight);
// }




















    // var loader = new THREE.GLTFLoader();
    // const letters_filenames = ["W.glb", "R.glb", "L.glb", "D.glb", "2.glb", "K.glb", "I.glb", "D2.glb", "Z.glb"];
    // letters_filenames.forEach((letter_file)=>
    // {
    //     // Load a glTF resource
    //     loader.load(
    //         // resource URL
    //         "glb_letters/" + letter_file,
    //         // called when the resource is loaded
    //         function ( gltf ) {
    //             scene.add( gltf.scene );
    //         },
    //         // called while loading is progressing
    //         function ( xhr ) {

    //             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    //         },
    //         // called when loading has errors
    //         function ( error ) {

    //             console.log( 'An error happened' );

    //         }
    //     );
    
    // })
