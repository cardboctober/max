(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  var playOnTouch;

  core.init();
  core.addGround();

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var lightsobj = [
    [0xffffff, -25, 30, -35],
    [0xffffff, 25, 30, -35],
    [0xffffff, -25, 0, -35],
    [0xffffff, 25, 0, -35]
  ];
  var lights = [];
  lightsobj.forEach(function (lobj, i) {
    var _light = new T.PointLight(lobj[0], .5, 0, 1);
    _light.position.set(lobj[1], lobj[2], lobj[3]);
    lights.push(_light);
    scene.add(_light);


    // Debug positions of lights
    // var bulb = core.build(
    //   'BoxGeometry', [1, 1, 1],
    //   'MeshPhongMaterial', [{
    //     color: 0xffff00,
    //     shading: T.FlatShading,
    //   }]
    // );
    // bulb.position.set(lobj[1], lobj[2], lobj[3]);
    // scene.add(bulb);
  });

  // Build a cinema...

  var chairObject = new T.Object3D();
  var chairObject_backrest = core.build(
    'BoxGeometry', [4, 6, 1],
    'MeshPhongMaterial', [{
      color: 0xcc0000,
      shading: T.FlatShading,
    }]
  );
  chairObject_backrest.rotation.x = .25;
  chairObject.add(chairObject_backrest);


  var chairObject_base = core.build(
    'BoxGeometry', [4, 1, 4],
    'MeshPhongMaterial', [{
      color: 0xcc0000,
      shading: T.FlatShading,
    }]
  );

  chairObject_base.position.y = -2.5;
  chairObject_base.position.z = -2;
  chairObject.add(chairObject_base);


  var chairObject_arm = core.build(
    'BoxGeometry', [1, 1, 4],
    'MeshPhongMaterial', [{
      color: 0x222222,
      shading: T.FlatShading,
    }]
  );
  var chairObject_arm_L = new T.Mesh(chairObject_arm.geometry.clone(), chairObject_arm.material.clone());
  chairObject_arm_L.position.x = -2;
  chairObject_arm_L.position.y = -1;
  chairObject_arm_L.position.z = -2;

  chairObject.add(chairObject_arm_L);

  var chairObject_arm_R = new T.Mesh(chairObject_arm.geometry.clone(), chairObject_arm.material.clone());
  chairObject_arm_R.position.x = 2;
  chairObject_arm_R.position.y = -1;
  chairObject_arm_R.position.z = -2;

  chairObject.add(chairObject_arm_R);

  var chairObject_stand = core.build(
    'BoxGeometry', [2, 2, 2],
    'MeshPhongMaterial', [{
      color: 0x222222,
      shading: T.FlatShading,
    }]
  );
  chairObject_stand.position.y = -3.5;
  chairObject_stand.position.z = -2;
  chairObject.add(chairObject_stand);

  var chairArrangement = [
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
  ];
  var randomIndex = function(array) {
    return Math.floor(Math.random() * array.length);
  };
  var randomSeat = function () {
    var indexR = randomIndex(chairArrangement);
    var indexC = randomIndex(chairArrangement[indexR]);
    while (chairArrangement[indexR][indexC] == 0) {
      indexC = randomIndex(chairArrangement[indexR]);
    }
    return {
      row: indexR,
      col: indexC
    };
  };
  var height = 0;
  var metrics = {
    width: 6,
    height: 6,
    depth: 8,
  };
  var chairs = [];
  var xOffset = (metrics.width * chairArrangement[0].length) / 2;
  chairArrangement.forEach(function(row, i) {
    var _row = [];
    row.forEach(function(col, j) {
      if (col == 1) {
        var chair = chairObject.clone();
        chair.position.x = (j * metrics.width) - xOffset;
        chair.position.y = height * (0.3 * metrics.height);
        chair.position.z = i * metrics.depth;

        scene.add(chair);
        _row[j] = chair;
      }
    });
    chairs.push(_row);
    height++;
  });



  var video = document.createElement('video');
    video.poster = 'video.png';
  var videoSource = document.createElement('source');
      videoSource.src = 'video.webm';
      videoSource.type = 'video/webm';
      video.appendChild(videoSource);
  var videoSource = document.createElement('source');
      videoSource.src = 'video.ogv';
      videoSource.type = 'video/ogg';
      video.appendChild(videoSource);
  var videoSource = document.createElement('source');
      videoSource.src = 'video.mp4';
      videoSource.type = 'video/mp4';
      video.appendChild(videoSource);

  //make your video canvas
  var videocanvas = document.createElement('canvas');
  var videocanvasctx = videocanvas.getContext('2d');

  //set its size
  var vidw = 1024;
  var vidh = 512;

  videocanvas.width = vidw;
  videocanvas.height = vidh;

  //draw a black rectangle so that your spheres don't start out transparent
  videocanvasctx.fillStyle = "#222222";
  videocanvasctx.fillRect(0,0,vidw,vidh);
  var videotexture = textureLoader.load('video.png');


  var screen = core.build(
    'BoxGeometry', [120, 60, 0],
    'MeshLambertMaterial', [{
      color: 0xffffff,
      map: videotexture,
      overdraw: 0.5
    }]
  );
  screen.position.set(0, 20, -50);

  scene.add(screen);

  var playing = false;

  screen.ongazelong = function () {
    if (!playing) {
      playing = true;
      if (core.isPocketDevice()) {
        videotexture = textureLoader.load('mobile-instructions.png');
        screen.material.map = videotexture;
        playOnTouch = function () {
          videotexture = new THREE.Texture(videocanvas);
          videotexture.wrapS = videotexture.wrapT = T.RepeatWrapping;
          videotexture.repeat.x = 1;
          videotexture.repeat.y = 1;
          videotexture.offset.x = -.15;
          videotexture.offset.y = .1;
          screen.material.map = videotexture;
          video.load();
          video.play();
          document.removeEventListener('click', playOnTouch, false);
          reticle.remove_collider(screen);
        }
        document.addEventListener('click', playOnTouch, false);
      } else {
        videotexture = new THREE.Texture(videocanvas);
        videotexture.wrapS = videotexture.wrapT = T.RepeatWrapping;
        videotexture.repeat.x = 1;
        videotexture.repeat.y = 1;
        videotexture.offset.x = -.15;
        videotexture.offset.y = .1;
        screen.material.map = videotexture;
        video.load();
        video.play();
        reticle.remove_collider(screen);
      }
    }
  };
  reticle.add_collider(screen);

  var colorThief = new ColorThief();

  var gotochair = function (seat) {
    var targetChair = chairs[seat.row][seat.col];
    camera.position.set(targetChair.position.x, targetChair.position.y + 4, targetChair.position.z);
    camera.lookAt(new T.Vector3(screen.position.x, screen.position.y, screen.position.z));
  };

  gotochair(randomSeat());

  var update = function() {
    if(video.readyState === video.HAVE_ENOUGH_DATA){
      //draw video to canvas starting from upper left corner
      videocanvasctx.drawImage(video, 0, 0);
      //tell texture object it needs to be updated
      videotexture.needsUpdate = true;

      var domcolors = colorThief.getPalette(videocanvas, 4);
      domcolors.forEach(function (color, i) {
        var colorrgb = core.template("rgb({r}, {g}, {b})",{
          r:color[0],
          g:color[1],
          b:color[2],
        });
        var tcolor = new THREE.Color(colorrgb);
        lights[i].color = tcolor;
      });
    }
    reticle.reticle_loop();

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  update();

}(window));
