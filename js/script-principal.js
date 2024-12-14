// Variables globales
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contadorCarrito = document.getElementById("contador-carrito");

// Función para guardar el carrito en Local Storage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para actualizar el contador del carrito
function actualizarContador() {
  const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  contadorCarrito.textContent = totalProductos;
}

// Código para inicializar eventos y cargar datos dinámicos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador(); // Actualizar el contador de productos

});

