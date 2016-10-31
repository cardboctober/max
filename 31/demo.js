(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;
  core.init();

  core.addGround();
  scene.fog = new THREE.Fog(0x111111, 0.015, 110);
  var groundTexture = textureLoader.load('floor.jpg');
  groundTexture.wrapS = groundTexture.wrapT = T.RepeatWrapping;
  groundTexture.repeat.set(20,20);
  ground.material.map = groundTexture;
  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  var light = new T.DirectionalLight(0xffffff, .8);
  light.color.setHSL(0.1, 1, 0.95);
  light.position.set(0, 20, -10);
  light.position.multiplyScalar(40);

  scene.add(light);


  // put all of the demo related stuff here


  var fur = textureLoader.load('fur.jpg');
  fur.wrapS = fur.wrapT = T.RepeatWrapping;
  fur.repeat.set(2,2);

  var applyScale = function(obj, x, y, z) {
    obj.geometry.applyMatrix(new T.Matrix4().makeScale(x, y, z));
  };

  var spider = new T.Object3D();
  var abdomen = core.build(
    'SphereGeometry', [10, 32, 32],
    'MeshLambertMaterial', [{
      shading: T.FlatShading,
      map: fur,
      color: 0x666666
    }]
  );
  applyScale(abdomen, 1,1,1.5);
  abdomen.rotation.x = Math.PI * -.1;
  spider.add(abdomen);
  var thorax = core.build(
    'SphereGeometry', [6, 32, 32],
    'MeshLambertMaterial', [{
      shading: T.FlatShading,
      map: fur,
      color: 0x666666
    }]
  );
  applyScale(thorax, 1,1,1.2);
  thorax.position.z = -15;
  thorax.position.y = -5;
  spider.add(thorax);
  var head = core.build(
    'SphereGeometry', [3, 32, 32],
    'MeshLambertMaterial', [{
      shading: T.FlatShading,
      map: fur,
      color: 0x666666
    }]
  );
  head.position.z = -24;
  head.position.y = -5;

  var mandible = core.build('SphereGeometry', [1,8,8],'MeshLambertMaterial',[{shading:T.FlatShading,color:0x222222}]);
  var mandiblel = new T.Mesh(mandible.geometry.clone(), mandible.material.clone());
  var mandibler = new T.Mesh(mandible.geometry.clone(), mandible.material.clone());

  applyScale(mandiblel,.8,1,1.5);
  applyScale(mandibler,.8,1,1.5);

  mandiblel.position.set(-1,-1,-3);
  mandibler.position.set(1,-1,-3);

  head.add(mandiblel);
  head.add(mandibler);

  spider.add(head);
  var legs = [];
  var legpos = [{ // R1
      x: 5.5,
      y: -5,
      z: -20,
      r: {
        x: Math.PI * -.3,
        y: 0,
        z: Math.PI * -.4,
      },
      s: {
        x: 1,
        y: 1,
        z: 1,
      },
      // FEMUR
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      // TIBIA
      t: {
        x: -1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * -.4,
          z: Math.PI * .3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      // METATARSAL
      m: {
        x: -2.8, // back/forward
        y: 13.5, // left/right
        z: -8, // up/down
        r: {
          x: Math.PI * .1,
          y: Math.PI * -.4,
          z: Math.PI * .5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    }, { // L1
      x: -5.5,
      y: -5,
      z: -20,
      r: {
        x: Math.PI * -.3,
        y: 0,
        z: Math.PI * .4,
      },
      s: {
        x: 1,
        y: 1,
        z: 1,
      },
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      t: {
        x: 1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * .4,
          z: Math.PI * -.3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      m: {
        x: 2.8,
        y: 13.5,
        z: -8,
        r: {
          x: Math.PI * .1,
          y: Math.PI * .4,
          z: Math.PI * -.5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    },
    { // R2
      x: 5.8,
      y: -4.5,
      z: -17,
      r: {
        x: Math.PI * -.4,
        y: Math.PI * -.1,
        z: Math.PI * -.4,
      },
      s: {
        x: 1,
        y: 1.2,
        z: 1,
      },
      // FEMUR
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      // TIBIA
      t: {
        x: -1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * -.4,
          z: Math.PI * .3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      // METATARSAL
      m: {
        x: -2.8, // back/forward
        y: 13.5, // left/right
        z: -8, // up/down
        r: {
          x: Math.PI * .1,
          y: Math.PI * -.4,
          z: Math.PI * .5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    }, { // L2
      x: -5.8,
      y: -4.5,
      z: -17,
      r: {
        x: Math.PI * -.4,
        y: Math.PI * .1,
        z: Math.PI * .4,
      },
      s: {
        x: 1,
        y: 1.2,
        z: 1,
      },
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      t: {
        x: 1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * .4,
          z: Math.PI * -.3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      m: {
        x: 2.8,
        y: 13.5,
        z: -8,
        r: {
          x: Math.PI * .1,
          y: Math.PI * .4,
          z: Math.PI * -.5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    },
    { // R3
      x: 5.5,
      y: -5,
      z: -15,
      r: {
        x: Math.PI * -.7,
        y: 0,
        z: Math.PI * -.6,
      },
      s: {
        x: 1,
        y: 1.2,
        z: 1,
      },
      // FEMUR
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      // TIBIA
      t: {
        x: -1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * -.4,
          z: Math.PI * .3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      // METATARSAL
      m: {
        x: -2.8, // back/forward
        y: 13.5, // left/right
        z: -8, // up/down
        r: {
          x: Math.PI * .1,
          y: Math.PI * -.4,
          z: Math.PI * .5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    }, { // L3
      x: -5.5,
      y: -5,
      z: -15,
      r: {
        x: Math.PI * -.7,
        y: 0,
        z: Math.PI * .6,
      },
      s: {
        x: 1,
        y: 1.2,
        z: 1,
      },
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      t: {
        x: 1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * .4,
          z: Math.PI * -.3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      m: {
        x: 2.8,
        y: 13.5,
        z: -8,
        r: {
          x: Math.PI * .1,
          y: Math.PI * .4,
          z: Math.PI * -.5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    },
    { // R4
      x: 5.5,
      y: -5,
      z: -13,
      r: {
        x: Math.PI * -.5,
        y: Math.PI * -.1,
        z: Math.PI * -.7,
      },
      s: {
        x: 1,
        y: 1,
        z: 1,
      },
      // FEMUR
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      // TIBIA
      t: {
        x: -1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * -.4,
          z: Math.PI * .3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      // METATARSAL
      m: {
        x: -2.8, // back/forward
        y: 13.5, // left/right
        z: -8, // up/down
        r: {
          x: Math.PI * .1,
          y: Math.PI * -.4,
          z: Math.PI * .5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    }, { // L4
      x: -5.5,
      y: -5,
      z: -13,
      r: {
        x: Math.PI * -.5,
        y: Math.PI * .1,
        z: Math.PI * .7,
      },
      s: {
        x: 1,
        y: 1,
        z: 1,
      },
      f: {
        x: 0,
        y: 0,
        z: 0,
        r: {
          x: 0,
          y: 0,
          z: 0,
        },
        s: {
          x: 1.2,
          y: 8,
          z: 1.2,
        }
      },
      t: {
        x: 1.2,
        y: 10.5,
        z: -3,
        r: {
          x: 0,
          y: Math.PI * .4,
          z: Math.PI * -.3,
        },
        s: {
          x: .5,
          y: 4,
          z: .5,
        }
      },
      m: {
        x: 2.8,
        y: 13.5,
        z: -8,
        r: {
          x: Math.PI * .1,
          y: Math.PI * .4,
          z: Math.PI * -.5,
        },
        s: {
          x: .3,
          y: 2,
          z: .3,
        }
      }
    },
  ];
  var section = core.build(
    'CylinderGeometry', [.5, 1, 2, 8],
    'MeshLambertMaterial', [{
      shading: T.FlatShading,
      map: fur,
      color: 0x666666
    }]
  );
  var applyRotation = function(obj, x, y, z) {
    obj.rotation.set(x, y, z);
  };
  var applyPosition = function(obj, x, y, z) {
    obj.position.set(x, y, z);
  };

  var legsL = new T.Object3D();
  var legsR = new T.Object3D();
  for (var i = 0; i < legpos.length; i++) {
    var leg = new T.Object3D();
    var femur = new T.Mesh(section.geometry.clone(), section.material.clone());
    applyScale(femur, legpos[i].f.s.x, legpos[i].f.s.y, legpos[i].f.s.z);
    applyRotation(femur, legpos[i].f.r.x, legpos[i].f.r.y, legpos[i].f.r.z);
    applyPosition(femur, legpos[i].f.x, legpos[i].f.y, legpos[i].f.z);
    var tibia = new T.Mesh(section.geometry.clone(), section.material.clone());
    applyScale(tibia, legpos[i].t.s.x, legpos[i].t.s.y, legpos[i].t.s.z);
    applyRotation(tibia, legpos[i].t.r.x, legpos[i].t.r.y, legpos[i].t.r.z);
    applyPosition(tibia, legpos[i].t.x, legpos[i].t.y, legpos[i].t.z);
    var meta = new T.Mesh(section.geometry.clone(), section.material.clone());
    applyScale(meta, legpos[i].m.s.x, legpos[i].m.s.y, legpos[i].m.s.z);
    applyRotation(meta, legpos[i].m.r.x, legpos[i].m.r.y, legpos[i].m.r.z);
    applyPosition(meta, legpos[i].m.x, legpos[i].m.y, legpos[i].m.z);
    leg.add(femur);
    leg.add(tibia);
    leg.add(meta);
    leg.scale.set(legpos[i].s.x, legpos[i].s.y, legpos[i].s.z);
    applyRotation(leg, legpos[i].r.x, legpos[i].r.y, legpos[i].r.z);
    applyPosition(leg, legpos[i].x, legpos[i].y, legpos[i].z);

    if (i % 2) {
      legsL.add(leg);
    } else {
      legsR.add(leg);
    }
    // spider.add(leg);
  }
  spider.add(legsL);
  spider.add(legsR);
  spider.position.z = 12;
  scene.add(spider);

  var forwards = true;
  var rotationAmount = 0;


  var radius = 9;
  var w = 10;
  var d = 10;
  var angle = 0;


  var update = function() {
    if (forwards) {
      rotationAmount += .0025;
      if (rotationAmount = .05) {
        forwards = false;
      }
    } else {
      rotationAmount -= .01;
      if (rotationAmount < -.05) {
        forwards = true;
      }
    }
    abdomen.rotation.y = rotationAmount;
    thorax.rotation.y = rotationAmount;
    head.rotation.y = rotationAmount;

    if (radius > 1) {
      legsL.rotation.z = rotationAmount;
      legsL.rotation.x = rotationAmount;
      legsR.rotation.y = -1 * rotationAmount;
      legsR.rotation.z = -1 * rotationAmount;
      // radius -= .01;
      spider.rotation.y += .01;
      angle -= .01;

    }

    spider.position.x = w * radius  * Math.cos(angle);
    spider.position.z = d * radius * Math.sin(angle);




    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(animateRenderer);
  };
  var animateRenderer = function() {
    update();
  };
  update();
}(window));
