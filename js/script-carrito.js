// Variables globales
let carritoDeCompras = JSON.parse(localStorage.getItem("carrito")) || [];
const tablaCarritoProductos = document.getElementById("lista-carrito");
const totalItemsCarrito = document.getElementById("cantidad-productos");
const cantidadTotalProductos = document.getElementById("cantidad-total");
const precioTotalCarrito = document.getElementById("total-carrito");

// Función para actualizar la vista del carrito
function actualizarVistaCarrito() {
  tablaCarritoProductos.innerHTML = ""; // Limpiar contenido previo
  let total = 0;
  let totalProductos = 0;

  carritoDeCompras.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    totalProductos += producto.cantidad;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-carrito"></td>
      <td>${producto.nombre}</td>
      <td>${producto.descripcion}</td>
      <td>S/ ${producto.precio.toFixed(2)}</td>
      <td>
        <button class="btn-cantidad" onclick="modificarCantidadProducto(${index}, -1)">-</button>
        ${producto.cantidad}
        <button class="btn-cantidad" onclick="modificarCantidadProducto(${index}, 1)">+</button>
      </td>
      <td>S/ ${subtotal.toFixed(2)}</td>
    `;
    tablaCarritoProductos.appendChild(row);
  });

    // Actualizar totales
  totalItemsCarrito.textContent = totalProductos;
  cantidadTotalProductos.textContent = totalProductos;
  precioTotalCarrito.textContent = `S/ ${total.toFixed(2)}`;
  guardarCarritoEnLocalStorage();
}

// Función para modificar la cantidad de productos
function modificarCantidadProducto(indice, cambio) {
  if (carritoDeCompras[indice].cantidad + cambio > 0) {
    carritoDeCompras[indice].cantidad += cambio;
  } else {
    carritoDeCompras.splice(indice, 1); // Eliminar producto si la cantidad es 0
  }
  actualizarVistaCarrito();
}

// Función para guardar carrito en Local Storage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
}

// Función para cargar carrito desde Local Storage
function cargarCarritoDesdeLocalStorage() {
  carritoDeCompras = JSON.parse(localStorage.getItem("carrito")) || [];
  actualizarVistaCarrito();
}

// Cargar datos del carrito al inicio
document.addEventListener("DOMContentLoaded", cargarCarritoDesdeLocalStorage);
