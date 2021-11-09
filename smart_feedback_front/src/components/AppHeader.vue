<template>
    <v-app-bar
      color="rgb(36,41,47)"
      dark
      :flat = "isFlat"
    >
      <router-link to="/">
        <v-img
          style="margin-left:25px;margin-right:10px;"
          src="../assets/skku_logo.png"
          max-height="60"
          max-width="60"
          contain
        ></v-img>
        </router-link>
      <v-toolbar-title>Smart Feedback System</v-toolbar-title>
      
      <router-link to="/my_page"><v-btn style="margin-left:20px;" text v-if="$store.state.user !== null && $store.state.isAdmin == false">My Page</v-btn></router-link>
      <router-link to="/problem_lecture_list"><v-btn style="margin-left:20px;" text v-if="$store.state.user !== null && $store.state.isAdmin == true">Manage Problem</v-btn></router-link>
      <router-link to="/lecture_list"><v-btn style="margin-left:10px;" text v-if="$store.state.user !== null && $store.state.isAdmin == true">Manage Lecture</v-btn></router-link>
      <v-spacer/>
      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
        <v-btn 
            icon
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
        <v-list v-else>
        <v-list-item
            v-for="(session_item, index) in session_items"
            :key="index"
            @click="go(session_item)"
        >
            <v-list-item-title> {{ session_item.title }} </v-list-item-title>
        </v-list-item>
        </v-list>
    </v-menu>
    </v-app-bar>
</template>
<script>

export default {
  props: {
      isFlat : Boolean,
      isMiddle : Boolean,
  },
  data: () => ({
    items: [
      { title: 'Submit', link: '/submit' },
    ],
    login_items: [
      { title: 'Login', link: '/login' },
      { title: 'Sing Up', link: '/signup' },
    ],
    session_items: [
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
