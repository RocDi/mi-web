async function mostrarProyectos() {
  const contenedor = document.getElementById("lista-proyectos");
    contenedor.textContent = "Cargando proyectos...";

  const { data, error } = await db
    .from("proyectos")
    .select("*")
        .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    contenedor.textContent = "No se pudieron cargar los proyectos.";
    console.error(error);
    return;
  }
    contenedor.replaceChildren();

  if (data.length === 0) {
    contenedor.textContent = "Todavía no hay proyectos.";
    return;
  }
  data.forEach((proyecto) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");
        if (proyecto.imagen && proyecto.imagen.startsWith("https://")) {
      const imagen = document.createElement("img");
      imagen.src = proyecto.imagen;
      imagen.alt = proyecto.titulo;
      imagen.loading = "lazy";
      tarjeta.append(imagen);
    }

    const titulo = document.createElement("h3");
    titulo.textContent = proyecto.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = proyecto.descripcion;

    tarjeta.append(titulo, descripcion);
        if (proyecto.enlace && proyecto.enlace.startsWith("http")) {
      const enlace = document.createElement("a");
      enlace.href = proyecto.enlace;
      enlace.textContent = "Ver proyecto";
      enlace.target = "_blank";
      enlace.rel = "noopener noreferrer";
      tarjeta.append(enlace);
    }
    contenedor.append(tarjeta);
  });
}

mostrarProyectos();