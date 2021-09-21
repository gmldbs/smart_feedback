<template>
  <v-app>
    <v-app-bar
      app
      color="black"
      dark
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <router-link to="/">
        <v-img
          contain
          src="./assets/skku_logo_negative.png"
          transition="scale-transition"
          width="100"
        />
        </router-link>
      </div>
      <v-app-bar-title> Smart Feedback System </v-app-bar-title>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="black"
            dark
            v-bind="attrs"
            v-on="on"
          >
            Contents
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            icon 
            color="white"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list v-if="$store.state.user == null">
          <v-list-item
            v-for="(session_item, index) in login_items"
            :key="index"
            @click="go(session_item)"
          >
            <v-list-item-title> {{ session_item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list v-else-if="$store.state.isAdmin == false">
          <v-list-item
            v-for="(session_item, index) in session_items"
            :key="index"
            @click="go(session_item)"
          >
            <v-list-item-title> {{ session_item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list v-else>
          <v-list-item
            v-for="(session_item, index) in admin_items"
            :key="index"
            @click="go(session_item)"
          >
            <v-list-item-title> {{ session_item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    items: [
      { title: 'Submit' },
    ],
    login_items: [
      { title: 'Login', link: '/login' },
      { title: 'Sing Up', link: '/signup' },
    ],
    session_items: [
      { title: 'My page', link: '/'},
      { title: 'Log Out', link: '/log_out'},
    ],
    admin_items: [
      { title: 'Manage problem', link: '/problem_manage'},
      { title: 'Log Out', link: '/log_out'},
    ]
  }),
  methods: {
    go (item) {
      if(item.link=='/log_out') this.log_out()
      else this.$router.push(item.link)
    },
    log_out () {
      this.$store.commit('setUser',{email : null, isAdmin : false})
      this.$router.replace('/')
    }
  },
};
</script>
