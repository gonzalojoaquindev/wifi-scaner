<template>
  <div>
    <v-app-bar app dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ text }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar color="secondary">
        <span class="white--text text-h6">{{ initials }}</span>
      </v-avatar>
      <!-- hola -->
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" disable-resize-watcher app>
      <v-list nav dense>
        <v-list-item to="/profile">
          <v-list-item-avatar
            ><v-img :src="user.avatar"></v-img
          ></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.position }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item-group v-model="group" active-class="primary">
          <v-list-item to="/supervisor/plannings">Planes semanales</v-list-item>
          <v-list-item to="/supervisor/my-plannings"
            >Planificaciones asignadas</v-list-item
          >
          <!-- <v-list-item to="/supervisor/ot">OT planificadas</v-list-item> -->
          <v-list-item to="/supervisor/pm03">PM03</v-list-item>

          <v-list-item @click="SignOut()">Cerrar Sesión</v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    user: {},
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },
  props: ["name", "avatar", "initials", "text"],
};
</script>
