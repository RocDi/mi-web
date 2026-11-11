async function iniciarConfiguracion() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
    location.href = "login.html";
    return;
  }

    const { data: nivel } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
  if (nivel.nextLevel === "aal2" && nivel.currentLevel !== "aal2") {
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
    // Verificación en dos pasos
  const estadoMfa = document.getElementById("estado-mfa");
  const mensajeMfa = document.getElementById("mensaje-mfa");
  const btnActivar = document.getElementById("btn-mfa-activar");
  const btnQuitar = document.getElementById("btn-mfa-quitar");
  const zonaMfa = document.getElementById("zona-mfa");
  let factorPendiente = null;

  async function mostrarEstadoMfa() {
    const { data, error } = await db.auth.mfa.listFactors();
    if (error) {
      console.error(error);
      return;
    }

    const verificado = data.totp[0];
    estadoMfa.textContent = verificado ? "Estado: activada." : "Estado: desactivada.";
    btnActivar.hidden = Boolean(verificado);
    btnQuitar.hidden = !verificado;
    btnQuitar.dataset.factor = verificado ? verificado.id : "";
  }

  btnActivar.addEventListener("click", async () => {
    mensajeMfa.textContent = "";

    const { data, error } = await db.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "app-" + Date.now(),
    });

    if (error) {
      mensajeMfa.textContent = "No se pudo iniciar la activación.";
      console.error(error);
      return;
    }

    factorPendiente = data.id;
    document.getElementById("qr-mfa").src = data.totp.qr_code;
    document.getElementById("clave-mfa").textContent = data.totp.secret;
    zonaMfa.hidden = false;
    btnActivar.hidden = true;
  });

  document.getElementById("form-mfa-verificar").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const codigo = document.getElementById("codigo-mfa").value.trim();

    const { error } = await db.auth.mfa.challengeAndVerify({
      factorId: factorPendiente,
      code: codigo,
    });

    if (error) {
      mensajeMfa.textContent = "El código no es correcto. Prueba con el siguiente que muestre la app.";
      console.error(error);
      return;
    }

    zonaMfa.hidden = true;
    document.getElementById("form-mfa-verificar").reset();
    mensajeMfa.textContent = "Verificación en dos pasos activada.";
    mostrarEstadoMfa();
  });

  btnQuitar.addEventListener("click", async () => {
    if (!confirm("¿Desactivar la verificación en dos pasos?")) return;

    const { error } = await db.auth.mfa.unenroll({ factorId: btnQuitar.dataset.factor });

    if (error) {
      mensajeMfa.textContent = "No se pudo desactivar. Prueba a cerrar sesión y volver a entrar con el código.";
      console.error(error);
      return;
    }

    mensajeMfa.textContent = "Verificación en dos pasos desactivada.";
    mostrarEstadoMfa();
  });

  mostrarEstadoMfa();
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