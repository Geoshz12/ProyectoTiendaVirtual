document.addEventListener("DOMContentLoaded", () => {
  // Selecciona elementos importantes
  const inputBusqueda = document.getElementById("busqueda");
  const contenedorSugerencias = document.getElementById("sugerencias");

  let productos = [];

  // Carga el archivo JSON
  fetch("productos.json")
    .then(response => response.json())
    .then(data => {
      productos = data.productos; // Carga los productos
    })
    .catch(error => console.error("Error al cargar el archivo JSON:", error));

  // Evento de entrada en el campo de búsqueda
  inputBusqueda.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    contenedorSugerencias.innerHTML = ""; // Limpia sugerencias previas

    if (texto.trim() === "") {
      contenedorSugerencias.style.display = "none";
      return;
    }

    // Filtra productos por coincidencia
    const resultados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(texto)
    );

    if (resultados.length > 0) {
      contenedorSugerencias.style.display = "block";
      resultados.forEach(producto => {
        // Crear cada elemento de sugerencia
        const item = document.createElement("div");
        item.className = "list-group-item list-group-item-action d-flex align-items-center";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen; // Ruta de la imagen del producto
        imagen.alt = producto.nombre;
        imagen.className = "img-thumbnail me-3";
        imagen.style.width = "50px";
        imagen.style.height = "50px";

        const detalles = document.createElement("div");
        detalles.className = "flex-grow-1";

        const nombre = document.createElement("h5");
        nombre.textContent = producto.nombre;
        nombre.className = "mb-1";

        const precio = document.createElement("span");
        precio.textContent = `S/. ${parseFloat(producto.precio).toFixed(2)}`;
        precio.className = "text-success fw-bold";

        // Armar el contenido de cada sugerencia
        detalles.appendChild(nombre);
        detalles.appendChild(precio);

        item.appendChild(imagen);
        item.appendChild(detalles);

        // Evento de selección
        item.addEventListener("click", () => {
          inputBusqueda.value = producto.nombre; // Rellena el campo de búsqueda
          contenedorSugerencias.style.display = "none"; // Oculta las sugerencias
        });

        contenedorSugerencias.appendChild(item);
      });
    } else {
      contenedorSugerencias.style.display = "block";
      const mensajeNoResultados = document.createElement("div");
      mensajeNoResultados.className = "list-group-item";
      mensajeNoResultados.textContent = `Lo sentimos, pero no encontramos resultados para "${texto}".`;
      contenedorSugerencias.appendChild(mensajeNoResultados);
    }
  });

  // Ocultar sugerencias cuando el usuario haga clic fuera del campo de búsqueda
  document.addEventListener("click", (e) => {
    if (!contenedorSugerencias.contains(e.target) && e.target !== inputBusqueda) {
      contenedorSugerencias.style.display = "none";
    }
  });
});
