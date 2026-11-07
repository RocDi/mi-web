console.log("login.js cargado");
const formulario = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const correo = document.getElementById("correo").value;
  const clave = document.getElementById("clave").value;

  const { error } = await db.auth.signInWithPassword({
    email: correo,
    password: clave,
  });

  if (error) {
    mensaje.textContent = "Correo o contraseña incorrectos.";
    return;
  }

  mensaje.textContent = "¡Sesión iniciada!";
});