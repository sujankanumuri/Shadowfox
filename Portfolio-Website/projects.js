const express = require('express');
const router = express.Router();

const fallbackProjects = [
  {
    title: "Web Crawler - Automated Data Collection System",
    description: "Developed a Web Crawler to automatically explore websites, collect web links, and process structured data using traversal algorithms.",
    techStack: ["Python", "Algorithms", "Web Scraping"],
    githubLink: "",
    demoLink: "",
    category: "Web"
  },
  {
    title: "Crop Advisory System - Smart Agriculture Assistant",
    description: "Built a Crop Advisory System that provides crop recommendations using data analysis and rule-based decision-making techniques.",
    techStack: ["Python", "Data Analysis", "AI"],
    githubLink: "",
    demoLink: "",
    category: "AI"
  },
  {
    title: "CryPto Banking - Secure Digital Banking Platform",
    description: "Developed a modern digital banking platform with secure transactions, finance management, and user-friendly banking features.",
    techStack: ["React", "JavaScript", "Firebase"],
    githubLink: "",
    demoLink: "",
    category: "FinTech"
  },
  {
    title: "Nivora - AI Powered Women Health Guidance Platform",
    description: "Built an AI-based platform providing anonymous health guidance and emotional support for women.",
    techStack: ["HTML", "Node.js", "AI"],
    githubLink: "",
    demoLink: "",
    category: "Healthcare AI"
  },
];

router.get('/', (req, res) => {
  res.json(fallbackProjects);
});

module.exports = router;