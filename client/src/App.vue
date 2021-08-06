<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container
        fluid
        class="pa-0"
      >
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './core/components/NavBar';

export default {
  name: 'App',

  components: {
    NavBar,
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
@import './assets/styles/global.css';
</style>