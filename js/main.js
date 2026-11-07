async function cargar(id, archivo) {
    const respuesta = await fetch(archivo);
    const html = await respuesta.text();
    document.getElementById(id).innerHTML = html;
}

cargar("header", "componentes/header.html");
cargar("footer", "componentes/footer.html");