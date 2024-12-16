// Variables globales
let carritoDeCompras = JSON.parse(localStorage.getItem("carrito")) || [];
const tablaCarritoProductos = document.getElementById("lista-carrito");
const totalItemsCarrito = document.getElementById("cantidad-productos");
const cantidadTotalProductos = document.getElementById("cantidad-total");
const precioTotalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

// Función para actualizar la vista del carrito
function actualizarVistaCarrito() {
  tablaCarritoProductos.innerHTML = ""; // Limpiar contenido previo
  let total = 0;
  let totalProductos = 0;

  // Iterar sobre los productos del carrito y crear las filas
  carritoDeCompras.forEach((producto, index) => {
    const fila = document.createElement("tr");

    // Crear columnas para cada producto
    fila.innerHTML = `
      <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
      <td>${producto.nombre}</td>
      <td>${producto.descripcion}</td>
      <td>S/ ${producto.precio.toFixed(2)}</td>
      <td>
        <button class="btn btn-outline-secondary btn-sm" onclick="actualizarCantidad('restar', ${index})">-</button>
        <span id="cantidad-producto-${index}">${producto.cantidad}</span>
        <button class="btn btn-outline-secondary btn-sm" onclick="actualizarCantidad('sumar', ${index})">+</button>
      </td>
      <td>S/ ${(producto.precio * producto.cantidad).toFixed(2)}</td>
    `;

    tablaCarritoProductos.appendChild(fila);

    // Calcular total de productos y total en dinero
    totalProductos += producto.cantidad;
    total += producto.precio * producto.cantidad;
  });

  // Actualizar la vista de cantidad de productos y total
  totalItemsCarrito.textContent = totalProductos;
  cantidadTotalProductos.textContent = totalProductos;
  precioTotalCarrito.textContent = `S/ ${total.toFixed(2)}`;
  contadorCarrito.textContent = totalProductos; // Actualizar contador en el header
}

// Función para actualizar la cantidad de productos en el carrito
function actualizarCantidad(accion, index) {
  if (accion === 'sumar') {
    carritoDeCompras[index].cantidad++;
  } else if (accion === 'restar') {
    if (carritoDeCompras[index].cantidad > 1) {
      carritoDeCompras[index].cantidad--;
    } else {
      // Eliminar producto si la cantidad es 1 y se intenta restar
      carritoDeCompras.splice(index, 1);
    }
  }

  // Guardar los cambios en el localStorage y actualizar la vista
  localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
  actualizarVistaCarrito();
}

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
  const productoExistente = carritoDeCompras.find((item) => item.id === producto.id);

  if (productoExistente) {
    // Si el producto ya está en el carrito, aumentar la cantidad
    productoExistente.cantidad++;
  } else {
    // Si el producto no está en el carrito, agregarlo con cantidad inicial 1
    carritoDeCompras.push({ ...producto, cantidad: 1 });
  }

  // Guardar los cambios en el localStorage y actualizar la vista
  localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
  actualizarVistaCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
  carritoDeCompras = []; // Vaciar el array
  localStorage.removeItem("carrito"); // Eliminar del localStorage
  actualizarVistaCarrito(); // Actualizar la vista
}

// Función para pasar el precio total al modal de pago
function actualizarModalPago() {
  const totalCarrito = precioTotalCarrito.textContent;
  document.getElementById("monto").value = totalCarrito; // Pasar el total al input del modal
}

// Actualizar el monto total en el modal de pago al abrir
document.querySelector('.btn-continuar').addEventListener('click', actualizarModalPago);

// Procesar el pago (simulado) al enviar el formulario
document.getElementById('formPago').addEventListener('submit', function (event) {
  event.preventDefault(); // Evitar recargar la página

  // Simular el procesamiento del pago
  alert('Pago realizado con éxito');

  // Vaciar el carrito en memoria y en localStorage
  carritoDeCompras = [];
  localStorage.removeItem("carrito");

  // Actualizar la vista para reflejar el carrito vacío
  actualizarVistaCarrito();

  // Cerrar el modal después del pago
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalPago'));
  modal.hide();
});

// Llamar a la función de vista inicial del carrito cuando cargue la página
actualizarVistaCarrito();


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
