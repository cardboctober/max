(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  // core.addGround();
  var mouse = new T.Vector2();
  var raycaster = new T.Raycaster();
  var cameraPosition = new T.Vector3(camera.position.x, 10, camera.position.z);
  var PLAYING = true;

  scene.rotation.y = Math.PI / 4;

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);
  var light = new T.DirectionalLight(0xffffff, .5);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 30, 20);
  light.position.multiplyScalar(40);

  scene.add(light);

  var sounds = [
    'sounds/bd01.wav',
    'sounds/cp01.wav',
    'sounds/cr01.wav',
    'sounds/hh01.wav',
    'sounds/ht01.wav',
    'sounds/lt01.wav',
    'sounds/mt01.wav',
    'sounds/oh01.wav',
    'sounds/rd01.wav',
    'sounds/rs01.wav',
    'sounds/sd01.wav',
  ];

  var pauseButton = core.build(
    'BoxGeometry', [40, 20, 0],
    'MeshLambertMaterial', [{
      color: 0x555555,
      map: textureLoader.load('pause.png')
    }]
  );
  pauseButton.position.x = -(60 * Math.cos((Math.PI / 2.2)));
  pauseButton.position.z = -(60 * Math.sin((Math.PI / 2.2)));
  pauseButton.name = 'pause';
  pauseButton.lookAt(cameraPosition);
  scene.add(pauseButton);

  var resetButton = core.build(
    'BoxGeometry', [40, 20, 0],
    'MeshLambertMaterial', [{
      color: 0x555555,
      map: textureLoader.load('reset.png')
    }]
  );
  resetButton.position.x = -(60 * Math.cos((Math.PI / 1.3)));
  resetButton.position.z = -(60 * Math.sin((Math.PI / 1.3)));
  resetButton.name = 'reset';
  resetButton.lookAt(cameraPosition);
  scene.add(resetButton);



  var TICKS = 16;
  var scale = 20;
  var BPM = 128;
  var cells = [];
  var step = (Math.PI / 4) / TICKS;
  var angle = 0;

  var activateCell = function(cell) {
    if ('active' in cell) {
      cell.active = !cell.active;
    } else {
      cell.active = true;
    }
    cell.material.color.setHex(cell.active ? 0x40c057 : 0xfa5252);
  };
  sounds.forEach(function(sound, i) {
    var row = [];

    for (var j = 0; j < TICKS; j++) {
      var obj = core.build(
        'BoxGeometry', [scale - (scale / 4), scale - (scale / 4), 1],
        'MeshLambertMaterial', [{
          color: 0xfa5252,
          map: textureLoader.load('bump.png')
        }]
      );

      obj.position.x = (scale * j) - (scale * TICKS / 2);
      obj.position.z = -20;
      angle = step * j;
      obj.position.x = (10 / TICKS) + (100 * Math.cos(angle * (scale / 4)));
      obj.position.z = (10 / TICKS) + (100 * Math.sin(angle * (scale / 4)));
      obj.position.y = ((scale / 3) * sounds.length) - (scale * i); // stack in from top to bottom
      obj.playing = false;
      obj.name = 'cell';
      obj.lookAt(cameraPosition);
      cells.push(obj);
    };
  });

  var clickFunction = function() {
    // we use a custom raycaster because vreticle doesn't play nicely
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length) {
      var intersect = intersects[0].object;
      switch (intersect.name) {
        case 'cell':
          activateCell(intersect);
          break;
        case 'pause':
          PLAYING = !PLAYING;
          pauseButton.material.color.setHex(PLAYING?0x555555:0xffffff);
          break;
        case 'reset':
          cells.forEach(function (cell, i) {
            cell.active = false;
            cell.material.color.setHex(0xfa5252);
            resetButton.material.color.setHex(0xffffff);
            setTimeout(function (){
              resetButton.material.color.setHex(0x555555);
            }, 100);
          });
          break;
      }
    }
  };
  cells.forEach(function(cell, i) {
    document.addEventListener('click', clickFunction, false);
    scene.add(cell);
  });

  var currentTick = 0;
  var lastTick = TICKS - 1;
  var tickTime = 1 / (4 * BPM / (60 * 1000));

  var requestInterval = function(fn, delay) {
    var start = new Date().getTime();
    var handle = {};

    function loop() {
      var current = new Date().getTime();
      var delta = current - start;
      if (delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }
      handle.value = requestAnimationFrame(loop);
    }
    handle.value = requestAnimationFrame(loop);
    return handle;
  };
  requestInterval(function() {
    if (PLAYING) {
      for (var i = 0; i < sounds.length; i++) {
        var lastBeat = cells[i * TICKS + lastTick];
        var currentBeat = cells[i * TICKS + currentTick];
        lastBeat.playing = !lastBeat.playing;
        currentBeat.playing = !currentBeat.playing;

        currentBeat.material.color.setHex(currentBeat.active ? 0x40c057 : 0xfab005);
        lastBeat.material.color.setHex(lastBeat.active ? 0x40c057 : 0xfa5252);


        if (currentBeat.active) {
          var sound = new Howl({
            src: sounds[i]
          });
          sound.play();
        }
      }
      lastTick = currentTick;
      currentTick = (currentTick + 1) % TICKS;
    }
  }, 1 / (4 * BPM / (60 * 1000)));

  var update = function() {
    raycaster.setFromCamera(mouse, camera);

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  update();
}(window));
