(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var ambientLight = new T.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);


  var light = new T.DirectionalLight(0xffffff, 1);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 30, 20);
  light.position.multiplyScalar(40);

  scene.add(light);


  // Load all the models in
  var modelsToLoad = [
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 8, 8, 8, 'short.wav'],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, 'let-me-see-your-id.mp3'],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, 'move-along.mp3'],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, ],
    ['Stormtrooper', 10, 10, 10, ],
    ['R2-D2', 10, 10, 10, 'r2d2a.wav'],
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
  modelsToLoad.forEach(function(model, i) {
    var mtlLoader = new T.MTLLoader();
    var objLoader = new T.OBJLoader();
    var modelName = model[0] + '.obj';
    mtlLoader.load(modelName + '.mtl', function(materials) {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(modelName, function(object) {
        var mesh = new T.Object3D();

        object.position.y = -10;
        object.scale.set(model[1], model[2], model[3])

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
          cube.ongazelong = function() {
            var meshroty = mesh.rotation.y;
            if (!playingSounds.includes(model[0])) {
              playingSounds.push(model[0]);
              var sound = new Howl({
                src: [model[4]]
              });
              mesh.lookAt(new T.Vector3(camera.position.x, meshroty, camera.position.z));
              sound.play();
              sound.on('end', function() {
                setTimeout(function() {
                  playingSounds.splice(playingSounds.indexOf(model[0]));
                  mesh.rotation.set(0, meshroty, 0);
                }, 1000);
              });

            }
          };
          reticle.add_collider(cube);
        }
        scene.add(mesh);

        angle += step;
        if (i + 1 === modelsToLoad.length) {
          loadedAll = true;
        }
      });
    });
  });

  var update = function() {
    reticle.reticle_loop();

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  }
  update();

}(window));
