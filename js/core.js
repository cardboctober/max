var core = function (window) {
  'use strict';
  var T = window.THREE;

  var construct = function construct(constructor, args) {
    var F = function F() {
      return constructor.apply(this, args);
    };
    F.prototype = constructor.prototype;
    return new F();
  };

  var build = function build(geoType, geoProps, matType, matProps) {
    var geo = construct(T[geoType], geoProps);
    var mat = construct(T[matType], matProps);
    var mesh = new T.Mesh(geo, mat);
    return mesh;
  };

  var isPocketDevice = function isPocketDevice() {
    // Assuming this is only available on mobile
    return typeof window.orientation !== 'undefined';
  };

  var setControllerMethod = function setControllerMethod(camera, domElement) {
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
  var resizeRenderer = function resizeRenderer(renderer, scene, camera, effect) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspect = width / height;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    effect.setSize(width, height);
    effect.render(scene, camera);
  };

  var setCameraOptions = function setCameraOptions() {
    var camera = void 0;
    camera = new T.PerspectiveCamera(
      core.options.fov,
      core.options.aspect,
      core.options.near,
      core.options.far
    );
    return camera;
  };

  var options = {
    fov: isPocketDevice() ? 90 : 40,
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: 1,
    near: 0.1,
    far: 1000
  };
  // Override some options based on context
  options.aspect = options.width / options.height;

  var center = new T.Vector3(0, 0, 0);

  var template = function template(tpl, data) {
    for (var part in data) {
      tpl = tpl.replace(new RegExp('{' + part + '}', 'g'), data[part]);
    }
    return tpl;
  };

  return {
    options: options,
    construct: construct,
    build: build,
    isPocketDevice: isPocketDevice,
    setControllerMethod: setControllerMethod,
    resizeRenderer: resizeRenderer,
    setCameraOptions: setCameraOptions,
    template: template
  };
}(window);
