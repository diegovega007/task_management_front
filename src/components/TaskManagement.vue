<template>
  <v-container class="task-container">
    <h2 class="text-center">Gestor de Tareas</h2>

    <!-- Formulario para agregar nuevas tareas -->
    <v-form @submit.prevent="addTask" class="task-form">
      <v-text-field
        v-model="newTask.title"
        label="Título de la tarea"
        placeholder="Título de la tarea"
        required
      ></v-text-field>
      <v-text-field
        v-model="newTask.description"
        label="Descripción"
        placeholder="Descripción"
        required
      ></v-text-field>
      <v-btn color="primary" type="submit">Agregar Tarea</v-btn>
    </v-form>

    <!-- Tabla de tareas -->

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Título</th>
          <th class="text-left">Descripción</th>
          <th class="text-left">Estatus</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tasks" :key="item.id">
          <td style="width: 25%;"> {{item.title}} </td>
          <td style="width: 25%;"> {{ item.description }} </td>
          <td style="width: 25%;"> {{ item.status ? 'Atendido' : 'Pendiente' }} </td>
          <td  style="width: 25%;"> 
            <div class="d-flex justify-center">
              <v-btn color="primary" @click="openEditModal(item)" class="mr-2" >Editar</v-btn>
              <v-btn color="error" @click="deleteTask(item.id)">Eliminar</v-btn>
            </div>
          </td>

        </tr>
      </tbody>
    </v-table>

    <!-- Mensaje si no hay tareas -->
    <v-alert v-if="errorMessage" type="error" dismissible>
      {{ errorMessage }}
    </v-alert>

    <v-alert v-if="tasks.length === 0" class="no-tasks" type="info">
      No hay tareas registradas.
    </v-alert>
 

    <!-- Modal de edición -->
    <v-dialog v-model="editModalOpen" max-width="600">
      <v-card>
        <v-card-title>Editar Tarea</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateTask">
            <v-text-field v-model="editedTask.title" label="Título de la tarea" required></v-text-field>
            <v-text-field v-model="editedTask.description" label="Descripción"></v-text-field>
            <v-checkbox v-model="editedTask.status" label="Estatus"></v-checkbox>
            <v-btn color="primary" type="submit">Guardar Cambios</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import api from '../config';
import { useRouter } from 'vue-router';

const tasks = ref([]);
const newTask = reactive({ title: '', description: '', status: false });
const editedTask = reactive({ id: null, title: '', description: '' });
const errorMessage = ref('');
const editModalOpen = ref(false);

const fetchTasks = async () => {
  try {
    const response = await api.get('/management/');
    tasks.value = response.data.data;
  } catch (error) {
    console.error('Error al cargar las tareas:', error);
    errorMessage.value = 'Error al cargar las tareas. Favor de hacer login o intentar más tarde.';
  }
};

const addTask = async () => {
  try {
    const response = await api.post('/management/', newTask);
    tasks.value.push(response.data.data);
    newTask.title = '';
    newTask.description = '';
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    errorMessage.value = 'Error al agregar la tarea';
  }
};

const openEditModal = (task) => {
  editedTask.id = task.id;
  editedTask.title = task.title;
  editedTask.description = task.description;
  editedTask.status = task.status;
  editModalOpen.value = true;
};

const updateTask = async () => {
  try {
    await api.put(`/management/${editedTask.id}`, editedTask);
    const index = tasks.value.findIndex(task => task.id === editedTask.id);
    if (index !== -1) {
      tasks.value[index].title = editedTask.title;
      tasks.value[index].description = editedTask.description;
      tasks.value[index].status = editedTask.status;
    }
    editModalOpen.value = false;
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    errorMessage.value = 'Error al actualizar la tarea';
  }
};

const deleteTask = async (id) => {
  try {
    await api.delete(`/management/${id}`);
    tasks.value = tasks.value.filter(task => task.id !== id);
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    errorMessage.value = 'Error al eliminar la tarea';
  }
};

// Opcional: Implementar redirección si el usuario no está autenticado
const router = useRouter();
const redirectIfNotAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  }
};

fetchTasks(); // Cargar las tareas al montar el componente

</script>

<style scoped>
.task-container {
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.task-form {
  margin-bottom: 20px;
}

.task-list {
  margin-top: 20px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 4px;
}

.task-item .task-item-body {
  flex: 1;
  font-size: 18px; /* Aumentar el tamaño de la fuente */
}

.task-item-header {
  font-weight: bold; /* Texto en negrita */
  text-align: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.no-tasks {
  text-align: center;
  padding: 20px;
  margin-top: 20px;
}

.v-dialog {
  z-index: 10000; /* Ajusta el índice z para estar por encima de otros elementos */
}
</style>