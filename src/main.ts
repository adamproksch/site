interface Plan {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  featured: boolean;
  features: string[];
}

interface Faq {
  q: string;
  a: string;
}

let plans: Plan[] = [];
let yearly = false;

const logLines = [
  "12:04:09 [push]   received on main@a41f9c2",
  "12:04:10 [build]  npm ci && npm run build",
  "12:04:17 [build]  finished in 6.8s",
  "12:04:18 [start]  container nb-4821, EU West",
  "12:04:19 [bot]    logged in as NestBot#0001",
  "12:04:19 [bot]    24 servers, 12 slash commands synced",
  "12:04:20 [health] bot is online",
];

function showLog(i: number) {
  if (i >= logLines.length) return;
  const log = document.getElementById("log")!;
  log.innerHTML += logLines[i].replace(/\[(\w+)\]/, '<span class="tag">[$1]</span>') + "\n";
  setTimeout(function () {
    showLog(i + 1);
  }, 500);
}

function showPlans() {
  let html = "";
  for (let i = 0; i < plans.length; i++) {
    const p = plans[i];
    let price = p.monthly;
    if (yearly) {
      price = p.yearly;
    }

    let priceText = "Free";
    if (price > 0) {
      priceText = "$" + price + "<span class='small'> /month</span>";
    }

    let list = "";
    for (let j = 0; j < p.features.length; j++) {
      list += "<li>" + p.features[j] + "</li>";
    }

    html += "<div class='plan" + (p.featured ? " featured" : "") + "'>";
    html += "<h3>" + p.name + "</h3>";
    html += "<p>" + p.tagline + "</p>";
    html += "<div class='price'>" + priceText + "</div>";
    html += "<ul>" + list + "</ul>";
    html += "<a href='#signup' class='btn'>Choose " + p.name + "</a>";
    html += "</div>";
  }
  document.getElementById("plans")!.innerHTML = html;
}

function showFaqs(faqs: Faq[]) {
  let html = "";
  for (let i = 0; i < faqs.length; i++) {
    html += "<details class='faq-item'><summary>" + faqs[i].q + "</summary><p>" + faqs[i].a + "</p></details>";
  }
  document.getElementById("faqs")!.innerHTML = html;
}

document.getElementById("monthly")!.addEventListener("click", function () {
  yearly = false;
  document.getElementById("monthly")!.classList.add("active");
  document.getElementById("yearly")!.classList.remove("active");
  showPlans();
});

document.getElementById("yearly")!.addEventListener("click", function () {
  yearly = true;
  document.getElementById("yearly")!.classList.add("active");
  document.getElementById("monthly")!.classList.remove("active");
  showPlans();
});

document.getElementById("menu-btn")!.addEventListener("click", function () {
  document.getElementById("nav")!.classList.toggle("open");
});

document.getElementById("signup-form")!.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const msg = document.getElementById("msg")!;
  if (email == "" || email.indexOf("@") == -1) {
    msg.innerText = "Please enter a valid email.";
  } else {
    msg.innerText = "Signups aren't open yet, check back soon!";
  }
});

fetch("/api/plans")
  .then(function (res) { return res.json(); })
  .then(function (data) {
    plans = data;
    showPlans();
  })
  .catch(function () {
    document.getElementById("plans")!.innerHTML = "Couldn't load plans.";
  });

fetch("/api/faqs")
  .then(function (res) { return res.json(); })
  .then(function (data) { showFaqs(data); })
  .catch(function () {
    document.getElementById("faqs")!.innerHTML = "Couldn't load FAQ.";
  });

showLog(0);
