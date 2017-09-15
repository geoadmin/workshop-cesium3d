(function() {
  // Swiss extent
  var rectangle = Cesium.Rectangle.fromDegrees(
        5.0134, 45.356, 11.477, 48.275);

  // All available layers can be found here:
  // http://wmts20.geo.admin.ch/EPSG/4326/1.0.0/WMTSCapabilities.xml
  var overlays = {
    'ch.swisstopo.swissimage-product': {
      format: 'jpeg',
      timestamp: 'current'
    },
    'ch.swisstopo.swisstlm3d-karte-farbe': {
      format: 'png',
      timestamp: 'current'
    },
    'ch.swisstopo.swisstlm3d-karte-grau': {
      format: 'png',
      timestamp: 'current'
    }
  };

  var getCesiumImagery = function(id) {
    var layer = overlays[id];
    return new Cesium.UrlTemplateImageryProvider({
      url: "//wmts20.geo.admin.ch/1.0.0/" + id + "/default/" + layer.timestamp + "/4326/{z}/{x}/{y}." + layer.format,
      minimumRetrievingLevel: 8,
      maximumLevel: 17,
      tilingScheme: new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
      })
    });
  };

  var initSelectBox = function(v) {
    var selectBox = $('#selectBox');
    $.each(overlays, function(id) {
      selectBox.append($('<option/>', {
        value: id,
        text : id
      }));
    });
    selectBox.on('change', function(e) {
      selectBox.value = e.target.value;
      v.scene.imageryLayers.removeAll();
      v.scene.imageryLayers.addImageryProvider(
        getCesiumImagery(e.target.value)
      );
    });
  };

  var getCesiumTileset = function() {
    return new Cesium.Cesium3DTileset({
      url: 'https://vectortiles.geo.admin.ch/ch.swisstopo.swisstlm3d.3d/20161217/tileset.json'
    });
  };

  // See all camera settings
  // https://cesiumjs.org/Cesium/Build/Documentation/Camera.html
  var initCameraOnMoveEnd = function(v) {
    v.camera.moveEnd.addEventListener(function() {
      // ECEF coordinates
      var pos = v.camera.position;
      // Orientation parameters in radians
      var heading = v.camera.heading;
      var pitch = v.camera.pitch;
      var roll = v.camera.roll;
      var txt =  'pos: ' + pos.x + ', ' + pos.y + ', ' + pos.z;
      txt += ' <br>heading: ' + heading + '<br>pitch: ' + pitch + '<br>roll: ' + roll;
      $('#positionControl').html(txt);
    });
  };

  var initFlyToBtn = function(v) {
    $('#flyToPosition').on('click', function() {
      // https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#flyTo
      v.camera.flyTo({
        destination: new Cesium.Cartesian3(4333643.393905449, 513547.4508890798, 4639144.286780434),
        orientation: {
          heading: 4.52996251903466,
          pitch: -0.49412275759546054,
          roll: 6.279463826952917
        }
      });
    });
  };

  var init = function() {
    var viewer = new Cesium.Viewer('cesiumContainer', {
        // Disable default base layer picker
        baseLayerPicker: false,
        // Disable fullscreen button
        fullscreenButton: false,
        // Disable home button
        homeButton: false,
        // Disable scene picker
        sceneModePicker: false,
        // Disable selection indicator
        selectionIndicator: false,
        timeline: false,
        animation: false,
        geocoder: false,
        navigationInstructionsInitiallyVisible: false,
        navigationHelpButton: false,
        scene3DOnly: true,
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: '//3d.geo.admin.ch/1.0.0/ch.swisstopo.terrain.3d/default/20160115/4326/',
          rectangle: rectangle
        }),
        imageryProvider: getCesiumImagery('ch.swisstopo.swissimage-product')
    });
    // Zoom on swiss
    viewer.camera.setView({
      destination: rectangle
    });
    viewer.scene.globe.baseColor = Cesium.Color.WHITE;
    viewer.scene.backgroundColor = Cesium.Color.WHITE;
    // Tune the fog
    // https://cesiumjs.org/Cesium/Build/Documentation/Fog.html
    viewer.scene.fog.enabled = true;
    viewer.scene.fog.density = 0.0001;
    viewer.scene.fog.screenSpaceErrorFactor = 25;
    // Add buildings
    viewer.scene.primitives.add(getCesiumTileset());
    return viewer;
  };


  window.onload = function() {
    var v = init();
    initSelectBox(v);
    initCameraOnMoveEnd(v);
    initFlyToBtn(v);
  };
})();
