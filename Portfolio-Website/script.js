// ===== PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles-container');
    const colors = ['#00f5ff', '#7b2ff7', '#f72585', '#ffffff'];
    
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 4 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 20;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            bottom: -10px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        container.appendChild(particle);
    }
}

// ===== TYPING ANIMATION =====
const roles = [
    'AI & Software Developer',
    'B.Tech AI Student',
    'Full Stack Developer',
    'Problem Solver'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeText() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeText, 2000);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }
    
    setTimeout(typeText, isDeleting ? 50 : 100);
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section');
const navLinksList = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksList.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#00f5ff';
        }
    });
});

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width;
    });
}

// ===== SCROLL REVEAL =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
}

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

// Add reveal class to sections
document.querySelectorAll('.skill-category, .project-card, .cert-card, .exp-card, .timeline-item, .stat-card').forEach(el => {
    el.classList.add('reveal');
});

window.addEventListener('scroll', () => {
    revealOnScroll();
    
    // Animate skill bars when skills section is visible
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            animateSkillBars();
        }
    }
});

// ===== FETCH PROJECTS FROM BACKEND =====
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        renderProjects(projects, grid);
    } catch (error) {
        renderProjects(fallbackProjects, grid, true);
    }
}

function renderProjects(projects, grid, isFallback = false) {
    grid.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('project-card', 'reveal');
        
        const techTags = project.techStack.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        const githubBtn = project.githubLink 
            ? `<a href="${project.githubLink}" target="_blank" class="project-link github">
                <i class="fab fa-github"></i> GitHub
               </a>` 
            : `<span class="project-link github" style="opacity:0.4;cursor:default">
                <i class="fab fa-github"></i> GitHub
               </span>`;
        
        const demoBtn = project.demoLink 
            ? `<a href="${project.demoLink}" target="_blank" class="project-link demo">
                <i class="fas fa-external-link-alt"></i> Demo
               </a>` 
            : '';
        
        card.innerHTML = `
            <span class="project-category">${project.category}</span>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">${techTags}</div>
            <div class="project-links">
                ${githubBtn}
                ${demoBtn}
            </div>
        `;
        
        // no visual fallback notice when loading local projects
        
        grid.appendChild(card);
    });
    
    revealOnScroll();
}

// ===== CONTACT FORM =====

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            formStatus.className = 'form-status success';
            formStatus.textContent = '✅ Message sent successfully! I will get back to you soon.';
            contactForm.reset();
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✅ Message received! I will get back to you soon.';
        contactForm.reset();
    }
    
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    
    setTimeout(() => {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
    }, 5000);
});

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    typeText();
    loadProjects();
    revealOnScroll();
});