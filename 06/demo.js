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

    var textureLoader = new T.TextureLoader();
    var groundTexture = textureLoader.load('grid.png');

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

    // Game stuff

    var bens = [
        {
            "id": "1",
            "img":"0b297198e80776964f7335aa183224e6bc77feef.jpeg"
        },
        {
            "id": "2",
            "img":"51385.jpg"
        },
        {
            "id": "3",
            "img":"478240_10100495233670161_1134896658_o.jpg"
        },
        {
            "id": "4",
            "img":"544073_10100714296067361_1364950741_n.jpg"
        },
        {
            "id": "5",
            "img":"552497_10100670131839199_1410185620_n.jpg"
        },
        {
            "id": "6",
            "img":"1459835_10100714295543411_1569267728_n.jpg"
        },
        {
            "id": "7",
            "img":"1609964_10100891468372399_5314245146414495341_n.jpg"
        },
        {
            "id": "8",
            "img":"1899843_10154857989372316_449088837082222867_o.jpg"
        },
        {
            "id": "9",
            "img":"10257785_10152958074013731_2068668379596738058_o.jpg"
        },
        {
            "id": "10",
            "img":"10535062_698112880280887_1441873599_a.jpg"
        },
        {
            "id": "11",
            "img":"10576219_941633282563285_353342430_n.jpg"
        },
        {
            "id": "12",
            "img":"10576948_10100939882814711_907055561372069259_n.jpg"
        },
        {
            "id": "13",
            "img":"10891691_10152524412140583_5150630968971189847_n.jpg"
        },
        {
            "id": "14",
            "img":"11013143_10101560780041695_542762577459071105_n.jpg"
        },
        {
            "id": "15",
            "img":"11227641_10155824324175644_8875895580432879358_n.jpg"
        },
        {
            "id": "16",
            "img":"11695930_10206769712754005_1777398456919497257_n.jpg"
        },
        {
            "id": "17",
            "img":"11849198_515553488608358_841433183_n.jpg"
        },
        {
            "id": "18",
            "img":"11909124_743573075788390_1223993214_n.jpg"
        },
        {
            "id": "19",
            "img":"12407624_834055283386917_203495249_n.jpg"
        },
        {
            "id": "20",
            "img":"12716844_236593263342621_1956910791_n.jpg"
        },
        {
            "id": "21",
            "img":"afd2a8f01a90533438baf75f010997ef2f07d693.jpeg"
        },
        {
            "id": "22",
            "img":"ben_2b3bad82-402b-4f50-abf0-f5dbc9a1aeca_large.jpg"
        },
        {
            "id": "23",
            "img":"ben-1.jpg"
        },
        {
            "id": "24",
            "img":"ben-foxall-1.jpg"
        },
        {
            "id": "25",
            "img":"ben-foxall-2.jpg"
        },
        {
            "id": "26",
            "img":"ben-foxall-3.jpg"
        },
        {
            "id": "27",
            "img":"ben-foxall-4.jpg"
        },
        {
            "id": "28",
            "img":"ben-foxall-5.jpg"
        },
        {
            "id": "29",
            "img":"ben-foxall.jpg"
        },
        {
            "id": "30",
            "img":"ben.jpg"
        },
        {
            "id": "31",
            "img":"ben1.jpg"
        },
        {
            "id": "32",
            "img":"CQo2vp6VAAA9Lzq.jpg"
        },
        {
            "id": "33",
            "img":"CUrutJyXIAMSA4w.jpg"
        },
        {
            "id": "34",
            "img":"d5f36cb3a2b97a68cc812d985726b5dd.jpg"
        },
        {
            "id": "35",
            "img":"hqdefault.jpg"
        },
        {
            "id": "36",
            "img":"images-1.jpg"
        },
        {
            "id": "37",
            "img":"images.jpg"
        },
        {
            "id": "38",
            "img":"IMG_20160422_093015.jpg"
        },
        {
            "id": "39",
            "img":"IMG_20160422_093220.jpg"
        },
        {
            "id": "40",
            "img":"IMG_20160422_112235.jpg"
        },
        {
            "id": "41",
            "img":"Kf3rKQ9W_400x400.jpg"
        },
        {
            "id": "42",
            "img":"large_benfoxall.jpg"
        },
        {
            "id": "43",
            "img":"photo.jpg"
        },
        {
            "id": "44",
            "img":"url.jpg"
        },
    ];

    var clength = bens.length;
    var step = (2 * Math.PI) / clength;
    var angle = 0;
    var circle = {
        width: 10,
        depth: 10,
        radius: 150
    };

    var pickCardSet = function (arr, count) {
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    };

    var flipBen = function (ben, forwards) {
        ben.card.flipped = forwards;
        var rotation = {y:Math.PI};
        var rotation_to = {y:Math.PI * 2};
        var card_tween = new TWEEN.Tween(rotation).to(rotation_to, 500);
        card_tween.onUpdate(function() {
            ben.rotation.y = rotation.y;
        });
        card_tween.start();
    };

    var benCount = 16;

    var newGame = function () {

        var cardSize = 22;
        var spacing = cardSize * 1.5;
        var cX = -1;
        var cY = 0;
        var numTries = 0;
        var flippedBens = [];
        var solvedBens = [];

        var randomBens = pickCardSet(bens, benCount / 2); // only pick half as many as we need
        // then duplicate them!
        var clonedBens = randomBens.slice(0);
        // then merge them so we have doubles!
        randomBens = randomBens.concat(clonedBens);
        // then reshuffle them
        randomBens = pickCardSet(randomBens, benCount);

        randomBens.forEach(function (ben, i) {
            var benTexture = textureLoader.load('bens/'+ben.img);
            var benMaterial = new T.MeshLambertMaterial({
                color: 0xffffff,
                map: benTexture
            });

            var plainMaterial = new T.MeshLambertMaterial({
                color: 0xffffff
            });

            var materials = [
                plainMaterial,
                plainMaterial,
                plainMaterial,
                plainMaterial,
                benMaterial, // only show his glorious face on one face of the cube
                plainMaterial
            ];

            var benMesh = new T.Mesh(
                new T.BoxGeometry(cardSize, cardSize, 2, 3, 3, 3),
                new T.MeshFaceMaterial(materials)
            );

            // grid layout
            cX++;
            if (i % 4 === 0) {
                cY++;
                cX = -1;
            }

            benMesh.position.x = spacing * cX;
            benMesh.position.y = (spacing * cY) - (spacing/2);
            benMesh.position.z = -100;
            benMesh.card = {
                id: ben.id,
                img: ben.img,
                flipped: false
            };
            // Initial flip to hide faces
            benMesh.rotation.y = Math.PI;

            benMesh.ongazelong = function () {
                if (flippedBens.length < 2 && !benMesh.card.flipped) {
                    flipBen(benMesh, true);
                    flippedBens.push(benMesh);
                    if (flippedBens.length === 2) {
                        numTries++;
                        if (flippedBens[0].card.id === flippedBens[1].card.id) {
                            setTimeout(function () {
                                flippedBens.forEach(function (ben) {
                                    scene.remove(ben);
                                    reticle.remove_collider(ben);
                                    solvedBens.push(ben);

                                    if (solvedBens.length === benCount) {
                                        newGame();
                                    }
                                });
                                flippedBens = [];
                            }, 500);
                        }
                    }
                } else {
                    if (flippedBens.length >= 2) {
                        flippedBens.forEach(function (ben) {
                            ben.rotation.y = Math.PI;
                            ben.card.flipped = false;
                        });
                        flippedBens = [];
                    }
                }
            };

            angle += step;

            reticle.add_collider(benMesh);
            scene.add(benMesh);
        });

    };


    var intro = core.build(
        'BoxGeometry', [40, 20, 2],
        'MeshLambertMaterial', [{
            color: 0xffffff
        }]
    );
    var introButtonTexture = textureLoader.load('start.png');
    var introButton = core.build(
        'BoxGeometry', [38, 18, 1],
        'MeshLambertMaterial', [{
            color: 0x4c6ef5,
            map: introButtonTexture
        }]
    );
    introButton.position.z = 2;
    intro.add(introButton);
    intro.position.z = -60;
    intro.position.y = 10;

    intro.ongazelong = function () {
        newGame();
        var scale = {x: 1, y: 1, z: 1};
        var scale_to = {x: 0, y: 0, z: 0};
        var intro_tween = new TWEEN.Tween(scale).to(scale_to, 500);
        intro_tween.onUpdate(function() {
            intro.scale.x = scale.x;
            intro.scale.y = scale.y;
            intro.scale.z = scale.z;
        });
        intro_tween.start();
        setTimeout(function () {
            scene.remove(intro);
            reticle.remove_collider(intro);
        }, 1000);
    };
    reticle.add_collider(intro);
    scene.add(intro);










    var animateRenderer = function() {
        controls.update();
        effect.render(scene, camera);
        reticle.reticle_loop();
        requestAnimationFrame(animateRenderer);
        TWEEN.update();
    };
    animateRenderer();
    window.addEventListener('resize', function() {
        core.resizeRenderer(renderer, scene, camera, effect);
    }, false);

}(window, document));
