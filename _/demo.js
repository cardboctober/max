(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  // core.addGround();

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  // put all of the demo related stuff here


  var update = function() {
    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  update();
}(window));
