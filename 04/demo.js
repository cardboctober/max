(function(window, document) {
    'use strict';
    var core = window.core;
    var T = window.THREE;

    core.createFullScreenControl();

    var renderer, scene, camera, effect, controls, ground, ambientLight, light;

    scene = new T.Scene();
    camera = core.setCameraOptions();
    if (core.isPocketDevice()) {
        camera.position.set(0, 10, 0);
    } else {
        camera.position.set(0, 40, 0);
    }
    scene.add(camera);

    renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        logarithmicDepthBuffer: true,
    });

    renderer.setSize(core.options.width, core.options.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.soft = true;
    document.body.appendChild(renderer.domElement);
    controls = core.setControllerMethod(camera, renderer.domElement);

    effect = new T.StereoEffect(renderer);
    effect.eyeSeparation = 1;
    effect.focalLength = 25;
    effect.setSize(core.options.width, core.options.height);

  renderer = core.isPocketDevice()? effect : renderer;

    var textureLoader = new T.TextureLoader();
    var groundTexture = textureLoader.load('grid.png');
    var bumpTexture = textureLoader.load('bump.png');

    groundTexture.wrapS = groundTexture.wrapT = T.RepeatWrapping;
    groundTexture.repeat.set(64, 64);
    groundTexture.anisotropy = renderer.getMaxAnisotropy();
    ground = core.build(
        'CircleBufferGeometry', [64, 50],
        'MeshLambertMaterial', [{
            color: 0xffffff,
            map: groundTexture
        }]
    );

    // lower the ground
    ground.position.y = -10;
    // make it flat
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    ambientLight = new T.AmbientLight(0xffffff, .5);
    scene.add(ambientLight);

  light = new T.DirectionalLight(0xffffff, .5);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 10, 20);
  light.position.multiplyScalar(40);
  light.castShadow = true;

  // Increase size for sharper shadows
  light.shadow.MapWidth = 1024;
  light.shadow.MapHeight = 1024;

  var d = 256;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 3500;
  light.shadow.bias = -0.0001;

  scene.add(light);

    var materials = [
        createSkyMaterial('px.jpg'),
        createSkyMaterial('nx.jpg'),
        createSkyMaterial('py.jpg'),
        createSkyMaterial('ny.jpg'),
        createSkyMaterial('pz.jpg'),
        createSkyMaterial('nz.jpg')
    ];

    var mesh = new T.Mesh(
        new T.BoxGeometry( 512, 512, 512, 1, 1, 1 ),
        new T.MeshFaceMaterial( materials )
    );

    function createSkyMaterial( path ) {
        var texture = textureLoader.load(path);
        var material = new T.MeshBasicMaterial( {
            map: texture,
            overdraw: 0.5
        });

        return material;
    }

    // Set the x scale to be -1, this will turn the cube inside out
    mesh.scale.set(-1,1,1);
    scene.add( mesh );


    var shapes = {
        'L': {
          'color': 0xf0a000,
          'layout': [
            [0,0,0],
            [1,0,0],
            [1,0,0],
            [1,1,0]
          ]
        },
        'J': {
          'color': 0x0000f0,
          'layout': [
            [0,0,0],
            [0,1,0],
            [0,1,0],
            [1,1,0]
          ]
        },
        'S': {
          'color': 0x00f000,
          'layout': [
            [0,0,0],
            [0,0,0],
            [0,1,1],
            [1,1,0]
          ]
        },
        'Z': {
          'color': 0xf00000,
          'layout': [
            [0,0,0],
            [0,0,0],
            [1,1,0],
            [0,1,1]
          ]
        },
        'O': {
          'color': 0xf0f000,
          'layout': [
            [0,0],
            [0,0],
            [1,1],
            [1,1]
          ]
        },
        'T': {
          'color': 0xa000f0,
          'layout': [
            [0,0,0],
            [0,0,0],
            [1,1,1],
            [0,1,0]
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

    var renderShape = function (type, scale) {
        var scale = scale || 2;
        var shape = shapes[type] || shapes[Object.keys(shapes)[0]];

        var shapeMesh = new T.Object3D();

        var layout = shape.layout;

        for (var r = 0; r<layout.length; r++) {
            for (var c = 0; c<layout[r].length; c++) {
              if (layout[r][c]>0) {
                var block = core.build(
                    'BoxGeometry', [scale, scale, scale],
                    'MeshLambertMaterial', [{
                        color: shape.color,
                        shading: T.FlatShading,
                        map: bumpTexture
                    }]
                );
                block.position.x = c * scale;
                block.position.y = r * -(scale);
                shapeMesh.add(block);
              }
            }
        }
        shapeMesh.position.y = (5*scale) - (layout.length * scale);
        shapeMesh.position.x = (layout[0].length / 2) * -1;

        return shapeMesh;
    }

    var letters = 'LJSZTOI';
    var tetrominos = []
    letters.split('').forEach(function(letter,i) {
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
        radius: 20
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


    var animateRenderer = function() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animateRenderer);
        tetrominos.forEach(function(tetromino) {
          tetromino.rotation.y += 0.025;
        });
    };
    animateRenderer();
    window.addEventListener('resize', function() {
        core.resizeRenderer(renderer, scene, camera, effect);
    }, false);

}(window, document));
