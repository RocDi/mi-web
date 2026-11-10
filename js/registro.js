const formulario = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const correo = document.getElementById("correo").value;
  const clave = document.getElementById("clave").value;
  const clave2 = document.getElementById("clave2").value;
    const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();

  if (!nombre || !apellidos) {
    mensaje.textContent = "Escribe tu nombre y tus apellidos.";
    return;
  }

  if (clave !== clave2) {
    mensaje.textContent = "Las contraseñas no coinciden.";
    return;
  }

  const { error } = await db.auth.signUp({
    email: correo,
    password: clave,
        options: {
      emailRedirectTo: new URL("login.html", location.href).href,
      data: { nombre, apellidos },
    },
  });

  if (error) {
    mensaje.textContent = "No se pudo crear la cuenta. Prueba con otra contraseña o más tarde.";
    console.error(error);
    return;
  }

  formulario.reset();
  mensaje.textContent = "Cuenta creada. Revisa tu correo y pulsa el enlace para confirmarla.";
});