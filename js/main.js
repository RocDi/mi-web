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
  const { data } = await db.auth.getSession();

  if (data.session) {
    document.getElementById("li-admin").hidden = false;
    enlace.textContent = "Cerrar sesión";
    enlace.href = "#";
    enlace.addEventListener("click", async (evento) => {
      evento.preventDefault();
      await db.auth.signOut();
      location.href = "index.html";
    });
  }
}

async function iniciar() {
  await cargar("header", "componentes/header.html");
  await cargar("footer", "componentes/footer.html");
  activarModoOscuro();
  marcarPaginaActual();
  activarMenuMovil();
  actualizarSesion();
}

iniciar();