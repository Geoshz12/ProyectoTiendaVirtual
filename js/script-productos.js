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

  let productos = []; // Almacenar productos globalmente
  let categorias = []; // Almacenar categorías globalmente
  let marcas = []; // Almacenar marcas globalmente
  let ram = []; // Almacenar opciones de RAM globalmente
  let categoriaActual = obtenerCategoriaDeURL(); // Obtener categoría de la URL



  // ============================
  // Función para cargar datos iniciales
  // ============================
  async function cargarDatosIniciales() {
    try {
      const response = await fetch("js/productos.json");
      const data = await response.json();
      
      productos = data.productos;
      categorias = data.categorias;
      marcas = data.marcas;
      ram = data.ram; // Cargar datos de RAM

      // Configurar navegación de categorías
      configurarNavegacionCategorias();
      
      // Cargar marcas
      cargarMarcas();

      // Cargar opciones de RAM
      cargarRAM();
      
      // Cargar productos de la categoría inicial
      cargarProductos(categoriaActual);
    } catch (error) {
      console.error("Error cargando datos:", error);
      productosContainer.innerHTML = "<p>Error al cargar los datos.</p>";
    }
  }




  // ============================
  // Función para obtener la categoría desde la URL
  // ============================
  function obtenerCategoriaDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('categoria') || 'laptops'; // Si no hay categoría en la URL, se pone "laptops" por defecto
  }

  // ============================
  // Configurar navegación de categorías
  // ============================
  function configurarNavegacionCategorias() {
    menuCategorias.addEventListener("click", function(event) {
      const categoriaLink = event.target.closest('a');
      if (categoriaLink) {
        event.preventDefault();
        const nuevaCategoria = categoriaLink.getAttribute('href').split('=')[1];
        cambiarCategoria(nuevaCategoria);
      }
    });
  }



  // ============================
  // Cambiar categoría sin recargar
  // ============================
  function cambiarCategoria(nuevaCategoria) {
    categoriaActual = nuevaCategoria;
    
    // Actualizar URL en la barra de direcciones
    history.pushState(null, '', `tienda.html?categoria=${nuevaCategoria}`);
    
    // Actualizar título de categoría
    const categoria = categorias.find(cat => cat.id === categoriaActual);
    tituloCategoria.textContent = categoria ? categoria.nombre : "Productos";
    
    // Reiniciar filtros
    busquedaInput.value = "";
    precioRango.value = precioRango.max;
    precioValor.textContent = `S/ ${precioRango.value}`;
    
    // Desmarcar todas las marcas
    marcasContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Recargar productos
    cargarProductos(categoriaActual);
  }





  // ============================
  // Cargar productos
  // ============================
  function cargarProductos(categoriaFiltro) {
    const textoBusqueda = busquedaInput.value.toLowerCase();

    const marcasSeleccionadas = Array.from(
      marcasContainer.querySelectorAll('input[type="checkbox"]:checked')
    ).map(checkbox => checkbox.value);

    const ramsSeleccionadas = Array.from(
      ramsContainer.querySelectorAll('input[type="checkbox"]:checked')
    ).map(checkbox => checkbox.value);


    const productosFiltrados = productos.filter(prod => 
      prod.categoria_id === categoriaFiltro &&
      parseFloat(prod.precio) <= parseFloat(precioRango.value) &&
      (marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(prod.marca_id)) &&
      (ramsSeleccionadas.length === 0 || ramsSeleccionadas.includes(prod.ram_id)) &&
      prod.nombre.toLowerCase().includes(textoBusqueda)
    );

    productosContainer.innerHTML = productosFiltrados.map(prod => `
      <li class="producto" data-marca="${prod.marca_id}">
        <img class="producto-imagen" src="${prod.imagen}" alt="${prod.nombre}">
        <p class="nombre-marca">${prod.marca_id}</p>
        <h3 class="nombre-producto">${prod.nombre}</h3>
        <p class="precio-producto"><strong>S/ ${prod.precio}</strong></p>
        <button class="boton-agregar" onclick="agregarProducto('${prod.nombre}', '${prod.descripcion}', ${prod.precio}, '${prod.imagen}')">
          <span class="boton-texto">AGREGAR AL CARRITO</span>
          <i class="fas fa-shopping-cart boton-icono"></i>
        </button>
      </li>
    `).join('');

    actualizarCarrito();
  }




  // ============================
  // Cargar marcas
  // ============================
  function cargarMarcas() {
    marcasContainer.innerHTML = marcas.map(marca => `
      <label class="checkbox-marca">
        <input type="checkbox" value="${marca.id}">
        ${marca.nombre}
      </label>
    `).join('');

    // Añadir evento de cambio para filtrar
    marcasContainer.addEventListener("change", () => cargarProductos(categoriaActual));
  }


    // ============================
  // Cargar rams
  // ============================
  function cargarRAM() {
    ramsContainer.innerHTML = ram.map(ram => `
      <label class="checkbox-ram">
        <input type="checkbox" value="${ram.id}">
        ${ram.nombre}
      </label>
    `).join('');

    // Añadir evento de cambio para filtrar
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

  precioRango.addEventListener("input", (e) => {
    precioValor.textContent = `S/ ${e.target.value}`;
    cargarProductos(categoriaActual);
  });

  busquedaInput.addEventListener("input", () => {
    cargarProductos(categoriaActual);
  });






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
  }

  function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorCarrito.textContent = totalProductos;
  }

  // Inicializar
  cargarDatosIniciales();
});
