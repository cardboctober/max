(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var cube = core.build(
    'BoxGeometry', [15, 15, 15],
    'MeshPhongMaterial', [{
      color: 0xff0000,
      shading: T.FlatShading,
    }]
  );
  cube.position.set(0, 20, -40);
  scene.add(cube);

  var ambientLight = new T.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  var light = new T.DirectionalLight(0xffffff, 1);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 20, -10);
  light.position.multiplyScalar(40);

  scene.add(light);

  var bobDirection = "up";

  var update = function() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // Bobbing up and down
    if (bobDirection == "up") {
      cube.position.y += 0.25;
      if (cube.position.y >= 20) {
        bobDirection = "down";
      }
    } else {
      cube.position.y -= 0.125;
      if (cube.position.y <= 1) {
        bobDirection = "up";
      }
    }

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  update();

}(window));
