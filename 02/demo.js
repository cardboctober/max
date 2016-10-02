(function(window, document) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.createFullScreenControl();

  var renderer, scene, camera, effect, controls, ground, ambientLight, light, raycaster;
  var mouse = new T.Vector2(), INTERSECTED;

  scene = new T.Scene();
  camera = core.setCameraOptions();
  if (core.isPocketDevice()) {
    camera.position.set(0, 20, 0);
  } else {
    camera.position.set(0, 40, 0);
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
  var boo_1 = textureLoader.load('boo_1.png');
  var boo_2 = textureLoader.load('boo_2.png');

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

  ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);


  var panel = core.build(
    'BoxGeometry', [30, 30, 2],
    'MeshLambertMaterial', [{
      color: 0xffffff,
      map: boo_1,
      transparent: true
    }]
  );
  var generatePanels = function (number) {
    var panels = [];
    for (var i=0; i<number;i++) {
      panels[i] = new T.Mesh(panel.geometry.clone(), panel.material.clone());
      panels[i].position.y = 1;
    }
    return panels;
  }
  var panels = generatePanels(16);
  var clength = panels.length;
  var step = (2 * Math.PI) / clength;
  var angle = 0;
  var circle = {
    width: 10,
    depth: 10,
    radius: 100
  };
  panels.forEach(function (panel, i) {
    // position them in a circle
    panel.position.x = (circle.width/clength) + (circle.radius * Math.cos(angle));
    panel.position.z = (circle.depth/clength) + (circle.radius * Math.sin(angle));
    panel.lookAt(core.center);
    angle += step;

    scene.add(panels[i]);
  });

  raycaster = new T.Raycaster();

  var updateRaycaster = function (mouse, camera) {
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      // If we're looking at the floor plane, don't continue
      if (intersects[0].object.geometry.type == 'PlaneBufferGeometry') return;

      // If the first thing we're hitting isn't already the thing we're hitting
      if (INTERSECTED != intersects[0].object) {
        if (INTERSECTED) {
          INTERSECTED.material.map = INTERSECTED.currentMaterial;
        }
        INTERSECTED = intersects[0].object;
        INTERSECTED.currentMaterial = INTERSECTED.material.map;
        INTERSECTED.material.map = boo_2;

      }
    } else {
      if (INTERSECTED) {
        INTERSECTED.material.map = INTERSECTED.currentMaterial;
      }
      INTERSECTED = null;
    }
  }

  var animateRenderer = function() {
    controls.update();
    updateRaycaster(mouse, camera);
    effect.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  animateRenderer();
  window.addEventListener('resize', function() {
    core.resizeRenderer(renderer, scene, camera, effect);
  }, false);

}(window, document));
