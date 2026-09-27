/* Cinematic Rolex Concept — app.js */
gsap.registerPlugin(ScrollTrigger);

const STORE_KEY = "cinematic_rolex_products_v1";
const CART_KEY = "cinematic_rolex_cart_v1";

const DEFAULT_PRODUCTS = [
  {
    id: "submariner",
    name: "Submariner Date",
    cat: "sport",
    price: 14500,
    badge: "Icon",
    img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=900&auto=format&fit=crop",
    desc: "Oystersteel 41mm. Cerachrom bezel. 300m waterproof. The dive watch that started it all.",
  },
  {
    id: "daytona",
    name: "Cosmograph Daytona",
    cat: "sport",
    price: 39500,
    badge: "Racing",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=900&auto=format&fit=crop",
    desc: "18k yellow gold. Calibre 4131 chronograph. Born for endurance racing in 1963.",
  },
  {
    id: "datejust",
    name: "Datejust 36",
    cat: "classic",
    price: 9800,
    badge: "Classic",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=900&auto=format&fit=crop",
    desc: "Jubilee bracelet, fluted bezel. The archetype of the classic automatic watch.",
  },
  {
    id: "daydate",
    name: "Day-Date 40",
    cat: "prestige",
    price: 38500,
    badge: "Prestige",
    img: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=900&auto=format&fit=crop",
    desc: "Platinum & champagne dial. Presidents wear it. Day and date in full splendour.",
  },
  {
    id: "gmt",
    name: "GMT-Master II",
    cat: "sport",
    price: 11700,
    badge: "Travel",
    img: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=900&auto=format&fit=crop",
    desc: "Pepsi bezel. Two time zones. Built with Pan-Am pilots in 1954.",
  },
  {
    id: "deepsea",
    name: "Sea-Dweller Deepsea",
    cat: "sport",
    price: 12950,
    badge: "3,900m",
    img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=900&auto=format&fit=crop",
    desc: "Ringlock system, helium valve. Engineered for the hadal zone.",
  },
  {
    id: "oyster",
    name: "Oyster Perpetual 41",
    cat: "classic",
    price: 6100,
    badge: "Essential",
    img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=900&auto=format&fit=crop",
    desc: "Turquoise lacquer dial. The purest Oyster — clean, bright, eternal.",
  },
  {
    id: "sky",
    name: "Sky-Dweller Gold",
    cat: "prestige",
    price: 49800,
    badge: "Annual",
    img: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=900&auto=format&fit=crop",
    desc: "Annual calendar + dual time. Saros system in 18k Everose gold.",
  },
  {
    id: "explorer",
    name: "Explorer 36",
    cat: "classic",
    price: 7250,
    badge: "Summit",
    img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=900&auto=format&fit=crop",
    desc: "Summit-tested since Everest 1953. Legibility above everything.",
  },
];

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + Number(n).toLocaleString();

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length) return p;
    }
  } catch (e) {}
  return [...DEFAULT_PRODUCTS];
}
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  renderCart();
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2400);
}

let PRODUCTS = loadProducts();
let activeFilter = "all",
  query = "",
  currentModal = null,
  qty = 1;

/* ---------- Preloader ---------- */
(function () {
  let p = 0;
  const fill = $("#preBarFill"),
    cnt = $("#preCount");
  const iv = setInterval(() => {
    p = Math.min(100, p + Math.random() * 14);
    fill.style.width = p + "%";
    cnt.textContent = Math.floor(p);
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => $("#preloader").classList.add("done"), 350);
    }
  }, 140);
})();

/* ---------- Smooth scroll (Lenis) ---------- */
let lenis = null;
try {
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
} catch (e) {}

/* anchor smooth fallback */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    $("#mobileMenu").classList.remove("open");
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: "smooth" });
  });
});

/* ---------- Custom cursor + magnetic ---------- */
const dot = $("#cursorDot"),
  ring = $("#cursorRing");
let mx = innerWidth / 2,
  my = innerHeight / 2,
  rx = mx,
  ry = my;
addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
  const h = e.target.closest("a,button,.card,.show-item");
  ring.style.borderColor = h ? "#e8c97a" : "rgba(200,162,74,.6)";
});
(function loop() {
  rx += (mx - rx) * 0.16;
  ry += (my - ry) * 0.16;
  ring.style.transform = `translate(${rx - 17}px,${ry - 17}px)`;
  requestAnimationFrame(loop);
})();
document.querySelectorAll(".magnetic").forEach((b) => {
  b.addEventListener("mousemove", (e) => {
    const r = b.getBoundingClientRect();
    gsap.to(b, {
      x: (e.clientX - r.left - r.width / 2) * 0.25,
      y: (e.clientY - r.top - r.height / 2) * 0.25,
      duration: 0.3,
    });
  });
  b.addEventListener("mouseleave", () =>
    gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,.4)" }),
  );
});

/* ---------- Products render ---------- */
function filtered() {
  return PRODUCTS.filter((p) => {
    const f = activeFilter === "all" || p.cat === activeFilter;
    const q =
      !query ||
      (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(query);
    return f && q;
  });
}
function renderProducts() {
  const grid = $("#productGrid");
  const list = filtered();
  $("#resultCount").textContent = list.length + " references";
  grid.innerHTML =
    list
      .map(
        (p) => `
    <article class="card tilt" data-id="${p.id}">
      <div class="card-img" data-quick="${p.id}"><span class="badge">${p.badge || p.cat}</span><img loading="lazy" src="${p.img}" alt="${p.name}"><button class="quick" data-quick="${p.id}">Quick View +</button></div>
      <div class="card-body"><p class="card-cat">${p.cat}</p><h3>${p.name}</h3><p class="card-desc">${p.desc}</p>
      <div class="card-foot"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">Add +</button></div></div>
    </article>`,
      )
      .join("") ||
    `<p class="muted">No references found. <button class="link" id="resetF">Reset filters</button></p>`;
  const rf = $("#resetF");
  if (rf)
    rf.onclick = () => {
      activeFilter = "all";
      query = "";
      $("#searchInput").value = "";
      document
        .querySelectorAll(".chip")
        .forEach((c) =>
          c.classList.toggle("active", c.dataset.filter === "all"),
        );
      renderProducts();
    };
  bindTilt();
  ScrollTrigger.refresh();
}
function renderShowcase() {
  const box = $("#showList");
  box.innerHTML = PRODUCTS.slice(0, 5)
    .map(
      (p, i) => `
    <button class="show-item ${i === 0 ? "active" : ""}" data-show="${p.id}"><img src="${p.img}" alt=""><div><b>${p.name}</b><small>${p.cat} — ${p.badge || ""}</small></div><span>${money(p.price)}</span></button>`,
    )
    .join("");
  box.querySelectorAll("[data-show]").forEach(
    (b) =>
      (b.onclick = () => {
        box
          .querySelectorAll(".show-item")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        const p = PRODUCTS.find((x) => x.id === b.dataset.show);
        gsap.to("#showImg", {
          opacity: 0,
          scale: 1.06,
          duration: 0.25,
          onComplete: () => {
            $("#showImg").src = p.img;
            $("#showName").textContent = p.name;
            $("#showPrice").textContent = money(p.price);
            gsap.to("#showImg", { opacity: 1, scale: 1, duration: 0.5 });
          },
        });
      }),
  );
  if (PRODUCTS[0]) {
    $("#showImg").src = PRODUCTS[0].img;
    $("#showName").textContent = PRODUCTS[0].name;
    $("#showPrice").textContent = money(PRODUCTS[0].price);
  }
}

/* filters + search */
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  document
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("active"));
  b.classList.add("active");
  activeFilter = b.dataset.filter;
  renderProducts();
});
$("#searchInput").addEventListener("input", (e) => {
  query = e.target.value.trim().toLowerCase();
  renderProducts();
});
$("#searchBtn").onclick = () => {
  $("#collection").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#searchInput").focus(), 600);
};

/* 3D tilt */
function bindTilt() {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.onmousemove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    };
    card.onmouseleave = () => (card.style.transform = "");
  });
}

/* grid clicks */
$("#productGrid").addEventListener("click", (e) => {
  const a = e.target.closest("[data-add]"),
    q = e.target.closest("[data-quick]");
  if (a) {
    addToCart(a.dataset.add, 1);
  }
  if (q) {
    openModal(q.dataset.quick);
  }
});

/* ---------- Modal ---------- */
function openModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  currentModal = id;
  qty = 1;
  $("#qVal").textContent = "1";
  $("#mImg").src = p.img;
  $("#mCat").textContent = p.cat + " — " + (p.badge || "");
  $("#mName").textContent = p.name;
  $("#mPrice").textContent = money(p.price);
  $("#mDesc").textContent = p.desc;
  $("#quickModal").classList.add("open");
}
$("#modalClose").onclick = () => $("#quickModal").classList.remove("open");
$("#quickModal").addEventListener("click", (e) => {
  if (e.target.id === "quickModal") e.target.classList.remove("open");
});
$("#qPlus").onclick = () => {
  qty = Math.min(9, qty + 1);
  $("#qVal").textContent = qty;
};
$("#qMinus").onclick = () => {
  qty = Math.max(1, qty - 1);
  $("#qVal").textContent = qty;
};
$("#mAdd").onclick = () => {
  if (currentModal) {
    addToCart(currentModal, qty);
    $("#quickModal").classList.remove("open");
  }
};

/* ---------- Cart ---------- */
function addToCart(id, n) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const c = getCart();
  const f = c.find((x) => x.id === id);
  if (f) f.qty += n;
  else c.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: n });
  saveCart(c);
  toast(p.name + " added to bag");
  openCart();
}
function renderCart() {
  const c = getCart();
  const box = $("#cartItems");
  const n = c.reduce((s, x) => s + x.qty, 0),
    total = c.reduce((s, x) => s + x.qty * x.price, 0);
  $("#cartCount").textContent = n;
  $("#cartN").textContent = n;
  $("#cartTotal").textContent = money(total);
  box.innerHTML = c.length
    ? c
        .map(
          (x) =>
            `<div class="cart-item"><img src="${x.img}" alt=""><div><b>${x.name}</b><small>${x.qty} × ${money(x.price)}</small><br><button data-rm="${x.id}">Remove</button></div><b>${money(x.qty * x.price)}</b></div>`,
        )
        .join("")
    : `<p class="muted" style="text-align:center;padding:40px 0">Your bag is empty.<br>Timelessness awaits.</p>`;
  box
    .querySelectorAll("[data-rm]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          saveCart(getCart().filter((x) => x.id !== b.dataset.rm))),
    );
}
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartVeil").classList.add("open");
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartVeil").classList.remove("open");
}
$("#cartOpen").onclick = openCart;
$("#cartClose").onclick = closeCart;
$("#cartVeil").onclick = closeCart;
$("#clearCart").onclick = () => saveCart([]);
$("#checkoutBtn").onclick = () => {
  const c = getCart();
  if (!c.length) return toast("Bag is empty");
  toast("Order placed — " + money(c.reduce((s, x) => s + x.qty * x.price, 0)));
  saveCart([]);
  closeCart();
};

/* ---------- Scroll animations ---------- */
function anim() {
  // progress
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (s) => ($("#progressFill").style.width = s.progress * 100 + "%"),
  });
  // hero parallax
  gsap.to("#heroImg", {
    yPercent: 18,
    scale: 1.15,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.to(".hero-content", {
    yPercent: -22,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "70% top",
      scrub: true,
    },
  });
  gsap.to(".hero-big-fade", {
    xPercent: -12,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  // generic parallax imgs
  gsap.utils.toArray("[data-speed]").forEach((el) => {
    gsap.to(el, {
      yPercent: parseFloat(el.dataset.speed || 0.2) * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") || el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
  // reveals
  gsap.utils.toArray(".reveal").forEach((el) =>
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    }),
  );
  gsap.utils.toArray(".reveal-text").forEach((el) =>
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    }),
  );
  gsap.utils.toArray(".parallax-img img").forEach((img) =>
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    ),
  );
  // cinematic zoom
  gsap.fromTo(
    "#cineImg",
    { scale: 1.25 },
    {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#cinematic",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
  gsap.utils.toArray("[data-cine]").forEach((el, i) =>
    gsap.from(el, {
      x: i ? 120 : -120,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: "#cinematic", start: "top 70%" },
    }),
  );
  // craft stagger
  gsap.from(".craft-card", {
    y: 70,
    opacity: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".craft-cards", start: "top 82%" },
  });
  gsap.from(".card", {
    y: 50,
    opacity: 0,
    stagger: 0.06,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: { trigger: "#productGrid", start: "top 85%" },
  });
  // counters
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: end,
            duration: 1.6,
            snap: { innerText: 1 },
            ease: "power2.out",
          },
        ),
    });
  });
  // nav shadow
  ScrollTrigger.create({
    start: 80,
    onEnter: () => ($("#nav").style.boxShadow = "0 10px 40px rgba(0,0,0,.5)"),
    onLeaveBack: () => ($("#nav").style.boxShadow = "none"),
  });
}

/* ---------- Misc UI ---------- */
$("#burger").onclick = () => $("#mobileMenu").classList.toggle("open");
$("#playFilm").onclick = () => $("#filmOverlay").classList.add("open");
$("#filmClose").onclick = () => $("#filmOverlay").classList.remove("open");
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#quickModal").classList.remove("open");
    $("#filmOverlay").classList.remove("open");
    closeCart();
  }
});
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#formOk").style.display = "block";
  e.target.querySelector("button").textContent = "Request Sent ✓";
  toast("Appointment requested");
});
$("#newsBtn").onclick = () => {
  const v = $("#newsInput").value.trim();
  $("#newsOk").textContent = v.includes("@")
    ? "✓ You are on the list."
    : "Enter a valid email.";
};

/* hero mouse parallax */
$("#hero").addEventListener("mousemove", (e) => {
  const x = e.clientX / innerWidth - 0.5,
    y = e.clientY / innerHeight - 0.5;
  gsap.to(".hero-content", { x: x * 20, duration: 0.6 });
  gsap.to("#heroImg", { x: x * -30, duration: 0.8 });
});

/* init */
try {
  const s =
    JSON.parse(localStorage.getItem("cinematic_rolex_settings_v1")) || {};
  if (s.announce) $("#announce").innerHTML = s.announce;
  if (s.hero) document.querySelector(".hero-sub").innerHTML = s.hero;
  if (s.anim === false) document.body.style.setProperty("--no-anim", "1");
} catch (e) {}
renderProducts();
renderShowcase();
renderCart();
anim();
addEventListener("storage", (e) => {
  if (e.key === STORE_KEY) {
    PRODUCTS = loadProducts();
    renderProducts();
    renderShowcase();
  }
});
