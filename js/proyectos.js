const SUPABASE_URL = "https://dhkboitfvtsevryalyjy.supabase.co";
const SUPABASE_KEY = "sb_publishable_zLAXm3rUx1i7ALZDlluqYw_Z-8UB9bX";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function mostrarProyectos() {
  const contenedor = document.getElementById("lista-proyectos");

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

    const titulo = document.createElement("h3");
    titulo.textContent = proyecto.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = proyecto.descripcion;

    tarjeta.append(titulo, descripcion);
    contenedor.append(tarjeta);
  });
}

mostrarProyectos();