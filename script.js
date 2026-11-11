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

/* The winding journey is the single experience view. Milestones can
   be selected without a duplicate table, sidebar, or detail panel. */
const journeyButtons = Array.from(document.querySelectorAll(".career-journey__stop[data-event]"));

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

const now = new Date();

/* Scroll-linked winding SVG journey.
   Progress is derived from the journey container itself and is reversible. */
const careerJourney = document.querySelector(".career-journey");
const careerPaths = Array.from(document.querySelectorAll(".career-journey__progress"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let careerFrameRequested = false;

function updateCareerLine() {
  if (!careerJourney || careerPaths.length === 0) return;

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const bounds = careerJourney.getBoundingClientRect();
  // Start when the winding path approaches the viewport. Finish near the
  // final milestone, with reverse scrolling naturally erasing the line.
  const drawingDistance = Math.max(1, bounds.height - viewportHeight * 0.1);
  const progress = Math.min(1, Math.max(0,
    (viewportHeight * 0.78 - bounds.top) / drawingDistance
  ));
  const visibleProgress = reduceMotion.matches ? 1 : progress;

  careerPaths.forEach(function (path) {
    const length = path.getTotalLength();
    if (length <= 0) return;
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length * (1 - visibleProgress));
  });

  const thresholds = [0.18, 0.41, 0.64, 0.88];
  journeyButtons.forEach(function (button, index) {
    button.classList.toggle("is-reached", visibleProgress >= thresholds[index]);
  });
}

function scheduleCareerLineUpdate() {
  if (careerFrameRequested) return;
  careerFrameRequested = true;
  window.requestAnimationFrame(function () {
    careerFrameRequested = false;
    updateCareerLine();
  });
}

if (careerJourney && careerPaths.length > 0) {
  updateCareerLine();
  window.addEventListener("scroll", scheduleCareerLineUpdate, { passive: true });
  window.addEventListener("resize", scheduleCareerLineUpdate);
  window.addEventListener("load", scheduleCareerLineUpdate);
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", scheduleCareerLineUpdate);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(scheduleCareerLineUpdate);
  }
}

const copyrightYear = document.getElementById("copyright-year");
if (copyrightYear) copyrightYear.textContent = String(now.getFullYear());


/* ShinyText: native JavaScript port of the supplied React/Motion component.
   The span's textContent is its text prop, its class is className, and
   data-disabled/speed/color/shine-color/spread/yoyo/pause-on-hover/
   direction/delay provide the remaining component props. */
(function initializeShinyText() {
  const elements = Array.from(document.querySelectorAll(".shiny-text"));
  if (!elements.length) return;

  const supportsClip = Boolean(window.CSS && (
    window.CSS.supports("background-clip", "text") ||
    window.CSS.supports("-webkit-background-clip", "text")
  ));
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const toNumber = (value, fallback) => {
    const n = Number(value);
    return value === undefined || value === "" || !Number.isFinite(n) ? fallback : n;
  };
  const isTrue = (value) => value === "true";

  const spans = elements.map((element) => {
    const data = element.dataset;
    const state = {
      element,
      disabled: isTrue(data.disabled),
      speed: Math.max(0.1, toNumber(data.speed, 2)),
      color: data.color || "#b5b5b5",
      shineColor: data.shineColor || "#ffffff",
      spread: toNumber(data.spread, 120),
      yoyo: isTrue(data.yoyo),
      pauseOnHover: isTrue(data.pauseOnHover),
      direction: data.direction === "right" ? "right" : "left",
      delay: Math.max(0, toNumber(data.delay, 0)),
      paused: false,
      elapsed: 0,
      lastTime: null
    };
    if (state.pauseOnHover) {
      element.addEventListener("mouseenter", () => {
        state.paused = true;
        state.lastTime = null;
      });
      element.addEventListener("mouseleave", () => {
        state.paused = false;
        state.lastTime = null;
      });
    }
    return state;
  });

  function configure(state) {
    const element = state.element;
    element.classList.remove("shiny-text--ready");
    element.style.color = state.color;
    element.style.backgroundImage = "";
    element.style.backgroundColor = "";
    element.style.backgroundSize = "";
    element.style.backgroundPosition = "";
    if (state.disabled || motionPreference.matches || !supportsClip) return;
    // Fill any space left uncovered when the moving gradient shifts beyond the letters.
    // The color is clipped to text alongside the image, so it never paints a box.
    element.style.backgroundColor = state.color;
    // Exact opaque gradient stops from the original ShinyText component.
    element.style.backgroundImage = "linear-gradient(" + state.spread + "deg, " +
      state.color + " 0%, " + state.color + " 35%, " +
      state.shineColor + " 50%, " + state.color + " 65%, " +
      state.color + " 100%)";
    element.style.backgroundSize = "200% auto";
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundPosition = state.direction === "left" ? "150% center" : "-50% center";
    element.classList.add("shiny-text--ready");
  }

  spans.forEach(configure);

  function animate(time) {
    for (const state of spans) {
      if (state.disabled || motionPreference.matches || !supportsClip || state.paused) {
        state.lastTime = null;
        continue;
      }
      if (state.lastTime === null) {
        state.lastTime = time;
        continue;
      }
      const dt = Math.max(0, time - state.lastTime);
      state.lastTime = time;
      state.elapsed += dt;
      const duration = state.speed * 1000;
      const rest = state.delay * 1000;
      let progress = 0;

      if (state.yoyo) {
        const cycle = duration + rest;
        const t = state.elapsed % (2 * cycle);
        if (t < duration) progress = t / duration * 100;
        else if (t < cycle) progress = 100;
        else if (t < cycle + duration) progress = 100 - (t - cycle) / duration * 100;
        else progress = 0;
      } else {
        const t = state.elapsed % (duration + rest);
        progress = t < duration ? t / duration * 100 : 100;
      }

      if (state.direction === "right") progress = 100 - progress;
      state.element.style.backgroundPosition = String(150 - progress * 2) + "% center";
    }
    window.requestAnimationFrame(animate);
  }

  document.addEventListener("visibilitychange", () => {
    spans.forEach((state) => { state.lastTime = null; });
  });
  const refresh = () => spans.forEach((state) => {
    state.lastTime = null;
    configure(state);
  });
  if (typeof motionPreference.addEventListener === "function")
    motionPreference.addEventListener("change", refresh);
  else if (typeof motionPreference.addListener === "function")
    motionPreference.addListener(refresh);

  window.requestAnimationFrame(animate);
})();
