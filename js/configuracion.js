async function iniciarConfiguracion() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
      const usuario = data.session.user;
  const metadatos = usuario.user_metadata || {};

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
    location.href = "login.html";
    return;
  }

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