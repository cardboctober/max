(function(window, document) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var light = new T.DirectionalLight(0xffffff, .5);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 30, 20);
  light.position.multiplyScalar(40);

  scene.add(light);

  var speaker = new T.Object3D();

  var woodSide = new T.MeshLambertMaterial({
    color: 0xffffff,
    map: textureLoader.load('speaker-side.jpg')
  });
  var woodTop = new T.MeshLambertMaterial({
    color: 0xffffff,
    map: textureLoader.load('speaker-top.jpg')
  });
  var speakerMaterials = [
    woodSide, // right
    woodSide, // left
    woodTop, // top
    woodTop, // bottom
    woodSide, // front
    woodSide // back
  ];

  var speakerGrillFill = new T.MeshLambertMaterial({
    color: 0x222222,
    map: textureLoader.load('speaker.jpg')
  });

  var speakerGrillTex = new T.MeshLambertMaterial({
    color: 0x222222,
    map: textureLoader.load('speaker.jpg')
  });
  var speakerGrillMaterials = [
    speakerGrillFill,
    speakerGrillFill,
    speakerGrillFill,
    speakerGrillTex,
    speakerGrillFill,
    speakerGrillFill
  ]

  var speakerBody = core.build(
    'BoxGeometry', [4, 8, 4],
    'MeshFaceMaterial', [speakerMaterials]
  );
  speaker.add(speakerBody);
  var speakerGrill = core.build(
    'CylinderGeometry', [1.8, 1.8, 1, 32],
    'MeshLambertMaterial', [{
      color: 0x222222
    }]
  );
  speakerGrill.rotation.x = Math.PI / 2;
  speakerGrill.position.z = 2;
  speakerGrill.position.y = -2;
  var speakerGrill2 = core.build(
    'CylinderGeometry', [1.4, 1.4, 1, 32],
    'MeshLambertMaterial', [{
      color: 0x222222
    }]
  );
  speakerGrill2.rotation.x = Math.PI / 2;
  speakerGrill2.position.z = 2;
  speakerGrill2.position.y = 2;

  speaker.add(speakerGrill);
  speaker.add(speakerGrill2);


  var button = new T.Object3D();

  var buttonBody = core.build(
    'BoxGeometry', [8, 2, 8],
    'MeshLambertMaterial', [{
      color: 0x222222
    }]
  );
  button.add(buttonBody);

  var buttonPresser = core.build(
    'CylinderGeometry', [3, 3, 1.5, 32],
    'MeshLambertMaterial', [{
      color: 0xdd0000
    }]
  );
  buttonPresser.position.y = 1;
  button.add(buttonPresser);

  button.rotation.x = Math.PI / 6;
  button.position.z = -10;

  var speakers = [];

  speakers.push({
    "speaker": speaker.clone(),
    "speaker_pos": new T.Vector3(-40, 4, -20),
    "button": button.clone(),
    "button_pos": new T.Vector3(-16, -10, -10)
  });
  speakers.push({
    "speaker": speaker.clone(),
    "speaker_pos": new T.Vector3(-20, 4, -35),
    "button": button.clone(),
    "button_pos": new T.Vector3(-8, -10, -10)
  });
  speakers.push({
    "speaker": speaker.clone(),
    "speaker_pos": new T.Vector3(0, 12, -50),
    "speaker_scale": [3, 3, 3],
    "button": button.clone(),
    "button_pos": new T.Vector3(0, -10, -10)
  });
  speakers.push({
    "speaker": speaker.clone(),
    "speaker_pos": new T.Vector3(20, 4, -35),
    "button": button.clone(),
    "button_pos": new T.Vector3(8, -10, -10)
  });
  speakers.push({
    "speaker": speaker.clone(),
    "speaker_pos": new T.Vector3(40, 4, -20),
    "button": button.clone(),
    "button_pos": new T.Vector3(16, -10, -10)
  });


  var lastPlayed;
  speakers.forEach(function(s, i) {
    var spos = s.speaker_pos;
    var bpos = s.button_pos;

    s.speaker.position.x = spos.x;
    s.speaker.position.y = spos.y;
    s.speaker.position.z = spos.z;
    s.speaker.lookAt(new T.Vector3(camera.position.x, 2, camera.position.z));


    if ('speaker_scale' in s) {
      var scale = s.speaker_scale;
      s.speaker.scale.set(scale[0], scale[1], scale[2]);
    }

    s.button.position.x = bpos.x;
    s.button.position.y = bpos.y;
    s.button.position.z = bpos.z;


    // Make them user their own material!
    s.speaker.children[1].material = new T.MeshFaceMaterial(speakerGrillMaterials).clone();
    s.speaker.children[2].material = new T.MeshFaceMaterial(speakerGrillMaterials).clone();
    s.button.children[1].material = new T.MeshLambertMaterial({ color: 0xdd0000 });

    scene.add(s.speaker);
    scene.add(s.button);


    // Draw lines from speakers to buttons
    var material = new T.LineBasicMaterial({
      color: 0xaaaaaa,
      linewidth: 10
    });

    var geometry = new T.Geometry();
    geometry.vertices.push(
      new T.Vector3(spos.x, spos.y, spos.z),
      new T.Vector3(spos.x, -10, spos.z),
      new T.Vector3(bpos.x, -20, bpos.z),
      new T.Vector3(bpos.x, bpos.y, bpos.z)
    );

    var line = new T.Line(geometry, material);
    scene.add(line);


    var updateColors = function(color1, color2, color3, color4) {
      s.speaker.children[1].material.materials.forEach(function(mat) {
        mat.color.setHex(color1);
      });
      s.speaker.children[2].material.materials.forEach(function(mat) {
        mat.color.setHex(color2);
      });
      s.button.children[1].material.color.setHex(color3);
      line.material.color.setHex(color4);
    }

    var looked = false;
    var triggerButton = function(i) {
      if (!looked) {
        if (lastPlayed == 4 && i == 2) {
          // play the secret sound!
          var sound = new Howl({
            src: 'birabuto.mp3',
            volume: .6,
            onend: function() {
              played = [];
              updateColors(0x222222, 0x222222, 0xdd0000, 0xaaaaaa);
            }
          });
          var soundid = sound.play();
          var colors = [
            0xfa5252,
            0xe64980,
            0xbe4bdb,
            0x7950f2,
            0x4c6ef5,
            0x228ae6,
            0x15aabf,
            0x12b886,
            0x40c057,
            0x82c91e,
            0xfab005,
            0xfd7e14
          ];
          var changeToColor = function(color) {
            updateColors(color, color, color, color);
          };
          var length = 9900;

          var clength = colors.length;
          for (var i = 0; i < clength; i++) {
            var color = colors[i];
            var timeout = i * (length / clength);
            setTimeout(changeToColor.bind(null, color), timeout);
          }
        }
        updateColors(0xffffff, 0xffffff, 0xffffff, 0xffffff);

        s.button.children[1].position.y -= .5;

        var sound = new Howl({
          src: 'jump.mp3'
        });
        sound.pos(spos.x, spos.y, spos.z);
        sound.play();

        looked = true;

        setTimeout(function() {
          looked = false;
          updateColors(0x222222, 0x222222, 0xdd0000, 0xaaaaaa);
          s.button.children[1].position.y += .5;
        }, 1000);
      }
        lastPlayed = i;
    };
    s.button.children[1].ongazelong = function () {
        triggerButton(i)
    };
    reticle.add_collider(s.button.children[1]);
  });

  var update = function() {
    reticle.reticle_loop();

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  }
  update();

}(window, document));
