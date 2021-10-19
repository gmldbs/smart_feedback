<template>
  <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="8"
        >
          <h1>Problem List</h1>
        </v-col>
      </v-row>
      <v-card>
            <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="problem_list" :search="search">
                <template v-slot:[`item.feedback`]="{ item }" ]>
                    <v-icon @click="openFeedbackDialog(item)" v-if="item.feedback != undefined && item.feedback[$store.state.student_id] != undefined">mdi-magnify</v-icon>
                </template>
                <template v-slot:[`item.grade`]="{ item }" ]>
                    <p v-if="item.grade != undefined && item.grade[$store.state.student_id] != undefined">{{item.grade[$store.state.student_id]}}</p>
                </template>
                <template v-slot:[`item.solve`]="{ item }" ]>
                    <v-btn @click="openDialog(item)">Solve</v-btn>
                </template>
            </v-data-table>
      </v-card>
      <v-row justify="center">
        <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
        <v-overlay :value="overlay"></v-overlay>
        <v-card>
            <v-toolbar
            dark
            color="primary"
            >
            <v-btn
                icon
                dark
                @click="closeDialog()"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{selected_problem.problem_name}}</v-toolbar-title>
            </v-toolbar>
            <v-list
            three-line
            subheader
            >
            <v-subheader>Problem Discription</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <p v-html="selected_problem.problem_discription"></p>
                </v-list-item-content>
            </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list
            three-line
            subheader
            >
            <v-subheader>Write your code</v-subheader>
            <b-container>
                <b-row>
                <b-col sm="2" style="text-align: center">
                    <label for="textarea-auto-height">Python code:</label>
                </b-col>
                <b-col sm="10">
                    <b-form-textarea
                    id="textarea-auto-height"
                    placeholder="Write your code"
                    rows="20"
                    max-rows="20"
                    v-model="code"
                    ></b-form-textarea>
                </b-col>
                </b-row>

                <b-row>
                <b-col sm="2" style="text-align: center">
                    <label for="textarea-auto-height">Result</label>
                </b-col>
                <b-col sm="10">
                    <b-form-textarea
                    id="textarea-auto-height"
                    disabled
                    rows="5"
                    max-rows="5"
                    v-model="result"
                    ></b-form-textarea>
                </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <v-btn style="width:46%;margin-right:4%" outlined color="teal" @click = "run()">Run</v-btn>
                        <v-btn style="width:46%;margin-left:4%" outlined color="indigo" @click = "submit()">Submit</v-btn>
                    </b-col>
                </b-row>

            </b-container>
            </v-list>
        </v-card>
        </v-dialog>
    </v-row>
    <v-row justify="center">
        <v-dialog
        v-model="Feedback_dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
        <v-overlay :value="Feedback_overlay"></v-overlay>
        <v-card>
            <v-toolbar
            dark
            color="teal"
            >
            <v-btn
                icon
                dark
                @click="closeFeedbackDialog()"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{selected_problem.problem_name}}</v-toolbar-title>
            </v-toolbar>
            <v-list
            three-line
            subheader
            >
            <v-subheader>Problem Discription</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <p v-html="selected_problem.problem_discription"></p>
                </v-list-item-content>
            </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list
            three-line
            subheader
            >
            <v-subheader>Your code</v-subheader>
            <b-container>
                <b-row>
                <b-col sm="2" style="text-align: center">
                    <label for="textarea-auto-height">Your code:</label>
                </b-col>
                <b-col sm="10">
                    <b-form-textarea
                    id="textarea-auto-height"
                    placeholder="Write your code"
                    rows="20"
                    max-rows="20"
                    v-model="repair_info.origin_code"
                    disabled
                    ></b-form-textarea>
                </b-col>
                </b-row>

                <b-row>
                <b-col sm="2" style="text-align: center">
                    <label for="textarea-auto-height">Repair code:</label>
                </b-col>
                <b-col sm="10">
                    <b-form-textarea
                    id="textarea-auto-height"
                    placeholder="Write your code"
                    rows="20"
                    max-rows="20"
                    v-model="repair_info.repair_code"
                    disabled
                    ></b-form-textarea>
                </b-col>
                </b-row>

                <b-row>
                    <p>Origin code grade :  {{repair_info.num_correct}}/{{repair_info.num_total}}</p>
                    <p>Repair code grade :  {{grade}}</p>
                </b-row>

            </b-container>
            </v-list>
        </v-card>
        </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: '',
    problem_list : [],
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
        },
        {
            text: 'grade',
            value: 'grade'
        },
        {
            text: 'feedback',
            value: 'feedback'
        },
        {
            text: 'solve',
            value: 'solve'
        }
    ],
    dialog:false,
    overlay:false,
    Feedback_dialog: false,
    Feedback_overlay: false,
    selected_problem: {},
    editorConfig: {
    },
    code: '',
    result: '',
    repair_info: {},
    grade : ''
  }),
  firestore () {
    return {
        problem_list : this.$firebase.firestore().collection('Problems').where("lecture_key", "==", this.$route.params.lecture_key)
    }
  },
  created () {
    
  },
  methods: {
    closeDialog() {
      this.dialog = false
    },
    openDialog(problem) {
      this.dialog= true
      this.selected_problem = problem
    },
    submit () {
        var student_id = this.$store.state.student_id
        this.$http.post('/api/submit_code', { code: this.code, problem: this.selected_problem.problem_name, student_id: this.$store.state.student_id })
        .then((response) => {
            alert("Correct case : "+response.data.correct+" in Total : "+response.data.total)
            this.$firebase.firestore().collection('Problems').doc(this.selected_problem['.key']).set(
            {grade: {[student_id] : response.data.correct + '/' + response.data.total}
            },{merge:true})
        })
    },
    run () {
        console.log(this.selected_problem)
         this.$http.post('/api/run_code', { code: this.code, student_id: this.$store.state.student_id })
        .then((response) => {
            this.result = response.data
        })
    },
    openFeedbackDialog(problem) {
        console.log(problem)
      this.Feedback_dialog= true
      this.selected_problem = problem
      this.repair_info = this.selected_problem['feedback'][this.$store.state.student_id]
      console.log("before")
      console.log(this.repair_info)
      this.repair_info['origin_code'] = this.repair_info['origin_code'].split('<br/>').join('\n')
      this.repair_info['repair_code'] = this.repair_info['repair_code'].split('<br/>').join('\n')
      console.log("after")
      console.log(this.repair_info)
      this.grade = this.selected_problem['grade'][this.$store.state.student_id]
    },
    closeFeedbackDialog() {
        this.Feedback_dialog = false
        this.selected_problem = {}
    }
  },
  watch: {
  }
}
</script>
<style>
.example-vuex label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
</style>