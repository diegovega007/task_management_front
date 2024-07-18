<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="4">
        <v-card class="card-task">
          <v-card-title class="text-h5">Login de Usuario</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="username"
                :rules="[rules.required]"
                label="Usuario"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="[rules.required]"
                label="Contraseña"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { RouterLink} from 'vue-router';
import { ref } from 'vue';
import api from '../config';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const valid = ref(false);
const error = ref('');
const rules = {
  required: value => !!value || 'Required.',
};
const router = useRouter();

const login = async () => {
  error.value = ''; 
  if (valid.value) {
    try {
      const response = await api.post('/login/', {
        username: username.value,
        password: password.value,
      });
      console.log(response.data.success);
      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        router.push('/task');
      } else {
        error.value = response.data.error;
      }
    } catch (err) {
      error.value = 'Ocurrio un error. Intentelo de nuevo.';
    }
  }
};
</script>

<style scoped>
.v-alert {
  margin-top: 16px;
}
</style>
