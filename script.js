const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Theme toggle (remembers your choice)
try {
    const saved = localStorage.getItem("theme");
    if (saved) root.dataset.theme = saved;
} catch (e) {}
document.querySelector(".theme-btn").addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
});

// 2. Mobile menu
const nav = document.getElementById("nav");
const menuBtn = document.querySelector(".menu-btn");
menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", false);
    }
});

// 3. Hero: letters rise in one by one
const name = document.querySelector(".name");
name.innerHTML = [...name.textContent]
    .map((ch, i) => ch === " " ? " " : `<span class="l" style="--i:${i}" aria-hidden="true">${ch}</span>`)
    .join("");

// 4. Hero: grid glows around the cursor
const hero = document.querySelector(".hero");
hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
    hero.style.setProperty("--my", `${e.clientY - r.top}px`);
});

// 5. Typing effect for the role line
const role = document.querySelector(".role");
const words = ["Web Developer", "Designer"];
if (!reduceMotion) {
    role.classList.add("typing");
    let w = 0, c = 0, deleting = false;
    const prefix = "I build as a ";
    const tick = () => {
        const word = words[w];
        c += deleting ? -1 : 1;
        role.textContent = prefix + word.slice(0, c);
        let delay = deleting ? 50 : 100;
        if (!deleting && c === word.length) { deleting = true; delay = 1600; }
        else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
        setTimeout(tick, delay);
    };
    setTimeout(tick, 1200);
}

// 6. Reveal sections as they scroll into view
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); }
    });
}, { threshold: 0.15 });
document.querySelectorAll("[data-reveal]").forEach((el) => revealObs.observe(el));

// 7. Highlight the nav link of the section you're reading
const links = [...nav.querySelectorAll("a")];
const navObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) {
            links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
        }
    });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => navObs.observe(s));

// 8. Contact form validation (no backend yet, so it only confirms on screen)
const form = document.getElementById("contact-form");
const msg = form.querySelector(".form-msg");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("input, textarea").forEach((f) => {
        const valid = f.value.trim() !== "" && f.checkValidity();
        f.classList.toggle("bad", !valid);
        if (!valid) ok = false;
    });
    msg.textContent = ok ? "Thanks! Your message is ready to send." : "Please fill in every field with a valid email.";
    if (ok) form.reset();
});

// 9. Footer year
document.getElementById("year").textContent = new Date().getFullYear();
