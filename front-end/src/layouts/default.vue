<template>
  <v-app>
    <v-layout>
      <v-app-bar prominent>
        <v-app-bar-nav-icon
          variant="text"
          @click="onDrawer"
        />
        <v-toolbar-title>Control Escolar</v-toolbar-title>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer">
        <v-list-item
          title="Escuela"
          subtitle="Meta 4.1"
        />
        <v-divider />
        <v-list>
          <v-list-item
            prepend-icon="mdi-account-school"
            title="Estudiantes"
            to="/EstudiantesPage"
          />
          <v-list-item
            prepend-icon="mdi-account-tie"
            title="Profesores"
            to="/ProfesorPage"
          />
          <v-list-item
            prepend-icon="mdi-library-outline"
            title="Cursos"
            to="/CursosPage"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>
      <AppFooter />
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
const drawer = ref(false);

function onDrawer(){
  drawer.value = !drawer.value
}

</script>