async function cargar(id, archivo) {
  const respuesta = await fetch(archivo);
  const html = await respuesta.text();
  document.getElementById(id).innerHTML = html;
}

function activarModoOscuro() {
  const boton = document.getElementById("tema");
  const html = document.documentElement;

  if (localStorage.getItem("tema") === "oscuro") {
    html.setAttribute("data-tema", "oscuro");
    boton.textContent = "☀️";
  }

  boton.addEventListener("click", () => {
    if (html.getAttribute("data-tema") === "oscuro") {
      html.removeAttribute("data-tema");
      localStorage.setItem("tema", "claro");
      boton.textContent = "🌙";
    } else {
      html.setAttribute("data-tema", "oscuro");
      localStorage.setItem("tema", "oscuro");
      boton.textContent = "☀️";
    }
  });
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

  const usuario = data.session.user;
  const nombre = usuario.user_metadata?.nombre || usuario.email.split("@")[0];

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

iniciar();