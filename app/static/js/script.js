// ---- THEME TOGGLE ----
const themeToggle = document.getElementById("themeToggle");
document.getElementById("correo");
document.getElementById("password");
const html = document.documentElement;
let preguntas = [];
let respuestas = [];
let respuestasUsuario = [];
let preguntaActual = 0;

// Cargar preferencia guardada
const saved = localStorage.getItem("theme") || "light";
if (saved === "dark") {
  html.classList.add("dark");
  themeToggle.checked = true; // sincroniza el checkbox visualmente
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// ---- HAMBURGUESA MENU ----
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("open");
  navMenu.style.right = "-100%";
}

hamburger.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("open");
  if (isOpen) {
    closeMenu();
  } else {
    hamburger.classList.add("active");
    navMenu.classList.add("open");
    navMenu.style.display = "flex";
    navMenu.style.right = "0";
  }
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    closeMenu();
  }
});

// ---- NAVIGATION ----
const navLinks = document.querySelectorAll(".nav-link");
const screens = document.querySelectorAll(".screen");

function navigateTo(targetId) {
  screens.forEach((s) => s.classList.remove("active"));
  navLinks.forEach((l) => l.classList.remove("active"));

  const target = document.getElementById(targetId);
  if (target) target.classList.add("active");

  const activeLink = document.querySelector(
    `.nav-link[data-target="${targetId}"]`,
  );
  if (activeLink) activeLink.classList.add("active");

  closeMenu(); // para cerrarlo aut.

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(link.getAttribute("data-target"));
  });
});

// ---- HEADER SCROLL ----
window.addEventListener("scroll", () => {
  document
    .getElementById("header")
    .classList.toggle("shadow-lg", window.pageYOffset > 50);
});

function renderPregunta() {
  console.log("Renderizando pregunta");
  const pregunta = preguntas[preguntaActual];
  console.log(pregunta);
  const container = document.getElementById("questionsContainer");
  console.log(container);

  let opcionesHTML = "";

  respuestas.forEach((respuesta) => {
    opcionesHTML += `
            <label
                class="option-label flex items-center px-5 py-4 bg-[#f0f3f5]
                dark:bg-[#2d3340] rounded-2xl cursor-pointer border-2
                border-transparent hover:border-brand hover:bg-white
                dark:hover:bg-[#353d55] hover:translate-x-2
                hover:shadow-md transition-all duration-300 text-base"
            >

                <input
                    type="radio"
                    name="pregunta_${pregunta.id_pregunta}"
                    value="${respuesta.id_respuesta}"
                    class="mr-4 w-5 h-5 cursor-pointer flex-shrink-0"
                    style="accent-color:#0058ac"

                    onchange="seleccionarRespuesta(
                        ${pregunta.id_pregunta},
                        ${respuesta.id_respuesta}
                    )"
                >

                <span>${respuesta.texto}</span>

            </label>
        `;
  });

  container.innerHTML = `
        <div class="question">

            <div class="flex items-start gap-4 mb-6">

                <span
                    class="flex-shrink-0 w-10 h-10 accent-gradient
                    text-cream rounded-full flex items-center
                    justify-center font-black text-lg shadow-md"
                >
                    ${preguntaActual + 1}
                </span>

                <span
                    class="font-playfair text-xl font-bold
                    text-navy dark:text-[#e8e9ed] pt-1"
                >
                    ${pregunta.pregunta}
                </span>

            </div>

            <div class="flex flex-col gap-3 pl-14">
                ${opcionesHTML}
            </div>

        </div>
    `;

  actualizarBarra();
}

async function cargarPreguntas() {
  try {
    const response = await fetch("http://127.0.0.1:8000/preguntas");

    const data = await response.json();

    preguntas = data.preguntas;
    respuestas = data.respuestas;

    console.log("Preguntas cargadas:", preguntas);
    console.log("Respuestas cargadas:", respuestas);

    renderPregunta();
  } catch (error) {
    console.error(error);
  }
}

function seleccionarRespuesta(idPregunta, idRespuesta) {
  const existente = respuestasUsuario.find((x) => x.id_pregunta === idPregunta);

  if (existente) {
    existente.id_respuesta = idRespuesta;
  } else {
    respuestasUsuario.push({
      id_pregunta: idPregunta,
      id_respuesta: idRespuesta,
    });
  }

  console.log(respuestasUsuario);

  siguientePregunta();
}

function siguientePregunta() {
  preguntaActual++;

  if (preguntaActual >= preguntas.length) {
    finalizarTest();
    return;
  }

  renderPregunta();
}

function actualizarBarra() {
  const progressFill = document.getElementById("progressFill");

  const progressPercText = document.getElementById("progressPercText");

  const porcentaje = Math.round((preguntaActual / preguntas.length) * 100);

  progressFill.style.width = porcentaje + "%";

  progressPercText.textContent = porcentaje + "%";
}

async function finalizarTest() {
  try {
    // OBTENER USUARIO DEL LOCALSTORAGE
    const usuario = JSON.parse(localStorage.getItem("vocare_session"));

    if (!usuario) {
      alert("Debes iniciar sesión");
      return;
    }

    const payload = {
      id_usuario: usuario.id_usuario,
      respuestas: respuestasUsuario,
    };

    console.log("Payload enviado:", payload);
    console.log(usuario);

    const response = await fetch("http://127.0.0.1:8000/guardar-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      console.error("Error backend:", data);
      alert("Error enviando test");
      return;
    }
    mostrarResultados(data.top3);

  } catch (error) {
    console.error("Error enviando test:", error);
  }
}

function mostrarResultados(top3) {
  const summary = document.getElementById("results-summary");
  const container = document.getElementById("results-container");

  if (!summary || !container) {
    console.error("No existen los contenedores de resultados");
    return;
  }

  // LIMPIAR CONTENEDOR
  container.innerHTML = "";

  // TOP 1
  const mejor = top3[0];

  // RESUMEN SUPERIOR
  summary.innerHTML = `
        <div class="relative z-10">

            <h2 class="text-3xl font-bold mb-4">
                Tu mejor coincidencia es:
            </h2>

            <div class="text-5xl font-black text-brand mb-4">
                ${mejor.nombre}
            </div>

            <p class="text-lg opacity-80">
                Universidad: ${mejor.universidad}
            </p>

            <p class="text-lg opacity-80">
                Modalidad: ${mejor.modalidad}
            </p>

            <p class="text-lg opacity-80">
                Sede: ${mejor.sede}
            </p>

            <div class="mt-6 text-2xl font-bold">
                Compatibilidad: ${mejor.probabilidad}%
            </div>

        </div>
    `;

  // CREAR CARDS
  top3.forEach((item, index) => {
    const card = document.createElement("div");

    card.className = `
            bg-white dark:bg-slate-900
            rounded-3xl
            shadow-lg
            p-8
            border border-slate-200 dark:border-slate-700
            hover:scale-[1.02]
            transition-all
            duration-300
        `;

    card.innerHTML = `
            <div class="flex items-center justify-between mb-6">

                <div>

                    <div class="text-sm uppercase tracking-widest text-brand font-bold">
                        Opción ${index + 1}
                    </div>

                    <h3 class="text-3xl font-black text-navy dark:text-cream">
                        ${item.nombre}
                    </h3>

                </div>

                <div class="text-3xl font-black text-brand">
                    ${item.probabilidad}%
                </div>

            </div>

            <div class="space-y-3 text-slate-700 dark:text-slate-300">

                <p>
                    <strong>Universidad:</strong>
                    ${item.universidad}
                </p>

                <p>
                    <strong>Modalidad:</strong>
                    ${item.modalidad}
                </p>

                <p>
                    <strong>Sede:</strong>
                    ${item.sede}
                </p>

            </div>
        `;

    container.appendChild(card);
  });

  // IR A PANTALLA RESULTADOS
  navigateTo("resultados");
}

document
  .getElementById("vocationalForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    if (respuestasUsuario.length !== preguntas.length) {
      alert("Debes responder todas las preguntas.");
      return;
    }
    await finalizarTest();
  });

cargarPreguntas();

/* ===========================================================
   REFERENCIAS DEL DOM PRINCIPAL
   =========================================================== */
const main = document.getElementById("main");
const signIn = document.getElementById("formSignIn");
const signUp = document.getElementById("formSignUp");
const loginError = document.getElementById("loginError");

/* ===========================================================
   FUNCIONES AUXILIARES
   =========================================================== */
function activate(form, mode) {
  try {
    [signIn, signUp].forEach((f) => f && f.classList.add("hidden"));
    form?.classList.remove("hidden");

    if (main) {
      main.classList.remove("md:flex-row", "md:flex-row-reverse");
      main.classList.add(
        mode === "signup" ? "md:flex-row-reverse" : "md:flex-row",
      );
    }

    const first = form?.querySelector("input");
    if (first) first.focus({ preventScroll: true });
  } catch (err) {
    console.warn("⚠️ Error al activar formulario:", err.message);
  }
}

/* ===========================================================
   LOGIN
   =========================================================== */
$("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  hideBanner("loginBanner");

  const email = $("lEmail").value.trim();
  const password = $("lPassword").value;

  let ok = true;

  if (!email) {
    setField("lEmail", "lEmailMsg", "err", "El correo es obligatorio");
    ok = false;
  } else if (!isEmail(email)) {
    setField("lEmail", "lEmailMsg", "err", "Formato inválido");
    ok = false;
  }

  if (!password) {
    setField(
      "lPassword",
      "lPasswordMsg",
      "err",
      "La contraseña es obligatoria",
    );
    ok = false;
  }

  if (!ok) return;

  const btn = $("loginBtn");
  setLoading(btn, true);

  const hashedPassword = await sha256(password);

  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: email,
        password: hashedPassword,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setLoading(btn, false, "Ingresar");
      showBanner(
        "loginBanner",
        "error",
        data.detail || "Credenciales incorrectas",
      );
      return;
    }

    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    btn.style.background = "#16a34a";
    btn.innerHTML = "Acceso exitoso";

    showBanner("loginBanner", "success", `Bienvenido ${data.usuario.nombre}`);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    console.error(error);

    setLoading(btn, false, "Ingresar");

    showBanner("loginBanner", "error", "Error conectando con el servidor");
  }
});

/* ===========================================================
   REGISTRO
   =========================================================== */
$("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  hideBanner("registerBanner");

  const email = $("rEmail").value.trim();

  const password = $("rPassword").value;

  const confirm = $("rConfirm").value;

  let ok = true;

  if (!email) {
    setField("rEmail", "rEmailMsg", "err", "El correo es obligatorio");

    ok = false;
  } else if (!isEmail(email)) {
    setField("rEmail", "rEmailMsg", "err", "Formato inválido");

    ok = false;
  }

  if (password.length < 8) {
    setField("rPassword", "rPasswordMsg", "err", "Mínimo 8 caracteres");

    ok = false;
  }

  if (confirm !== password) {
    setField("rConfirm", "rConfirmMsg", "err", "Las contraseñas no coinciden");

    ok = false;
  }

  if (!ok) return;

  const btn = $("registerBtn");
  setLoading(btn, true);

  const hashedPassword = await sha256(password);
  console.log(hashedPassword);
  try {
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nombre: email.split("@")[0],
        correo: email,
        password: hashedPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoading(btn, false, "Crear Cuenta");

      showBanner("registerBanner", "error", data.detail || "Error");

      return;
    }

    btn.style.background = "#16a34a";

    btn.innerHTML = "✓ Cuenta creada";

    showBanner("registerBanner", "success", "Usuario registrado correctamente");

    setTimeout(() => {
      switchTab("login");
    }, 1500);
  } catch (error) {
    console.error(error);

    setLoading(btn, false, "Crear Cuenta");

    showBanner("registerBanner", "error", "Error conectando con servidor");
  }
});

/* ===========================================================
   ESTADO INICIAL
   =========================================================== */
activate(signIn, "signin");

/* ===========================================================
   CAMBIO ENTRE LOGIN / SIGNUP
   =========================================================== */
try {
  const goToSignUp = document.getElementById("goToSignUp");
  const goToSignIn = document.getElementById("goToSignIn");

  goToSignUp?.addEventListener("click", (e) => {
    e.preventDefault();
    activate(signUp, "signup");
  });

  goToSignIn?.addEventListener("click", (e) => {
    e.preventDefault();
    activate(signIn, "signin");
  });
} catch (err) {
  console.warn("⚠️ Error al cambiar formulario:", err.message);
}

/* ===========================================================
   NAVBAR MOBILE
   =========================================================== */
try {
  const menuBtn = document.getElementById("menuBtn");
  const menuList = document.getElementById("menuList");

  menuBtn?.addEventListener("click", () => {
    if (!menuList) return;
    const wasHidden = menuList.classList.contains("hidden");
    menuList.classList.toggle("hidden");
    menuList.classList.toggle("flex");

    if (!wasHidden) {
      const catSub = document.getElementById("catSub");
      const catBtn = document.getElementById("catBtn");
      const catIcon = document.getElementById("catIcon");
      if (catSub && !catSub.classList.contains("hidden")) {
        catSub.classList.add("hidden");
        catBtn?.setAttribute("aria-expanded", "false");
        if (catIcon) {
          catIcon.classList.add("fa-angle-down");
          catIcon.classList.remove("fa-angle-up");
        }
      }
    }
  });

  const catBtn = document.getElementById("catBtn");
  const catSub = document.getElementById("catSub");
  const catIcon = document.getElementById("catIcon");

  if (catBtn && catSub) {
    catBtn.addEventListener("click", () => {
      const isOpen = catSub.classList.toggle("hidden") === false;
      catBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (catIcon) {
        catIcon.classList.toggle("fa-angle-down", !isOpen);
        catIcon.classList.toggle("fa-angle-up", isOpen);
      }
    });
  }
} catch (err) {
  console.warn("⚠️ Error en navbar:", err.message);
}

/* ===========================================================
   MODAL DE LIBRO
   =========================================================== */
try {
  const bookModal = document.getElementById("bookModal");
  const bookModalOverlay = document.getElementById("bookModalOverlay");
  const bookModalClose = document.getElementById("bookModalClose");

  const bmTitleTop = document.getElementById("bmTitleTop");
  const bmTitle = document.getElementById("bmTitle");
  const bmAuthor = document.getElementById("bmAuthor");
  const bmImage = document.getElementById("bmImage");
  const bmStars = document.getElementById("bmStars");
  const bmRatingText = document.getElementById("bmRatingText");
  const bmDesc = document.getElementById("bmDesc");
  const bmISBN = document.getElementById("bmISBN");
  const bmYear = document.getElementById("bmYear");
  const bmPages = document.getElementById("bmPages");
  const bmGenero = document.getElementById("bmGenero");

  function renderStars(n) {
    const full = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
    bmStars.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("i");
      star.className =
        i < full
          ? "fa-solid fa-star text-sm text-lime-500"
          : "fa-regular fa-star text-sm text-gray-300";
      bmStars.appendChild(star);
    }
    bmRatingText.textContent = `${full}/5`;
  }

  function openBookModal(card) {
    bmTitleTop.textContent = card.dataset.title || "Sin título";
    bmTitle.textContent = card.dataset.title || "Sin título";
    bmAuthor.textContent = card.dataset.author || "Autor desconocido";
    bmImage.src = card.dataset.image || "";
    bmImage.alt = card.dataset.title || "";
    renderStars(card.dataset.rating || 0);
    bmDesc.textContent =
      card.dataset.description || "Sin descripción disponible.";
    bmISBN.textContent = card.dataset.isbn || "N/D";
    bmYear.textContent = card.dataset.year || "N/D";
    bmPages.textContent = card.dataset.pages || "N/D";
    bmGenero.textContent = card.dataset.genero || "N/D";

    bookModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeBookModal() {
    bookModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  bookModalOverlay?.addEventListener("click", closeBookModal);
  bookModalClose?.addEventListener("click", closeBookModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !bookModal.classList.contains("hidden"))
      closeBookModal();
  });

  document.querySelectorAll(".book-card").forEach((card) => {
    card.addEventListener("click", () => openBookModal(card));
  });
} catch (err) {
  console.warn("⚠️ Error en modal de libro:", err.message);
}

/* ===========================================================
   EFECTO VANTA (protegido)
   =========================================================== */
try {
  let vantaEffect;
  function initVanta() {
    if (typeof VANTA === "undefined") return;
    if (vantaEffect) return;
    vantaEffect = VANTA.GLOBE({
      el: "#vanta-globe",
      mouseControls: true,
      touchControls: true,
      minHeight: 200.0,
      minWidth: 200.0,
      color: 0xff3f81,
      backgroundColor: 0x23153c,
      size: 2.1,
      points: 15.0,
    });
  }
  document.addEventListener("DOMContentLoaded", initVanta);
  window.addEventListener("resize", () => {
    if (vantaEffect) vantaEffect.resize();
  });
  window.addEventListener("pagehide", () => {
    if (vantaEffect) {
      vantaEffect.destroy();
      vantaEffect = null;
    }
  });
} catch (err) {
  console.warn("⚠️ Error en VANTA:", err.message);
}

/* ===========================================================
   RESERVAR LIBRO (con límites)
   =========================================================== */
try {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-reservar");
    if (!btn) return;

    const title = document.getElementById("bmTitle").innerText;
    const author = document.getElementById("bmAuthor").innerText;
    const img = document.getElementById("bmImage").src;
    const isbn = document.getElementById("bmISBN").innerText;
    const date = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    let category = window.location.pathname
      .split("/")
      .pop()
      .replace(".html", "");
    if (category === "" || category === "home") category = "home";

    const entrega = new Date();
    entrega.setDate(entrega.getDate() + 30);

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    // 🔒 Máximo 6 reservas en total
    if (reservas.length >= 6) {
      alert("⚠️ No puedes reservar más de 6 libros a la vez.");
      return;
    }

    // 🔒 Máximo 2 reservas del mismo libro
    const repeticiones = reservas.filter((r) => r.title === title).length;
    if (repeticiones >= 1) {
      alert("⚠️ Ya reservaste este libro el máximo permitido.");
      return;
    }

    const reserva = {
      title,
      author,
      img,
      isbn,
      date,
      entrega: entrega.toLocaleDateString("es-ES"),
      status: "Activa",
      category,
    };
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    document.getElementById("bookModal").classList.add("hidden");
    document.body.style.overflow = "auto";

    // 🟢 Toast visual (funciona también en mobile)
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-6 right-6 bg-indigo-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fadeIn z-[9999]";
    toast.textContent = `✅ "${title}" ha sido reservado.`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);

    updateNotifications();
  });
} catch (err) {
  console.warn("⚠️ Error al reservar libro:", err.message);
}

/* ===========================================================
   POPUP DE NOTIFICACIONES (Desktop + Mobile)
   =========================================================== */
try {
  let currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  if (currentPage === "" || currentPage === "home") currentPage = "home";

  const notifBtn = document.getElementById("notifBtn");
  const notifPopup = document.getElementById("notifPopup");
  const notifContent = document.getElementById("notifContent");
  const notifBadge = document.getElementById("notifBadge");
  const notifBtnMobile = document.getElementById("notifBtnMobile");
  const notifBadgeMobile = document.getElementById("notifBadgeMobile");

  function getReservas() {
    return JSON.parse(localStorage.getItem("reservas")) || [];
  }

  // 🔄 Actualiza el contenido y los badges
  function updateNotifications() {
    const allReservas = getReservas();
    const reservasFiltradas = ["home", "reservas", "faqs"].includes(currentPage)
      ? allReservas
      : allReservas.filter((r) => r.category === currentPage);

    const total = reservasFiltradas.length;

    // Actualiza badges (desktop y mobile)
    [notifBadge, notifBadgeMobile].forEach((badge) => {
      if (!badge) return;
      if (total > 0) {
        badge.classList.remove("hidden");
        badge.textContent = total;
      } else {
        badge.classList.add("hidden");
      }
    });

    // Actualiza contenido desktop
    if (notifContent) {
      if (total > 0) {
        const ultima = reservasFiltradas.at(-1);
        notifContent.innerHTML = `
          <p>📚 Tienes <b>${total}</b> libros activos</p>
          <p>✨ Último: <b>${ultima.title}</b></p>
        `;
      } else {
        notifContent.innerHTML = `<p class="text-gray-500">No tienes reservas en esta categoría</p>`;
      }
    }
  }

  // 🖥️ Desktop: abre/cierra popup
  notifBtn?.addEventListener("click", () =>
    notifPopup?.classList.toggle("hidden"),
  );
  document.addEventListener("click", (e) => {
    if (!notifBtn?.contains(e.target) && !notifPopup?.contains(e.target)) {
      notifPopup?.classList.add("hidden");
    }
  });

  // 📱 Mobile: abre modal con resumen
  notifBtnMobile?.addEventListener("click", () => {
    const reservas = getReservas();
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]";

    const popup = document.createElement("div");
    popup.className =
      "bg-white w-80 max-w-[90%] rounded-xl p-5 shadow-xl text-sm text-gray-800";
    popup.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-semibold text-lg">Notificaciones</h2>
        <button class="text-gray-500 hover:text-black text-lg font-bold">&times;</button>
      </div>
      ${
        reservas.length
          ? `<p>📚 Tienes <b>${reservas.length}</b> libros activos.</p>
             <p class="mt-1 text-gray-700">✨ Último: <b>${reservas.at(-1).title}</b></p>`
          : `<p class="text-gray-500 text-center">No tienes reservas activas</p>`
      }
    `;
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    popup
      .querySelector("button")
      .addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  });

  updateNotifications();
  window.updateNotifications = updateNotifications;
} catch (err) {
  console.warn("⚠️ Error en popup de notificaciones:", err.message);
}
//login apartee

const $ = (id) => document.getElementById(id);

async function sha256(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function setField(inputId, msgId, type, text) {
  const inp = $(inputId),
    msg = $(msgId);
  inp.classList.remove("err", "ok");
  msg.classList.remove("show", "is-err", "is-ok");
  if (!type) return;
  inp.classList.add(type === "err" ? "err" : "ok");
  msg.innerHTML = (type === "err" ? "⚠ " : "✓ ") + text;
  msg.classList.add("show", type === "err" ? "is-err" : "is-ok");
}

function showBanner(id, type, html) {
  const b = $(id);
  b.className = `result-banner show ${type}`;
  b.innerHTML = `<span class="b-icon">${type === "success" ? "✅" : "❌"}</span><span>${html}</span>`;
}
function hideBanner(id) {
  $(id).className = "result-banner";
  $(id).innerHTML = "";
}

function setLoading(btn, on, label = "") {
  if (on) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spin"></span> Procesando…`;
  } else {
    btn.disabled = false;
    btn.innerHTML = label;
  }
}

const eyeOpen = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`;

function togglePw(id, btn) {
  const inp = $(id);
  const isText = inp.type === "text";
  inp.type = isText ? "password" : "text";
  btn.querySelector("svg").innerHTML = isText ? eyeOpen : eyeClosed;
}

function switchTab(tab) {
  const lT = $("loginTab"),
    rT = $("registerTab"),
    lF = $("loginForm"),
    rF = $("registerForm");
  if (tab === "login") {
    lF.classList.remove("hidden");
    lF.classList.add("form-anim");
    rF.classList.add("hidden");
    lT.className = "tab-pill active";
    rT.className = "tab-pill inactive";
    hideBanner("loginBanner");
  } else {
    rF.classList.remove("hidden");
    rF.classList.add("form-anim");
    lF.classList.add("hidden");
    rT.className = "tab-pill active";
    lT.className = "tab-pill inactive";
    hideBanner("registerBanner");
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem("vocare_users") || "[]");
}
function saveUsers(u) {
  localStorage.setItem("vocare_users", JSON.stringify(u));
}
function setSession(user) {
  localStorage.setItem(
    "vocare_session",
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      loginAt: new Date().toISOString(),
    }),
  );
}

/* Strength bar */
$("rPassword").addEventListener("input", function () {
  const v = this.value,
    wrap = $("strWrap"),
    fill = $("strFill"),
    lbl = $("strLabel");
  if (!v) {
    wrap.style.display = "none";
    return;
  }
  wrap.style.display = "block";
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const lvl = [
    { w: "18%", c: "#dc2626", t: "Muy débil" },
    { w: "38%", c: "#ea580c", t: "Débil" },
    { w: "60%", c: "#ca8a04", t: "Moderada" },
    { w: "82%", c: "#16a34a", t: "Fuerte" },
    { w: "100%", c: "#15803d", t: "Muy fuerte" },
  ][s] || { w: "18%", c: "#dc2626", t: "Muy débil" };
  fill.style.width = lvl.w;
  fill.style.background = lvl.c;
  lbl.textContent = lvl.t;
  lbl.style.color = lvl.c;
});

$("rConfirm").addEventListener("input", function () {
  if (!this.value) {
    setField("rConfirm", "rConfirmMsg", null, "");
    return;
  }
  this.value === $("rPassword").value
    ? setField("rConfirm", "rConfirmMsg", "ok", "Las contraseñas coinciden")
    : setField("rConfirm", "rConfirmMsg", "err", "No coinciden");
});

["lEmail", "lPassword"].forEach((id) =>
  $(id).addEventListener("input", () => {
    setField(id, id + "Msg", null, "");
    hideBanner("loginBanner");
  }),
);
["rEmail", "rPassword"].forEach((id) =>
  $(id).addEventListener("input", () => {
    setField(id, id + "Msg", null, "");
    hideBanner("registerBanner");
  }),
);

/* ══ LOGIN ══ */
$("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  hideBanner("loginBanner");
  const email = $("lEmail").value.trim();
  const password = $("lPassword").value;
  const remember = $("rememberMe").checked;
  let ok = true;

  if (!email) {
    setField("lEmail", "lEmailMsg", "err", "El correo es obligatorio");
    ok = false;
  } else if (!isEmail(email)) {
    setField("lEmail", "lEmailMsg", "err", "Formato de correo inválido");
    ok = false;
  }
  if (!password) {
    setField(
      "lPassword",
      "lPasswordMsg",
      "err",
      "La contraseña es obligatoria",
    );
    ok = false;
  }
  if (!ok) return;

  const btn = $("loginBtn");
  setLoading(btn, true);
  await new Promise((r) => setTimeout(r, 700));

  const hashed = await sha256(password);
  const users = getUsers();
  const user = users.find(
    (u) => u.email === email && u.passwordHash === hashed,
  );

  if (!user) {
    setLoading(btn, false, "Ingresar");
    showBanner("loginBanner", "error", "Correo o contraseña incorrectos.");
    setField("lEmail", "lEmailMsg", "err", "");
    setField("lPassword", "lPasswordMsg", "err", "");
    return;
  }

  if (remember) localStorage.setItem("vocare_remember", email);
  else localStorage.removeItem("vocare_remember");

  setSession(user);
  btn.style.background = "#16a34a";
  btn.innerHTML = "✓ Acceso exitoso — redirigiendo…";
  showBanner(
    "loginBanner",
    "success",
    `¡Bienvenido, <strong>${user.name}</strong>! Serás redirigido en un momento…`,
  );
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1400);
});

/* ══ REGISTER ══ */
$("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  hideBanner("registerBanner");
  const email = $("rEmail").value.trim();
  const password = $("rPassword").value;
  const confirm = $("rConfirm").value;
  let ok = true;

  if (!email) {
    setField("rEmail", "rEmailMsg", "err", "El correo es obligatorio");
    ok = false;
  } else if (!isEmail(email)) {
    setField("rEmail", "rEmailMsg", "err", "Formato de correo inválido");
    ok = false;
  }

  if (!password) {
    setField(
      "rPassword",
      "rPasswordMsg",
      "err",
      "La contraseña es obligatoria",
    );
    ok = false;
  } else if (password.length < 8) {
    setField("rPassword", "rPasswordMsg", "err", "Mínimo 8 caracteres");
    ok = false;
  } else if (!/[A-Z]/.test(password)) {
    setField(
      "rPassword",
      "rPasswordMsg",
      "err",
      "Debe incluir al menos una mayúscula",
    );
    ok = false;
  } else if (!/[0-9]/.test(password)) {
    setField(
      "rPassword",
      "rPasswordMsg",
      "err",
      "Debe incluir al menos un número",
    );
    ok = false;
  } else {
    setField("rPassword", "rPasswordMsg", "ok", "Contraseña válida");
  }

  if (!confirm) {
    setField("rConfirm", "rConfirmMsg", "err", "Confirma tu contraseña");
    ok = false;
  } else if (confirm !== password) {
    setField("rConfirm", "rConfirmMsg", "err", "Las contraseñas no coinciden");
    ok = false;
  }

  if (!ok) {
    showBanner(
      "registerBanner",
      "error",
      "Corrige los campos marcados antes de continuar.",
    );
    return;
  }

  const btn = $("registerBtn");
  setLoading(btn, true);
  await new Promise((r) => setTimeout(r, 800));

  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    setLoading(btn, false, "Crear Cuenta");
    setField("rEmail", "rEmailMsg", "err", "Este correo ya está registrado");
    showBanner(
      "registerBanner",
      "error",
      "Ya existe una cuenta con ese correo.",
    );
    return;
  }

  const passwordHash = await sha256(password);
  const newUser = {
    id: Date.now(),
    name: email.split("@")[0],
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);

  btn.style.background = "#16a34a";
  btn.innerHTML = "✓ Cuenta creada — inicia sesión…";
  showBanner(
    "registerBanner",
    "success",
    `<strong>¡Registro exitoso!</strong> Ahora inicia sesión con <strong>${email}</strong>.`,
  );
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1800);
});

/* ══ FORGOT ══ */
function handleForgot() {
  hideBanner("loginBanner");
  const email = $("lEmail").value.trim();
  if (!email || !isEmail(email)) {
    setField(
      "lEmail",
      "lEmailMsg",
      "err",
      "Escribe tu correo para recuperarlo",
    );
    return;
  }
  showBanner(
    "loginBanner",
    "success",
    `Enlace de recuperación enviado a <strong>${email}</strong>.`,
  );
}

/* ══ INIT ══ */
const rem = localStorage.getItem("vocare_remember");
if (rem) {
  $("lEmail").value = rem;
  $("rememberMe").checked = true;
}

if (localStorage.getItem("vocare_session")) {
  window.location.href = "index.html";
}

async function login() {
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      correo,
      password,
    }),
  });

  const data = await response.json();

  console.log(data);

  if (response.ok) {
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    window.location.href = "/";
  } else {
    alert(data.detail || "Credenciales inválidas");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cargarPreguntas();
});
