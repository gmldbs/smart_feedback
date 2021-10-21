<template>
    <v-container style="padding:0%;">
        <v-row>
            <v-col cols="18">
                <div class="d-flex align-center">
                    <router-link to="/">
                        <v-img
                        contain
                        src="../assets/skku_logo.png"
                        transition="scale-transition"
                        width="100"
                        />
                    </router-link>
                    <v-menu open-on-hover offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            text
                            v-bind="attrs"
                            v-on="on"
                            style="margin-left: 10%"
                        >
                            Contents
                        </v-btn>
                    </template>
                    <v-list>
                    <v-list-item
                        v-for="(item, index) in items"
                        :key="index"
                        @click="go(item)"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                    </v-list>
                    </v-menu>
                </div>
            </v-col>
            <v-col cols="4" align="right">
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
            </v-col>
        </v-row>
        <hr>
    </v-container>
</template>
<script>

export default {
  data: () => ({
    items: [
      { title: 'Submit', link: '/submit' },
    ],
    login_items: [
      { title: 'Login', link: '/login' },
      { title: 'Sing Up', link: '/signup' },
    ],
    session_items: [
      { title: 'My page', link: '/my_page'},
      { title: 'Log Out', link: '/log_out'},
    ],
    admin_items: [
      { title: 'Upload problem', link: '/upload_problem'},
      { title: 'Manage problem', link: '/problem_lecture_list'},
      { title: 'Manage Lecture', link: '/lecture_list'},
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
