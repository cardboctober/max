(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var mouse = new T.Vector2(),
    INTERSECTED;

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var panel = core.build(
    'BoxGeometry', [30, 30, 0],
    'MeshLambertMaterial', [{
      color: 0xffffff,
      map: textureLoader.load('boo_1.png'),
      transparent: true
    }]
  );

  var generatePanels = function(number) {
    var panels = [];
    for (var i = 0; i < number; i++) {
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
  panels.forEach(function(panel, i) {
    // position them in a circle
    panel.position.x = (circle.width / clength) + (circle.radius * Math.cos(angle));
    panel.position.z = (circle.depth / clength) + (circle.radius * Math.sin(angle));
    panel.lookAt(core.center);
    angle += step;

    scene.add(panels[i]);
  });

  var raycaster = new T.Raycaster();

  var updateRaycaster = function(mouse, camera) {
    raycaster.setFromCamera(mouse, camera);
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
        INTERSECTED.material.map = textureLoader.load('boo_2.png');

      }
    } else {
      if (INTERSECTED) {
        INTERSECTED.material.map = INTERSECTED.currentMaterial;
      }
      INTERSECTED = null;
    }
  }

  var update = function() {
    updateRaycaster(mouse, camera);

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  update();

}(window));
