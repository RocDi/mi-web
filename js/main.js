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

  if (boton) {
    boton.addEventListener("click", () => {
      const oscuro =
        document.documentElement.getAttribute("data-tema") === "oscuro";

      localStorage.setItem("tema", oscuro ? "claro" : "oscuro");
      aplicarTema();
    });
  }

  const preferencia = window.matchMedia("(prefers-color-scheme: dark)");

  preferencia.addEventListener("change", () => {
    if ((localStorage.getItem("tema") || "sistema") === "sistema") {
      aplicarTema();
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

  if (!boton || !lista) return;

  boton.setAttribute("aria-expanded", "false");

  boton.addEventListener("click", () => {
    const abierto = lista.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });
}



async function actualizarSesion() {
  const enlace = document.getElementById("enlace-sesion");
  const caja = document.getElementById("li-sesion");

  if (!enlace || !caja) return;

  try {
    const { data, error } = await db.auth.getSession();

    if (error) throw error;
    if (!data.session) return;

    const usuario = data.session.user;
    const nombre =
      usuario.user_metadata?.nombre ||
      usuario.email?.split("@")[0] ||
      "Mi cuenta";

    const saludo = document.getElementById("saludo");
    if (saludo) {
      saludo.textContent = "Hola, " + nombre;
    }

    const botonInicio = document.getElementById("boton-inicio");
    if (botonInicio) {
      botonInicio.textContent = "Ver espacio personal";
      botonInicio.href = "configuracion.html";
    }

    caja.classList.add("con-sesion");
    enlace.textContent = nombre;
    enlace.href = "#";

    const enlaceAdmin = document.getElementById("enlace-admin");
    if (enlaceAdmin) {
      enlaceAdmin.hidden = usuario.id !== ADMIN_ID;
    }

    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();
      caja.classList.toggle("abierto");
    });

    document.addEventListener("click", (evento) => {
      if (!caja.contains(evento.target)) {
        caja.classList.remove("abierto");
      }
    });

    const cerrarSesion = document.getElementById("cerrar-sesion");

    if (cerrarSesion) {
      cerrarSesion.addEventListener("click", async (evento) => {
        evento.preventDefault();

        const { error } = await db.auth.signOut();

        if (error) {
          console.error("No se pudo cerrar la sesión:", error);
          return;
        }

        location.href = "index.html";
      });
    }
  } catch (error) {
    console.error("Error al comprobar la sesión:", error);
  }
}


function ponerFavicon() {
  const icono = document.createElement("link");
  icono.rel = "icon";
  icono.href =
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>";
  document.head.append(icono);
}

function mostrarAviso() {
  if (localStorage.getItem("aviso-visto")) return;

  const aviso = document.createElement("div");
  aviso.id = "aviso";
  aviso.setAttribute("role", "region");
  aviso.setAttribute("aria-label", "Aviso sobre el almacenamiento en el navegador");

  const texto = document.createElement("p");
  texto.textContent =
    "Esta web guarda en tu navegador solo lo necesario para funcionar (tu sesión y tu preferencia de aspecto). No usa publicidad ni analítica. ";

  const enlace = document.createElement("a");
  enlace.href = "privacidad.html";
  enlace.textContent = "Más información";
  texto.append(enlace);

  const boton = document.createElement("button");
  boton.textContent = "Entendido";
  boton.classList.add("boton");
  boton.addEventListener("click", () => {
    localStorage.setItem("aviso-visto", "1");
    aviso.remove();
  });

  aviso.append(texto, boton);
  document.body.append(aviso);
}

function activarVolverArriba() {
  const boton = document.createElement("button");
  boton.id = "subir";
  boton.textContent = "↑";
  boton.setAttribute("aria-label", "Volver arriba");
  boton.hidden = true;

  boton.addEventListener("click", () => {
    const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: sinAnimacion ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", () => {
    boton.hidden = window.scrollY < 400;
  });

  document.body.append(boton);
}


async function cargar(id, archivo) {
  const contenedor = document.getElementById(id);

  if (!contenedor) {
    throw new Error("No se encontró el contenedor: " + id);
  }

  const respuesta = await fetch(archivo);

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar " + archivo);
  }

  contenedor.innerHTML = await respuesta.text();
}

aplicarTema();
setTimeout(() => document.documentElement.classList.add("transiciones"), 300);

async function iniciar() {
  ponerFavicon();

  const resultados = await Promise.allSettled([
    cargar("header", "componentes/header.html"),
    cargar("footer", "componentes/footer.html"),
  ]);

  resultados.forEach((resultado) => {
    if (resultado.status === "rejected") {
      console.error("Error al cargar un componente:", resultado.reason);
    }
  });

  activarModoOscuro();
  marcarPaginaActual();
  activarMenuMovil();
  await actualizarSesion();
  mostrarAviso();
  activarVolverArriba();
}
iniciar();