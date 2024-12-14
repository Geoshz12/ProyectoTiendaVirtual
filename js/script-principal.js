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





// script para cambiar colocar el nombre del usuario al iniciar sesion

document.addEventListener("DOMContentLoaded", function () {
  // Seleccionamos el botón "ACCEDER" del modal
  const btnAcceder = document.querySelector("#modalLogin .btn-primary");

  // Seleccionamos los campos de usuario y el elemento donde cambiaremos el texto
  const inputUsuario = document.getElementById("usuario");
  const nombreUsuarioDisplay = document.getElementById("nombreUsuario");

  // Agregamos un evento de clic al botón "ACCEDER"
  btnAcceder.addEventListener("click", function (event) {
    event.preventDefault(); // Evitamos el envío del formulario

    const nombreUsuario = inputUsuario.value.trim(); // Obtenemos el valor del campo usuario

    if (nombreUsuario) {
      // Cambiamos el texto de "Mi Cuenta" por el nombre ingresado
      nombreUsuarioDisplay.textContent = nombreUsuario;

      // Cerramos el modal
      const modalElement = document.getElementById("modalLogin");
      const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
      modalBootstrap.hide();
    } else {
      // Si no se ingresa un usuario, mostramos una alerta
      alert("Por favor, ingresa un nombre de usuario.");
    }
  });
});

