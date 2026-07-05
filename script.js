(function () {
  var body = document.body;
  var header = document.querySelector("[data-header]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");
  var root = document.documentElement;
  var scrollFrame = null;

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function setScrollMotion() {
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = window.scrollY / maxScroll;
    var heroProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));

    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    root.style.setProperty("--hero-scroll", heroProgress.toFixed(4));
    root.style.setProperty("--scroll-px", Math.round(window.scrollY) + "px");
    root.style.setProperty("--scroll-a", (-180 * progress).toFixed(1) + "px");
    root.style.setProperty("--scroll-b", (120 * progress).toFixed(1) + "px");
    root.style.setProperty("--section-a", (-120 * progress).toFixed(1) + "px");
    root.style.setProperty("--section-b", (90 * progress).toFixed(1) + "px");
    root.style.setProperty("--hero-bg-x", (-90 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-bg-y", (50 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-bg-x2", (70 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-bg-y2", (-80 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-terrain-x-neg", (-160 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-terrain-x-pos", (110 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-terrain-y-large", (76 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-terrain-y-mid", (48 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-fog-x", (90 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-fog-y", (-56 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-fog2-x", (-80 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--hero-fog2-y", (42 * heroProgress).toFixed(1) + "px");
    root.style.setProperty("--solutions-a", (-220 * progress).toFixed(1) + "px");
    root.style.setProperty("--solutions-b", (160 * progress).toFixed(1) + "px");
    root.style.setProperty("--solution-field-x", (180 * progress).toFixed(1) + "px");
    root.style.setProperty("--solution-shape-x", (-70 * progress).toFixed(1) + "px");
    root.style.setProperty("--solution-shape-y", (30 * progress).toFixed(1) + "px");
    root.style.setProperty("--solution-branch-x", (90 * progress).toFixed(1) + "px");
    root.style.setProperty("--solution-branch-y", (-42 * progress).toFixed(1) + "px");
    root.style.setProperty("--stack-a", (260 * progress).toFixed(1) + "px");
    root.style.setProperty("--stack-b", (-180 * progress).toFixed(1) + "px");
    root.style.setProperty("--stack-line-a", (-120 * progress).toFixed(1) + "px");
    root.style.setProperty("--stack-line-b", (160 * progress).toFixed(1) + "px");
    root.style.setProperty("--stack-line-c", (-90 * progress).toFixed(1) + "px");
    root.style.setProperty("--fit-a", (-190 * progress).toFixed(1) + "px");
    root.style.setProperty("--fit-b", (130 * progress).toFixed(1) + "px");
    root.style.setProperty("--work-a", (180 * progress).toFixed(1) + "px");
    root.style.setProperty("--work-b", (-130 * progress).toFixed(1) + "px");
    root.style.setProperty("--ready-a", (-210 * progress).toFixed(1) + "px");
    root.style.setProperty("--ready-b", (150 * progress).toFixed(1) + "px");
    root.style.setProperty("--cta-a", (240 * progress).toFixed(1) + "px");
    root.style.setProperty("--cta-b", (-150 * progress).toFixed(1) + "px");
    root.style.setProperty("--cta-shape-x", (-120 * progress).toFixed(1) + "px");
    root.style.setProperty("--cta-shape-y", (54 * progress).toFixed(1) + "px");
    setHeaderState();
  }

  function requestScrollMotion() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(function () {
      setScrollMotion();
      syncSolutionScroll();
      scrollFrame = null;
    });
  }

  setScrollMotion();
  window.addEventListener("scroll", requestScrollMotion, { passive: true });
  window.addEventListener("resize", requestScrollMotion);

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("is-nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        body.classList.remove("is-nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -44px 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  var flowNodes = Array.prototype.slice.call(document.querySelectorAll("[data-flow-node]"));
  var flowIndex = 0;

  if (flowNodes.length) {
    flowNodes[0].classList.add("is-active");

    window.setInterval(function () {
      flowNodes.forEach(function (node, index) {
        node.classList.toggle("is-active", index === flowIndex);
      });
      flowIndex = (flowIndex + 1) % flowNodes.length;
    }, 1050);
  }

  var solutionData = {
    cloud: {
      lineOne: "Cloud",
      lineTwo: "Architecture",
      copy:
        "Secure, scalable, and cost-aware AWS and GCP environments with clear ownership, networking, IAM, and deployment paths.",
      metricOne: "Foundation",
      valueOne: "Accounts / projects",
      metricTwo: "Controls",
      valueTwo: "Security + cost",
      metricThree: "Outcome",
      valueThree: "Ready to scale",
      metricFour: "Engagement",
      valueFour: "Foundation build",
      color: "#669487"
    },
    iac: {
      lineOne: "Terraform",
      lineTwo: "IaC",
      copy:
        "Reusable modules, environment separation, remote state, and automated provisioning for safer infrastructure changes.",
      metricOne: "Modules",
      valueOne: "Reusable blocks",
      metricTwo: "State",
      valueTwo: "Remote + reviewed",
      metricThree: "Outcome",
      valueThree: "Repeatable change",
      metricFour: "Engagement",
      valueFour: "IaC foundation",
      color: "#8fc2a7"
    },
    delivery: {
      lineOne: "CI/CD",
      lineTwo: "Engineering",
      copy:
        "Deployment pipelines with tests, approvals, secrets handling, rollback paths, and release visibility for fast teams.",
      metricOne: "Flow",
      valueOne: "Build / test / release",
      metricTwo: "Controls",
      valueTwo: "Approvals + rollback",
      metricThree: "Outcome",
      valueThree: "Lower release risk",
      metricFour: "Engagement",
      valueFour: "Pipeline build",
      color: "#669487"
    },
    platform: {
      lineOne: "Kubernetes",
      lineTwo: "Platforms",
      copy:
        "Production clusters, workload boundaries, ingress, autoscaling, security policies, and operational runbooks.",
      metricOne: "Runtime",
      valueOne: "Clusters / workloads",
      metricTwo: "Operations",
      valueTwo: "Scaling + policies",
      metricThree: "Outcome",
      valueThree: "Operable platform",
      metricFour: "Engagement",
      valueFour: "Platform hardening",
      color: "#8fc2a7"
    },
    observability: {
      lineOne: "System",
      lineTwo: "Signals",
      copy:
        "Logs, metrics, traces, alerts, dashboards, and reliability signals that expose system health before users are affected.",
      metricOne: "Signals",
      valueOne: "Logs / metrics / traces",
      metricTwo: "Response",
      valueTwo: "Alerts + dashboards",
      metricThree: "Outcome",
      valueThree: "Faster debugging",
      metricFour: "Engagement",
      valueFour: "Observability build",
      color: "#b8d8bf"
    },
    ai: {
      lineOne: "AI",
      lineTwo: "Engineering",
      copy:
        "LLM integrations, vector search, model deployment, secure APIs, monitoring, and cost controls for AI-enabled products.",
      metricOne: "AI layer",
      valueOne: "LLMs / vector search",
      metricTwo: "Controls",
      valueTwo: "Monitoring + cost",
      metricThree: "Outcome",
      valueThree: "Production AI",
      metricFour: "Engagement",
      valueFour: "AI deployment",
      color: "#669487"
    }
  };

  var solutionTabs = Array.prototype.slice.call(document.querySelectorAll("[data-solution]"));
  var solutionCard = document.querySelector("[data-solution-card]");
  var fields = {
    lineOne: document.querySelector("[data-solution-line-one]"),
    lineTwo: document.querySelector("[data-solution-line-two]"),
    copy: document.querySelector("[data-solution-copy]"),
    metricOne: document.querySelector("[data-solution-metric-one]"),
    valueOne: document.querySelector("[data-solution-value-one]"),
    metricTwo: document.querySelector("[data-solution-metric-two]"),
    valueTwo: document.querySelector("[data-solution-value-two]"),
    metricThree: document.querySelector("[data-solution-metric-three]"),
    valueThree: document.querySelector("[data-solution-value-three]"),
    metricFour: document.querySelector("[data-solution-metric-four]"),
    valueFour: document.querySelector("[data-solution-value-four]")
  };
  var solutionOrder = ["cloud", "iac", "delivery", "platform", "observability", "ai"];
  var cubeOrientations = [
    { x: -12, y: -18, z: -1 },
    { x: -12, y: -108, z: 1 },
    { x: -12, y: -198, z: -1 },
    { x: -12, y: 72, z: 1 },
    { x: -102, y: -18, z: -1 },
    { x: 78, y: -18, z: 1 }
  ];
  var activeSolutionKey = "cloud";
  var solutionOpenTimer = null;
  var solutionCube = document.querySelector("[data-solution-cube]");
  var solutionsSection = document.querySelector("[data-solutions-section]");
  var solutionCurrent = document.querySelector("[data-solution-current]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function smoothStep(value) {
    return value * value * (3 - 2 * value);
  }

  function updateSolutionTabs(key) {
    var activeOrderIndex = solutionOrder.indexOf(key);

    solutionTabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-solution") === key;
      var tabOrderIndex = solutionOrder.indexOf(tab.getAttribute("data-solution"));
      tab.classList.toggle("is-active", isActive);
      tab.classList.toggle("is-passed", tabOrderIndex >= 0 && tabOrderIndex < activeOrderIndex);
      tab.setAttribute("aria-selected", String(isActive));
    });
  }

  function setSolutionContent(key, solution) {
    Object.keys(fields).forEach(function (name) {
      if (fields[name]) {
        fields[name].textContent = solution[name];
      }
    });

    if (solutionCard) {
      solutionCard.style.setProperty("--solution-color", solution.color);
    }

    if (solutionCurrent) {
      var index = solutionOrder.indexOf(key);
      solutionCurrent.textContent = String(index + 1).padStart(2, "0");
    }
  }

  function pulseSolutionDetails() {
    if (!solutionCard) return;
    window.clearTimeout(solutionOpenTimer);
    solutionCard.classList.remove("is-changing");
    void solutionCard.offsetWidth;
    solutionCard.classList.add("is-changing");
    solutionOpenTimer = window.setTimeout(function () {
      solutionCard.classList.remove("is-changing");
    }, 620);
  }

  function activateSolution(key, options) {
    var solution = solutionData[key];
    var settings = options || {};
    if (!solution || (key === activeSolutionKey && !settings.force)) return;

    updateSolutionTabs(key);
    setSolutionContent(key, solution);
    activeSolutionKey = key;

    if (!settings.silent && !reduceMotion) {
      pulseSolutionDetails();
    }
  }

  function setCubeFromProgress(progress) {
    if (!solutionCube) return;

    var bounded = clamp(progress, 0, 1);
    var rawIndex = bounded * (solutionOrder.length - 1);
    var lowerIndex = Math.floor(rawIndex);
    var upperIndex = Math.min(solutionOrder.length - 1, lowerIndex + 1);
    var faceProgress = smoothStep(rawIndex - lowerIndex);
    var current = cubeOrientations[lowerIndex];
    var next = cubeOrientations[upperIndex];
    var activeIndex = clamp(Math.round(rawIndex), 0, solutionOrder.length - 1);

    if (reduceMotion) {
      current = cubeOrientations[activeIndex];
      next = current;
      faceProgress = 0;
    }

    solutionCube.style.setProperty("--cube-rotate-x", lerp(current.x, next.x, faceProgress).toFixed(2) + "deg");
    solutionCube.style.setProperty("--cube-rotate-y", lerp(current.y, next.y, faceProgress).toFixed(2) + "deg");
    solutionCube.style.setProperty("--cube-rotate-z", lerp(current.z, next.z, faceProgress).toFixed(2) + "deg");

    if (solutionCard) {
      solutionCard.style.setProperty("--service-progress", bounded.toFixed(4));
    }

    if (solutionTabs.length) {
      solutionTabs[0].parentElement.style.setProperty("--solution-list-progress", bounded.toFixed(4));
    }

    activateSolution(solutionOrder[activeIndex], { silent: true });
  }

  function syncSolutionScroll() {
    if (!solutionsSection || !solutionCube) return;

    var rect = solutionsSection.getBoundingClientRect();
    var travel = Math.max(1, solutionsSection.offsetHeight - window.innerHeight);
    var progress = clamp(-rect.top / travel, 0, 1);
    setCubeFromProgress(progress);
  }

  function scrollToSolution(key) {
    var index = solutionOrder.indexOf(key);
    if (index < 0) return;

    if (!solutionsSection) {
      activateSolution(key, { force: true });
      return;
    }

    var rect = solutionsSection.getBoundingClientRect();
    var travel = Math.max(1, solutionsSection.offsetHeight - window.innerHeight);
    var target = window.scrollY + rect.top + travel * (index / Math.max(1, solutionOrder.length - 1));

    window.scrollTo({
      top: target,
      behavior: reduceMotion ? "auto" : "smooth"
    });

    setCubeFromProgress(index / Math.max(1, solutionOrder.length - 1));
    activateSolution(key, { force: true });
  }

  solutionTabs.forEach(function (tab) {
    var key = tab.getAttribute("data-solution");
    tab.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToSolution(key);
    });
  });

  syncSolutionScroll();

  var contactForm = document.querySelector("[data-contact-form]");
  var formStatus = document.querySelector("[data-form-status]");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(contactForm);
      var needs = data.getAll("needs");
      var subject = "Xbase1 project enquiry";
      var bodyLines = [
        "Name: " + (data.get("name") || ""),
        "Email: " + (data.get("email") || ""),
        "Company: " + (data.get("company") || ""),
        "Website: " + (data.get("website") || ""),
        "Needs: " + (needs.length ? needs.join(", ") : "Not specified"),
        "Project stage: " + (data.get("stage") || ""),
        "",
        "Message:",
        data.get("message") || ""
      ];

      if (formStatus) {
        formStatus.textContent = "Opening your email app with the enquiry details.";
      }

      window.location.href =
        "mailto:hello@xbase1.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));
    });
  }
})();
