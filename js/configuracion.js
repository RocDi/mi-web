async function iniciarConfiguracion() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
    location.href = "login.html";
    return;
  }

  const usuario = data.session.user;
  const metadatos = usuario.user_metadata || {};

  // Nombre
  document.getElementById("nombre").value = metadatos.nombre || "";
  document.getElementById("apellidos").value = metadatos.apellidos || "";

  document.getElementById("form-nombre").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const mensaje = document.getElementById("mensaje-nombre");
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();

    if (!nombre || !apellidos) {
      mensaje.textContent = "Escribe tu nombre y tus apellidos.";
      return;
    }

    const { error } = await db.auth.updateUser({ data: { nombre, apellidos } });

    if (error) {
      mensaje.textContent = "No se pudo guardar el nombre.";
      console.error(error);
      return;
    }

    mensaje.textContent = "Nombre guardado.";
    document.getElementById("enlace-sesion").textContent = nombre;
  });

  // Correo
  document.getElementById("correo-actual").textContent = usuario.email;

  document.getElementById("form-correo").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const mensaje = document.getElementById("mensaje-correo");
    const nuevo = document.getElementById("correo-nuevo").value.trim();

    if (nuevo === usuario.email) {
      mensaje.textContent = "Ese ya es tu correo actual.";
      return;
    }

    const { error } = await db.auth.updateUser(
      { email: nuevo },
      { emailRedirectTo: new URL("login.html", location.href).href }
    );

    if (error) {
      mensaje.textContent = "No se pudo cambiar el correo.";
      console.error(error);
      return;
    }

    document.getElementById("form-correo").reset();
    mensaje.textContent =
      "Te hemos enviado un correo para confirmar el cambio. Hasta que lo confirmes, seguirás usando el correo actual.";
  });

    // Contraseña
  document.getElementById("form-clave").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const mensaje = document.getElementById("mensaje-clave");
    const actual = document.getElementById("clave-actual").value;
    const nueva = document.getElementById("clave-nueva").value;
    const nueva2 = document.getElementById("clave-nueva2").value;

    if (nueva !== nueva2) {
      mensaje.textContent = "Las contraseñas nuevas no coinciden.";
      return;
    }

    if (nueva === actual) {
      mensaje.textContent = "La nueva contraseña debe ser distinta de la actual.";
      return;
    }

    const comprobacion = await db.auth.signInWithPassword({
      email: usuario.email,
      password: actual,
    });

    if (comprobacion.error) {
      mensaje.textContent = "La contraseña actual no es correcta.";
      return;
    }

    const { error } = await db.auth.updateUser({ password: nueva });

    if (error) {
      mensaje.textContent = "No se pudo cambiar la contraseña. Prueba con otra más segura.";
      console.error(error);
      return;
    }

    document.getElementById("form-clave").reset();
    mensaje.textContent = "Contraseña cambiada.";
  });
  // Aspecto
  const guardado = localStorage.getItem("tema") || "sistema";

  document.querySelectorAll('input[name="tema"]').forEach((opcion) => {
    opcion.checked = opcion.value === guardado;
    opcion.addEventListener("change", () => {
      localStorage.setItem("tema", opcion.value);
      aplicarTema();
    });
  });
}

iniciarConfiguracion();