"use strict";

/* Navigation: a proper full-screen, keyboard-friendly mobile menu. */
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
let menuWasOpened = false;

function setMenu(open, returnFocus) {
  if (!menuButton || !mobileMenu) return;
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.inert = !open;
  if (open) {
    menuWasOpened = true;
    const firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  } else if (returnFocus && menuWasOpened) {
    menuButton.focus();
  }
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", function () {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true", false);
  });
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false, false); });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMenu(false, true);
    }
    if (event.key !== "Tab" || !document.body.classList.contains("menu-open")) return;
    const focusable = [menuButton].concat(Array.from(mobileMenu.querySelectorAll("a")));
    const activeIndex = focusable.indexOf(document.activeElement);
    if (event.shiftKey && activeIndex === 0) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    } else if (!event.shiftKey && activeIndex === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 700 && document.body.classList.contains("menu-open")) {
      setMenu(false, false);
    }
  });
}

/* One career journey: Bachelor’s → AD IT Robotics → Master’s → ApplyWise.
   Both SVGs use 3 measurable path segments. Their accumulated actual SVG
   lengths define precisely where the walking boy changes into a plane,
   and then back to a running boy. The blue line and traveler share one
   scroll-driven progress value, reversible on upward scrolling. */
const journeyButtons = Array.from(document.querySelectorAll(".career-journey__stop[data-event]"));
const careerJourney = document.querySelector(".career-journey");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const narrowJourney = window.matchMedia("(max-width: 900px)");
let careerFrameRequested = false;
let journeyWasScrolled = false;
let journeyLastDistance = null;
let journeyLastScene = null;
let journeyMotionTimeout = null;

function selectJourneyMilestone(key) {
  journeyButtons.forEach(function (button) {
    const selected = button.dataset.event === key;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

journeyButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectJourneyMilestone(button.dataset.event);
  });
});

function createJourneyScene(size) {
  if (!careerJourney) return null;
  const svg = careerJourney.querySelector(".career-journey__svg--" + size);
  if (!svg) return null;
  const path = svg.querySelector(".career-journey__progress");
  const rail = svg.querySelector(".career-journey__rail");
  const legs = Array.from(svg.querySelectorAll(".career-journey__leg"));
  const traveler = svg.querySelector(".journey-traveler");
  if (!path || !rail || legs.length !== 3 || !traveler) return null;

  const legLengths = legs.map(function (leg) { return leg.getTotalLength(); });
  // The permanent rail is the sole source of path coordinates. We draw the
  // visible blue path from sampled rail points, not stroke-dash lengths.
  // This prevents stretched/non-scaling SVG dashes from ending behind the 3D plane.
  const length = rail.getTotalLength();
  if (length <= 0 || legLengths.some(function (n) { return n <= 0; })) return null;
  const segmentTotal = legLengths.reduce(function (sum, n) { return sum + n; }, 0);
  const boundaries = [0,
    legLengths[0] / segmentTotal,
    (legLengths[0] + legLengths[1]) / segmentTotal,
    1
  ];
  const sampleStep = 5;
  const samples = [];
  for (let d = 0; d < length; d += sampleStep) {
    const p = rail.getPointAtLength(d);
    samples.push((samples.length ? "L " : "M ") +
      p.x.toFixed(2) + " " + p.y.toFixed(2));
  }
  const startPoint = rail.getPointAtLength(0);
  path.style.strokeDasharray = "none";
  path.style.strokeDashoffset = "0";
  path.setAttribute("d", "M " + startPoint.x + " " + startPoint.y);
  return {
    svg: svg, path: path, rail: rail, sampleStep: sampleStep,
    samples: samples, length: length, boundaries: boundaries,
    traveler: traveler,
    modes: Array.from(traveler.querySelectorAll(".journey-traveler__mode")),
    plane: traveler.querySelector(".journey-plane__facing"),
    boys: Array.from(traveler.querySelectorAll(".journey-boy__facing"))
  };
}

const journeyScenes = {
  desktop: createJourneyScene("desktop"),
  mobile: createJourneyScene("mobile")
};

function clampJourney(n) { return Math.max(0, Math.min(1, n)); }

function currentJourneyProgress(scene) {
  if (reduceMotion.matches) return 1;
  if (journeyButtons.length !== 4) return 0;

  // Match each change of vehicle to its real milestone marker as it crosses
  // the viewport's reading line, rather than guessing fixed percentages.
  const readingLine = (window.innerHeight || document.documentElement.clientHeight) * 0.54;
  const positions = journeyButtons.map(function (button) {
    const rect = button.getBoundingClientRect();
    return rect.top + rect.height / 2;
  });
  if (readingLine <= positions[0]) return 0;
  if (readingLine >= positions[3]) return 1;

  for (let i = 0; i < 3; i += 1) {
    if (readingLine <= positions[i + 1]) {
      const fraction = clampJourney((readingLine - positions[i]) /
        Math.max(1, positions[i + 1] - positions[i]));
      return scene.boundaries[i] +
        (scene.boundaries[i + 1] - scene.boundaries[i]) * fraction;
    }
  }
  return 1;
}

function updateCareerLine() {
  const sceneKey = narrowJourney.matches ? "mobile" : "desktop";
  const scene = journeyScenes[sceneKey];
  if (!scene) return;

  const progress = currentJourneyProgress(scene);
  const length = scene.length;
  const distance = length * progress;
  // Trigger gait and flight streaks only when a real scroll moves the
  // traveler along this route. Do not animate on load, idle or resize.
  const advanced = journeyWasScrolled && journeyLastScene === sceneKey &&
    journeyLastDistance !== null && Math.abs(distance - journeyLastDistance) > .35;
  if (advanced && !reduceMotion.matches) {
    careerJourney.classList.add("journey-is-moving");
    window.clearTimeout(journeyMotionTimeout);
    journeyMotionTimeout = window.setTimeout(function () {
      careerJourney.classList.remove("journey-is-moving");
    }, 140);
  } else if (reduceMotion.matches) {
    window.clearTimeout(journeyMotionTimeout);
    careerJourney.classList.remove("journey-is-moving");
  }
  journeyLastDistance = distance;
  journeyLastScene = sceneKey;
  journeyWasScrolled = false;

  // Draw the blue line to the exact point the traveler uses. Drawing a
  // partial polyline rather than a dashed full path keeps it perfectly
  // synchronized even with preserveAspectRatio="none" and uneven scaling.
  const point = scene.rail.getPointAtLength(distance);
  const sampledCount = Math.min(scene.samples.length, Math.floor(distance / scene.sampleStep) + 1);
  const commands = scene.samples.slice(0, sampledCount);
  commands.push("L " + point.x.toFixed(2) + " " + point.y.toFixed(2));
  scene.path.setAttribute("d", commands.join(" "));
  scene.path.style.visibility = distance < .2 ? "hidden" : "visible";

  const near = scene.rail.getPointAtLength(Math.min(length, distance + 2));
  const prev = scene.rail.getPointAtLength(Math.max(0, distance - 2));
  const dx = near.x - prev.x;
  const dy = near.y - prev.y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  scene.traveler.setAttribute("transform", "translate(" + point.x + " " + point.y + ")");

  const mode = progress < scene.boundaries[1] ? "walk" :
    progress < scene.boundaries[2] ? "plane" : "run";
  scene.modes.forEach(function (part) {
    part.classList.toggle("is-active", part.dataset.mode === mode);
  });
  scene.boys.forEach(function (boy) {
    if (Math.abs(dx) > .01) boy.setAttribute("transform", "scale(" + (dx < 0 ? -1 : 1) + " 1)");
  });
  if (scene.plane) scene.plane.setAttribute("transform", "rotate(" + angle + ")");

  // The blue stroke and the WebGL traveler use this identical path point.
  // Coordinate percentages account for the SVG's preserveAspectRatio="none".
  if (typeof window.__journey3DUpdate === "function") {
    const box = scene.svg.viewBox.baseVal;
    window.__journey3DUpdate({
      x: point.x, y: point.y, width: box.width, height: box.height,
      mode: mode, angle: angle, dx: dx
    });
  }

  let active = 0;
  scene.boundaries.forEach(function (boundary, index) {
    const reached = reduceMotion.matches || progress >= boundary - .0005;
    if (journeyButtons[index]) journeyButtons[index].classList.toggle("is-reached", reached);
    if (reached) active = index;
  });
  if (journeyButtons[active]) {
    selectJourneyMilestone(journeyButtons[active].dataset.event);
  }
}

function scheduleCareerLineUpdate() {
  if (careerFrameRequested) return;
  careerFrameRequested = true;
  window.requestAnimationFrame(function () {
    careerFrameRequested = false;
    updateCareerLine();
  });
}

if (careerJourney && journeyScenes.desktop && journeyScenes.mobile) {
  updateCareerLine();
  window.addEventListener("scroll", function () {
    journeyWasScrolled = true;
    scheduleCareerLineUpdate();
  }, { passive: true });
  window.addEventListener("resize", scheduleCareerLineUpdate);
  window.addEventListener("load", scheduleCareerLineUpdate);
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", scheduleCareerLineUpdate);
    narrowJourney.addEventListener("change", scheduleCareerLineUpdate);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(scheduleCareerLineUpdate);
    narrowJourney.addListener(scheduleCareerLineUpdate);
  }
}

const now = new Date();

const copyrightYear = document.getElementById("copyright-year");
if (copyrightYear) copyrightYear.textContent = String(now.getFullYear());
