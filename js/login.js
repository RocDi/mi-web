console.log("login.js cargado");
const formulario = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");
const formCodigo = document.getElementById("form-codigo");
const mensajeCodigo = document.getElementById("mensaje-codigo");

async function irAlDestino() {
  const { data } = await db.auth.getUser();
  location.href = data.user.id === ADMIN_ID ? "admin.html" : "index.html";
}

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

  const { data: nivel } = await db.auth.mfa.getAuthenticatorAssuranceLevel();

  if (nivel.nextLevel === "aal2" && nivel.currentLevel !== "aal2") {
    formulario.hidden = true;
    formCodigo.hidden = false;
    document.getElementById("codigo").focus();
    return;
  }

  mensaje.textContent = "¡Sesión iniciada!";
  irAlDestino();
});

formCodigo.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const codigo = document.getElementById("codigo").value.trim();

  const { data: factores, error: errorFactores } = await db.auth.mfa.listFactors();

  if (errorFactores || !factores.totp.length) {
    mensajeCodigo.textContent = "No se pudo comprobar la verificación en dos pasos.";
    return;
  }

  const { error } = await db.auth.mfa.challengeAndVerify({
    factorId: factores.totp[0].id,
    code: codigo,
  });

  if (error) {
    mensajeCodigo.textContent = "Código incorrecto.";
    return;
  }

  irAlDestino();
});