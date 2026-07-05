var canvases = document.querySelectorAll("[data-scroll-3d]");

canvases.forEach(startScrollScene);

async function startScrollScene(targetCanvas) {
  try {
    var THREE = await loadThree();
    initThreeScene(THREE, targetCanvas);
  } catch (error) {
    initCanvasFallback(targetCanvas);
  }
}

function loadThree() {
  return Promise.race([
    import("https://unpkg.com/three@0.160.0/build/three.module.js"),
    new Promise(function (_resolve, reject) {
      window.setTimeout(function () {
        reject(new Error("Three.js load timeout"));
      }, 1400);
    })
  ]);
}

function getScrollState() {
  var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  var progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  var heroProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
  var scrollScreens = window.scrollY / Math.max(1, window.innerHeight);

  return {
    progress: progress,
    heroProgress: heroProgress,
    scrollScreens: scrollScreens
  };
}

function wrappedDistance(a, b, length) {
  var distance = Math.abs(a - b);
  return Math.min(distance, length - distance);
}

function initThreeScene(THREE, targetCanvas) {
  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: targetCanvas,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.6, 11);

  var rig = new THREE.Group();
  scene.add(rig);

  var nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0x669487,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide
  });
  var nodeMaterialHot = new THREE.MeshBasicMaterial({
    color: 0x10231d,
    transparent: true,
    opacity: 0.86,
    side: THREE.DoubleSide
  });
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xb8d8bf,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.12,
    depthWrite: false
  });

  var nodeGeometry = new THREE.BoxGeometry(0.28, 0.18, 0.04);
  var planeGeometry = new THREE.PlaneGeometry(3.6, 1.55, 1, 1);

  var planes = [];
  for (var p = 0; p < 4; p += 1) {
    var plane = new THREE.Mesh(planeGeometry, planeMaterial.clone());
    plane.position.set(-1.3 + p * 0.9, 0.3 - p * 0.42, -p * 0.72);
    plane.rotation.set(-0.72, 0.16 + p * 0.12, -0.15);
    rig.add(plane);
    planes.push(plane);
  }

  var nodePositions = [
    [-3.0, 1.16, 0.1],
    [-1.8, 0.72, -0.45],
    [-0.72, 1.0, -1.15],
    [0.5, 0.35, -1.85],
    [1.6, 0.78, -2.55],
    [2.65, 0.08, -3.15],
    [-2.45, -0.48, -0.35],
    [-1.1, -0.82, -1.05],
    [0.1, -0.38, -1.55],
    [1.05, -0.96, -2.25],
    [2.15, -0.62, -2.95]
  ];

  var nodes = nodePositions.map(function (position, index) {
    var material = index % 3 === 0 ? nodeMaterialHot : nodeMaterial;
    var mesh = new THREE.Mesh(nodeGeometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    rig.add(mesh);
    return mesh;
  });

  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0x669487,
    transparent: true,
    opacity: 0.48
  });
  var linePoints = [];
  nodePositions.forEach(function (position) {
    linePoints.push(new THREE.Vector3(position[0], position[1], position[2]));
  });
  var lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
  var line = new THREE.Line(lineGeometry, lineMaterial);
  rig.add(line);

  var crossLines = [
    [0, 6],
    [1, 7],
    [2, 8],
    [3, 9],
    [4, 10],
    [5, 10]
  ];
  crossLines.forEach(function (pair) {
    var a = nodePositions[pair[0]];
    var b = nodePositions[pair[1]];
    var geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(a[0], a[1], a[2]),
      new THREE.Vector3(b[0], b[1], b[2])
    ]);
    var cross = new THREE.Line(geometry, lineMaterial.clone());
    cross.material.opacity = 0.28;
    rig.add(cross);
  });

  var pointer = { x: 0, y: 0 };
  window.addEventListener(
    "pointermove",
    function (event) {
      pointer.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointer.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    },
    { passive: true }
  );

  function resize() {
    var rect = targetCanvas.getBoundingClientRect();
    var width = Math.max(1, Math.floor(rect.width));
    var height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  function render(time) {
    var state = getScrollState();
    var t = time * 0.001;
    var progress = state.progress;
    var screens = state.scrollScreens;
    var activeHead = (screens * 1.8) % nodes.length;

    rig.rotation.x = -0.1 + state.heroProgress * 0.32 + progress * 1.18 + pointer.y * 0.03;
    rig.rotation.y = -0.48 + screens * 0.34 + pointer.x * 0.04;
    rig.rotation.z = -0.08 + Math.sin(t * 0.34 + progress * 4) * 0.04;
    rig.position.x = 1.18 - state.heroProgress * 0.82 + Math.sin(screens * 0.72) * 0.52;
    rig.position.y = -0.18 + Math.sin(screens * 0.58) * 0.42;
    rig.position.z = -progress * 2.6 + Math.sin(screens * 0.9) * 0.34;

    nodes.forEach(function (node, index) {
      var pulse = 1 + Math.sin(t * 2.1 + index * 0.8 + screens * 0.62) * 0.18;
      var active = wrappedDistance(activeHead, index, nodes.length) < 1.2 ? 1.38 : 1;
      node.scale.set(pulse * active, pulse * active, 1);
      node.rotation.x = Math.sin(t * 0.2 + index * 0.3) * 0.12;
      node.rotation.y = Math.sin(t * 0.1 + index * 0.4) * 0.1;
    });

    planes.forEach(function (plane, index) {
      plane.material.opacity = 0.07 + Math.sin(t + index + progress * 4) * 0.018;
      plane.position.z += Math.sin(t * 0.5 + index) * 0.0015;
    });

    line.material.opacity = 0.34 + Math.sin(progress * Math.PI) * 0.2;
    camera.position.z = 10.6 - state.heroProgress * 1.2 - Math.sin(progress * Math.PI) * 1.4;
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
}

function initCanvasFallback(targetCanvas) {
  var context = targetCanvas.getContext("2d");
  if (!context) return;

  var size = { width: 1, height: 1, ratio: 1 };
  var points = [
    [-2.8, 1.1, 0.2],
    [-1.8, 0.7, -0.5],
    [-0.6, 1.0, -1.0],
    [0.4, 0.32, -1.7],
    [1.5, 0.72, -2.4],
    [2.6, 0.1, -3.1],
    [-2.3, -0.46, -0.2],
    [-1.1, -0.78, -0.95],
    [0.05, -0.34, -1.5],
    [1.0, -0.9, -2.2],
    [2.0, -0.58, -2.9]
  ];
  var edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [0, 6],
    [1, 7],
    [2, 8],
    [3, 9],
    [4, 10],
    [5, 10],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10]
  ];

  function resize() {
    var rect = targetCanvas.getBoundingClientRect();
    size.ratio = Math.min(window.devicePixelRatio || 1, 2);
    size.width = Math.max(1, Math.floor(rect.width));
    size.height = Math.max(1, Math.floor(rect.height));
    targetCanvas.width = Math.floor(size.width * size.ratio);
    targetCanvas.height = Math.floor(size.height * size.ratio);
    context.setTransform(size.ratio, 0, 0, size.ratio, 0, 0);
  }

  function project(point, rotation, state) {
    var x = point[0];
    var y = point[1];
    var z = point[2];
    var cosY = Math.cos(rotation);
    var sinY = Math.sin(rotation);
    var rx = x * cosY - z * sinY;
    var rz = x * sinY + z * cosY;
    var depth = 5.8 + rz + state.progress * 1.2;
    var scale = Math.min(size.width, size.height) * 0.12 / depth;

    return {
      x: size.width * 0.66 + rx * scale * 24 - state.heroProgress * size.width * 0.14 + Math.sin(state.scrollScreens * 0.7) * 44,
      y: size.height * 0.45 + y * scale * 26 + Math.sin(state.scrollScreens * 0.56) * 38,
      r: Math.max(3, scale * 13),
      depth: depth
    };
  }

  function render(time) {
    var state = getScrollState();
    var t = time * 0.001;
    var rotation = -0.35 + state.scrollScreens * 0.58 + Math.sin(t * 0.3) * 0.1;
    var activeHead = (state.scrollScreens * 1.8) % points.length;
    var projected = points.map(function (point) {
      return project(point, rotation, state);
    });

    context.clearRect(0, 0, size.width, size.height);
    context.globalAlpha = 0.76;
    context.lineWidth = 1.3;
    context.strokeStyle = "rgba(102, 148, 135, 0.56)";
    context.fillStyle = "rgba(184, 216, 191, 0.18)";

    for (var plane = 0; plane < 4; plane += 1) {
      var x = size.width * (0.48 + plane * 0.035 - state.heroProgress * 0.06) + Math.sin(state.scrollScreens * 0.64) * 42;
      var y = size.height * (0.28 + plane * 0.08) + Math.cos(state.scrollScreens * 0.46) * 32;
      context.save();
      context.translate(x, y);
      context.rotate(-0.18 + state.scrollScreens * 0.18);
      context.fillRect(-160, -42, 320, 84);
      context.restore();
    }

    edges.forEach(function (edge) {
      var a = projected[edge[0]];
      var b = projected[edge[1]];
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    });

    projected.forEach(function (point, index) {
      var active = wrappedDistance(activeHead, index, points.length) < 1.3;
      context.fillStyle = active ? "#10231d" : "#669487";
      context.globalAlpha = active ? 0.92 : 0.76;
      var width = point.r * 1.4;
      var height = point.r * 0.9;
      context.save();
      context.translate(point.x, point.y);
      context.rotate(Math.sin(t * 0.4 + index * 0.3) * 0.16);
      context.fillRect(-width / 2, -height / 2, width, height);
      context.restore();
    });

    window.requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  window.requestAnimationFrame(render);
}
