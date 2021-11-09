<template>
  <div>
    <app-header/>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="8"
        >
          <h1>Lecture List</h1>
        </v-col>
      </v-row>
      <hr>
      <div>
        <v-row class="ma-2">
          <v-col md="4" class="pa-3 d-flex flex-column" v-for="lecture in lectures" :key="lecture['.key']">
            <v-hover v-slot="{ hover }" open-delay="30" close-delay="30">
              <div style="border-top: 0.5px solid rgb(199,199,199);">
                <button @click="LectureProblemList(lecture)" style="text-align : left">
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
  </v-container>
  
  <app-footer/>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: '',
    lectures : [],
    headers: [
        {
            text: 'Problem Name',
            align: 'start',
            value: 'problem_name'
        },
        {
            text: 'Professor',
            value: 'admin'
        },
        {
            text: 'Due Date',
            value: 'due_date'
        }
    ],
  }),
  firestore () {
    return {
        lectures : this.$firebase.firestore().collection('Lectures').where("students", "array-contains", this.$store.state.student_id)
    }
  },
  methods: {
    LectureProblemList(lecture) {
        console.log(lecture)
        this.$router.push("/problems/"+lecture['.key'])
    },
    test() {
        console.log(this.$store.state.student_id)
    }
  },
  watch: {
  }
}
</script>