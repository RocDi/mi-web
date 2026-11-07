const formulario = document.getElementById("form-proyecto");
const mensaje = document.getElementById("mensaje");

async function iniciarAdmin() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
    location.href = "login.html";
    return;
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const proyecto = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      enlace: document.getElementById("enlace").value || null,
    };

    const { error } = await db.from("proyectos").insert(proyecto);

    if (error) {
      mensaje.textContent = "No se pudo crear el proyecto.";
      console.error(error);
      return;
    }

    mensaje.textContent = "Proyecto creado.";
    formulario.reset();
  });
}

iniciarAdmin();