(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var lampx = 0;
  var lampy = 40;
  var lampz = -20;

  var bulb = core.build(
    'SphereGeometry', [0.5, 20, 20],
    'MeshPhongMaterial', [{
      color: 0xffff00,
      shading: T.FlatShading,
    }]
  );
  bulb.position.set(lampx, lampy, lampz);
  // scene.add(bulb);

  var light = new T.DirectionalLight(0xffffff, 1);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(lampx, lampy, lampz);
  light.position.multiplyScalar(40);
  light.castShadow = true;

  // Increase size for sharper shadows
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  var d = 256;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 3500;
  light.shadow.bias = -0.0001;

  // light.shadowCameraVisible = true;
  scene.add(light);

  var symbols = 'LLLLLLJJJJJJSSSSSSZZZZZZTTTTTTOOOOOOIIIIII'; // duplicate for chance
  var shapes = [
    {
      name: 'L',
      color: 0xf0a000,
      layout: [

        [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
        [
          [1, 1, 1],
          [1, 0, 0],
        ],
        [
          [1, 1],
          [0, 1],
          [0, 1],
        ],
        [
          [0, 0, 1],
          [1, 1, 1],
        ],

      ]
    },
    {
      name: 'J',
      color: 0x0000f0,
      layout: [
        [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
        [
          [1, 0, 0],
          [1, 1, 1],
        ],
        [
          [1, 1],
          [1, 0],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 0, 1],
        ],

      ]
    },
    {
      name: 'S',
      color: 0x00f000,
      layout: [
        [
          [0, 1, 1],
          [1, 1, 0],
        ],
        [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      ]
    },
    {
      name: 'Z',
      color: 0xf00000,
      layout: [

        [
          [1, 1, 0],
          [0, 1, 1],
        ],
        [
          [0, 1],
          [1, 1],
          [1, 0],
        ],

      ]
    },
    {
      name: 'T',
      color: 0xa000f0,
      layout: [

        [
          [0, 1, 0],
          [1, 1, 1],
        ],
        [
          [1, 0],
          [1, 1],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 1, 0],
        ],
        [
          [0, 1],
          [1, 1],
          [0, 1],
        ],

      ]
    },
    {
      name: 'O',
      color: 0xf0f000,
      layout: [
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
      ]
    },
    {
      name: 'I',
      color: 0x00f0f0,
      layout: [

        [
          [1],
          [1],
          [1],
          [1],
        ],
        [
          [1, 1, 1, 1],
        ],

      ]
    },
  ];
  var rows = 20;
  var cols = 10;
  var board;
  var blockSize = 5.2;
  var shape;
  var currentY = rows - 1;
  var middleCol = Math.floor(cols/2);
  var currentX = middleCol;
  var gameover = false;


  var positions = [];
  var circle = {
    width: 20,
    depth: 20,
    radius: 23
  };
  var step = (Math.PI * .8) / cols;
  var angle = Math.PI * 1.133;
  for (var c = 0; c < cols; c++) {
    // put the calculated cell position in our array
    var position = new T.Vector3(
      (cols / circle.width) + (circle.radius * Math.cos(angle)),
      0,
      (cols / circle.depth) + (circle.radius * Math.sin(angle))
    );
    positions.push(position);
    angle += step;
  };
  console.log(positions);

  var defaultColor = 0xffffff;

  var makeBlock = function () {
    return core.build(
      'BoxGeometry', [blockSize,blockSize,blockSize],
      'MeshPhongMaterial', [{
        color: defaultColor,
        shading: T.FlatShading,
        transparent: true
      }]
    );
  };

  var makeShape = function (board, symbol) {
    var shape;
    shapes.forEach(function (s){
      if (s.name === symbol) {
        shape = s;
      }
    });
    return shape;
  };


  var dropInterval = 1000;
  var lastTime = 0;
  var dropCounter = 0;

  var deactivateBlocks = function (board) {
    board.forEach(function (row, r) {
      row.forEach(function (col, c) {
        if (col.active) {
          col.active = false;
          col.material.color.setHex(defaultColor);
        }
      });
    });
  };

  var drawShape = function () {
    var now = Date.now();
    var delta = now - lastTime;
    dropCounter += delta;

    if (dropCounter >= dropInterval) {
      if (currentY > shape.layout.length) {
        currentY--;
      } else {
        currentY = rows - 1;
        newPiece();
      }
      dropCounter = 0;
    }
    lastTime = now;

    // reset all active's
    deactivateBlocks(board);

    // draw the shape
    shape.layout[0].forEach(function (row, r) {
      row.forEach(function (col, c) {
        if (col > 0) {
          var x = currentX + c; // draw horizontally
          var y = currentY - r; // draw vertically
          if (!collide(x, y, shape.layout[0])) {
            if ( typeof board[y] != 'undefined'
              && typeof board[y][x] != 'undefined'
            ) {
              board[y][x].active = true;
              board[y][x].material.color.setHex(shape.color);
            }
          }
        }
      });
    });
  };

  var collide = function (offsetX, offsetY, shape) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;

    for (var y = 0; y < shape.length; y++) {
      for (var x = 0; x < shape[0].length; x++) {
        if (shape[y][x]) {
          if (  typeof board[y + offsetY] == 'undefined'
             || typeof board[y + offsetY][x + offsetX] == 'undefined'
             || board[y+offsetY][x +offsetX]
             || x + offsetX < 0
             || y + offsetY >= rows
             || x + offsetX >= cols
            ) {
            if (offsetY == 1) {
              gameover = true;
              return true;
            }
          }
        }
      }
    }
    return false;
  };


  var drawBoard = function (board) {
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c< board[r].length; c++) {
        scene.remove(board[r][c]);
        // var x = c * blockSize - (blockSize * cols/2);
        var y = r * blockSize - (blockSize * 2);
        // var z = -40;
        board[r][c].position.set(positions[c].x, y, positions[c].z);
        board[r][c].material.opacity = board[r][c].active ? 1 : .2; // .2 for debug
        board[r][c].lookAt(new T.Vector3(0, y, 0));
        board[r][c].castShadow = board[r][c].active;
        board[r][c].recieveShadow = board[r][c].active;

        scene.add(board[r][c]);
      }
    }
  };

  // create board
  var initBoard = function (rows, cols) {
    var board = [];
    for (var r = 0; r < rows; r++) {
      var row = [];
      for (var c = 0; c < cols; c++) {
        var block = makeBlock();
        row.push(block);
      }
      board.push(row);
    }
    return board;
  };


  var updateXPos = function (shape, offset) {
    if (shape && !collide(offset, currentY, shape)) {
      var target = currentX + offset;
      var maxX = cols - shape.layout[0].length;
      var minX = 0;
      if (target < minX || target >= maxX) {
        if (target < minX) {
          currentX = minX;
        }
        if (target >= maxX) {
          currentX = maxX;
        }
      } else {
        currentX = target;
      }
    }
  };

  var rotatePiece = function (shape) {
    shape.layout.push(shape.layout.shift());
  };

  var dropShape = function () {
    lastTime = 0;
    drawShape();
  };

  document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 37:
        updateXPos(shape, -1);
      break;
      case 38:
        rotatePiece(shape);
      break;
      case 39:
        updateXPos(shape, 1);
      break;
      case 40:
        dropShape();
      break;
      default:
        console.log(e.keyCode);
      break;
    }
  });

  var newPiece = function () {
    var randomPiece = shapes[Math.floor(shapes.length * Math.random(shapes.length))].name;
    shape = makeShape(board, randomPiece);
  };

  var endGame = function () {
    console.log('Game over!');
    gameover = false;
    newPiece();
  };

  var init = function () {
    board = initBoard(rows, cols);
    newPiece();
    update();
  };

  var update = function() {
    if (!gameover) {
      drawShape();
      drawBoard(board);
    } else {
      endGame();
    }

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(update);
  };
  init();
}(window));
