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

/* Engineering event stream.
   Bars encode calendar spans from May 2022; they do NOT represent runtime metrics. */
const traceData = {
  backend: {
    event: "EVT-001",
    title: "Software Development Engineer — Backend",
    detail: "Built and maintained Python and SQL inventory workflows, REST APIs, dynamic multi-filter search, pagination, stock validation, and automation. Investigated slow queries and improved retrieval efficiency.",
    organization: "AD IT ROBOTICS",
    dates: "MAY 2022 — NOV 2024"
  },
  research: {
    event: "EVT-002",
    title: "Graduate Research Assistant",
    detail: "Building Python automation, model evaluation, and validation workflows for AI research, with an emphasis on repeatable experiments and reliable results.",
    organization: "TEXAS A&M UNIVERSITY–CORPUS CHRISTI",
    dates: "MAR 2025 — PRESENT"
  },
  education: {
    event: "EVT-003",
    title: "M.S. in Computer Science",
    detail: "Graduate study at Texas A&M University–Corpus Christi, complementing software engineering experience with advanced computer science and research work. Expected completion: December 2026.",
    organization: "TEXAS A&M UNIVERSITY–CORPUS CHRISTI",
    dates: "JAN 2025 — DEC 2026 (EXPECTED)"
  },
  milestone: {
    event: "EVT-004",
    title: "ApplyWise — team checkpoint",
    detail: "As project manager and developer on a six-person team, coordinated test requirements, work items, reviews, and CI. At the October 2026 checkpoint, the team had developed 230 automated tests and recorded 85 commits.",
    organization: "APPLYWISE / TEAM DEVELOPMENT",
    dates: "OCT 2026"
  }
};

const eventButtons = Array.from(document.querySelectorAll(".trace-event[data-event]"));
const eventRows = Array.from(document.querySelectorAll(".trace-table tr[data-trace-row]"));
const traceDetail = document.querySelector("#trace-detail");

function setSelectedEvent(key) {
  const data = traceData[key];
  if (!data) return;
  eventButtons.forEach(function (button) {
    const selected = button.dataset.event === key;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  eventRows.forEach(function (row) {
    row.classList.toggle("is-focused", row.dataset.traceRow === key);
    row.setAttribute("aria-selected", String(row.dataset.traceRow === key));
  });
  if (!traceDetail) return;
  traceDetail.replaceChildren();
  const label = document.createElement("div");
  label.className = "trace-detail__label mono";
  label.appendChild(document.createTextNode("INSPECT / " + data.event + " "));
  const selected = document.createElement("span");
  selected.className = "accent-blue";
  selected.textContent = "● SELECTED";
  label.appendChild(selected);
  const title = document.createElement("h3");
  title.textContent = data.title;
  const summary = document.createElement("p");
  summary.textContent = data.detail;
  const footer = document.createElement("div");
  footer.className = "trace-detail__footer mono";
  const organization = document.createElement("span");
  organization.textContent = data.organization;
  const dates = document.createElement("span");
  dates.textContent = data.dates;
  footer.append(organization, dates);
  traceDetail.append(label, title, summary, footer);
}

eventButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setSelectedEvent(button.dataset.event);
  });
});

eventRows.forEach(function (row) {
  row.tabIndex = 0;
  row.setAttribute("role", "button");
  row.setAttribute("aria-label", "Inspect " + row.querySelector("td strong").textContent);
  row.addEventListener("click", function () {
    setSelectedEvent(row.dataset.traceRow);
  });
  row.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedEvent(row.dataset.traceRow);
    }
  });
});

function monthNumber(value) {
  const parts = value.split("-");
  return Number(parts[0]) * 12 + Number(parts[1]) - 1;
}
const now = new Date();
const careerStart = monthNumber("2022-05");
const currentMonth = now.getFullYear() * 12 + now.getMonth();
const careerEnd = Math.max(monthNumber("2026-12"), currentMonth + 3);
const period = Math.max(1, careerEnd - careerStart);
document.querySelectorAll(".timeline-bar[data-start]").forEach(function (bar) {
  const start = monthNumber(bar.dataset.start);
  const end = bar.dataset.end === "present" ? currentMonth : monthNumber(bar.dataset.end);
  const left = Math.max(0, Math.min(100, (start - careerStart) / period * 100));
  const span = Math.max(.8, (Math.max(start, end) - start + 1) / period * 100);
  bar.style.setProperty("--offset", left.toFixed(2) + "%");
  bar.style.setProperty("--span", Math.min(100 - left, span).toFixed(2) + "%");
});

const copyrightYear = document.getElementById("copyright-year");
if (copyrightYear) copyrightYear.textContent = String(now.getFullYear());
