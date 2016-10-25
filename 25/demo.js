(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var symbols = 'LLLLLLJJJJJJSSSSSSZZZZZZTTTTTTOOOOOOIIIIII'; // duplicate for chance
  var shapes = [
    {
      name: 'L',
      color: 0xffffff,
      layout: [

        [1, 0],
        [2, 0],
        [1, 1],

      ]
    },
    {
      name: 'J',
      color: 0xffffff,
      layout: [

        [0, 1],
        [0, 2],
        [1, 1],

      ]
    },
    {
      name: 'S',
      color: 0xffffff,
      layout: [

        [0, 2, 1],
        [1, 1, 0],

      ]
    },
    {
      name: 'Z',
      color: 0xffffff,
      layout: [

        [1, 2, 0],
        [0, 1, 1],

      ]
    },
    {
      name: 'T',
      color: 0xffffff,
      layout: [

        [0, 1, 0],
        [1, 2, 1],

      ]
    },
    {
      name: 'O',
      color: 0xffffff,
      layout: [

        [1, 2],
        [1, 1],

      ]
    },
    {
      name: 'I',
      color: 0xffffff,
      layout: [

        [1],
        [1],
        [2],
        [1],

      ]
    },
  ];
  var rows = 20;
  var cols = 10;
  var board;
  var blockSize = 3;
  var shape;
  var currentY = rows - 1;
  var middleCol = Math.floor(cols/2);
  var currentX = middleCol;

  var makeBlock = function () {
    return core.build(
      'BoxGeometry', [blockSize,blockSize,blockSize],
      'MeshBasicMaterial', [{
        color: 0xff0000,
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
        }
      });
    });
  };

  var drawShape = function () {
    var now = Date.now();
    var delta = now - lastTime;
    dropCounter += delta;

    if (dropCounter >= dropInterval) {
      if (currentY > shape.layout.length - 1) {
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
    shape.layout.forEach(function (row, r) {
      row.forEach(function (col, c) {
        if (col > 0) {
          var x = currentX + c; // draw horizontally
          var y = currentY - r; // draw vertically
          if (x < cols) {
            board[y][x].active = true;
          }
        }
      });
    });
  };

  var drawBoard = function (board) {
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c< board[r].length; c++) {
        scene.remove(board[r][c]);
        var x = c * blockSize - (blockSize * cols/2 - c/2);
        var y = r * (blockSize * 1.1) - (blockSize * 2);
        var z = -40;
        board[r][c].position.set(x, y, z);
        board[r][c].material.opacity = board[r][c].active ? 1 : .1;
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
    if (shape) {
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

  document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 37:
        updateXPos(shape, -1);
      break;
      case 39:
        updateXPos(shape, 1);
      break;
    }
  });

  var newPiece = function () {
    var randomPiece = shapes[Math.floor(shapes.length * Math.random(shapes.length))].name;
    shape = makeShape(board, randomPiece);
  };

  var init = function () {
    board = initBoard(rows, cols);
    newPiece();
    update();
  };

  var update = function() {
    drawShape();
    drawBoard(board);

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(update);
  };
  init();
}(window));
