<template>
  <div>
    <app-header/>
    <v-container>
      <h3 style="margin-top:30px;margin-bottom:30px">{{lecture_info.lecture_name}}</h3> 
      <div style="border-top: 0.5px solid rgb(199,199,199)" v-bind:key = "i" v-for="(problem,i) in problem_list">
        <button @click="goSolve(problem)" style="text-align: left">
        <h5 style="margin-top : 15px; margin-bottom:20px;">{{problem.problem_name}}</h5>
        <p>마감 일자 : {{problem.due_date}}</p>
        <p v-if="problem.grade == undefined">0명 완료</p>
        <p v-else>{{Object.keys(problem.grade).length}}명 완료</p>
        </button>
        <br>
        <p v-if="problem != undefined && problem['grade'] != undefined && problem['grade'][$store.state.student_id] != undefined">성적 : {{problem['grade']['2016312568']}}</p>
        <v-btn v-if="problem.feedback != undefined && problem.feedback[$store.state.student_id] != undefined" @click="openFeedbackDialog(problem)">피드백 확인</v-btn>
      </div>
    <v-row justify="center">
        <v-dialog
        v-model="Feedback_dialog"
        hide-overlay
        >
        <v-overlay :value="Feedback_overlay"></v-overlay>
        <v-card>
            <v-toolbar
            dark
            color="rgb(36,41,47)"
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
            style="margin-top:30px;"
            three-line
            subheader
            >
            <v-subheader>Feedback Info 
              <v-select
                :items="items"
                item-text="name"
                item-value="value"
                v-model="outputFormat"
                label="Feedback Type"
                style="max-width: 15%; margin-left:30px; margin-top:20px;"
              ></v-select>
            </v-subheader>
            <b-container>
                <b-row>
                    <p>Origin code grade :  {{grade}}</p>
                    <p>Repair code grade :  11/11</p>
                </b-row>
                <code-diff
                  :old-string="origin_code"
                  :new-string="feedback_code"
                  :outputFormat="outputFormat"
                  :context = "context"
                  />
            </b-container>
            </v-list>
        </v-card>
        </v-dialog>
    </v-row>
  </v-container>
  
  <app-footer/>
  </div>
</template>

<script>
import {CodeDiff} from 'v-code-diff'
export default {
  inject: { $item: { default: null } },
  props: {
    itemId: { type: [Number, String] }
  },
  components: {CodeDiff},
  computed: {
    itemByinject() {
      if (this.$item) {
        return this.$item();
      }
      return null;
    },
    id() {
      if (this.itemByinject) {
        return this.itemByinject.id;
      }
      return "";
    }
  },
  data: () => ({
      tab: 4,
    search: '',
    problem_list : [],
    lecture_info: {},
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
    feedback_code: '',
    origin_code: '',
    grade : '',
    items : [
      {name: 'Line by Line', value: 'line-by-line'},
      {name: 'Side by Side', value: 'side-by-side'}
      ],
    outputFormat : 'line-by-line',
    context: 20
  }),
  firestore () {
    return {
        problem_list : this.$firebase.firestore().collection('Problems').where("lecture_key", "==", this.$route.params.lecture_key),
        lecture_info : this.$firebase.firestore().collection('Lectures').doc(this.$route.params.lecture_key)
    }
  },
  created () {
    
  },
  methods: {
    closeDialog() {
      this.dialog = false
    },
    goSolve(problem) {
      this.$router.push('/solve/'+this.$route.params.lecture_key+'/'+problem['.key'])
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
      this.feedback_code = this.selected_problem['feedback'][this.$store.state.student_id]
      this.origin_code = this.selected_problem['student_code'][this.$store.state.student_id]
      //this.repair_info['origin_code'] = this.repair_info['origin_code'].split('<br/>').join('\n')
      //this.repair_info['repair_code'] = this.repair_info['repair_code'].split('<br/>').join('\n')
      this.grade = this.selected_problem['grade'][this.$store.state.student_id]
    },
    closeFeedbackDialog() {
        this.Feedback_dialog = false
        this.selected_problem = {}
    },
  },
  watch: {
  }
}
</script>
<style lang="scss">
// required class
.my-editor {
  background: #1E1E1E;
  color: rgb(255, 255, 255);
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

// optional
.prism-editor__textarea:focus {
  outline: none;
}

// not required:
.height-300 {
  height: 300px;
}
.example-vuex label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.content {
  height: 100%;
  width: 100%;
  border: 1px solid #172334;
  border-radius: 5px;
}
.bottom {
  height: 100%;
  width: 100%;
}
</style>