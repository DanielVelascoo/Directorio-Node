document.addEventListener("DOMContentLoaded", async () => {
    const directorio = document.getElementById("directorio");
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");


    async function obtenerJerarquia() {
        try {
            const response = await fetch("http://localhost:3000/api/funcionarios");
            const data = await response.json();
            renderizarOficinas(data);
        } catch (error) {
            console.error("Error al obtener la jerarquía:", error);
        }
    }

    function renderizarOficinas(funcionarios) {
        directorio.innerHTML = "";
    
        // Crear un objeto para agrupar funcionarios por oficina
        let oficinasAgrupadas = {};
    
        funcionarios.forEach(funcionario => {
            let oficina = funcionario.Oficina || "Sin Oficina";
            if (!oficinasAgrupadas[oficina]) {
                oficinasAgrupadas[oficina] = {
                    nombre: oficina,
                    funcionarios: []
                };
            }
            oficinasAgrupadas[oficina].funcionarios.push(funcionario);
        });
    
        // Crear las tarjetas de oficina sin repetir
        Object.values(oficinasAgrupadas).forEach(oficina => {
            let tarjetaOficina = document.createElement("div");
            tarjetaOficina.classList.add("tarjeta-oficina");
            tarjetaOficina.textContent = oficina.nombre;
            tarjetaOficina.addEventListener("click", () => mostrarDetalles(oficina));
            directorio.appendChild(tarjetaOficina);
        });
    }
    

    function mostrarDetalles(oficina) {
        const modalContent = document.getElementById("modal-content");
        modalContent.innerHTML = `<h5>${oficina.nombre}</h5>`;
    
        oficina.funcionarios.forEach(funcionario => {
            let nodoFuncionario = crearNodoFuncionario(funcionario);
            modalContent.appendChild(nodoFuncionario);
        });
    
        // Activar el modal
        document.getElementById("openModalButton").click();
    }

    function crearNodoFuncionario(funcionario) {
        let divFuncionario = document.createElement("div");
        divFuncionario.classList.add("funcionario");

        divFuncionario.innerHTML = `
        <div> <span class="nombre">Nombres:</span> ${funcionario.Nombres}</div>
        <div> <span class="correo">Correo:</span> ${funcionario.Correo}</div>
        <div> <span class="celular">Celular:</span> ${funcionario.Celular || "Sin celular"}</div>
        <div> <span class="funcionalidad">Funciones:</span> ${funcionario.Funcionalidad || "Sin Función"}</div>
    `;
    

        if (funcionario.subordinados && funcionario.subordinados.length > 0) {
            let divSubordinados = document.createElement("div");
            divSubordinados.classList.add("subordinados");

            funcionario.subordinados.forEach(sub => {
                let subNodo = crearNodoFuncionario(sub);
                divSubordinados.appendChild(subNodo);
            });

            divFuncionario.appendChild(divSubordinados);
        }

        return divFuncionario;
    }

     

    

    obtenerJerarquia();
});
