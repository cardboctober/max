(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var symbols = 'LJSZTOI';
  var shapes = [
    {
      name: 'L',
      color: 0xffffff,
      layout: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]
    },
    {
      name: 'J',
      color: 0xffffff,
      layout: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]
    },
    {
      name: 'S',
      color: 0xffffff,
      layout: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]
    },
    {
      name: 'Z',
      color: 0xffffff,
      layout: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 2, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]
    },
    {
      name: 'T',
      color: 0xffffff,
      layout: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 2, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]
    },
    {
      name: 'O',
      color: 0xffffff,
      layout: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 2, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]
    },
    {
      name: 'I',
      color: 0xffffff,
      layout: [
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]
    },
  ];

  // Position a bunch of blocks around the camera
  var cols = 12;
  var rows = 20;
  var blockSize = 9;
  var block = core.build(
    'BoxGeometry', [blockSize,blockSize,blockSize],
    'MeshBasicMaterial', [{
      color:0xff0000,
      transparent: true,
      opacity: .1
    }]
  );
  var middleCol = Math.floor(cols / 2);

  var positions = [];
  var circle = {
    width: 10,
    depth: 10,
    radius: 50
  };
  var step = (Math.PI * .8) / cols;
  var angle = Math.PI * 1.133;
  for (var c = 0; c < cols; c++) {
    positions.push([]);
    for (var r = 0; r < rows; r++) {
      var y = (blockSize + 1) * r;
      // put the calculated cell position in our array
      var position = new T.Vector3(
        (cols / circle.width) + (circle.radius * Math.cos(angle)),
        y,
        (cols / circle.depth) + (circle.radius * Math.sin(angle))
      );
      positions[c].push(position);
    }
    angle += step;
  }

  // Build the board
  positions.forEach(function (col) {
    col.forEach(function (row) {
      var _block = new T.Mesh(block.geometry.clone(), block.material.clone());
      _block.position.set(row.x, row.y, row.z);
      _block.lookAt(new T.Vector3(camera.position.x, row.y, camera.position.z));
      scene.add(_block);
    });
  });

  var dropInterval = 1000;
  var lastTime = 0;
  var dropCounter = 0;

  // make the piece drop
  var updatePosition = function (piece) {
    var y = blockSize + 1;
    var now = Date.now();
    var delta = now - lastTime;
    dropCounter += delta;

    if (dropCounter >= dropInterval) {
      if (piece.position.y > 0) {
        piece.position.y -= y;
      } else {
        piece.position.y = positions[middleCol][positions[middleCol].length - 1].y;
      }
      dropCounter = 0;
    }
    lastTime = now;
  };

  var newPiece = function () {
    var piece = new T.Mesh(block.geometry.clone(), block.material.clone());
    var pos = positions[middleCol][0];

    piece.position.set(pos.x, pos.y, pos.z);
    piece.lookAt(new T.Vector3(camera.position.x, pos.y, camera.position.z));
    piece.material.opacity = 1;
    // eventually generate shapes here
    return piece;
  };

  var player;
  var init = function () {
    player = newPiece();
    scene.add(player);
    updatePosition(player);
    update();
  };

  var update = function() {
    updatePosition(player);
    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  init();
}(window));
