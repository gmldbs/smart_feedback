<template>
    <div class="background">
    <v-container>
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
                            color="white"
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
            </v-col>
        </v-row>
    </v-container>
    <v-container>
        <v-row class="text-center">
        <v-col cols="12" style="margin-top:10%">
            <v-img
            :src="require('../assets/skku_logo.png')"
            class="my-3"
            contain
            height="200"
            />
        </v-col>

        <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3" style="color:white">
            Welcome to Smart Feedback System
            </h1>

            <p class="subheading font-weight-regular" style="color:white">
            This is SKKU Smart Feedback System,
            <br> You can join us
            <a
                href="https://cs.skku.edu/ko/"
                target="_blank"
            >SKKU Software</a>
            </p>
        </v-col>
        </v-row>
    </v-container>
    </div>
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
      { title: 'Firebase Test', link: '/firebase_test'},
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
<style>
.background {
  min-height:100vh;
  background-image: linear-gradient(to left, #434343 0%, black 100%);
  background-size:cover;
}
</style>
