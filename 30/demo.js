(function(window) {
  'use strict';
  var core = window.core;
  var T = window.THREE;
  core.init();
  core.addGround();
  var ambientLight = new T.AmbientLight(0xffffff, .8);
  scene.add(ambientLight);

  function xmlToJson(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };
  var request = new XMLHttpRequest();
  request.open('GET', "https://urlreq.appspot.com/req?method=GET&url=https://github.com/users/omgmog/contributions", true);
  request.onload = function() {
    var parser = new DOMParser();
    var xml = parser.parseFromString(this.responseText, "text/xml");
    renderChart(xmlToJson(xml));
  };
  request.send();
  var blockSize = 4;
  var block = core.build(
    'BoxGeometry', [blockSize, blockSize, blockSize],
    'MeshBasicMaterial', [{
      color: 0xff0000,
      transparent: true,
      opacity: 1
    }]
  );
  var colors = [
    0xeeeeee,
    0xd6e685,
    0x8cc665,
    0x44a340,
    0x1e6823
  ];
  var renderChart = function(data) {
    var cols = data.svg.g.g;
    var positions = [];
    var circle = {
      width: 20,
      depth: 20,
      radius: 50
    };
    var clength = cols.length;
    var step = (2 * Math.PI) / clength;
    var angle = 0;
    for (var c = 0; c < clength; c++) {
      positions.push([]);
      // put the calculated cell position in our array
      var position = new T.Vector3(
        (clength / circle.width) + (circle.radius * Math.cos(angle)),
        0,
        (clength / circle.depth) + (circle.radius * Math.sin(angle))
      );
      positions[c].push(position);
      angle += step;
    }
    cols.forEach(function(col, c) {
      var rows = col.rect;
      var pos = positions[c][0];
      rows.forEach(function(row) {
        var row = row['@attributes'];
        var count = row['data-count'];
        if (count > 0) {
          pos.y = row.y * -(blockSize / 10) + (7 * blockSize);
          var rBlock = new T.Mesh(block.geometry.clone(), block.material.clone());
          colors.forEach(function(color, i) {
            if (count >= (i - 1) * 10) {
              rBlock.material.color.setHex(color);
            }
          });
          rBlock.position.set(
            pos.x,
            pos.y,
            pos.z
          );
          rBlock.lookAt(new T.Vector3(core.center.x, pos.y, core.center.z));
          if (c < 20) {
            rBlock.material.opacity = .1 * c;
          }
          scene.add(rBlock);
        }
      });
    });
  };
  var update = function() {
    controls.update();
    _renderer.render(scene, camera);
    requestAnimationFrame(update);
  };
  update();
}(window));
