var renderer;
var camera;
var spotlight;
var scene;


var Africa;

function loadSounds()
{
    Africa = new Audio("sounds/Africa.mp3");
    Africa.volume = 0.4;
    Africa.loop = true;

    Africa.play();
}
function init()
{
    scene = new THREE.Scene();

    addRenderer();
    addCamera();
    addSpotlight();

    loadSounds();

    addPlane();
    addShapes();

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize, false);

    render();
}

var timer = 0;
function render()
{
    maintainShapeMovement();

    timer += 0.1;
    uniforms.time.value = timer;

    checkMusic();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

var musicPlaying = true;
function checkMusic()
{
    if(Key.isDown(Key.M)){
        if(musicPlaying){
            Africa.pause();
            musicPlaying = false;
        }
        else{
            Africa.play();
            musicPlaying = true;
        }
    }
}

function addRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
}

function addCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -1.75, 10);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(scene.position);
}

function addSpotlight() {
    spotlight = new THREE.SpotLight(0xffffff, 0.2);
    spotlight.position.set(0, 30, 500);
    spotlight.angle = 1.05;
    spotlight.distance = 1000;
    spotlight.penumbra = 0;
    spotlight.decay = 0.5;
    spotlight.shadow.camera.visible = true;
    spotlight.shadow.camera.near = 10;
    spotlight.shadow.camera.far = 1000;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.right = 10;
    spotlight.shadow.camera.left = -10;
    spotlight.shadow.camera.top = 5;
    spotlight.shadow.camera.bottom = -5;

    spotlight.castShadow = true;
    scene.add(spotlight);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    //scene.add(ambientLight);
}

function onResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

var plane;
var planeWidth = 60, planeLength = 30;
function addPlane() {
    var loader = new THREE.TextureLoader();
    loader.load('images/floor.jpg', function (texture) {

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(6, 6);

        var planeGeometry = new THREE.PlaneGeometry(planeWidth, planeLength);
        var planeMaterial = new THREE.MeshLambertMaterial({ map: texture });

        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.receiveShadow = true;
        plane.position.set(0, 0, -5.5);

        scene.add(plane);
    });
}

var block1, block2;
var box;
var sphere;
function addShapes()
{
    var blockGeometry = new THREE.BoxGeometry(2.25, 3.25, .15);
    var block1Material = createCustomShaderMaterial(1);

    block1 = new THREE.Mesh(blockGeometry, block1Material);
    block1.rotation.x = (Math.PI/180)*20;
    block1.position.set(-3, 2, 0);

    scene.add(block1);


    var boxGeometry = new THREE.BoxGeometry(1.75, 1.75, 1.75);
    var block2Material = createCustomShaderMaterial(2);
    var boxMaterial = createCustomShaderMaterial(3);

    block2 = new THREE.Mesh(boxGeometry, block2Material);
    block2.rotation.x = (Math.PI/180)*20;
    block2.position.set(3, 2, 0);

    scene.add(block2);

    box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.rotation.x = (Math.PI/180)*20;
    box.position.set(-3, -2, 0);

    scene.add(box);


    var sphereGeometry = new THREE.SphereGeometry(1.25, 32, 32);
    var sphereMaterial = createCustomShaderMaterial(4);
    
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(3, -2, 0);

    scene.add(sphere);
}

function maintainShapeMovement()
{
    block1.rotation.z += 0.01;
    block1.rotation.x += 0.01;
    block1.rotation.y += 0.015;

    block2.rotation.z -= 0.01;
    block2.rotation.x -= 0.01;
    block2.rotation.y -= 0.015;


    box.rotation.x += 0.01;
    box.rotation.y += 0.015;
    box.rotation.z += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.015;
    sphere.rotation.z += 0.01;
}

function loadShader(shader)
{
    return document.getElementById(shader).textContent;
}

function createCustomShaderMaterial(i)
{
    var vertex = loadShader("vertexShader");
    var fragment = loadShader("fragmentShader"+i);

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertex,
        fragmentShader: fragment
    });

    return shaderMaterial;
}

var uniforms = {
    time: {value: 1.0}
};


window.onload = init;