const bubble = document.querySelector(".bubble");

bubble.addEventListener("click", function (evt) {
  evt.preventDefault();
  bubble.classList.add("animated");
  setTimeout(function () {
    bubble.classList.remove("animated");
  }, 1000);
});
// - Noel Delgado | @pixelia_me
const nodes = [...document.querySelectorAll('li')];
const directions = { 0: 'top', 1: 'right', 2: 'bottom', 3: 'left' };
const classNames = ['in', 'out'].map((p) => Object.values(directions).map((d) => `${p}-${d}`)).reduce((a, b) => a.concat(b));

const getDirectionKey = (ev, node) => {
  const { width, height, top, left } = node.getBoundingClientRect();
  const l = ev.pageX - (left + window.pageXOffset);
  const t = ev.pageY - (top + window.pageYOffset);
  const x = (l - (width / 2) * (width > height ? (height / width) : 1));
  const y = (t - (height / 2) * (height > width ? (width / height) : 1));
  return Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
};

class Item {
  constructor(element) {
    this.element = element;
    this.element.addEventListener('mouseover', (ev) => this.update(ev, 'in'));
    this.element.addEventListener('mouseout', (ev) => this.update(ev, 'out'));
  }

  update(ev, prefix) {
    this.element.classList.remove(...classNames);
    this.element.classList.add(`${prefix}-${directions[getDirectionKey(ev, this.element)]}`);
  }
}

nodes.forEach(node => new Item(node));




//THREE.JS part



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







const containerEl = document.querySelector(".globe-wrapper");
const canvasEl = containerEl.querySelector("#globe-3d");
const svgMapDomEl = document.querySelector("#map");
const svgCountries = Array.from(svgMapDomEl.querySelectorAll("path"));
const svgCountryDomEl = document.querySelector("#country");
const countryNameEl = document.querySelector(".info span");

let renderer, scene, camera, rayCaster, pointer, controls;
let globeGroup, globeColorMesh, globeStrokesMesh, globeSelectionOuterMesh;

var GLOBE_ANIMATED = true;
var FOCUS_ON_SWITH_PLAYED = false;

const svgViewBox = [2000, 1000];
const offsetY = -.1;

const params = {
    strokeColor: "#111111",
    defaultColor: "#9a9591",
    hoverColor: "#00C9A2",
    fogColor: "#e4e5e6",
    fogDistance: 12.6,
    strokeWidth: 2,
    hiResScalingFactor: 2,
    lowResScalingFactor: .7
}




const SWITHERLAND_DATA_INDEX = 25;
let hoveredCountryIdx = SWITHERLAND_DATA_INDEX;
let isTouchScreen = false;
let isHoverable = true;

const textureLoader = new THREE.TextureLoader();
let staticMapUri;
const bBoxes = [];
const dataUris = [];


initScene();
createControls();

window.addEventListener("resize", updateSize);


containerEl.addEventListener("touchstart", (e) => {
    isTouchScreen = true;
});
containerEl.addEventListener("mousemove", (e) => {
    updateMousePosition(e.clientX, e.clientY);
});
containerEl.addEventListener("click", (e) => {
    updateMousePosition(e.clientX, e.clientY);
});

function updateMousePosition(eX, eY) {
    pointer.x = (eX - containerEl.offsetLeft) / containerEl.offsetWidth * 2 - 1;
    pointer.y = -((eY - containerEl.offsetTop) / containerEl.offsetHeight) * 2 + 1;
}





function animateGlobeUpDown(direction)
{


    if(!GLOBE_ANIMATED)
    {
        gsap.to(globeGroup.position, {
            duration: 2,
            x: 0,
            y: 0,
            z: 0,
            onUpdate: () =>
            {
              //controls.update();
            },
            onComplete: () =>
            {
              //this.controls.enabled = true;
              
            }, 
            ease: "power1.inOut"
          });

          return;
    }

    const offset = direction == "up" ? 0.5: -0.5;
    gsap.to(globeGroup.position, {
        duration: 2,
        x: 0,
        y: offset,
        z: 0,
        onUpdate: () =>
        {
          //controls.update();
        },
        onComplete: () =>
        {
          //this.controls.enabled = true;
          if(direction == "up")
          {
            animateGlobeUpDown("down")
          }
          else if(direction == "down")
          {
            animateGlobeUpDown("up")
          }
          
        }, 
        ease: "power1.inOut"
      });

}
function initScene() {
    renderer = new THREE.WebGLRenderer({canvas: canvasEl, alpha: true});
    renderer.setSize(containerEl.offsetWidth, containerEl.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(params.fogColor, 0, params.fogDistance);

    //camera = new THREE.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, 0, 3);
    camera = new THREE.PerspectiveCamera(90, containerEl.offsetWidth / containerEl.offsetHeight, 0.1, 2000);
    camera.position.z = 2;
    camera.position.y = 0;
    camera.lookAt(0,0,0)

    globeGroup = new THREE.Group();
    scene.add(globeGroup);

    rayCaster = new THREE.Raycaster();
    rayCaster.far = 1.15;
    pointer = new THREE.Vector2(-1, -1);

    //createOrbitControls();
    createGlobe();
    prepareHiResTextures();
    prepareLowResTextures();



    //focusOnSwitherLand();


    updateSize();

    gsap.ticker.add(render);


    animateGlobeUpDown("up");


    // const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    // const cube = new THREE.Mesh( geometry, material ); 
    // scene.add( cube );

      
}


window.addEventListener("click", (e)=>
{
    //e.preventDefault();
    if(FOCUS_ON_SWITH_PLAYED)
    {
        return;
    }
    focusOnSwitherLand();


})


function createOrbitControls() {
    controls = new THREE.OrbitControls(camera, canvasEl);
    controls.enablePan = false;
    // controls.enableZoom = false;
    //controls.enableDamping = true;
    // controls.minPolarAngle = .46 * Math.PI;
    // controls.maxPolarAngle = .46 * Math.PI;
    //controls.autoRotate = true;
    //controls.autoRotateSpeed *= 1.2;

    controls.addEventListener("start", () => {
        isHoverable = false;
        pointer = new THREE.Vector2(-1, -1);
        // gsap.to(globeGroup.scale, {
        //     duration: .3,
        //     x: .9,
        //     y: .9,
        //     z: .9,
        //     ease: "power1.inOut"
        // })
    });
    controls.addEventListener("end", () => {
        isHoverable = true;
        // gsap.to(globeGroup.scale, {
        //     duration: .6,
        //     x: 1,
        //     y: 1,
        //     z: 1,
        //     ease: "back(1.7).out",
        //     onComplete: () => {
        //         isHoverable = true;
        //     }
        // })
    });
}

function createGlobe() {
    const globeGeometry = new THREE.IcosahedronGeometry(1, 20);

    const globeColorMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaTest: true,
        side: THREE.DoubleSide
    });
    const globeStrokeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        depthTest: false,
    });
    const outerSelectionColorMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.DoubleSide
    });

    globeColorMesh = new THREE.Mesh(globeGeometry, globeColorMaterial);
    globeStrokesMesh = new THREE.Mesh(globeGeometry, globeStrokeMaterial);
    globeSelectionOuterMesh = new THREE.Mesh(globeGeometry, outerSelectionColorMaterial);

    globeStrokesMesh.renderOrder = 2;

    globeGroup.add(globeStrokesMesh, globeSelectionOuterMesh, globeColorMesh);

    
    // globeGroup.rotateX(3.8*Math.PI/18);
    // globeGroup.rotateY(8.7*Math.PI/18);
    
    console.log("globeGroup.rotation", globeGroup.rotation)

    //globeGroup.rotation.set(0.6632251157578458, 1.518436449235066, 0)
}

function setMapTexture(material, URI) {
    textureLoader.load(
        URI,
        (t) => {
            t.repeat.set(1, 1);
            material.map = t;
            material.needsUpdate = true;
        });
}

function prepareHiResTextures() {
    let svgData;
    gsap.set(svgMapDomEl, {
        attr: {
            "viewBox": "0 " + (offsetY * svgViewBox[1]) + " " + svgViewBox[0] + " " + svgViewBox[1],
            "stroke-width": params.strokeWidth,
            "stroke": params.strokeColor,
            "fill": params.defaultColor,
            "width": svgViewBox[0] * params.hiResScalingFactor,
            "height": svgViewBox[1] * params.hiResScalingFactor,
        }
    })
    svgData = new XMLSerializer().serializeToString(svgMapDomEl);
    staticMapUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    setMapTexture(globeColorMesh.material, staticMapUri);

    gsap.set(svgMapDomEl, {
        attr: {
            "fill": "none",
            "stroke": params.strokeColor,
        }
    })
    svgData = new XMLSerializer().serializeToString(svgMapDomEl);
    staticMapUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    setMapTexture(globeStrokesMesh.material, staticMapUri);
    //countryNameEl.innerHTML = svgCountries[hoveredCountryIdx].getAttribute("data-name");

}

function focusOnSwitherLand ()
{
    //svgCountries[hoveredCountryIdx].getAttribute("data-name");


    // SwitherLand Data index is 25

    // svgCountries.forEach((country, index)=>
    // {
    //     if(country.getAttribute("data-name") == "Switzerland")
    //     {
    //         console.log("SwitherLand Data index: ", index);
    //         setMapTexture(globeSelectionOuterMesh.material, dataUris[index]);
    //         countryNameEl.innerHTML = svgCountries[index].getAttribute("data-name");
    //     }
    // })

    GLOBE_ANIMATED = false;
    FOCUS_ON_SWITH_PLAYED = true;

    
    setMapTexture(globeSelectionOuterMesh.material, dataUris[SWITHERLAND_DATA_INDEX]);
    countryNameEl.innerHTML = ""
    //svgCountries[SWITHERLAND_DATA_INDEX].getAttribute("data-name");


    //globeGroup.rotation.set(0.6632251157578458, 1.518436449235066, 0);




    console.log("Euler Rotation:", globeGroup.rotation);
    gsap.to(globeGroup.rotation, {
        duration: 2,
        x: 0.6632251157578458,
        y: 1.518436449235066,
        z: 0,
        onUpdate: () =>
        {
          //controls.update();
        },
        onComplete: () =>
        {
            
          //this.controls.enabled = true;

          this.setTimeout(()=>{
            GLOBE_ANIMATED = true;
            animateGlobeUpDown("up")

            FOCUS_ON_SWITH_PLAYED = false;
          }, 3000
          )
          
        }, 
        ease: "power1.inOut"
      });


    

    
}

function prepareLowResTextures() {
    gsap.set(svgCountryDomEl, {
        attr: {
            "viewBox": "0 " + (offsetY * svgViewBox[1]) + " " + svgViewBox[0] + " " + svgViewBox[1],
            "stroke-width": params.strokeWidth,
            "stroke": params.strokeColor,
            "fill": params.hoverColor,
            "width": svgViewBox[0] * params.lowResScalingFactor,
            "height": svgViewBox[1] * params.lowResScalingFactor,
        }
    })
    svgCountries.forEach((path, idx) => {
        bBoxes[idx] = path.getBBox();
    })
    svgCountries.forEach((path, idx) => {
        svgCountryDomEl.innerHTML = "";
        svgCountryDomEl.appendChild(svgCountries[idx].cloneNode(true));
        const svgData = new XMLSerializer().serializeToString(svgCountryDomEl);
        dataUris[idx] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    })
    setMapTexture(globeSelectionOuterMesh.material, dataUris[hoveredCountryIdx]);

}

function updateMap(uv = {x: 0, y: 0}) {
    const pointObj = svgMapDomEl.createSVGPoint();
    pointObj.x = uv.x * svgViewBox[0];
    pointObj.y = (1 + offsetY - uv.y) * svgViewBox[1];

    for (let i = 0; i < svgCountries.length; i++) {
        const boundingBox = bBoxes[i];
        if (
            pointObj.x > boundingBox.x ||
            pointObj.x < boundingBox.x + boundingBox.width ||
            pointObj.y > boundingBox.y ||
            pointObj.y < boundingBox.y + boundingBox.height
        ) {
            const isHovering = svgCountries[i].isPointInFill(pointObj);
            if (isHovering) {
                if (i !== hoveredCountryIdx) {
                    hoveredCountryIdx = i;
                    setMapTexture(globeSelectionOuterMesh.material, dataUris[hoveredCountryIdx]);
                    countryNameEl.innerHTML = svgCountries[hoveredCountryIdx].getAttribute("data-name");
                    break;
                }
            }
        }
    }
}

function render() {
    //controls.update();


    //console.log("globeGroup.rotation",globeGroup.rotation)
    if(GLOBE_ANIMATED)
    {
        console.log("globeGroup.rotation.y", globeGroup.rotation.y)
        //console.log("Math.PI", Math.PI)
        if(globeGroup.rotation.y >= Math.PI)
        {
            globeGroup.rotation.y = -Math.PI;
        }
        globeGroup.rotation.y +=0.005;
    }
    
    // if (isHoverable) {
    //     rayCaster.setFromCamera(pointer, camera);
    //     const intersects = rayCaster.intersectObject(globeStrokesMesh);
    //     if (intersects.length) {
    //         updateMap(intersects[0].uv);
    //     }
    // }

    // if (isTouchScreen && isHoverable) {
    //     isHoverable = false;
    // }

    renderer.render(scene, camera);
}

function updateSize() {
    // const side = Math.min(500, Math.min(window.innerWidth, window.innerHeight) - 50);
    // containerEl.style.width = side + "px";
    // containerEl.style.height = side + "px";
    // renderer.setSize(side, side);

    camera.aspect = containerEl.offsetWidth / containerEl.offsetHeight;
    camera.updateProjectionMatrix();

  renderer.setSize(containerEl.offsetWidth, containerEl.offsetHeight);
}


function createControls() {
    const gui = new lil.GUI();
	
	 gui.close();
	
    gui.addColor(params, "strokeColor")
        .onChange(prepareHiResTextures)
        .name("stroke")
    gui.addColor(params, "defaultColor")
        .onChange(prepareHiResTextures)
        .name("color")
    gui.addColor(params, "hoverColor")
        .onChange(prepareLowResTextures)
        .name("highlight")
    gui.addColor(params, "fogColor")
        .onChange(() => {
            scene.fog = new THREE.Fog(params.fogColor, 0, params.fogDistance);
        })
        .name("fog");
    gui.add(params, "fogDistance", 1, 4)
        .onChange(() => {
            scene.fog = new THREE.Fog(params.fogColor, 0, params.fogDistance);
        })
        .name("fog distance");
}








