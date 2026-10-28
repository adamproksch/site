"use strict";
// BotNest client (TypeScript)
function $(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw new Error(`Missing element: ${sel}`);
    return el;
}
async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`Request failed: ${url}`);
    return res.json();
}
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loadError = '<p class="muted">Could not load this section. Refresh the page to try again.</p>';
// ---------- Reveal on scroll ----------
const revealer = new IntersectionObserver((entries) => {
    for (const e of entries) {
        if (e.isIntersecting) {
            e.target.classList.add("in");
            revealer.unobserve(e.target);
        }
    }
}, { threshold: 0.1 });
function watchReveals() {
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => revealer.observe(el));
}
// ---------- Deploy log (plays once) ----------
const logRows = [
    ["12:04:09", "push", "received on main@a41f9c2"],
    ["12:04:10", "build", "npm ci && npm run build"],
    ["12:04:17", "build", "finished in 6.8s"],
    ["12:04:18", "start", "container nb-4821, EU West"],
    ["12:04:19", "bot", "logged in as NestBot#0001"],
    ["12:04:19", "bot", "24 servers, 12 slash commands synced"],
    ["12:04:20", "health", "check passed, bot is online"],
];
function addLogRow(out, row) {
    const line = document.createElement("div");
    line.className = "log-line";
    const [t, tag, msg] = row;
    line.innerHTML = `<span class="t">${t}</span><span class="tag">${tag}</span><span>${msg}</span>`;
    out.appendChild(line);
}
function setupLog() {
    const out = $("#log");
    if (reducedMotion) {
        logRows.forEach((r) => addLogRow(out, r));
        return;
    }
    const starter = new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting)
            return;
        obs.disconnect();
        let i = 0;
        const timer = window.setInterval(() => {
            addLogRow(out, logRows[i++]);
            if (i >= logRows.length)
                window.clearInterval(timer);
        }, 450);
    }, { threshold: 0.3 });
    starter.observe(out);
}
// ---------- Pricing ----------
let plans = [];
let yearly = false;
function renderPlans() {
    $("#plans").innerHTML = plans
        .map((p) => {
        const price = yearly ? p.yearly : p.monthly;
        const free = price === 0;
        return `
      <article class="plan ${p.featured ? "featured" : ""}">
        <div class="plan-name">
          <h3>${p.name}</h3>
          <p>${p.tagline}</p>
          ${p.featured ? '<span class="plan-flag">Most chosen</span>' : ""}
        </div>
        <div class="price">
          <span class="amt">${free ? "Free" : "$" + price}</span>
          ${free ? "" : `<span class="per">/ month${yearly ? ", billed yearly" : ""}</span>`}
        </div>
        <ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        <a href="#start" class="btn ${p.featured ? "primary" : ""}">${free ? "Start free" : "Choose " + p.name}</a>
      </article>`;
    })
        .join("");
}
function setupBilling() {
    const m = $("#bill-m");
    const y = $("#bill-y");
    const set = (isYearly) => {
        yearly = isYearly;
        m.setAttribute("aria-pressed", String(!isYearly));
        y.setAttribute("aria-pressed", String(isYearly));
        if (plans.length)
            renderPlans();
    };
    m.addEventListener("click", () => set(false));
    y.addEventListener("click", () => set(true));
}
// ---------- Reviews ----------
function renderReviews(list) {
    const [first, ...rest] = list;
    const who = (r) => `<p class="who"><b>${r.name}</b>, ${r.role}</p>`;
    $("#review-list").innerHTML = `
    <figure class="quote-lg reveal"><blockquote>${first.text}</blockquote>${who(first)}</figure>
    <div class="quote-stack">
      ${rest.map((r) => `<figure class="quote-sm reveal"><blockquote>${r.text}</blockquote>${who(r)}</figure>`).join("")}
    </div>`;
}
// ---------- FAQ ----------
function renderFaqs(list) {
    $("#faqs").innerHTML = list
        .map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`)
        .join("");
}
// ---------- Nav ----------
function setupNav() {
    const btn = $("#menu-btn");
    const nav = $("#nav-links");
    btn.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
    }));
}
// ---------- Signup form (demo) ----------
function setupForm() {
    const form = $("#start-form");
    const msg = $("#start-msg");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = $("#email");
        if (!email.value || !email.checkValidity()) {
            msg.textContent = "Enter a valid email address, like you@yourserver.gg.";
            email.focus();
            return;
        }
        msg.textContent = "This is a demo, so no account was created.";
    });
}
// ---------- Init ----------
async function init() {
    setupNav();
    setupBilling();
    setupLog();
    setupForm();
    watchReveals();
    const [p, r, f] = await Promise.allSettled([
        getJSON("/api/plans"),
        getJSON("/api/reviews"),
        getJSON("/api/faqs"),
    ]);
    if (p.status === "fulfilled") {
        plans = p.value;
        renderPlans();
    }
    else
        $("#plans").innerHTML = loadError;
    if (r.status === "fulfilled" && r.value.length)
        renderReviews(r.value);
    else
        $("#review-list").innerHTML = loadError;
    if (f.status === "fulfilled")
        renderFaqs(f.value);
    else
        $("#faqs").innerHTML = loadError;
    watchReveals();
}
init();
