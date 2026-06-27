document.documentElement.classList.add("js");

const CONFIG = {
  githubUser: "Ugiealbar7",
  emailjs: {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID"
  }
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
const smallScreen = window.matchMedia("(max-width: 860px)").matches;
const saveData = Boolean(navigator.connection && navigator.connection.saveData);
const mobileLike = coarsePointer || smallScreen;
const allowHeavyEffects = !reducedMotion && !mobileLike && !saveData;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3600);
}

// Loader
window.addEventListener("load", () => {
  setTimeout(() => $("#loader").classList.add("is-hidden"), reducedMotion || mobileLike ? 0 : 450);
});
setTimeout(() => $("#loader").classList.add("is-hidden"), 3500);

// Theme
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("ugi-theme");
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("ugi-theme", next);
});

// Mobile menu
const menuButton = $("#menuButton");
const navPanel = $("#navPanel");
function closeMenu() {
  menuButton.classList.remove("open");
  navPanel.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}
menuButton.addEventListener("click", () => {
  const willOpen = !navPanel.classList.contains("open");
  menuButton.classList.toggle("open", willOpen);
  navPanel.classList.toggle("open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  document.body.classList.toggle("menu-open", willOpen);
});
$$(".nav-panel a").forEach(link => link.addEventListener("click", closeMenu));

// Header and active navigation
const siteHeader = $("#siteHeader");
const sections = $$("main section[id]");
const navLinks = $$(".nav-panel a");
let sectionTops = [];
let headerTicking = false;
function refreshSectionTops() {
  sectionTops = sections.map(section => ({
    id: section.id,
    top: section.offsetTop
  }));
}
function updateHeader() {
  const scrollY = window.scrollY;
  siteHeader.classList.toggle("scrolled", scrollY > 30);
  let active = "";
  sectionTops.forEach(section => {
    if (scrollY >= section.top - 220) active = section.id;
  });
  navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${active}`));
  headerTicking = false;
}
function requestHeaderUpdate() {
  if (headerTicking) return;
  headerTicking = true;
  requestAnimationFrame(updateHeader);
}
refreshSectionTops();
window.addEventListener("resize", () => {
  refreshSectionTops();
  requestHeaderUpdate();
}, { passive: true });
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
updateHeader();

// Reveal and progress animations
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px" });
$$(".reveal, .stack-card").forEach(element => revealObserver.observe(element));
if (location.hash) {
  const directTarget = $(location.hash);
  if (directTarget) $$(".reveal", directTarget).forEach(element => element.classList.add("in-view"));
}

// Typing role
const roles = ["Web Developer", "UI/UX Designer", "IT Auditor", "Software Tester", "System Analyst"];
const typedRole = $("#typedRole");
let roleIndex = 0;
let characterIndex = roles[0].length;
let deleting = true;
function typeRole() {
  const role = roles[roleIndex];
  typedRole.textContent = role.slice(0, characterIndex);
  if (deleting) {
    characterIndex -= 1;
    if (characterIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      characterIndex = 0;
    }
  } else {
    characterIndex += 1;
    if (characterIndex > roles[roleIndex].length) {
      deleting = true;
      setTimeout(typeRole, 1300);
      return;
    }
  }
  setTimeout(typeRole, deleting ? 48 : 82);
}
if (allowHeavyEffects) {
  setTimeout(typeRole, 1200);
} else if (typedRole) {
  typedRole.textContent = roles[0];
}

// Counter
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const start = performance.now();
    const duration = 1100;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(element);
  });
}, { threshold: .7 });
$$("[data-count]").forEach(counter => counterObserver.observe(counter));

// Cursor glow and parallax
const cursorGlow = $("#cursorGlow");
const parallaxElements = $$("[data-parallax]");
if (allowHeavyEffects && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.classList.add("visible");
  }, { passive: true });
  document.addEventListener("mouseleave", () => cursorGlow.classList.remove("visible"));

  window.addEventListener("scroll", () => {
    parallaxElements.forEach(element => {
      const speed = Number(element.dataset.parallax);
      element.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
    });
  }, { passive: true });
}

// Lightweight particle background
const canvas = $("#particleCanvas");
const context = canvas.getContext("2d");
let particles = [];
let particleFrame = null;
let resizeFrame = null;
function sizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = innerWidth < 700 ? 18 : 38;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.2 + .35,
    vx: (Math.random() - .5) * .16,
    vy: (Math.random() - .5) * .16
  }));
}
function drawParticles() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  context.fillStyle = document.documentElement.dataset.theme === "light" ? "rgba(50,100,236,.35)" : "rgba(101,230,255,.42)";
  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < 0 || particle.x > innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > innerHeight) particle.vy *= -1;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    context.fill();
  });
  particleFrame = requestAnimationFrame(drawParticles);
}
if (allowHeavyEffects) {
  sizeCanvas();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(sizeCanvas);
  }, { passive: true });
  drawParticles();
} else {
  canvas.setAttribute("hidden", "");
  if (particleFrame) cancelAnimationFrame(particleFrame);
}

// Honest placeholder interactions
$$("[data-unavailable]").forEach(element => {
  element.addEventListener("click", event => {
    event.preventDefault();
    showToast(element.dataset.unavailable);
  });
});
const cvLink = document.querySelector("[data-cv-link]");

cvLink.addEventListener("click", function () {
    window.open("assets/CV_ATS_Muhamad_Ugi_Albar_IPK.pdf", "_blank");
});

// GitHub REST API
const languageColors = ["#65e6ff", "#4b7dff", "#a86bff", "#74f5bc", "#ffb768"];
function renderLanguages(languages) {
  const total = Object.values(languages).reduce((sum, value) => sum + value, 0) || 1;
  $("#languageChart").innerHTML = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value], index) => {
      const percent = Math.round((value / total) * 100);
      return `<div class="language-item"><span>${name}</span><div class="language-bar"><i style="width:${percent}%;background:${languageColors[index]}"></i></div><span>${percent}%</span></div>`;
    }).join("") || "<p>Belum ada data bahasa publik.</p>";
}
function renderRepositories(repositories) {
  $("#repoList").innerHTML = repositories.slice(0, 3).map(repo => `
    <a class="repo-item" href="${repo.html_url}" target="_blank" rel="noreferrer">
      <div><strong>${repo.name}</strong><p>${repo.description || "Public repository by Ugiealbar7."}</p></div>
      <div class="repo-meta"><span>${repo.language || "Code"}</span><span>★ ${repo.stargazers_count}</span></div>
    </a>
  `).join("") || "<p>Belum ada repository publik.</p>";
}
async function loadGitHub() {
  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${CONFIG.githubUser}`),
      fetch(`https://api.github.com/users/${CONFIG.githubUser}/repos?sort=updated&per_page=12`)
    ]);
    if (!profileResponse.ok || !reposResponse.ok) throw new Error("GitHub API unavailable");
    const profile = await profileResponse.json();
    const repos = await reposResponse.json();
    $("#githubAvatar").classList.remove("skeleton");
    $("#githubAvatar").style.backgroundImage = `url("${profile.avatar_url}")`;
    $("#githubName").textContent = profile.name || profile.login;
    $("#githubBio").textContent = profile.bio || "Information Systems student building and learning in public.";
    $("#repoCount").textContent = profile.public_repos;
    $("#followerCount").textContent = profile.followers;
    $("#followingCount").textContent = profile.following;
    renderRepositories(repos);

    const languageResults = await Promise.allSettled(repos.slice(0, 8).map(repo => fetch(repo.languages_url).then(response => response.json())));
    const languages = languageResults.reduce((all, result) => {
      if (result.status === "fulfilled") {
        Object.entries(result.value).forEach(([name, value]) => { all[name] = (all[name] || 0) + value; });
      }
      return all;
    }, {});
    renderLanguages(languages);
  } catch (error) {
    $("#githubBio").textContent = "Data GitHub tidak dapat dimuat saat ini. Kunjungi profil untuk melihat aktivitas terbaru.";
    $("#languageChart").innerHTML = '<p class="github-fallback">GitHub API sedang tidak tersedia.</p>';
    $("#repoList").innerHTML = '<a class="repo-item" href="https://github.com/Ugiealbar7" target="_blank" rel="noreferrer"><strong>Buka profil GitHub</strong><p>Lihat repository dan aktivitas terbaru langsung di GitHub.</p><div class="repo-meta"><span>@Ugiealbar7</span><span>↗</span></div></a>';
  }
}
let githubLoaded = false;
function startGitHubLoad() {
  if (githubLoaded) return;
  githubLoaded = true;
  loadGitHub();
}
const githubSection = $("#github");
if ("IntersectionObserver" in window && githubSection) {
  const githubObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    startGitHubLoad();
    githubObserver.disconnect();
  }, { rootMargin: "420px 0px" });
  githubObserver.observe(githubSection);
} else if ("requestIdleCallback" in window) {
  requestIdleCallback(startGitHubLoad, { timeout: 3500 });
} else {
  setTimeout(startGitHubLoad, 1800);
}

// EmailJS with mailto fallback until credentials are configured
const contactForm = $("#contactForm");
const emailConfigured = !Object.values(CONFIG.emailjs).some(value => value.startsWith("YOUR_"));
contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = $(".submit-button", contactForm);
  const buttonText = $("span", button);
  button.classList.add("sending");
  buttonText.textContent = "Mengirim...";
  const data = new FormData(contactForm);

  try {
    if (!emailConfigured || !window.emailjs) throw new Error("EmailJS not configured");
    window.emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
    await window.emailjs.sendForm(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, contactForm);
    contactForm.reset();
    showToast("Pesan berhasil dikirim. Terima kasih sudah menghubungi saya.");
  } catch (error) {
    const subject = encodeURIComponent(data.get("subject"));
    const body = encodeURIComponent(`Nama: ${data.get("from_name")}\nEmail: ${data.get("reply_to")}\n\n${data.get("message")}`);
    showToast("EmailJS belum dikonfigurasi. Membuka aplikasi email sebagai fallback.");
    setTimeout(() => { window.location.href = `mailto:mugieasus2233@gmail.com?subject=${subject}&body=${body}`; }, 600);
  } finally {
    button.classList.remove("sending");
    buttonText.textContent = "Kirim pesan";
  }
});

/* ============================================================
   PORTFOLIO FILTER TABS
   ============================================================ */
(function initPortfolioFilters() {
  const btns   = document.querySelectorAll(".pf-btn");
  const cards  = document.querySelectorAll(".pf-card");

  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.cat || "";
        if (filter === "all" || cat === filter) {
          card.classList.remove("pf-hidden");
        } else {
          card.classList.add("pf-hidden");
        }
      });
    });
  });
})();

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(src, title, desc, cat) {
  const overlay = document.getElementById("lightboxOverlay");
  const img     = document.getElementById("lightboxImg");
  const titleEl = document.getElementById("lightboxTitle");
  const descEl  = document.getElementById("lightboxDesc");
  const catEl   = document.getElementById("lightboxCat");

  img.src          = src;
  img.alt          = title;
  titleEl.textContent = title;
  descEl.textContent  = desc;
  catEl.textContent   = cat;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox(event) {
  // Close when clicking the overlay backdrop, not the inner box
  if (event && event.target !== document.getElementById("lightboxOverlay") && !event.target.classList.contains("lightbox-close")) return;

  const overlay = document.getElementById("lightboxOverlay");
  overlay.classList.remove("active");
  document.body.style.overflow = "";

  // Reset image after animation
  setTimeout(() => {
    document.getElementById("lightboxImg").src = "";
  }, 350);
}

// Close with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const overlay = document.getElementById("lightboxOverlay");
    if (overlay && overlay.classList.contains("active")) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});
