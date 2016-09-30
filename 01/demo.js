(function(window, document) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.createFullScreenControl();

  var renderer, scene, camera, effect, controls;
  var cube, ground, ambientLight, light;

  scene = new T.Scene();
  camera = core.setCameraOptions();
  if (core.isPocketDevice()) {
    camera.position.set(0, 20, 60);
  } else {
    camera.position.set(0, 40, 120);
  }
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

  var textureLoader = new T.TextureLoader();
  var groundTexture = textureLoader.load('grid.png');

  groundTexture.wrapS = groundTexture.wrapT = T.RepeatWrapping;
  groundTexture.repeat.set(256, 256);
  groundTexture.anisotropy = renderer.getMaxAnisotropy();
  ground = core.build(
    'PlaneBufferGeometry', [2000, 2000, 100],
    'MeshLambertMaterial', [{
      color: 0x222222,
      map: groundTexture
    }]
  );
  // lower the ground
  ground.position.y = -10;
  // make it flat
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  cube = core.build(
    'BoxGeometry', [15, 15, 15],
    'MeshPhongMaterial', [{
      color: 0xff0000,
      shading: T.FlatShading,
    }]
  );
  cube.position.set(0, 15, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);

  ambientLight = new T.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  light = new T.DirectionalLight(0xffffff, 1);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 20, -10);
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

  var bobDirection = "up";

  var animateRenderer = function() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Bobbing up and down
    if (bobDirection == "up") {
      cube.position.y += 0.25;
      if (cube.position.y >= 20) {
        bobDirection = "down";
      }
    }
    if (bobDirection == "down") {
      cube.position.y -= 0.125;
      if (cube.position.y <= 1) {
        bobDirection = "up";
      }
    }

    controls.update();

    effect.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  animateRenderer();
  window.addEventListener('resize', function() {
    core.resizeRenderer(renderer, scene, camera, effect);
  }, false);

}(window, document));
