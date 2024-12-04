<template>
  <h1> {{ titulo }} </h1>
  
  <!-- Botón para alternar búsqueda por matrícula -->
  <div class="pa-4 text-center">
    <v-btn
      color="primary"
      text="Filtrar por Curso"
      @click="activarBusqueda"
    />
  </div>
  
  <!-- Campo de búsqueda y botón buscar -->
  <div
    v-if="busquedaActiva"
    class="pa-4 text-center"
  >
    <v-container class="d-flex justify-center align-center">
      <v-text-field
        v-model="matriculaBuscar"
        label="Curso"
        variant="underlined"
        class="mr-4"
      />
      <v-btn
        color="success"
        text="Buscar"
        @click="filtrarPorMatricula"
      />
    </v-container>
  </div>
  
  <!-- Botón para agregar estudiante -->
  <div class="pa-4 text-center">
    <v-btn
      color="primary"
      text="Agregar Curso"
      @click="abrirDialogoAgregar"
    />
  </div>
  
  <!-- Mensaje de error si los datos no se cargan -->
  <v-alert
    v-if="error"
    type="error"
    dismissible
  >
    Error al cargar los datos. Por favor, inténtalo de nuevo.
  </v-alert>
  
  <v-table
    v-if="datosFiltrados && !error"
    height="600px"
    fixed-header
  >
    <thead>
      <tr>
        <th class="text-left">
          Clave
        </th>
        <th class="text-left">
          Nombre
        </th>
        <th class="text-left">
          Grupo
        </th>
        <th class="text-left">
          Acciones
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="estudiante,index in datosFiltrados"
        :key="estudiante.clave"
      >
        <td> {{ estudiante.clave }} </td>
        <td> {{ estudiante.nombre }} </td>
        <td> {{ estudiante.grupo }} </td>
        <td class="d-flex fluid">
          <v-btn
            icon="mdi-pencil"
            @click="editar(estudiante,index)"
          />
          <v-btn
            icon="mdi-delete"
            @click="borrar(estudiante)"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
  <p
    v-else
    class="text-center"
  >
    <v-progress-circular
      color="primary"
      indeterminate
    />
    Cargando datos...
  </p>
  
  <div class="pa-4 text-center"> 
    <v-dialog
      v-model="dialogEditar"
      max-width="600"
    >
      <v-card
        prepend-icon="mdi-pencil"
        title="Editar Curso"
      >
        <v-container>
          <v-text-field
            v-model="datoEditar.clave"
            label="Clave"
            variant="underlined"
            readonly
          />
  
          <v-text-field
            v-model="datoEditar.nombre"
            label="Nombre"
            variant="underlined"
          />
  
          <v-text-field
            v-model="datoEditar.grupo"
            label="Grupo"
            variant="underlined"
          />
        </v-container>
  
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Close"
            variant="plain"
            @click="close"
          />
    
          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="save"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialogBorrar"
      max-width="400"
      persistent
    >
      <v-card
        prepend-icon="mdi-delete"
        text="Usted esta de acuerdo de borrar el curso con la siguiente información:"
        title="¿Desea borrar el curso?"
      >
        <v-container>
          <v-text-field
            label="Clave"
            :model-value="datoBorrar.clave"
            variant="underlined"
            readonly
          />
  
          <v-text-field
            label="Nombre"
            :model-value="datoBorrar.nombre"
            variant="underlined"
            readonly
          />
  
          <v-text-field
            label="Grupo"
            :model-value="datoBorrar.grupo"
            variant="underlined"
            readonly
          />
        </v-container>
  
        <template #actions>
          <v-spacer />
          <v-btn @click="btnNoBorrar">
            No
          </v-btn>
          <v-btn
            color="red"
            @click="btnBorrar()"
          >
            Borrar
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  
    <!-- Diálogo para agregar estudiante -->
    <v-dialog
      v-model="dialogAgregar"
      max-width="600"
    >
      <v-card
        prepend-icon="mdi-account-plus"
        title="Agregar Curso"
      >
        <v-container>
          <v-text-field
            v-model="nuevoEstudiante.clave"
            label="Clave"
            variant="underlined"
          />
          <v-text-field
            v-model="nuevoEstudiante.nombre"
            label="Nombre"
            variant="underlined"
          />
          <v-text-field
            v-model="nuevoEstudiante.grupo"
            label="Grupo"
            variant="underlined"
          />
        </v-container>
  
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Cerrar"
            @click="cerrarDialogoAgregar"
          />
          <v-btn
            color="primary"
            text="Guardar"
            @click="guardarNuevoEstudiante"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  <script setup>
      import { ref, onMounted} from 'vue';
      import { cursosService } from '@/services/api';
  
      const datos = ref([]);
      const datosFiltrados = ref([]);
      const error = ref(false);
  
      const busquedaActiva = ref(false);
      const matriculaBuscar = ref('');
  
      const dialogAgregar = ref(false);
      const nuevoEstudiante = ref({
        clave: '',
        nombre: '',
        grupo: ''
      });
  
      function activarBusqueda() {
        busquedaActiva.value = !busquedaActiva.value;
        if (!busquedaActiva.value) {
          // Cuando se desactiva la búsqueda, mostrar toda la lista
          datosFiltrados.value = datos.value;
        }
      }
  
  
      function filtrarPorMatricula() {
        if (!matriculaBuscar.value) {
          datosFiltrados.value = datos.value;
        } else {
          datosFiltrados.value = datos.value.filter(estudiante =>
            estudiante.clave.toString().includes(matriculaBuscar.value)
          );
        }
      }
  
      onMounted(async () => {
        try {
          const estudiantes = await cursosService.getAll();
          console.log(estudiantes);
          datos.value = estudiantes;
          datosFiltrados.value = estudiantes;
        } catch (err) {
          console.error('Error al cargar los estudiantes:', err);
          error.value = true;
        }
      });
  
      const titulo = ref('Tabla Cursos');
  
      /* Dialogo para editar */
      const dialogEditar = ref(false);
      const datoEditar = ref(false);
      const indexEditar = ref(-1); // Guardar el índice del dato que se está editando
  
      function editar( dato, index ){
        console.log(dato," - ",index);
        datoEditar.value = { ...dato };
        indexEditar.value = index; // Guardar el índice del dato en la lista
        dialogEditar.value = true;
      };
  
      async function save() {
  console.log('Intentando guardar los cambios...');
  
  try {
    console.log('Datos a enviar:', datoEditar.value);
    
    // Actualizar en el backend
    await cursosService.update(datoEditar.value.clave, datoEditar.value);
    
    // Actualizar en la lista original
    datos.value[indexEditar.value] = { ...datoEditar.value };

    // Sincronizar datos filtrados
    const indexFiltrado = datosFiltrados.value.findIndex(
      item => item.clave === datoEditar.value.clave
    );
    if (indexFiltrado !== -1) {
      datosFiltrados.value[indexFiltrado] = { ...datoEditar.value };
    }

    // Cerrar el diálogo
    dialogEditar.value = false;

    console.log('Guardado exitoso');
  } catch (err) {
    console.error('Error al guardar los cambios:', err);
  }
}
  
      function close(){
        dialogEditar.value = false;
      }
  
      /* Dialogo para borrar */
      const dialogBorrar = ref(false);
      const datoBorrar = ref(null);
  
      function borrar( dato ){
        console.log(dato);
        datoBorrar.value = dato;
        dialogBorrar.value = true;
      };
  
      async function btnBorrar() {
        try {
          // Enviar solicitud DELETE al backend
          await cursosService.delete(datoBorrar.value.clave);
  
          // Filtrar la lista para eliminar el dato seleccionado en el frontend
          datos.value = datos.value.filter(item => item.clave !== datoBorrar.value.clave);
          datosFiltrados.value = datos.value;
  
          // Cerrar el diálogo
          dialogBorrar.value = false;
  
          console.log('Estudiante eliminado correctamente');
        } catch (err) {
          console.error('Error al borrar el estudiante:', err);
        }
      }
  
      function btnNoBorrar(){
        dialogBorrar.value = false;
      }
  
      // Lógica para agregar un estudiante
  function abrirDialogoAgregar() {
    dialogAgregar.value = true;
  }
  
  function cerrarDialogoAgregar() {
    dialogAgregar.value = false;
    // Limpiar el objeto de nuevo estudiante para el próximo uso
    nuevoEstudiante.value = {
      clave: '',
      nombre: '',
      grupo: ''
    };
  }
  
  async function guardarNuevoEstudiante() {
    try {
      // Llamada al servicio para agregar el estudiante
      const estudianteGuardado = await cursosService.create(nuevoEstudiante.value);
  
      // Agregar el nuevo estudiante a la lista
      datos.value.push(estudianteGuardado);
      datosFiltrados.value = [...datos.value];
  
      // Cerrar el diálogo
      dialogAgregar.value = false;
      console.log('Estudiante agregado correctamente');
    } catch (err) {
      console.error('Error al agregar el estudiante:', err);
    }
  }
  
  </script>