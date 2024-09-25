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







const containerEl = document.querySelector(".globe-wrapper");
const canvasEl = containerEl.querySelector("#globe-3d");
const svgMapDomEl = document.querySelector("#map");
const svgCountries = Array.from(svgMapDomEl.querySelectorAll("path"));
const svgCountryDomEl = document.querySelector("#country");
const countryNameEl = document.querySelector(".info span");

let renderer, scene, camera, rayCaster, pointer, controls;
let globeGroup, globeColorMesh, globeStrokesMesh, globeSelectionOuterMesh;

var letter_model;


const globe_original_position = new THREE.Vector3(-2.6, 0, 0);
const globe_original_rotation = new THREE.Vector3(0, 1.5399999999999892, 0);

var GLOBE_ANIMATED = true;
var FOCUS_ON_SWITH_PLAYED = false;
var current_globe_animation;

var ALLOW_PHYSIX = false;

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


var LETTERS_LOADED = false;



//Physix
// Global Solver Settings
const solverIterations = 100;
const solverTolerance = 0.001;

// Physics world setup
var world = new CANNON.World();
world.gravity.set(0, -1, 0);
world.solver.iterations = solverIterations;
world.solver.tolerance = solverTolerance;

// If using split solver (can help with performance in some cases)
const split = true;
if (split) {
    world.solver = new CANNON.SplitSolver(new CANNON.GSSolver());
}


// Physical Material Definition
const physMatOne = new THREE.MeshPhysicalMaterial({
    color: 0x78F078,
    opacity: 1,
    reflecitivy: .4,
    roughness: .6,
});

//Only this material is changed onclick
const physMatTwo = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    opacity: 1,
    reflecitivy: .4,
    roughness: .6,
});


// Physics material
const letterMaterial = new CANNON.Material('letterMaterial');
const letterContactMaterial = new CANNON.ContactMaterial(letterMaterial, letterMaterial, { friction: 0.1, restitution: 0.8 });
world.addContactMaterial(letterContactMaterial);

// Attractor Settings
const attractorStrength = 8;
const attractorPosition = new CANNON.Vec3(0, 0, 0);


var letterMeshes = [];


var cannonDebugger;








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



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function animateGlobeUpDown(direction)
{



    const offset = direction == "up" ? 0.2: -0.2;
    current_globe_animation = gsap.to(globeGroup.position, {
        duration: 2,
        x: globe_original_position.x,
        y: globe_original_position.y + offset,
        z: globe_original_position.z,
        onUpdate: () =>
        {
          //controls.update();
          globeGroup.userData.physicsBody.position = new CANNON.Vec3(globeGroup.position.x, globeGroup.position.y, globeGroup.position.z);
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



function loadLogoLetters ()
{

    // controls = new THREE.OrbitControls(camera, canvasEl);
    // scene.add(controls);

//     const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
// const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ); 
// const cube = new THREE.Mesh( geometry, material ); 
// scene.add( cube );

    






    const draco_loader = new THREE.DRACOLoader();

    // Specify path to a folder containing WASM/JS decoding libraries.
    draco_loader.setDecoderPath( 'draco/gltf/' );
    //draco_loader.preload();

    //draco_loader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    var loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(draco_loader);
        // Load a glTF resource
        loader.load(
            // resource URL
            "combined_letters.glb",
            // called when the resource is loaded
            function ( gltf ) {
                console.log("gltf", gltf)
                letter_model = gltf.scene;
                
                scene.add( letter_model );
                //letter_model.position.y += 2;   
                letter_model.updateMatrixWorld();
                // letter_model.renderOrder = 0;

                // letter_model.children.forEach((child)=>
                // {
                //     child.renderOrder = 0;
                // })

                
                console.log("letter_model", letter_model )

                const W = gltf.scene.getObjectByName("W");
                W.position.x -=1.1;

                const L = gltf.scene.getObjectByName("L");
                L.position.y += 0.1;


                letter_model.children.forEach((letter)=>
                {
                    //Center geometry to fix intersection bug
                    
                    // var center = new THREE.Vector3();
                    //letter.geometry.applyQuaternion(new THREE.Quaternion(Math.PI/4,0,0,1));
                    letter.geometry.center();
                    letter.rotation.x = 0;
                    
                    letter.geometry.rotateX(Math.PI/2);
                    
                    //letter.updateMatrixWorld();
                    letter.geometry.computeBoundingBox();
                    letter.updateMatrixWorld();
                    // letter.geometry.boundingBox.getCenter(center);
                    // letter.geometry.center();





                    const boundingBox = new THREE.Box3().setFromObject(letter);
                    const size = new THREE.Vector3();
                    boundingBox.getSize(size);

                    // const box = new THREE.BoxHelper( letter, 0xffff00 );
                    // scene.add( box );

                    const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);

                    console.log("halfExtents", halfExtents)
                    const letterShape = new CANNON.Box(halfExtents);

                    console.log("letter", letter)
                    
                    // letter.rotation.x = 0;
                    // letter.rotation.y = 0;
                    // letter.rotation.z = 0;
                    



                    const letterBody = new CANNON.Body({
                        mass: 1.5,
                        linearDamping: 0.4,
                        angularDamping: 0.4,
                        position: letter.position.clone(),
                        shape: letterShape,
                        material: letterMaterial,
                        allowSleep: true,
                        quaternion: letter.quaternion
                        
                    });

                    // letterBody.quaternion = letter.quaternion.clone()


                    letterBody.maxAngularVelocity = 5;
                    world.addBody(letterBody);
                    letter.userData.physicsBody = letterBody;
                    letterMeshes.push(letter);

                    letter.userData.original_position = new THREE.Vector3(letter.position.x, letter.position.y, letter.position.z);
                    letter.userData.original_quaternion = letter.quaternion.clone();
                })  

                LETTERS_LOADED = true;



                // Materials
                const stone = new CANNON.Material('stone')
                const stone_stone = new CANNON.ContactMaterial(stone, stone, {
                    friction: 0.3,
                    restitution: 0.1,
                })
                world.addContactMaterial(stone_stone)


                // Ground plane
                const groundShape = new CANNON.Plane()
                const groundBody = new CANNON.Body({ mass: 0, material: stone })
                groundBody.addShape(groundShape)
                groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
                groundBody.position.set(0, -1, 0)
                world.addBody(groundBody)




            },
            // called while loading is progressing
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened', error );

            }
        );
    



}


function resetModelPosition()
{


    world.clearForces();
    letterMeshes.forEach((letter)=>
    {


        
        // world.removeBody(letter.userData.physicsBody);
        // world.addBody(letter.userData.physicsBody);

        letter.userData.physicsBody.force.setZero();
        letter.userData.physicsBody.torque.setZero();

        letter.userData.physicsBody.velocity.setZero();
        letter.userData.physicsBody.angularVelocity.setZero();

        letter.userData.physicsBody.position = new CANNON.Vec3(letter.userData.original_position.x, letter.userData.original_position.y, letter.userData.original_position.z) ;
        letter.userData.physicsBody.quaternion.copy(letter.userData.original_quaternion) ;

        letter.position.set(letter.userData.original_position.x, letter.userData.original_position.y, letter.userData.original_position.z);
        letter.quaternion.copy(letter.userData.original_quaternion);

    
    });

    globeGroup.position.set(globe_original_position.x, globe_original_position.y, globe_original_position.z);
    globeGroup.quaternion.copy(globeGroup.userData.original_quaternion);
    globeGroup.userData.physicsBody.quaternion = new CANNON.Quaternion(globeGroup.quaternion.x, globeGroup.quaternion.y, globeGroup.quaternion.z, globeGroup.quaternion.w);
    globeGroup.userData.physicsBody.position = new CANNON.Vec3(globeGroup.position.x, globeGroup.position.y, globeGroup.position.z);

}
function initScene() {
    renderer = new THREE.WebGLRenderer({canvas: canvasEl, alpha: true, antialias: true});
    renderer.setSize(containerEl.offsetWidth, containerEl.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog(params.fogColor, 0, params.fogDistance);


    //debugging
    // cannonDebugger = new CannonDebugger(scene, world, {
    //     // options...
    // })

    //camera = new THREE.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, 0, 3);
    camera = new THREE.PerspectiveCamera(50, containerEl.offsetWidth / containerEl.offsetHeight, 0.1, 2000);
    // camera.position.z = 12;
    // camera.position.y = 2;
    camera.position.set(0, 0.5, 5.3);
    //camera.lookAt(0,2,0)


    const INTENSITY = 0.7;

    //White directional light at half intensity shining from the top.
    const directionalLight1 = new THREE.DirectionalLight( 0xffffff, INTENSITY );
    scene.add( directionalLight1 );
    directionalLight1.position.set(0, 50, 0);

    // const helper = new THREE.DirectionalLightHelper( directionalLight1, 5 );
    // scene.add( helper );

    const directionalLight2 = new THREE.DirectionalLight( 0xffffff, INTENSITY );
    scene.add( directionalLight2 );
    directionalLight2.position.set(0, 0, 50);


    const helper2 = new THREE.DirectionalLightHelper( directionalLight2, 5 );
    //scene.add( helper2 );

    const directionalLight3 = new THREE.DirectionalLight( 0xffffff, INTENSITY );
    scene.add( directionalLight3 );
    directionalLight3.position.set(0, 0, -50);


    const amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( amblight );


//     const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
// scene.add( light );


    // const spotLight = new THREE.SpotLight( 0xffffff );
    // spotLight.position.set( 0, 100, 0 );

    // spotLight.castShadow = true;

    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;

    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    // spotLight.shadow.camera.fov = 30;

    // scene.add( spotLight );
    

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

    loadLogoLetters();


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



function createGlobe() {


    // const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
    // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
    // const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere );
    // sphere.position.set(globe_original_position.x, globe_original_position.y, globe_original_position.z)
    // sphere.scale.set(0.7, 0.7, 0.7)


    const globeGeometry = new THREE.IcosahedronGeometry(1, 20);

    const globeColorMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaTest: true,
        side: THREE.DoubleSide,
        
        
    });
    const globeStrokeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        //depthTest: false,
        
        
    });
    const outerSelectionColorMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        
        
    });

    globeColorMesh = new THREE.Mesh(globeGeometry, globeColorMaterial);
    globeStrokesMesh = new THREE.Mesh(globeGeometry, globeStrokeMaterial);
    globeSelectionOuterMesh = new THREE.Mesh(globeGeometry, outerSelectionColorMaterial);

    //globeStrokesMesh.renderOrder = 2;

    globeGroup.add(globeStrokesMesh, globeSelectionOuterMesh, globeColorMesh);

    globeGroup.scale.set(0.7, 0.7, 0.7 );
    globeGroup.position.set(globe_original_position.x, globe_original_position.y, globe_original_position.z);

    console.log("globeGroup", globeGroup)

    
    // globeGroup.rotateX(3.8*Math.PI/18);
    // globeGroup.rotateY(8.7*Math.PI/18);
    
    console.log("globeGroup.rotation", globeGroup.rotation)

    //globeGroup.rotation.set(0.6632251157578458, 1.518436449235066, 0)

    // letter.geometry.boundingBox.getCenter(center);
    // letter.geometry.center();





    // ADDING GLOBE PHYSIX BODY
    const boundingBox = new THREE.Box3().setFromObject(globeGroup);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const halfExtents = size.x/2;
    console.log("halfExtents globe", halfExtents)

    const globeShape = new CANNON.Sphere(halfExtents);

    const globeBody = new CANNON.Body({
        mass: 1.5,
        linearDamping: 0.4,
        angularDamping: 0.4,
        position: globeGroup.position.clone(),
        shape: globeShape,
        material: letterMaterial,
        allowSleep: true,
        quaternion: globeGroup.quaternion
        
    });

    // letterBody.quaternion = letter.quaternion.clone()


    globeBody.maxAngularVelocity = 5;
    world.addBody(globeBody);
    globeGroup.userData.physicsBody = globeBody;

    globeGroup.userData.original_position = new THREE.Vector3(globeGroup.position.x, globeGroup.position.y, globeGroup.position.z);
    globeGroup.userData.original_quaternion = globeGroup.quaternion.clone();


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

    GLOBE_ANIMATED = false;
    FOCUS_ON_SWITH_PLAYED = true;


    if(current_globe_animation)
    {
        current_globe_animation.pause();
        current_globe_animation.kill();
    }
    
    gsap.to(globeGroup.position, {
        duration: 1,
        x: globe_original_position.x,
        y: globe_original_position.y,
        z: globe_original_position.z,
        onUpdate: () =>
        {
                  //controls.update();
    
                  //globeGroup.userData.physicsBody.quaternion = new CANNON.Quaternion(globeGroup.quaternion.x, globeGroup.quaternion.y, globeGroup.quaternion.z, globeGroup.quaternion.w);
        globeGroup.userData.physicsBody.position = new CANNON.Vec3(globeGroup.position.x, globeGroup.position.y, globeGroup.position.z);
        },
        onComplete: () =>
        {
                  //this.controls.enabled = true;
                  
        }, 
        ease: "power1.inOut"
        });
    
    
    

    
    setMapTexture(globeSelectionOuterMesh.material, dataUris[SWITHERLAND_DATA_INDEX]);
    countryNameEl.innerHTML = ""
    //svgCountries[SWITHERLAND_DATA_INDEX].getAttribute("data-name");


    //globeGroup.rotation.set(0.6632251157578458, 1.518436449235066, 0);




    console.log("Euler Rotation:", globeGroup.rotation);
    gsap.to(globeGroup.rotation, {
        duration: 1,
        x: 0.6632251157578458,
        y: 1.838436449235066,
        z: 0,
        onUpdate: () =>
        {
          //controls.update();

          globeGroup.userData.physicsBody.quaternion = new CANNON.Quaternion(globeGroup.quaternion.x, globeGroup.quaternion.y, globeGroup.quaternion.z, globeGroup.quaternion.w);
        },
        onComplete: () =>
        {
            
          //this.controls.enabled = true;

          this.setTimeout(()=>{

            GLOBE_ANIMATED = false;
            ALLOW_PHYSIX = true;

            


            //Give letter impulse
            letterMeshes.forEach(function (letter) {
                const body = letter.userData.physicsBody;
                if (body) {
        

        
                    //Add impulse onclick
                    const strength = getRandomArbitrary(-20, 20);
                    const dt = 1 / 60;
        
                    //const topPoint = new CANNON.Vec3(-0.18, 0.2, 0.1)
                    const topPoint = new CANNON.Vec3(0, 0.1, 0)
                    const impulse = new CANNON.Vec3(-strength * dt, -strength * dt, -strength * dt)
                    body.applyImpulse(impulse, topPoint);
        
                    
        
                }
            });
        
            //Give the globe impulse 
            
            const strength = getRandomArbitrary(-60, 60)
            const dt = 1 / 60;
            const topPoint = new CANNON.Vec3(0, 0.6059554180637184, 0)
            const impulse = new CANNON.Vec3(-strength * dt, -strength * dt, -strength * dt);
            globeGroup.userData.physicsBody.applyImpulse(impulse, topPoint);
            //globeGroup.userData.physicsBody.applyLocalImpulse(impulse, topPoint);
            // const force = new CANNON.Vec3(-strength, 0, 0)
            // globeGroup.userData.physicsBody.applyForce(force)

        

            this.setTimeout(()=>{
                resetModelPosition();
                GLOBE_ANIMATED = true;
                ALLOW_PHYSIX = false;
                FOCUS_ON_SWITH_PLAYED = false;
                animateGlobeUpDown("up");
            }, 7000)

            
          }, 1000
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
    if(GLOBE_ANIMATED && globeGroup)
    {
        //console.log("globeGroup.rotation.y", globeGroup.rotation.y)
        //console.log("Math.PI", Math.PI)

        if(globeGroup.rotation.y >= Math.PI)
        {
            globeGroup.rotation.y = -Math.PI;
        }
        globeGroup.rotation.y +=0.005;
        globeGroup.userData.physicsBody.quaternion = new CANNON.Quaternion(globeGroup.quaternion.x, globeGroup.quaternion.y, globeGroup.quaternion.z, globeGroup.quaternion.w) 
        //globeGroup.quaternion.copy();
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

    update();

    //cannonDebugger.update()


    //console.log("camera", camera)
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








// Update Loop
function update() {
    

    if(LETTERS_LOADED && ALLOW_PHYSIX)
    {

        world.step(1 / 60);

        letterMeshes.forEach(function (letter) {
            const body = letter.userData.physicsBody;
            if (body) {


                // ADD some rotation
                const rotation_quaternion = new CANNON.Quaternion();
                //rotation_quaternion.setFromEuler(0.03, 0.03, 0.03 );

                //body.quaternion.mult(rotation_quaternion, body.quaternion);
                



                    letter.position.copy(body.position);
                    letter.quaternion.copy(body.quaternion);
                    //letter.quaternion = new THREE.Quaternion(body.quaternion.x + 1, body.quaternion.y, body.quaternion.z, body.quaternion.w)

                // const attractionVec = attractorPosition.vsub(body.position);
                // attractionVec.normalize();
                // attractionVec.scale(attractorStrength, attractionVec);
                // body.applyForce(attractionVec, body.position);
            }
        });


        const globe_body = globeGroup.userData.physicsBody;
        globeGroup.position.copy(globe_body.position);
        globeGroup.quaternion.copy(globe_body.quaternion);
    }
}