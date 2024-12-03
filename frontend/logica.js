const url = "http://localhost:3001/api/empleados";
const contenedor = document.querySelector('tbody');
const modalempleado = new bootstrap.Modal(document.getElementById('modalempleado'));
const formempleado = document.getElementById('formempleado');
const buscarInput = document.getElementById('buscarInput');
const filtroArea = document.getElementById('filtroArea');
const filtroCargo = document.getElementById('filtroCargo');
let empleados = [];
let idEmpleado = null;
let opcion = '';

// Función para formatear la fecha
const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

// Cargar empleados
const cargarEmpleados = () => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            empleados = data; // Guardar todos los empleados para búsquedas y filtros
            mostrarEmpleados(data);
        });
};

// Mostrar empleados en la tabla
const mostrarEmpleados = (lista) => {
    let resultados = '';
    lista.forEach(emp => {
        resultados += `<tr>
            <td>${emp.id}</td>
            <td>${emp.cedula}</td>
            <td>${emp.nombre}</td>
            <td>${emp.cargo}</td>
            <td>${emp.area}</td>
            <td>${emp.salario}</td>
            <td>${formatearFecha(emp.fecha_ingreso)}</td>
            <td>
                <button class="btn btn-primary btn-editar" data-id="${emp.id}">Editar</button>
                <button class="btn btn-danger btn-eliminar" data-id="${emp.id}">Eliminar</button>
            </td>
        </tr>`;
    });
    contenedor.innerHTML = resultados;
};

// Buscar empleados por nombre o cédula
buscarInput.addEventListener('input', () => {
    const busqueda = buscarInput.value.toLowerCase();
    const resultados = empleados.filter(emp =>
        emp.nombre.toLowerCase().includes(busqueda) || emp.cedula.includes(busqueda)
    );
    mostrarEmpleados(resultados);
});

// Filtrar empleados por área o cargo
[filtroArea, filtroCargo].forEach(filtro => {
    filtro.addEventListener('change', () => {
        const area = filtroArea.value;
        const cargo = filtroCargo.value;
        const resultados = empleados.filter(emp =>
            (area === '' || emp.area === area) &&
            (cargo === '' || emp.cargo === cargo)
        );
        mostrarEmpleados(resultados);
    });
});

document.getElementById("btncrear").addEventListener("click", () => {
    formempleado.reset();
    idEmpleado = null;
    opcion = 'crear';
    modalempleado.show();
});

formempleado.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        cedula: document.getElementById('cedula').value,
        nombre: document.getElementById('nombre').value,
        cargo: document.getElementById('cargo').value,
        area: document.getElementById('area').value,
        salario: document.getElementById('salario').value,
        fecha_ingreso: document.getElementById('fecha_ingreso').value,
    };

    if (opcion === 'crear') {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(() => cargarEmpleados());
    } else {
        fetch(`${url}/${idEmpleado}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(() => cargarEmpleados());
    }
    modalempleado.hide();
});

contenedor.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    if (e.target.classList.contains('btn-eliminar')) {
        fetch(`${url}/${id}`, { method: 'DELETE' }).then(() => cargarEmpleados());
    } else if (e.target.classList.contains('btn-editar')) {
        fetch(`${url}/${id}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('cedula').value = data.cedula;
                document.getElementById('nombre').value = data.nombre;
                document.getElementById('cargo').value = data.cargo;
                document.getElementById('area').value = data.area;
                document.getElementById('salario').value = data.salario;
                document.getElementById('fecha_ingreso').value = data.fecha_ingreso.split('T')[0]; // Mantener formato YYYY-MM-DD
                idEmpleado = id;
                opcion = 'editar';
                modalempleado.show();
            });
    }
});

cargarEmpleados();
