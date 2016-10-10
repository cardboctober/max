(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;

  core.init();
  core.addGround();

  var obj, micon;

  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var light = new T.DirectionalLight(0xffffff, 1);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 20, -10);
  light.position.multiplyScalar(40);

  scene.add(light);

  var commandSheetTexture = textureLoader.load('commands_.png');
  var commandSheet = core.build(
    'BoxGeometry', [100, 50, 1],
    'MeshLambertMaterial', [{
      color: 0xffffff,
      map: commandSheetTexture,
    }]
  );
  commandSheet.position.z = -120;
  commandSheet.position.y = 20;


  var introButtonTexture = textureLoader.load('start.png');
  var introButton = core.build(
    'BoxGeometry', [32, 16, 1],
    'MeshLambertMaterial', [{
      color: 0x4c6ef5,
      map: introButtonTexture
    }]
  );
  introButton.position.z = 30;

  introButton.ongazelong = function() {
    init();
    commandSheet.remove(introButton);
    reticle.remove_collider(introButton);
  }

  reticle.add_collider(introButton);
  commandSheet.add(introButton);

  scene.add(commandSheet);


  var moveAxis = function(obj, axis, amount) {
    var position = {};
    var position_to = {};
    position[axis] = obj.position[axis];
    position_to[axis] = obj.position[axis] += amount;

    var obj_tween = new TWEEN.Tween(position).to(position_to, 500);
    obj_tween.onUpdate(function() {
      obj.position[axis] = position[axis];
    });
    obj_tween.start();

  }
  var rotateAxis = function(obj, axis, amount) {
    var rotation = {};
    var rotation_to = {};
    rotation[axis] = obj.rotation[axis];
    rotation_to[axis] = obj.rotation[axis] += amount;

    var obj_tween = new TWEEN.Tween(rotation).to(rotation_to, 500);
    obj_tween.onUpdate(function() {
      obj.rotation[axis] = rotation[axis];
    });
    obj_tween.start();
  }

  //

  var parseTranscriptAction = function(transcript, obj) {
    var jokes = [
      ["What do you call a laughing jar of mayonnaise?", "la-mayo"],
      ["What kind of jokes do you make in the shower?", "Clean jokes!"],
      ["What's the best thing about Switzerland?", "I don't know, but the flag is a big plus."],
      ["Did you hear about the mathematician who's afraid of negative numbers?", "He'll stop at nothing to avoid them."],
      ["Helvetica and Times New Roman walk into a bar.", "\"Get out of here!\" shouts the bartender. \"We don't serve your type.\""],
      ["Why is it hard to make puns for kleptomaniacs?", "They are always taking things literally."],
      ["How do you keep an idiot in suspense?"],
      ["What do I look like? A JOKE MACHINE!?"],
    ];

    switch (transcript) {
      case 'step forward':
      case 'step forwards':
      case 'go forward':
      case 'go forwards':
      case 'move forward':
      case 'move forwards':
      case 'forwards':
      case 'forward':
        console.log('Moving forward');
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Moving forward'));

        moveAxis(obj, 'z', -10);
        rotateAxis(obj, 'x', -5)
        break;

      case 'step back':
      case 'step backward':
      case 'step backwards':
      case 'go back':
      case 'go backward':
      case 'go backwards':
      case 'move back':
      case 'move backward':
      case 'move backwards':
      case 'backwards':
      case 'backward':
      case 'back':
        console.log('Moving backward');
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Moving backward'));

        moveAxis(obj, 'z', 10);
        rotateAxis(obj, 'x', 5);
        break;

      case 'step left':
      case 'go left':
      case 'move left':
      case 'left':
        console.log('Moving left');
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Moving left'));

        moveAxis(obj, 'x', -10);
        rotateAxis(obj, 'z', 5);
        break;

      case 'step right':
      case 'go right':
      case 'move right':
      case 'right':
        console.log('Moving right');
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Moving right'));

        moveAxis(obj, 'x', 10);
        rotateAxis(obj, 'z', -5);
        break;

      case 'tell me a joke':
      case 'tell a joke':
      case 'tell joke':
      case 'tell me another joke':
      case 'tell another joke':
      case 'another joke':
      case 'joke':
      case 'jokes':
        var index = Math.floor(Math.random() * jokes.length);
        var joke = jokes[index];

        joke.forEach(function(part, i) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(part))
          setTimeout(function() {}, 250);
        });
        break;

      case 'sing me a song':
      case 'sing a song':
      case 'sing song':
      case 'song':
      case 'sing':
        var songs = [
          [
            "Daisy, Daisy give me your answer do.",
            "I'm half crazy all for the love of you.",
            "It won't be a stylish marriage,",
            "I can't afford a carriage.",
            "But you'll look sweet,",
            "Upon the seat,",
            "Of a bicycle made for two."
          ],
          [
            "Hey I just met you",
            "And this is crazy",
            "But here's my number",
            "So call me maybe",
            "It's hard to look right at you baby",
            "But here's my number",
            "So call me maybe"
          ]
        ];

        var index = Math.floor(Math.random() * songs.length);
        var song = songs[index];
        song.forEach(function(line, i) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(line))
          setTimeout(function() {}, 250);
        });
        break;


      default:
        console.log("Sorry, I don't understand " + transcript);
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Sorry, I don't understand " + transcript));
        break;
    }
  }

  function startListening() {
    var recognition = new(webkitSpeechRecognition || SpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onstart = function() {
      micon.material.map = textureLoader.load('mic-on.png');
      micon.scale.set(1, 1, 1);
    };

    recognition.onend = function() {
      micon.material.map = textureLoader.load('mic-off.png');
      micon.scale.set(.75, .75, .75);
    };

    recognition.onresult = function() {
      parseTranscriptAction(event.results[0][0].transcript, obj);
    };
  };


  var init = function() {

    obj = core.build(
      'SphereGeometry', [6, 32, 32],
      'MeshLambertMaterial', [{
        color: 0xffffff,
        map: textureLoader.load('ball.png')
      }]
    );

    obj.position.z = -20;
    // obj.position.y = -4;
    obj.position.y = 100;
    scene.add(obj);
    moveAxis(obj, 'y', -104);

    obj.direction = new T.Vector3(0, 0, 0);

    micon = core.build(
      'CylinderGeometry', [1.8, 1.8, 0, 32],
      'MeshLambertMaterial', [{
        color: 0xffffff,
        map: textureLoader.load('mic-off.png'),
        transparent: true
      }]
    );
    micon.rotation.y = Math.PI / 2;
    micon.rotation.x = Math.PI / 2;
    micon.position.z = -15;
    // micon.position.x = 4;
    micon.position.y = -6;
    micon.scale.set(.75, .75, .75);

    camera.add(micon);

    document.body.addEventListener('click', startListening);
  }



  //



  var update = function() {
    reticle.reticle_loop();
    TWEEN.update();

    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  }
  update();

}(window));
