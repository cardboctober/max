(function(window, document) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.createFullScreenControl();

  var renderer, scene, camera, effect, controls, ambientLight, light, ground;

  scene = new T.Scene();
  camera = core.setCameraOptions();
  if (core.isPocketDevice()) {
    camera.position.set(0, 20, 0);
  } else {
    camera.position.set(0, 40, 0);
  }
  var reticle = vreticle.Reticle(camera, .5);
  scene.add(camera);

  renderer = new T.WebGLRenderer({
    alpha: true,
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(core.options.width, core.options.height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;
  document.body.appendChild(renderer.domElement);
  controls = core.setControllerMethod(camera, renderer.domElement);

  effect = new T.StereoEffect(renderer);
  effect.eyeSeparation = 1;
  effect.focalLength = 25;
  effect.setSize(core.options.width, core.options.height);


  ambientLight = new T.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);


  light = new T.DirectionalLight(0xffffff, 1);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 30, 20);
  light.position.multiplyScalar(40);
  light.castShadow = true;

  // Increase size for sharper shadows
  light.shadow.MapWidth = 1024;
  light.shadow.MapHeight = 1024;

  var d = 256;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 3500;
  light.shadow.bias = -0.0001;

  scene.add(light);

  // Floor!

  var textureLoader = new T.TextureLoader();
  var groundTexture = textureLoader.load('grid.png');
  groundTexture.wrapS = groundTexture.wrapT = T.RepeatWrapping;
  groundTexture.repeat.set(256, 256);
  groundTexture.anisotropy = renderer.getMaxAnisotropy();
  ground = core.build(
    'PlaneBufferGeometry', [2000, 2000, 100],
    'MeshLambertMaterial', [{
      color: 0xffffff,
      map: groundTexture
    }]
  );
  // lower the ground
  ground.position.y = -10;
  // make it flat
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);


  // Load all the models in
  var modelsToLoad = [
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 8,8,8, 'short.wav'],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10, 'let-me-see-your-id.mp3'],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10, 'move-along.mp3'],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10,],
    ['Stormtrooper', 10,10,10,],
    ['R2-D2', 10,10,10, 'r2d2a.wav'],
  ];
  var loadedAll = false;
  var clength = modelsToLoad.length;
  var step = (2 * Math.PI) / clength;
  var angle = 0;
  var circle = {
      width: 50,
      depth: 50,
      radius: 60
  };
  var playingSounds = [];
  modelsToLoad.forEach(function (model, i) {
    var mtlLoader = new T.MTLLoader();
    var objLoader = new T.OBJLoader();
    var modelName = model[0] + '.obj';
    mtlLoader.load(modelName + '.mtl', function (materials) {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(modelName, function (object) {
        var mesh = new T.Object3D();

        object.position.y = -10;
        object.scale.set(model[1],model[2],model[3])

        mesh.position.x = (circle.width / clength) + (circle.radius * Math.cos(angle));
        mesh.position.z = (circle.depth / clength) + (circle.radius * Math.sin(angle));
        mesh.rotation.y = Math.PI * (0.2 * i);
        mesh.add(object);

        var cube = core.build(
            'BoxGeometry', [18, 30, 18],
            'MeshLambertMaterial', [{
                color: 0xffffff,
                transparent: true,
                opacity: 0
            }]
        );
        cube.position.y = 10;
        mesh.add(cube);
        if (model[4]) {
          cube.ongazelong = function () {
            if (!playingSounds.includes(model[0])) {
              playingSounds.push(model[0]);
              var sound = new Howl({
                src: [model[4]]
              });
              sound.play();
              sound.on('end', function(){
                setTimeout(function () {
                  playingSounds.splice(playingSounds.indexOf(model[0]));
                }, 1000);
              });

            }
          };
          reticle.add_collider(cube);
        }
        scene.add(mesh);

        angle += step;
        if (i+1 === modelsToLoad.length) {
          loadedAll = true;
        }
      });
    });
  });

  var animateRenderer = function() {
    controls.update();
    reticle.reticle_loop();
    effect.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  animateRenderer();
  window.addEventListener('resize', function() {
    core.resizeRenderer(renderer, scene, camera, effect);
  }, false);

}(window, document));
