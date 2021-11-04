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
      <v-divider></v-divider>
        <v-container fluid>
          <v-row dense>
            <v-col
              v-for="lecture in lectures"
              :key="lecture.title"
              cols="4"
            >
              <v-card
                @click="LectureProblemList(lecture)"
              >
                <v-card-text>
                  <div>{{lecture.year}}년도 - {{lecture.semester}}학기</div>
                  <p class="text-h4 text--primary">
                    {{lecture.lecture_name}}
                  </p>
                  <p>Professor {{lecture.admin_name}}</p>
                  <div class="text--primary">
                    {{lecture.lecture_description}}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
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