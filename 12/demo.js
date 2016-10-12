(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;
  core.init();
  core.addGround();
  ground.name = 'ground';
  camera.position.y = 10;
  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);
  var light = new T.PointLight(0xff0000, 0);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 30, 20);
  light.position.multiplyScalar(40);
  scene.add(light);
  ////////////////////////
  var radius;
  var numberOfEnemies;
  var enemies;
  var setupZombies = function() {
    radius = 256;
    numberOfEnemies = 50;
    enemies = [];
    var faceRight = new T.MeshLambertMaterial({
      color: 0xffffff,
      map: textureLoader.load('face_right.png')
    });
    var faceLeft = new T.MeshLambertMaterial({
      color: 0xffffff,
      map: textureLoader.load('face_left.png')
    });
    var faceTop = new T.MeshLambertMaterial({
      color: 0xffffff,
      map: textureLoader.load('face_top.png')
    });
    var faceBottom = new T.MeshLambertMaterial({
      color: 0xffffff,
      map: textureLoader.load('face_bottom.png')
    });
    var faceFront = new T.MeshLambertMaterial({
      color: 0xffffff,
      map: textureLoader.load('face_front.png')
    });
    var faceBack = new T.MeshLambertMaterial({
      color: 0xffffff,
      map: textureLoader.load('face_Back.png')
    });
    var faceMaterials = [
      faceRight, // right
      faceLeft, // left
      faceTop, // top
      faceBottom, // bottom
      faceFront, // front
      faceBack // back
    ];
    for (var i = 0; i < numberOfEnemies; i++) {
      var enemy = core.build(
        'BoxGeometry', [4, 4, 4],
        'MeshFaceMaterial', [faceMaterials]
      );
      enemy.position.set(
        radius / 2 - radius * Math.random(),
        0,
        radius / 2 - radius * Math.random()
      );
      enemy.name = 'zombie';
      enemies.push(enemy);
      scene.add(enemy);
    }
  }
  setupZombies();
  var maxplaying = 16;
  var playing = 0;
  var updateEnemies = function() {
    enemies.forEach(function(enemy, i) {
      enemy.lookAt(camera.position);
      var easingAmount = .001;
      var xDistance = camera.position.x - enemy.position.x;
      var zDistance = camera.position.z - enemy.position.z;
      var distance = Math.sqrt(xDistance * xDistance + zDistance * zDistance);
      if (distance > 1) {
        enemy.position.x += xDistance * easingAmount;
        enemy.position.z += zDistance * easingAmount;
        if (playing < maxplaying) {
          var track = (playing % 3) + 1;
          var sound = new Howl({
            src: 'say' + (track) + '.ogg',
            loop: true,
            orientation: [enemy.position.x, enemy.position.y, enemy.position.z]
          });
          sound.play();
          playing++;
        } else {}
      }
    });
  };
  var object = new T.Object3D();
  var started = false;
  var up = new T.Vector3(0, 1, 0);
  var forward = new T.Vector3(1, 0, 0);
  var across = new T.Vector3(0, 0, -1);
  var moving = false;
  var raycaster = new T.Raycaster(camera.position, across.clone(), 0, 100);
  var casting = false;
  var target = false;
  var blink = false;
  var start = function(e) {
    casting = true;
    e.preventDefault();
  };
  var stop = function(e) {
    if (target) {
      var endPosition = glow.position.clone();
      endPosition.y += 10; // We don't want to be stuck in the ground
      blink = [camera.position.clone(), endPosition, 0];
    }
    casting = false;
    target = false;
    e.preventDefault();
  };
  document.addEventListener('mousedown', start);
  document.addEventListener('mouseup', stop);
  document.addEventListener('touchstart', start);
  document.addEventListener('touchend', stop);
  var glowMaterial = new T.MeshLambertMaterial();
  glowMaterial.transparent = true;
  glowMaterial.map = textureLoader.load('glow.png');
  glowMaterial.side = T.DoubleSide;
  var glowLight = new T.PointLight(0xddddff, 1, 10);
  glowLight.position.z = -0.2;
  var plane = new T.PlaneGeometry(10, 10);
  var glow = new T.Mesh(plane, glowMaterial);
  glow.add(glowLight);
  scene.add(glow);
  var materials = [
    createSkyMaterial('px.jpg'),
    createSkyMaterial('nx.jpg'),
    createSkyMaterial('py.jpg'),
    createSkyMaterial('ny.jpg'),
    createSkyMaterial('pz.jpg'),
    createSkyMaterial('nz.jpg')
  ];
  var mesh = new T.Mesh(
    new T.BoxGeometry(1000, 512, 1000, 1, 1, 1),
    new T.MeshFaceMaterial(materials)
  );

  function createSkyMaterial(path) {
    var texture = textureLoader.load(path);
    var material = new T.MeshBasicMaterial({
      map: texture,
      overdraw: 0.5
    });
    return material;
  }
  // Set the x scale to be -1, this will turn the cube inside out
  mesh.scale.set(-1, 1, 1);
  mesh.name = 'sky';
  scene.add(mesh);
  ////////////////////////
  var update = function() {
    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
    if (enemies.length < 1) {
      setupZombies();
    } else {
      // shamelessly stolen from Pete
      updateEnemies();
      if (blink) {
        camera.position.lerpVectors(blink[0], blink[1], blink[2]);
        blink[2] += 0.05;
        if (blink[2] > 1) {
          camera.position.copy(blink[1]);
          blink = false;
        }
      } else if (casting) {
        raycaster.set(camera.position, across.clone().applyQuaternion(camera.quaternion));
        var targets = enemies.concat(ground);
        var rays = raycaster.intersectObjects(targets);
        if (rays.length) {
          var targetobject = rays[0].object;
          switch (targetobject.name) {
            case 'ground':
              // movement!
              target = true;
              glow.position.copy(rays[0].point);
              glow.position.y += 0.08;
              var rotation = new T.Quaternion().setFromUnitVectors(up, rays[0].face.normal);
              glow.rotation.set(0, 0, 0);
              glow.quaternion.multiply(rotation);
              break;
            case 'zombie':
              var chance = Math.random() * 7;
              if (chance > 5) {
                // random chance of killing the zombie
                scene.remove(targetobject);
                enemies.splice(enemies.indexOf(targetobject), 1);
              }
              break;
            case 'sky':
              // do something when you hit the sky
              break;
          }
        } else {
          target = false;
          glow.position.set(0, -9, 0);
        }
      } else {
        glow.position.set(0, -9, 0);
      }
    }
  };
  var animateRenderer = function() {
    update();
  };
  update();
}(window));
