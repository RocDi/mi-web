const formulario = document.getElementById("form-recuperar");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const correo = document.getElementById("correo").value.trim();

  const { error } = await db.auth.resetPasswordForEmail(correo, {
    redirectTo: new URL("restablecer.html", location.href).href,
  });

  if (error) console.error(error);

  formulario.reset();
  mensaje.textContent =
    "Si existe una cuenta con ese correo, te hemos enviado un enlace para restablecer la contraseña.";
});