(function(window) {
  // 'use strict';
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
  // put all of the demo related stuff here
  var pram = new T.Object3D();
  var p_m = {
    width: 12,
    length: 20,
    depth: 7,
    wall: 1
  };
  var pram_base_left = core.build(
    'BoxGeometry', [p_m.wall, p_m.depth, p_m.length],
    'MeshPhongMaterial', [{
      color: 0xffffff,
      shading: T.FlatShading,
    }]
  );
  var pram_base_front = core.build(
    'BoxGeometry', [p_m.width, p_m.depth, p_m.wall],
    'MeshPhongMaterial', [{
      color: 0xffffff,
      shading: T.FlatShading,
    }]
  );
  pram_base_front.position.set((p_m.width - p_m.wall) / 2, 0, -(p_m.length / 2));
  var pram_base_right = core.build(
    'BoxGeometry', [p_m.wall, p_m.depth, p_m.length],
    'MeshPhongMaterial', [{
      color: 0xffffff,
      shading: T.FlatShading,
    }]
  );
  pram_base_right.position.set(p_m.width - p_m.wall, 0, 0);
  var pram_base_back = core.build(
    'BoxGeometry', [p_m.width, p_m.depth, p_m.wall],
    'MeshPhongMaterial', [{
      color: 0xffffff,
      shading: T.FlatShading,
    }]
  );
  pram_base_back.position.set((p_m.width - p_m.wall) / 2, 0, (p_m.length - p_m.wall) / 2);
  var pram_base_bottom = core.build(
    'BoxGeometry', [p_m.width, p_m.wall, p_m.length],
    'MeshPhongMaterial', [{
      color: 0xffffff,
      shading: T.FlatShading,
    }]
  );
  pram_base_bottom.position.set((p_m.width - p_m.wall) / 2, -((p_m.depth - p_m.wall) / 2), 0);
  pram.add(pram_base_left);
  pram.add(pram_base_front);
  pram.add(pram_base_right);
  pram.add(pram_base_back);
  pram.add(pram_base_bottom);
  var leg = core.build('BoxGeometry', [1, 15, 1], 'MeshPhongMaterial', [{ color: 0x555555, shading: T.FlatShading }]);
  var wheel = core.build('CylinderGeometry', [2, 2, 2, 16], 'MeshPhongMaterial', [{ color: 0xffffff, shading: T.FlatShading }]);
  var leg1 = new T.Mesh(leg.geometry.clone(), leg.material.clone());
  leg1.rotation.x = Math.PI * .25;
  leg1.position.set(1, -8.5, 0);
  var wheel1 = new T.Mesh(wheel.geometry.clone(), wheel.material.clone());
  wheel1.rotation.x = Math.PI * .25;
  wheel1.rotation.z = Math.PI * .5;
  wheel1.position.y = -6;
  leg1.add(wheel1);
  var leg2 = new T.Mesh(leg.geometry.clone(), leg.material.clone());
  leg2.rotation.x = Math.PI * .25;
  leg2.position.set(p_m.width - 2, -8.5, 0);
  var wheel2 = new T.Mesh(wheel.geometry.clone(), wheel.material.clone());
  wheel2.rotation.x = Math.PI * .25;
  wheel2.rotation.z = Math.PI * .5;
  wheel2.position.y = -6;
  leg2.add(wheel2);
  var leg3 = new T.Mesh(leg.geometry.clone(), leg.material.clone());
  leg3.rotation.x = Math.PI * -.25;
  leg3.position.set(p_m.width - 2, -8.5, 0);
  var wheel3 = new T.Mesh(wheel.geometry.clone(), wheel.material.clone());
  wheel3.rotation.x = Math.PI * .25;
  wheel3.rotation.z = Math.PI * .5;
  wheel3.position.y = -6;
  leg3.add(wheel3);
  var leg4 = new T.Mesh(leg.geometry.clone(), leg.material.clone());
  leg4.rotation.x = Math.PI * -.25;
  leg4.position.set(1, -8.5, 0);
  var wheel4 = new T.Mesh(wheel.geometry.clone(), wheel.material.clone());
  wheel4.rotation.x = Math.PI * .25;
  wheel4.rotation.z = Math.PI * .5;
  wheel4.position.y = -6;
  leg4.add(wheel4);
  pram.add(leg1);
  pram.add(leg2);
  pram.add(leg3);
  pram.add(leg4);
  pram.position.set(core.center.x, 5, core.center.z);
  scene.add(pram);
  // tetrominoes from my day 04 hack
  var shapes = {
    'L': {
      'color': 0xf0a000,
      'layout': [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0]
      ]
    },
    'J': {
      'color': 0x0000f0,
      'layout': [
        [0, 0, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    },
    'S': {
      'color': 0x00f000,
      'layout': [
        [0, 0, 0],
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
      ]
    },
    'Z': {
      'color': 0xf00000,
      'layout': [
        [0, 0, 0],
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
      ]
    },
    'O': {
      'color': 0xf0f000,
      'layout': [
        [0, 0],
        [0, 0],
        [1, 1],
        [1, 1]
      ]
    },
    'T': {
      'color': 0xa000f0,
      'layout': [
        [0, 0, 0],
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ]
    },
    'I': {
      'color': 0x00f0f0,
      'layout': [
        [1],
        [1],
        [1],
        [1]
      ]
    }
  };
  var renderShape = function(type, scale) {
    var scale = scale || 2;
    var shape = shapes[type] || shapes[Object.keys(shapes)[0]];
    var shapeMesh = new T.Object3D();
    var layout = shape.layout;
    for (var r = 0; r < layout.length; r++) {
      for (var c = 0; c < layout[r].length; c++) {
        if (layout[r][c] > 0) {
          var block = core.build(
            'BoxGeometry', [scale, scale, scale],
            'MeshLambertMaterial', [{
              color: shape.color,
              shading: T.FlatShading,
              map: textureLoader.load('bump.png')
            }]
          );
          block.position.x = c * scale;
          block.position.y = r * -(scale);
          shapeMesh.add(block);
        }
      }
    }
    shapeMesh.position.y = (5 * scale) - (layout.length * scale);
    shapeMesh.position.x = (layout[0].length / 2) * -1;
    return shapeMesh;
  }
  var letters = 'LJSZTOI';
  var tetrominos = []
  letters.split('').forEach(function(letter, i) {
    var scale = 4;
    var shape = renderShape(letter, scale);
    tetrominos.push(shape);
  });

  var clength = tetrominos.length;
  var step = (2 * Math.PI) / clength;
  var angle = 0;
  var circle = {
    width: 10,
    depth: 10,
    radius: 25
  };

  tetrominos.forEach(function(tetromino, i) {
    // position them in a circle
    tetromino.position.x = (circle.width / clength) + (circle.radius * Math.cos(angle));
    tetromino.position.z = (circle.depth / clength) + (circle.radius * Math.sin(angle));
    tetromino.scale.set(.75, .75, .75);
    tetromino.lookAt(core.center.x, camera.position.y, core.center.z);
    angle += step;
    scene.add(tetromino);
  });

  tetrominos.forEach(function (tetromino, i) {
    tetromino.direction = 1;
    tetromino.position.y = -10;
  });
  var update = function() {
    if (tetrominos) {
      tetrominos.forEach(function (tetromino, i) {
        tetromino.rotation.y += 0.01 * Math.random();
        tetromino.rotation.z += 0.02 * Math.random();
        tetromino.rotation.x -= 0.01 * Math.random();
        if (tetromino.direction = 1) {
          tetromino.position.y += .01;

          if (parseInt(tetromino.position.y) >= 40) {
            tetromino.direction = 0;
          }
        }
      });
    }
    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(update);
  };
  update();
}(window));
