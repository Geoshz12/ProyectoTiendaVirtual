// Variables globales
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contadorCarrito = document.getElementById("contador-carrito");
const usuarioInput = document.getElementById("usuario");
const contraseñaInput = document.getElementById("contraseña");
const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));

// Función para guardar el carrito en Local Storage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para actualizar el contador del carrito
function actualizarContador() {
  const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  contadorCarrito.textContent = totalProductos;
}

// Función para manejar el inicio de sesión
function iniciarSesion(event) {
  event.preventDefault(); // Prevenir que el formulario se recargue al enviar

  const usuario = usuarioInput.value.trim();
  const contraseña = contraseñaInput.value.trim();

  // Aquí puedes agregar la lógica de validación con un servidor o verificar contra un archivo predefinido
  if (usuario === "fran" && contraseña === "123456") {
    // Simulando un usuario autenticado
    alert("Inicio de sesión exitoso. ¡Bienvenido!");

    // Guardar el usuario en Local Storage para usarlo en otras páginas
    localStorage.setItem("usuario", JSON.stringify({ usuario }));

    // Cerrar el modal de inicio de sesión
    modalLogin.hide();

    // Cambiar el icono de "Mi Cuenta" para reflejar que el usuario ha iniciado sesión
    const cuentaLink = document.querySelector(".text-center.me-3 a");
    cuentaLink.innerHTML = `<i class="fas fa-user fs-4"></i><div>Bienvenido, ${usuario}</div>`;
  } else {
    alert("Usuario o contraseña incorrectos. Por favor, intenta nuevamente.");
  }
}

// Asignar el evento al formulario de inicio de sesión
const formularioLogin = document.getElementById("formLogin");
formularioLogin.addEventListener("submit", iniciarSesion);

// Actualizar el contador del carrito al cargar la página
actualizarContador();

// Verificar si el usuario está logueado y mostrar la información
window.onload = function() {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  if (usuarioGuardado) {
    // Si hay un usuario guardado, mostrar su nombre en el enlace de "Mi Cuenta"
    const cuentaLink = document.querySelector(".text-center.me-3 a");
    cuentaLink.innerHTML = `<i class="fas fa-user fs-4"></i><div>Bienvenido, ${usuarioGuardado.usuario}</div>`;
  }
};
