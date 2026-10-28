"use strict";
const $ = (id) => document.getElementById(id);
let plans = [];
let yearly = false;
// fake deploy output for the hero
const logLines = [
    "12:04:09 [push]   main @ a41f9c2",
    "12:04:10 [build]  npm ci && npm run build",
    "12:04:17 [build]  ok (6.8s)",
    "12:04:18 [start]  eu-central",
    "12:04:19 [bot]    ready, 24 guilds",
    "12:04:20 [health] passing",
];
async function playLog() {
    const log = $("log");
    for (const line of logLines) {
        log.innerHTML += line.replace(/\[(\w+)\]/, '<span class="tag">[$1]</span>') + "\n";
        await new Promise((r) => setTimeout(r, 450));
    }
}
function renderPlans() {
    $("plans").innerHTML = plans
        .map((p) => {
        const price = yearly ? p.yearly : p.monthly;
        const priceText = price ? `$${price}<span class="small"> /mo</span>` : "Free";
        return `
        <div class="plan${p.featured ? " featured" : ""}">
          <h3>${p.name}</h3>
          <p>${p.tagline}</p>
          <div class="price">${priceText}</div>
          <ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
          <a href="#signup" class="btn">Choose ${p.name}</a>
        </div>`;
    })
        .join("");
}
function setBilling(isYearly) {
    yearly = isYearly;
    $("monthly").classList.toggle("active", !yearly);
    $("yearly").classList.toggle("active", yearly);
    renderPlans();
}
$("monthly").addEventListener("click", () => setBilling(false));
$("yearly").addEventListener("click", () => setBilling(true));
$("menu-btn").addEventListener("click", (e) => {
    const open = $("nav").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
});
$("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("email").value.trim();
    // TODO POST /api/signup
    $("msg").textContent = /\S+@\S+\.\S+/.test(email)
        ? "Thanks! Signups open soon, we'll email you."
        : "That email doesn't look right.";
});
async function load() {
    try {
        plans = await (await fetch("/api/plans")).json();
        renderPlans();
        const faqs = await (await fetch("/api/faqs")).json();
        $("faqs").innerHTML = faqs
            .map((f) => `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`)
            .join("");
    }
    catch (err) {
        console.error(err);
        $("plans").textContent = "Couldn't load pricing, try refreshing.";
        $("faqs").textContent = "";
    }
}
load();
playLog();
