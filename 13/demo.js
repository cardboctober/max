(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;
  core.init();
  core.addGround();
  ground.position.y = -.5;
  camera.position.y = 5;
  ground.name = 'ground';
  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);
  var light = new T.PointLight(0xff0000, 1);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 30, 20);
  light.position.multiplyScalar(40);
  scene.add(light);
  ///////////////////////////////
  // Textures
  var zombieFace = textureLoader.load('face_front.png');
  // Globals
  var health;
  var score;
  var playArea = 128;
  var enemies = [];
  var started = false;
  var createEnemies = function(number) {
    for (var i = 0; i < number; i++) {
      var enemy = new T.Object3D();
      var faceFront = new T.MeshLambertMaterial({
        color: 0xffffff,
        map: zombieFace
      });
      var faceColor = new T.MeshLambertMaterial({
        color: 0x446d35
      });
      var headMaterial = [
        faceColor,
        faceColor,
        faceColor,
        faceFront,
        faceColor,
        faceColor,
      ];
      var head = core.build('BoxGeometry', [1, 1, 1], 'MeshFaceMaterial', [headMaterial]);
      var body = core.build('BoxGeometry', [1, 1.5, .5], 'MeshBasicMaterial', [{ color: 0x007f7f }]);
      body.position.y = -1.25;
      var legs = core.build('BoxGeometry', [1, 1.5, .5], 'MeshBasicMaterial', [{ color: 0x302872 }]);
      legs.position.y = -2.75;
      var arm = core.build('BoxGeometry', [.5, .5, 1.5], 'MeshBasicMaterial', [{ color: 0x446d35 }]);
      var armL = new T.Mesh(arm.geometry.clone(), arm.material.clone());
      armL.position.x = -.75;
      armL.position.y = -.75;
      armL.position.z = .75;
      var armR = new T.Mesh(arm.geometry.clone(), arm.material.clone());
      armR.position.x = .75;
      armR.position.y = -.75;
      armR.position.z = .75;
      enemy.position.set(
        (playArea / 2) - (playArea * Math.random()),
        3,
        (playArea / 2) - (playArea * Math.random())
      );
      enemy.name = 'zombie';
      enemy.add(head);
      enemy.add(body);
      enemy.add(armL);
      enemy.add(armR);
      enemy.add(legs);
      enemies.push(enemy);
      scene.add(enemy);
    }
  };
  var doLoopyBits = function() {
    // update zombie position
    enemies.forEach(function(enemy, i) {
      enemy.children[0].lookAt(new T.Vector3(0, camera.position.y + 1, 0));
      enemy.lookAt(new T.Vector3(camera.position.x, 3, camera.position.z));
      var xDistance = camera.position.x - enemy.position.x;
      var zDistance = camera.position.z - enemy.position.z;
      var distance = Math.sqrt((xDistance * xDistance) + (zDistance * zDistance));
      var speed = .0001;
      if (distance < 20) {
        speed = .0025;
      }
      if (distance < 10) {
        speed = .005;
      }
      if (distance > 1) {
        enemy.position.x += xDistance * speed;
        enemy.position.z += zDistance * speed;
      }
      if (distance < 3) {
        if (health === 0) {
          started = false;
          console.log('You are dead');
          document.querySelectorAll('.dead')[0].style.display = 'block';
          document.querySelectorAll('.dead')[1].style.display = 'block';
        }
        console.log('ouch!');
        var opacity = (1000 / health) / 100;
        document.querySelectorAll('.overlay')[0].style.opacity = opacity;
        health--;
      }
    });
    // check collisions
    // score and stuff
    handleMovementRing();
  };
  ///////////////////////////////
  // Raycaster movement stuff from Pete
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
  var glowMaterial;
  var glowLight;
  var plane;
  var glow;
  var start = function(e) {
    casting = true;
    e.preventDefault();
  };
  var stop = function(e) {
    if (target) {
      var endPosition = glow.position.clone();
      endPosition.y += 5; // We don't want to be stuck in the ground
      blink = [camera.position.clone(), endPosition, 0];
    }
    casting = false;
    target = false;
    e.preventDefault();
  };
  var setupRing = function() {
    glowMaterial = new T.MeshLambertMaterial();
    glowMaterial.transparent = true;
    glowMaterial.map = textureLoader.load('glow.png');
    glowMaterial.side = T.DoubleSide;
    glowLight = new T.PointLight(0xddddff, 1, 10);
    glowLight.position.z = -0.2;
    plane = new T.PlaneGeometry(10, 10);
    glow = new T.Mesh(plane, glowMaterial);
    glow.add(glowLight);
    scene.add(glow);
  }
  var handleMovementRing = function() {
    if (blink) {
      camera.position.lerpVectors(blink[0], blink[1], blink[2]);
      blink[2] += 0.05;
      if (blink[2] > 1) {
        camera.position.copy(blink[1]);
        blink = false;
      }
    } else if (casting) {
      raycaster.set(camera.position, across.clone().applyQuaternion(camera.quaternion));
      var rays = raycaster.intersectObjects([ground]);
      if (rays.length) {
        var targetobject = rays[0].object;
        switch (targetobject.name) {
          case 'ground':
            // movement!
            target = true;
            glow.position.copy(rays[0].point);
            glow.position.y += 1;
            var rotation = new T.Quaternion().setFromUnitVectors(up, rays[0].face.normal);
            glow.rotation.set(0, 0, 0);
            glow.quaternion.multiply(rotation);
            break;
        }
      } else {
        target = false;
        glow.position.set(0, -9, 0);
      }
    } else {
      glow.position.set(0, -9, 0);
    }
  };
  ///////////////////////////////
  var startButton;
  var pickWithMouse = function(event) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects([startButton]);
    if (intersects.length > 0 && intersects[0].object.name == 'start') {
      scene.remove(startButton);
      startGame();
      document.removeEventListener('touchstart', pickWithMouse);
      document.removeEventListener('mousedown', pickWithMouse);
    }
  };
  document.addEventListener('touchstart', pickWithMouse);
  document.addEventListener('mousedown', pickWithMouse);
  var showStartButton = function() {
    startButton = core.build(
      'BoxGeometry', [10, 5, .2],
      'MeshLambertMaterial', [{
        color: 0xffffff,
        map:textureLoader.load('start.png')
      }]
    );
    startButton.position.z = -10;
    startButton.position.y = 5;
    startButton.name = 'start';
    scene.add(startButton);
  };
  var startGame = function() {
    started = true;
    // create enemies
    // reset score/health
    health = 100;
    score = 0;
    setupRing();
    createEnemies(50);
    document.addEventListener('mousedown', start);
    document.addEventListener('mouseup', stop);
    document.addEventListener('touchstart', start);
    document.addEventListener('touchend', stop);
  };
  var update = function() {
    if (started) {
      doLoopyBits();
    }
    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  showStartButton();
  update();
}(window));
