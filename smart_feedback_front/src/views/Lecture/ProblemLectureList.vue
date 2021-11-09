<template>
  <div>
    <app-header/>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="problem_title">Select Lecture </h1>
        </v-col>
        <v-col>
          <v-row>
            <v-col>
              <v-switch
                v-model="show_datatable"
                label="Data Table"
              ></v-switch>
            </v-col>
            <v-col>
              <v-switch
                v-model="show_cards"
                label="Cards List"
              ></v-switch>
            </v-col>
          </v-row>
        </v-col> 
      </v-row>
      <hr>
      <div v-if="show_cards">
        <v-row class="ma-2">
          <v-col md="4" class="pa-3 d-flex flex-column" v-for="lecture in lecture_list" :key="lecture['.key']">
            <v-hover v-slot="{ hover }" open-delay="30" close-delay="30">
              <div style="border-top: 0.5px solid rgb(199,199,199);">
                <button @click="handleClick(lecture)" style="text-align : left">
                  <v-card class="card-design flex d-flex flex-column" :elevation="hover ? 5 : 0" :class="{ 'on-hover': hover }">
                    <v-card-text>
                        <div>{{lecture.year}}년도 - {{lecture.semester}}학기</div>
                        <p class="text-h5 text--primary">
                          {{lecture.lecture_name}}
                        </p>
                        <p>Professor {{lecture.admin_name}}</p>
                        <div class="text--primary">
                          {{lecture.lecture_description}}
                        </div>
                      </v-card-text>
                  </v-card>
                </button>
              </div>
            </v-hover>
          </v-col>
        </v-row>
      </div>
      <v-card v-if="show_datatable">
        <v-card-title>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
        </v-card-title>
        <v-data-table
        :headers="headers"
        :items="lecture_list"
        :search="search"
        @click:row="handleClick"
        ></v-data-table>
      </v-card>
    </v-container>
  <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../../components/AppHeader.vue'
export default {
  components: { AppHeader },
  data: () => ({
    search: '',
    headers: [
        {
            text: 'Lecture Name',
            align: 'start',
            value: 'lecture_name'
        },
        {
            text: 'year',
            value: 'year'
        },
        {
            text: 'semester',
            value: 'semester'
        }
    ],
    lecture_list: [],
    show_datatable: false,
    show_cards: true,
  }),
  firestore () {
    return {
        lecture_list : this.$firebase.firestore().collection('Lectures').where("admin", "==", this.$store.state.user)
    }
  },
  methods: {
    handleClick(val) {
        console.log(val)
        this.$router.push('/problem_list/'+val['.key'])
    },
  },
  watch: {
  }
}
</script>