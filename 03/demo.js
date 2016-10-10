(function(window, document) {
    'use strict';
    var core = window.core;
    var T = window.THREE;

    core.createFullScreenControl();

    var renderer, scene, camera, effect, controls, ground, ambientLight, light;

    scene = new T.Scene();
    camera = core.setCameraOptions();
    if (core.isPocketDevice()) {
        camera.position.set(0, 20, 0);
    } else {
        camera.position.set(0, 40, 0);
    }
    var reticle = vreticle.Reticle(camera, .5);
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
    var boo_1 = textureLoader.load('boo_1.png');
    var boo_2 = textureLoader.load('boo_2.png');

    groundTexture.wrapS = groundTexture.wrapT = T.RepeatWrapping;
    groundTexture.repeat.set(256, 256);
    groundTexture.anisotropy = renderer.getMaxAnisotropy();
    ground = core.build(
        'PlaneBufferGeometry', [2000, 2000, 100],
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

    ambientLight = new T.AmbientLight(0xffffff, .8);
    scene.add(ambientLight);


    var panel = core.build(
        'BoxGeometry', [30, 30, 2],
        'MeshLambertMaterial', [{
            color: 0xffffff,
            map: boo_1,
            transparent: true
        }]
    );
    var generatePanels = function(number) {
        var panels = [];
        for (var i = 0; i < number; i++) {
            panels[i] = new T.Mesh(panel.geometry.clone(), panel.material.clone());
            panels[i].position.y = 1;
        }
        return panels;
    }
    var panels = generatePanels(16);
    var clength = panels.length;
    var step = (2 * Math.PI) / clength;
    var angle = 0;
    var circle = {
        width: 10,
        depth: 10,
        radius: 100
    };
    panels.forEach(function(panel, i) {
        // position them in a circle
        panel.position.x = (circle.width / clength) + (circle.radius * Math.cos(angle));
        panel.position.z = (circle.depth / clength) + (circle.radius * Math.sin(angle));
        panel.scale.set(.5, .5, .5);
        panel.lookAt(core.center);
        angle += step;

        panels[i].gazeTriggered = false;

        panels[i].ongazelong = function() {
            if (panels[i].gazeTriggered) return;
            panels[i].gazeTriggered = true;
            panels[i].material.map = boo_2;
        }

        panels[i].ongazeover = function() {

            var scale = {
                x: .5,
                y: .5,
                z: .5
            };
            var new_scale = {
                x: 1.0,
                y: 1.0,
                z: 1.0
            };
            var panel_tween = new TWEEN.Tween(scale).to(new_scale, 500);
            panel_tween.onUpdate(function() {
                panels[i].scale.set(scale.x, scale.y, scale.z);
            });
            panel_tween.start();
        }

        panels[i].ongazeout = function() {
            panels[i].gazeTriggered = false;
            var scale = panels[i].scale;
            var new_scale = {
                x: .5,
                y: .5,
                z: .5
            };
            var panel_tween = new TWEEN.Tween(scale).to(new_scale, 500);
            panel_tween.onUpdate(function() {
                panels[i].scale.set(scale.x, scale.y, scale.z);
            });
            panel_tween.start();

            setTimeout(function() {
                panels[i].material.map = boo_1;
            }, 200);
        }

        reticle.add_collider(panels[i]);
        scene.add(panels[i]);
    });


    var animateRenderer = function() {
        controls.update();
        renderer.render(scene, camera);
        reticle.reticle_loop();
        requestAnimationFrame(animateRenderer);
        TWEEN.update();
    };
    animateRenderer();
    window.addEventListener('resize', function() {
        core.resizeRenderer(renderer, scene, camera, effect);
    }, false);

}(window, document));
