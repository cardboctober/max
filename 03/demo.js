(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

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
    panel.scale.set(.5, .5, .5);
    panel.lookAt(core.center);
    angle += step;

    panels[i].gazeTriggered = false;

    panels[i].ongazelong = function() {
      if (panels[i].gazeTriggered) return;
      panels[i].gazeTriggered = true;
      panels[i].material.map = textureLoader.load('boo_2.png');
    }

    panels[i].ongazeover = function() {

      var scale = {
        x: .5,
        y: .5,
        z: .5
      };
      var new_scale = {
        x: 1.0,
        y: 1.0,
        z: 1.0
      };
      var panel_tween = new TWEEN.Tween(scale).to(new_scale, 500);
      panel_tween.onUpdate(function() {
        panels[i].scale.set(scale.x, scale.y, scale.z);
      });
      panel_tween.start();
    }

    panels[i].ongazeout = function() {
      panels[i].gazeTriggered = false;
      var scale = panels[i].scale;
      var new_scale = {
        x: .5,
        y: .5,
        z: .5
      };
      var panel_tween = new TWEEN.Tween(scale).to(new_scale, 500);
      panel_tween.onUpdate(function() {
        panels[i].scale.set(scale.x, scale.y, scale.z);
      });
      panel_tween.start();

      setTimeout(function() {
        panels[i].material.map = textureLoader.load('boo_1.png');
      }, 200);
    }

    reticle.add_collider(panels[i]);
    scene.add(panels[i]);
  });


  var update = function() {
    controls.update();
    TWEEN.update();

    _renderer.render(scene, camera);
    reticle.reticle_loop();
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function () {
    update();
  };
  update();

}(window));
