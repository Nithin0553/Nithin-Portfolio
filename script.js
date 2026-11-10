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
