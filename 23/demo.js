(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);




  // Position a bunch of blocks around the camera
  var block = core.build('BoxGeometry', [5,5,5], 'MeshBasicMaterial', [{color:0xff0000}]);
  var numBlocks = 20;
  var circle = {
    width: 10,
    depth: 10,
    radius: 25
  };
  var step = (2 * Math.PI) / numBlocks;
  var angle = 0;
  for (var i = 0; i < numBlocks; i++) {
    var _block = new T.Mesh(block.geometry.clone(), block.material.clone());

    _block.position.x = (circle.width / numBlocks) + (circle.radius * Math.cos(angle));
    _block.position.z = (circle.depth / numBlocks) + (circle.radius * Math.sin(angle));

    // Look at the camera for uniform rotation
    _block.lookAt(new T.Vector3(core.center.x, 0, core.center.x));

    scene.add(_block);

    angle += step;
  }






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
