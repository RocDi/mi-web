const formulario = document.getElementById("form-proyecto");
const mensaje = document.getElementById("mensaje");
const tituloForm = document.getElementById("titulo-form");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");

let idEditando = null;

function salirEdicion() {
  idEditando = null;
  formulario.reset();
  tituloForm.textContent = "Nuevo proyecto";
  btnGuardar.textContent = "Crear proyecto";
  btnCancelar.hidden = true;
}

function empezarEdicion(proyecto) {
  idEditando = proyecto.id;
  document.getElementById("titulo").value = proyecto.titulo;
  document.getElementById("descripcion").value = proyecto.descripcion;
  document.getElementById("enlace").value = proyecto.enlace || "";
  tituloForm.textContent = "Editar proyecto";
  btnGuardar.textContent = "Guardar cambios";
  btnCancelar.hidden = false;
  mensaje.textContent = "";
  formulario.scrollIntoView();
}
function filtrarLista() {
  const texto = document.getElementById("buscar").value.toLowerCase();

  document.querySelectorAll("#lista-admin .tarjeta").forEach((tarjeta) => {
    const titulo = tarjeta.querySelector("h3").textContent;
    const descripcion = tarjeta.querySelector("p").textContent;
    const contenido = (titulo + " " + descripcion).toLowerCase();

    tarjeta.hidden = !contenido.includes(texto);
  });
    const visibles = document.querySelectorAll("#lista-admin .tarjeta:not([hidden])").length;
  document.getElementById("sin-resultados").hidden = visibles > 0;
}
async function cargarLista() {
  const contenedor = document.getElementById("lista-admin");
  contenedor.replaceChildren();

  const { data, error } = await db
    .from("proyectos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    contenedor.textContent = "No se pudieron cargar los proyectos.";
    console.error(error);
    return;
  }

  data.forEach((proyecto) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");
        if (!proyecto.visible) tarjeta.classList.add("oculta");

    const titulo = document.createElement("h3");
        titulo.textContent = proyecto.visible
      ? proyecto.titulo
      : proyecto.titulo + " (oculto)";

    const descripcion = document.createElement("p");
    descripcion.textContent = proyecto.descripcion;

    const acciones = document.createElement("div");
    acciones.classList.add("acciones");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("boton-secundario");
    btnEditar.addEventListener("click", () => empezarEdicion(proyecto));

    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Borrar";
    btnBorrar.classList.add("boton-peligro");
        btnBorrar.addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres borrar este proyecto?")) return;

      const { error } = await db
        .from("proyectos")
        .delete()
        .eq("id", proyecto.id);

      if (error) {
        mensaje.textContent = "No se pudo borrar el proyecto.";
        console.error(error);
        return;
      }

      cargarLista();
    });
      filtrarLista();

          const btnVisible = document.createElement("button");
    btnVisible.textContent = proyecto.visible ? "Ocultar" : "Mostrar";
    btnVisible.classList.add("boton-secundario");
    btnVisible.addEventListener("click", async () => {
      const { error } = await db
        .from("proyectos")
        .update({ visible: !proyecto.visible })
        .eq("id", proyecto.id);

      if (error) {
        mensaje.textContent = "No se pudo cambiar la visibilidad.";
        console.error(error);
        return;
      }

      cargarLista();
    });
        acciones.append(btnEditar, btnVisible, btnBorrar);
    tarjeta.append(titulo, descripcion, acciones);
    contenedor.append(tarjeta);
  });
}

async function iniciarAdmin() {
  const { data } = await db.auth.getSession();
    if (!data.session || data.session.user.id !== ADMIN_ID) {
    location.href = "login.html";
    return;
  }
    document.getElementById("buscar").addEventListener("input", filtrarLista);

    btnCancelar.addEventListener("click", salirEdicion);
  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
        btnGuardar.disabled = true;

    const proyecto = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      enlace: document.getElementById("enlace").value || null,
    };

        let error;
    if (idEditando) {
      ({ error } = await db
        .from("proyectos")
        .update(proyecto)
        .eq("id", idEditando));
    } else {
      ({ error } = await db.from("proyectos").insert(proyecto));
    }
        btnGuardar.disabled = false;

    if (error) {
      mensaje.textContent = "No se pudo guardar el proyecto.";
      console.error(error);
      return;
    }

        mensaje.textContent = idEditando ? "Cambios guardados." : "Proyecto creado.";
    salirEdicion();
    cargarLista();
  });

  cargarLista();
}

iniciarAdmin();