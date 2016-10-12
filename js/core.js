var core = function(window) {
  'use strict';
  var T = window.THREE;

  var construct = function(constructor, args) {
    var F = function() {
      return constructor.apply(this, args);
    };
    F.prototype = constructor.prototype;
    return new F();
  };

  var build = function(geoType, geoProps, matType, matProps) {
    var geo = construct(T[geoType], geoProps);
    var mat = construct(T[matType], matProps);
    var mesh = new T.Mesh(geo, mat);
    return mesh;
  };

  var isPocketDevice = function() {
    // Assuming this is only available on mobile
    return typeof window.orientation !== 'undefined' || ('ontouchstart' in window);
  };

  var options = {
    fov: isPocketDevice() ? 90 : 70,
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: 1,
    near: 0.1,
    far: 1000
  };

  var setControllerMethod = function(camera, domElement) {
    var controls = void 0;
    if (core.isPocketDevice()) {
      controls = new T.DeviceOrientationControls(camera, true);
    } else {
      controls = new T.OrbitControls(camera, domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = false;
      controls.enablePan = false;
    }
    return controls;
  };
  var resizeRenderer = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspect = width / height;

    window.camera.aspect = aspect;
    window.camera.updateProjectionMatrix();
    window.renderer.setSize(width, height);
    if (core.isPocketDevice()) {
      window.effect.setSize(width, height);
      window.effect.render(scene, camera);
    }
  };

  var setCameraOptions = function() {
    var camera = void 0;
    camera = new T.PerspectiveCamera(
      core.options.fov,
      core.options.aspect,
      core.options.near,
      core.options.far
    );
    return camera;
  };
  // Override some options based on context
  options.aspect = options.width / options.height;

  var center = new T.Vector3(0, 0, 0);

  var template = function(tpl, data) {
    for (var part in data) {
      tpl = tpl.replace(new RegExp('{' + part + '}', 'g'), data[part]);
    }
    return tpl;
  };

  var createFullScreenControl = function() {
    // If we're inside an iframe, there is probably already a control on the parent
    // so get out of dodge
    if (window.top !== window.self) {
      return; }
    if (!document.fullscreenEnabled) {
      return; }


    if (core.isPocketDevice()) {
      // Create a button
      var button = document.createElement('button');
      button.classList.add('fs-toggle');
      button.innerText = 'Enter fullscreen';

      // Append to body
      document.body.appendChild(button);

      // Bind it to enter fullscreen
      button.addEventListener('click', function(e) {
        document.body.requestFullscreen();
      }, false);

      // Oh also create some styles
      var css = '.fs-toggle { background: #000; border: 2px solid #0f0; padding: .5em 1em; font-size: 28px; color: #0f0; box-shadow: 0 0 80px 20px #000; box-sizing: border-box; position: absolute; z-index: 10001; margin: auto; left: 0; top: 0; bottom: 0; right: 0; width: 300px; height: 100px; }';
      css += ':fullscreen .fs-toggle { display: none; }';
      css += ':-webkit-full-screen .fs-toggle { display: none; }';
      css += ':-moz-full-screen .fs-toggle { display: none; }';
      var styleInject = document.createElement('style');
      styleInject.innerText = css;
      document.head.appendChild(styleInject);
    }

  };

  var addGround = function(height) {
    var groundTexture = textureLoader.load('../js/grid.png');
    groundTexture.wrapS = groundTexture.wrapT = T.RepeatWrapping;
    groundTexture.repeat.set(128, 128);
    window.ground = core.build(
      'PlaneBufferGeometry', [1000, 1000, 100],
      'MeshLambertMaterial', [{
        color: 0xffffff,
        map: groundTexture
      }]
    );
    if (height == undefined) {
      height = -10;
    }
    ground.position.y = height;
    ground.rotation.x = -Math.PI / 2;
    window.scene.add(ground);
  };


  var init = function() {
    createFullScreenControl();

    window.textureLoader = new T.TextureLoader();

    window.renderer = new T.WebGLRenderer({
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true,
    });

    window.scene = new T.Scene();
    window.camera = setCameraOptions();
    scene.add(camera);

    renderer.setSize(options.width, options.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.soft = true;
    document.body.appendChild(renderer.domElement);
    window.controls = setControllerMethod(camera, renderer.domElement);

    camera.position.set(0, 40, 0);
    window._renderer = renderer;

    if (isPocketDevice()) {
      window.effect = new T.StereoEffect(renderer);
      effect.eyeSeparation = 1;
      effect.focalLength = 25;
      effect.setSize(options.width, options.height);

      camera.position.set(0, 20, 0);
      _renderer = effect;
    }

    if (window.vreticle) {
      window.reticle = vreticle.Reticle(camera, .5);
    }

    window.addEventListener('resize', function() {
      resizeRenderer();
    }, false);
  };

  return {
    options: options,
    init: init,
    addGround: addGround,
    construct: construct,
    build: build,
    isPocketDevice: isPocketDevice,
    template: template,
    center: center,
  };
}(window);
