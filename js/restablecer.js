const formulario = document.getElementById("form-restablecer");
const mensaje = document.getElementById("mensaje");

async function iniciarRestablecer() {
  const { data } = await db.auth.getSession();

  if (!data.session) {
    mensaje.innerHTML = "";
    const aviso = document.createElement("span");
    aviso.textContent = "El enlace no es válido o ha caducado. ";
    const enlace = document.createElement("a");
    enlace.href = "recuperar.html";
    enlace.textContent = "Pide uno nuevo.";
    mensaje.append(aviso, enlace);
    return;
  }

  formulario.hidden = false;

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const clave = document.getElementById("clave").value;
    const clave2 = document.getElementById("clave2").value;

    if (clave !== clave2) {
      mensaje.textContent = "Las contraseñas no coinciden.";
      return;
    }

    const { error } = await db.auth.updateUser({ password: clave });

    if (error) {
      mensaje.textContent = "No se pudo cambiar la contraseña. Prueba con otra o pide un enlace nuevo.";
      console.error(error);
      return;
    }

    mensaje.textContent = "Contraseña cambiada. Te llevamos a la página de inicio...";
    setTimeout(() => (location.href = "index.html"), 1500);
  });
}

iniciarRestablecer();