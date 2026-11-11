async function cargar(id, archivo) {
  const respuesta = await fetch(archivo);
  const html = await respuesta.text();
  document.getElementById(id).innerHTML = html;
}

function actualizarIconoTema() {
  const boton = document.getElementById("tema");
  if (!boton) return;
  const oscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
  boton.textContent = oscuro ? "☀️" : "🌙";
}

function aplicarTema() {
  const guardado = localStorage.getItem("tema") || "sistema";
  const sistemaOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const oscuro = guardado === "oscuro" || (guardado === "sistema" && sistemaOscuro);

  if (oscuro) {
    document.documentElement.setAttribute("data-tema", "oscuro");
  } else {
    document.documentElement.removeAttribute("data-tema");
  }
  actualizarIconoTema();
}

function activarModoOscuro() {
  const boton = document.getElementById("tema");
  actualizarIconoTema();

  boton.addEventListener("click", () => {
    const oscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
    localStorage.setItem("tema", oscuro ? "claro" : "oscuro");
    aplicarTema();
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", aplicarTema);
}

function marcarPaginaActual() {
  const actual = location.pathname.split("/").pop() || "index.html";
  const enlaces = document.querySelectorAll("nav a");

  enlaces.forEach((enlace) => {
    if (enlace.getAttribute("href") === actual) {
      enlace.classList.add("activo");
      enlace.setAttribute("aria-current", "page");
    }
  });
}

function activarMenuMovil() {
  const boton = document.getElementById("menu-btn");
  const lista = document.querySelector("nav ul");

  boton.addEventListener("click", () => {
    lista.classList.toggle("abierto");
  });
}

async function actualizarSesion() {
  const enlace = document.getElementById("enlace-sesion");
  const caja = document.getElementById("li-sesion");
  const { data } = await db.auth.getSession();

  if (!data.session) return;
    const { data: nivel } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
  if (nivel.nextLevel === "aal2" && nivel.currentLevel !== "aal2") return;

  const usuario = data.session.user;
  const nombre = usuario.user_metadata?.nombre || usuario.email.split("@")[0];
    const saludo = document.getElementById("saludo");
  if (saludo) saludo.textContent = "Hola, " + nombre;
    const botonInicio = document.getElementById("boton-inicio");
  if (botonInicio) {
    botonInicio.textContent = "Ver espacio personal";
    botonInicio.href = "configuracion.html";
  }

  caja.classList.add("con-sesion");
  enlace.textContent = nombre;
  enlace.href = "#";

  if (usuario.id === ADMIN_ID) {
    document.getElementById("enlace-admin").hidden = false;
  }

  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();
    caja.classList.toggle("abierto");
  });

  document.addEventListener("click", (evento) => {
    if (!caja.contains(evento.target)) caja.classList.remove("abierto");
  });

  document.getElementById("cerrar-sesion").addEventListener("click", async (evento) => {
    evento.preventDefault();
    await db.auth.signOut();
    location.href = "index.html";
  });
}

function ponerFavicon() {
  const icono = document.createElement("link");
  icono.rel = "icon";
  icono.href =
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>";
  document.head.append(icono);
}

async function iniciar() {
  ponerFavicon();
  await cargar("header", "componentes/header.html");
  await cargar("footer", "componentes/footer.html");
  activarModoOscuro();
  marcarPaginaActual();
  activarMenuMovil();
  actualizarSesion();
}
aplicarTema();
iniciar();