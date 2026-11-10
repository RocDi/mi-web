async function iniciarConfiguracion() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
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