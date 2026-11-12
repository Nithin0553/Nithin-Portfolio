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
  const legs = Array.from(svg.querySelectorAll(".career-journey__leg"));
  const traveler = svg.querySelector(".journey-traveler");
  if (!path || legs.length !== 3 || !traveler) return null;

  const legLengths = legs.map(function (leg) { return leg.getTotalLength(); });
  const length = path.getTotalLength();
  if (length <= 0 || legLengths.some(function (n) { return n <= 0; })) return null;
  const segmentTotal = legLengths.reduce(function (sum, n) { return sum + n; }, 0);
  const boundaries = [0,
    legLengths[0] / segmentTotal,
    (legLengths[0] + legLengths[1]) / segmentTotal,
    1
  ];
  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(length);
  return {
    svg: svg, path: path, length: length, boundaries: boundaries,
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
  const scene = narrowJourney.matches ? journeyScenes.mobile : journeyScenes.desktop;
  if (!scene) return;

  const progress = currentJourneyProgress(scene);
  const length = scene.length;
  const distance = length * progress;
  scene.path.style.strokeDashoffset = String(length - distance);

  const point = scene.path.getPointAtLength(distance);
  const near = scene.path.getPointAtLength(Math.min(length, distance + 2));
  const prev = scene.path.getPointAtLength(Math.max(0, distance - 2));
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
  window.addEventListener("scroll", scheduleCareerLineUpdate, { passive: true });
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
