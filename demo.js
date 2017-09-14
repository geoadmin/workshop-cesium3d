(function() {
  // Swiss extent
  var rectangle = Cesium.Rectangle.fromDegrees(
        5.0134, 45.356, 11.477, 48.275);

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
        terrainProvider : new Cesium.CesiumTerrainProvider({
          url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles'
        })
    });
    // Zoom on swiss
    viewer.camera.setView({
      destination: rectangle
    });
    viewer.scene.globe.baseColor = Cesium.Color.WHITE;
    viewer.scene.backgroundColor = Cesium.Color.WHITE;
    return viewer;
  };


  window.onload = function() {
    var v = init();
  };
})();
