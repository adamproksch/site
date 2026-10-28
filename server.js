const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const plans = [
  {
    name: "Starter",
    tagline: "One bot, to try it out",
    monthly: 0,
    yearly: 0,
    featured: false,
    features: [
      "1 bot",
      "256 MB memory",
      "Shared CPU",
      "Community support on Discord",
      "Daily backup, kept 3 days",
    ],
  },
  {
    name: "Pro",
    tagline: "For a community with a few bots",
    monthly: 6,
    yearly: 5,
    featured: true,
    features: [
      "5 bots",
      "1 GB memory each",
      "1 vCPU each",
      "Email support, reply within a day",
      "Daily backups, kept 14 days",
      "Crash alerts in your Discord channel",
    ],
  },
  {
    name: "Elite",
    tagline: "For networks and bot developers",
    monthly: 18,
    yearly: 15,
    featured: false,
    features: [
      "Unlimited bots",
      "4 GB memory each",
      "2 vCPU each",
      "Live chat support",
      "Hourly backups, kept 30 days",
      "Dedicated node",
      "Custom domain for a web dashboard",
    ],
  },
];

const faqs = [
  {
    q: "Which languages can I run?",
    a: "Node.js, Python, Java and Go. Pro and Elite can also bring a custom Docker image.",
  },
  {
    q: "How does deploying work?",
    a: "Connect a GitHub repo and pick a branch. Each push builds the project and restarts the bot.",
  },
  {
    q: "What happens when my bot crashes?",
    a: "It restarts on its own, and the last 20 log lines are posted to a Discord channel you choose.",
  },
  {
    q: "Can I leave at any time?",
    a: "Yes. Download your files and databases from the panel whenever you like. Paid plans can be cancelled in one click.",
  },
  {
    q: "Is there a refund?",
    a: "Paid plans can be refunded within 7 days of the first payment.",
  },
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/plans", (req, res) => res.json(plans));
app.get("/api/faqs", (req, res) => res.json(faqs));

app.listen(PORT, () => console.log(`BotNest running on http://localhost:${PORT}`));
