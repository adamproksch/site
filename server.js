const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// TODO db
const plans = [
  {
    name: "Starter",
    tagline: "Try it out with one bot",
    monthly: 0,
    yearly: 0,
    featured: false,
    features: ["1 bot", "256 MB RAM", "Shared CPU", "Help in our Discord", "Daily backups (last 2)"],
  },
  {
    name: "Pro",
    tagline: "Most people pick this",
    monthly: 6,
    yearly: 5,
    featured: true,
    features: [
      "Up to 5 bots",
      "1 GB RAM per bot",
      "1 vCPU per bot",
      "Email support",
      "Daily backups, 7 days",
      "Crash alerts",
      "Custom Docker images",
    ],
  },
  {
    name: "Elite",
    tagline: "Big servers and bot devs",
    monthly: 18,
    yearly: 15,
    featured: false,
    features: [
      "Unlimited bots",
      "4 GB RAM per bot",
      "2 vCPU per bot",
      "Priority support (live chat)",
      "Hourly backups, 30 days",
      "Dedicated node",
      "Custom Docker images",
    ],
  },
];

const faqs = [
  {
    q: "What languages do you support?",
    a: "Node.js, Python, Java and Go out of the box. On Pro and Elite you can bring your own Docker image and run pretty much anything.",
  },
  {
    q: "Do I have to use GitHub?",
    a: "No, you can upload a zip instead. You just won't get automatic deploys.",
  },
  {
    q: "My bot keeps crashing, what happens?",
    a: "We restart it automatically. If it crashes more than 5 times in 10 minutes we stop restarting and let you know, so it doesn't loop forever.",
  },
  {
    q: "Can I take my stuff and leave?",
    a: "Sure. Everything can be downloaded from the panel, and cancelling is one click.",
  },
  {
    q: "Refunds?",
    a: "If you're not happy within 7 days of your first payment, email us and we'll refund it.",
  },
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/plans", (req, res) => res.json(plans));
app.get("/api/faqs", (req, res) => res.json(faqs));

app.listen(PORT, () => console.log(`Discord Bot Hosting running on http://localhost:${PORT}`));
