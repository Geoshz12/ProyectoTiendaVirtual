document.addEventListener("DOMContentLoaded", function () {
  // ============================
  // Selección de elementos del DOM
  // ============================
  const productosContainer = document.querySelector("#lista-productos");
  const tituloCategoria = document.querySelector("#titulo-categoria");
  const marcasContainer = document.querySelector("#marcas");
  const ramsContainer = document.querySelector("#ram");
  const precioRango = document.querySelector("#precio-rango");
  const precioValor = document.querySelector(".precio-valor");
  const btnAlternarMarcas = document.querySelector("#alternar-marcas");
  const btnAlternarRams = document.querySelector("#alternar-ram");
  const busquedaInput = document.querySelector("#busqueda-categoria");
  const contadorCarrito = document.querySelector("#contador-carrito");
  const menuCategorias = document.querySelector("#menu-categorias");

  let productos = [];
  let categorias = [];
  let marcas = [];
  let ram = [];
  let categoriaActual = obtenerCategoriaDeURL();

  // ============================
  // Función para cargar datos iniciales
  // ============================
  function cargarDatosIniciales() {
    fetch("js/productos.json")
      .then(response => response.json())
      .then(data => {
        productos = data.productos;
        categorias = data.categorias;
        marcas = data.marcas;
        ram = data.ram;

        configurarNavegacionCategorias();
        cargarMarcas();
        cargarRAM();
        cargarProductos(categoriaActual);
      })
      .catch(error => {
        console.error("Error cargando datos:", error);
        productosContainer.innerHTML = "<p>Error al cargar los datos.</p>";
      });
  }

  // ============================
  // Obtener categoría desde URL
  // ============================
  function obtenerCategoriaDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("categoria") || "laptops"; // Por defecto "laptops"
  }

  // ============================
  // Configurar navegación de categorías
  // ============================
  function configurarNavegacionCategorias() {
    menuCategorias.addEventListener("click", function (event) {
      const categoriaLink = event.target.closest("a");
      if (categoriaLink) {
        event.preventDefault();
        const nuevaCategoria = categoriaLink.getAttribute("href").split("=")[1];
        cambiarCategoria(nuevaCategoria);
      }
    });
  }

  // ============================
  // Cambiar categoría sin recargar
  // ============================
  function cambiarCategoria(nuevaCategoria) {
    categoriaActual = nuevaCategoria;
    history.pushState(null, "", `tienda.html?categoria=${nuevaCategoria}`);
    const categoria = categorias.find(cat => cat.id === categoriaActual);
    tituloCategoria.textContent = categoria ? categoria.nombre : "Productos";
    busquedaInput.value = "";
    precioRango.value = precioRango.max;
    precioValor.textContent = `S/ ${precioRango.value}`;
    marcasContainer.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
      checkbox.checked = false;
    });
    cargarProductos(categoriaActual);
  }

  // ============================
  // Cargar productos
  // ============================
  function cargarProductos(categoriaFiltro) {
    const textoBusqueda = busquedaInput.value.toLowerCase();
    const marcasSeleccionadas = Array.from(
      marcasContainer.querySelectorAll("input[type='checkbox']:checked")
    ).map(checkbox => checkbox.value);
    const ramsSeleccionadas = Array.from(
      ramsContainer.querySelectorAll("input[type='checkbox']:checked")
    ).map(checkbox => checkbox.value);

    const productosFiltrados = productos.filter(
      prod =>
        prod.categoria_id === categoriaFiltro &&
        parseFloat(prod.precio) <= parseFloat(precioRango.value) &&
        (marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(prod.marca_id)) &&
        (ramsSeleccionadas.length === 0 || ramsSeleccionadas.includes(prod.ram_id)) &&
        prod.nombre.toLowerCase().includes(textoBusqueda)
    );

    productosContainer.innerHTML = productosFiltrados
      .map(
        prod => `
      <li class="producto" data-marca="${prod.marca_id}">
        <img class="producto-imagen" src="${prod.imagen}" alt="${prod.nombre}">
        <p class="nombre-marca">${prod.marca_id}</p>
        <h3 class="nombre-producto">${prod.nombre}</h3>
        <p class="precio-producto"><strong>S/ ${parseFloat(prod.precio).toFixed(2)}</strong></p> 
        <button class="boton-agregar" onclick="agregarProducto('${prod.nombre}', '${prod.descripcion}', ${prod.precio}, '${prod.imagen}')">
          <span class="boton-texto">AGREGAR AL CARRITO</span>
          <i class="fas fa-shopping-cart boton-icono"></i>
        </button>
      </li>
    `
      )
      .join("");

    actualizarCarrito();
  }

  // ============================
  // Cargar marcas y RAM
  // ============================
  function cargarMarcas() {
    marcasContainer.innerHTML = marcas
      .map(
        marca => `
      <label class="checkbox-marca">
        <input type="checkbox" value="${marca.id}">
        ${marca.nombre}
      </label>
    `
      )
      .join("");
    marcasContainer.addEventListener("change", () => cargarProductos(categoriaActual));
  }

  function cargarRAM() {
    ramsContainer.innerHTML = ram
      .map(
        ram => `
      <label class="checkbox-ram">
        <input type="checkbox" value="${ram.id}">
        ${ram.nombre}
      </label>
    `
      )
      .join("");
    ramsContainer.addEventListener("change", () => cargarProductos(categoriaActual));
  }

  // ============================
  // Eventos de interacción
  // ============================
  btnAlternarMarcas.addEventListener("click", () => {
    marcasContainer.classList.toggle("oculto");
  });

  btnAlternarRams.addEventListener("click", () => {
    ramsContainer.classList.toggle("oculto");
  });

  precioRango.addEventListener("input", e => {
    precioValor.textContent = `S/ ${e.target.value}`;
    cargarProductos(categoriaActual);
  });

  busquedaInput.addEventListener("input", () => cargarProductos(categoriaActual));

  // ============================
  // Funciones de carrito
  // ============================
  window.agregarProducto = function (nombre, descripcion, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre, descripcion, precio, imagen, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();

    // Mostrar alerta al agregar producto
    alert(`Producto agregado: ${nombre}`);
  };

  function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorCarrito.textContent = totalProductos;
  }

  // Inicializar
  cargarDatosIniciales();
});


window.onload = function() {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  if (usuarioGuardado) {
    const cuentaLink = document.querySelector(".text-center.me-3 a");
    cuentaLink.innerHTML = `<i class="fas fa-user fs-4"></i><div>Bienvenido, ${usuarioGuardado.usuario}</div>`;
  } else {
    // Si no hay usuario guardado, mostrar el enlace de inicio de sesión
    const cuentaLink = document.querySelector(".text-center.me-3 a");
    cuentaLink.innerHTML = `<i class="fas fa-sign-in-alt fs-4"></i><div>Iniciar sesión</div>`;
  }
};
