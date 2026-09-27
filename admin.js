/* Admin console */
const STORE_KEY = "cinematic_rolex_products_v1",
  CART_KEY = "cinematic_rolex_cart_v1",
  SET_KEY = "cinematic_rolex_settings_v1",
  AUTH_KEY = "cinematic_rolex_auth";
const DEFAULT_PRODUCTS = [
  {
    id: "submariner",
    name: "Submariner Date",
    cat: "sport",
    price: 14500,
    badge: "Icon",
    img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=900&auto=format&fit=crop",
    desc: "Oystersteel 41mm. Cerachrom bezel. 300m waterproof.",
  },
  {
    id: "daytona",
    name: "Cosmograph Daytona",
    cat: "sport",
    price: 39500,
    badge: "Racing",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=900&auto=format&fit=crop",
    desc: "18k yellow gold. Calibre 4131 chronograph.",
  },
  {
    id: "datejust",
    name: "Datejust 36",
    cat: "classic",
    price: 9800,
    badge: "Classic",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=900&auto=format&fit=crop",
    desc: "Jubilee bracelet, fluted bezel.",
  },
  {
    id: "daydate",
    name: "Day-Date 40",
    cat: "prestige",
    price: 38500,
    badge: "Prestige",
    img: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=900&auto=format&fit=crop",
    desc: "Platinum & champagne dial.",
  },
  {
    id: "gmt",
    name: "GMT-Master II",
    cat: "sport",
    price: 11700,
    badge: "Travel",
    img: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=900&auto=format&fit=crop",
    desc: "Pepsi bezel. Two time zones.",
  },
  {
    id: "deepsea",
    name: "Sea-Dweller Deepsea",
    cat: "sport",
    price: 12950,
    badge: "3,900m",
    img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=900&auto=format&fit=crop",
    desc: "Ringlock system, helium valve.",
  },
  {
    id: "oyster",
    name: "Oyster Perpetual 41",
    cat: "classic",
    price: 6100,
    badge: "Essential",
    img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=900&auto=format&fit=crop",
    desc: "Turquoise lacquer dial.",
  },
  {
    id: "sky",
    name: "Sky-Dweller Gold",
    cat: "prestige",
    price: 49800,
    badge: "Annual",
    img: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=900&auto=format&fit=crop",
    desc: "Annual calendar + dual time.",
  },
  {
    id: "explorer",
    name: "Explorer 36",
    cat: "classic",
    price: 7250,
    badge: "Summit",
    img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=900&auto=format&fit=crop",
    desc: "Summit-tested since Everest 1953.",
  },
];
const SAMPLE_IMGS = [...new Set(DEFAULT_PRODUCTS.map((p) => p.img))];
const $ = (s) => document.querySelector(s);
const money = (n) => "$" + Number(n).toLocaleString();
const toast = (m) => {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
};
const load = () => {
  try {
    const r = localStorage.getItem(STORE_KEY);
    if (r) {
      const p = JSON.parse(r);
      if (Array.isArray(p) && p.length) return p;
    }
  } catch (e) {}
  return [...DEFAULT_PRODUCTS];
};
let PRODUCTS = load(),
  editingId = null;
const save = () => localStorage.setItem(STORE_KEY, JSON.stringify(PRODUCTS));

/* auth */
if (localStorage.getItem(AUTH_KEY) === "1") {
  showDash();
}
$("#loginBtn").onclick = () => {
  const u = $("#uName").value.trim(),
    p = $("#uPass").value;
  if (u === "admin" && p === "rolex123") {
    localStorage.setItem(AUTH_KEY, "1");
    showDash();
    toast("Welcome back");
  } else
    $("#loginErr").textContent = "Invalid credentials. Try admin / rolex123";
};
$("#uPass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#loginBtn").click();
});
$("#logout").onclick = () => {
  localStorage.removeItem(AUTH_KEY);
  location.reload();
};
function showDash() {
  $("#loginWrap").style.display = "none";
  $("#dash").hidden = false;
  renderAll();
}

/* tabs */
document.querySelectorAll(".slink").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".slink")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const t = b.dataset.tab;
      $("#tabTitle").textContent = t[0].toUpperCase() + t.slice(1);
      ["products", "orders", "settings"].forEach(
        (k) => ($("#tab-" + k).hidden = k !== t),
      );
      if (t === "orders") renderOrders();
    }),
);

/* render */
function renderAll() {
  renderStats();
  renderTable();
  renderOrders();
  loadSettings();
}
function renderStats() {
  const total = PRODUCTS.length,
    val = PRODUCTS.reduce((s, p) => s + (+p.price || 0), 0);
  const cats = new Set(PRODUCTS.map((p) => p.cat)).size;
  $("#statsRow").innerHTML =
    `<div class="stat"><b>${total}</b><span>References</span></div><div class="stat"><b>${money(val)}</b><span>Catalog value</span></div><div class="stat"><b>${money(Math.round(val / Math.max(1, total)))}</b><span>Avg price</span></div><div class="stat"><b>${cats}</b><span>Categories</span></div>`;
}
function renderTable() {
  const q = ($("#aSearch").value || "").toLowerCase(),
    f = $("#aFilter").value;
  const list = PRODUCTS.filter(
    (p) =>
      (f === "all" || p.cat === f) &&
      (!q || (p.name + p.desc).toLowerCase().includes(q)),
  );
  $("#aBody").innerHTML =
    list
      .map(
        (p) =>
          `<tr><td><div class="prod"><img src="${p.img}" onerror="this.src='https://picsum.photos/seed/${p.id}/200'"><div><b>${p.name}</b><small>${p.id}</small></div></div></td><td><span class="pill">${p.cat}</span></td><td>${money(p.price)}</td><td>${p.badge || "—"}</td><td><div class="row-act"><button data-edit="${p.id}">Edit</button><button class="del" data-del="${p.id}">Delete</button></div></td></tr>`,
      )
      .join("") || `<tr><td colspan="5" class="muted">No products.</td></tr>`;
  $("#aBody")
    .querySelectorAll("[data-edit]")
    .forEach((b) => (b.onclick = () => openEditor(b.dataset.edit)));
  $("#aBody")
    .querySelectorAll("[data-del]")
    .forEach(
      (b) =>
        (b.onclick = () => {
          if (confirm("Delete " + b.dataset.del + "?")) {
            PRODUCTS = PRODUCTS.filter((p) => p.id !== b.dataset.del);
            save();
            renderAll();
            toast("Deleted");
          }
        }),
    );
}
$("#aSearch").oninput = renderTable;
$("#aFilter").onchange = renderTable;

/* editor */
$("#addBtn").onclick = () => openEditor(null);
$("#editCancel").onclick = () => $("#editModal").classList.remove("open");
function openEditor(id) {
  editingId = id;
  $("#editTitle").textContent = id ? "Edit Watch" : "Add Watch";
  const p = PRODUCTS.find((x) => x.id === id) || {
    name: "",
    cat: "sport",
    price: "",
    badge: "",
    img: SAMPLE_IMGS[0],
    desc: "",
  };
  $("#fName").value = p.name;
  $("#fCat").value = p.cat;
  $("#fPrice").value = p.price;
  $("#fBadge").value = p.badge || "";
  $("#fImg").value = p.img;
  $("#fDesc").value = p.desc || "";
  $("#fPrev").src = p.img;
  $("#quickPick").innerHTML = SAMPLE_IMGS.map(
    (u) => `<img src="${u}" data-pick="${u}">`,
  ).join("");
  $("#quickPick")
    .querySelectorAll("[data-pick]")
    .forEach(
      (i) =>
        (i.onclick = () => {
          $("#fImg").value = i.dataset.pick;
          $("#fPrev").src = i.dataset.pick;
        }),
    );
  $("#editModal").classList.add("open");
}
$("#fImg").oninput = (e) => {
  if (e.target.value) $("#fPrev").src = e.target.value;
};
$("#editSave").onclick = () => {
  const name = $("#fName").value.trim(),
    price = +$("#fPrice").value,
    img = $("#fImg").value.trim();
  if (!name || !price || !img) return toast("Name, price and image required");
  const data = {
    name,
    cat: $("#fCat").value,
    price,
    badge: $("#fBadge").value.trim(),
    img,
    desc: $("#fDesc").value.trim(),
  };
  if (editingId) {
    PRODUCTS = PRODUCTS.map((p) =>
      p.id === editingId ? { ...p, ...data } : p,
    );
    toast("Watch updated");
  } else {
    PRODUCTS.unshift({
      id:
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        (Date.now() % 10000),
      ...data,
    });
    toast("Watch added");
  }
  save();
  renderAll();
  $("#editModal").classList.remove("open");
};

/* orders */
function renderOrders() {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {}
  const total = cart.reduce((s, x) => s + x.qty * x.price, 0);
  $("#ordersBox").innerHTML = cart.length
    ? `<table><thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead><tbody>${cart.map((x) => `<tr><td><div class="prod"><img src="${x.img}"><div><b>${x.name}</b><small>${money(x.price)}</small></div></div></td><td>${x.qty}</td><td>${money(x.qty * x.price)}</td></tr>`).join("")}</tbody></table><p style="margin-top:12px"><b>Bag total: ${money(total)}</b></p>`
    : `<p class="muted">No items in bag for this browser.</p>`;
}
$("#refreshOrders").onclick = renderOrders;
$("#clearOrders").onclick = () => {
  localStorage.removeItem(CART_KEY);
  renderOrders();
  toast("Bag cleared");
};

/* settings */
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SET_KEY)) || {};
    $("#setAnnounce").value = s.announce || "";
    $("#setHero").value = s.hero || "";
    $("#setAnim").checked = s.anim !== false;
  } catch (e) {}
}
$("#saveSettings").onclick = () => {
  localStorage.setItem(
    SET_KEY,
    JSON.stringify({
      announce: $("#setAnnounce").value,
      hero: $("#setHero").value,
      anim: $("#setAnim").checked,
    }),
  );
  toast("Settings saved");
};

/* export / reset */
$("#exportBtn").onclick = () => {
  const b = new Blob([JSON.stringify(PRODUCTS, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = "rolex-products.json";
  a.click();
};
$("#resetBtn").onclick = () => {
  if (confirm("Reset to defaults?")) {
    PRODUCTS = [...DEFAULT_PRODUCTS];
    save();
    renderAll();
    toast("Reset done");
  }
};
