<template>
  <v-container class="solve">
      <p style="margin-bottom:0px" v-if="lecture_info!=undefined">{{lecture_info.lecture_name}} {{lecture_info.admin}} > {{problem_info.problem_name}}</p>
      <dashboard style="margin-top:0px;" :id="'dashExample'">
          
            <dash-layout
                v-for="layout in dlayouts"
                v-bind="layout"
                :key="layout.breakpoint"
            >
                <dash-item v-for="item in layout.items" v-bind.sync="item" :key="item.id">

                    <b-container style="display: flex !important; flex-direction: column;" class="content" v-if="item.id == 1" >
                        <div style="flex-grow: 1; overflow: auto;">
                        <h6>Problem Discription</h6><br>
                        <p style="margin : 10px;" v-html="problem_info.problem_discription"></p>
                        </div>
                    </b-container>
                        
                    <div class="head" v-if="item.id == 2" draggable=false resizable=false>
                        <p style="">Write your code</p>
                    </div>
                    <div class="content" v-if="item.id == 3">
                        <prism-editor class="my-editor" v-model="code" line-numbers :highlight="highlighter"></prism-editor>
                    </div>
                    <div class="head" v-if="item.id == 4">
                        Result
                    </div>
                    
                    <div class="content" v-if="item.id == 5">
                        <b-overlay
                            id="overlay-background"
                            :show = overlay
                            variant="secondary"
                            rounded="sm"
                            style="height:100%"
                        >
                        <prism-editor class="my-editor" :readonly="true" v-model="result" line-numbers :highlight="highlighter"></prism-editor>
                        </b-overlay>
                    </div>
                    <div class="bottom" v-if="item.id == 6">
                        <v-btn style="width:46%;margin-right:4%" outlined color="teal" @click = "run()">Run</v-btn>
                        <v-btn style="width:46%;margin-left:4%" outlined color="indigo" @click = "submit()">Submit</v-btn>    
                    </div>
                </dash-item>
            </dash-layout>
        </dashboard>
        <v-row justify="center">
            <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            >
            <v-card>
                <v-toolbar
                dark
                color="secondary"
                >
                <v-btn
                    icon
                    dark
                    @click="closeDialog()"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{problem_info.problem_name}}</v-toolbar-title>
                </v-toolbar>
                <v-list
                three-line
                subheader
                >
                <v-subheader>Feedback Information</v-subheader>
                <v-list-item>
                    <v-list-item-content style="height:100%">
                        <h6>Your grade : {{correct}} / {{total}}</h6>
                        <h6>Origin Your Code </h6>
                        <prism-editor style="height:100%; margin-bottom:5%;" class="my-editor" v-model="feedback_data['Buggy Code']" line-numbers :highlight="highlighter"></prism-editor>
                        <h6>Repair Code grade : {{feedback_data['#Passed Test Case']}} / {{feedback_data['#Test Case']}}</h6>
                        <h6>Repair Code </h6>
                        <prism-editor style="height:100%" class="my-editor" v-model="feedback_data['Repair']" line-numbers :highlight="highlighter"></prism-editor>
                    </v-list-item-content>
                </v-list-item>
                </v-list>
            </v-card>
            </v-dialog>
        </v-row>
  </v-container>
</template>

<script>
import { Dashboard, DashLayout, DashItem } from "vue-responsive-dash";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

export default {
  components: {
    PrismEditor,
    Dashboard,
    DashLayout,
    DashItem
  },
  data: () => ({
    dialog: false,
    problem_info: {},
    code: '',
    result: '',
    feedback_data: {},
    lecture_info : {},
    overlay: false,
    correct: 0,
    total: 0,
    dlayouts: [
        {
          numberOfCols: 30,
          breakpoint: "xl",
          items: [
            { id: "1", x: 0, y: 0, width: 12, height: 15 },
            { id: "2", x: 12, y: 0, width: 18, height: 1 },
            { id: "3", x: 12, y: 1, width: 18, height: 10 },
            { id: "4", x: 12, y: 11, width: 18, height: 1 },
            { id: "5", x: 12, y: 12, width: 18, height: 3 },
            { id: "6", x: 0, y: 14, width: 30, height: 1 },
          ]
        },
        {
          breakpoint: "lg",
          breakpointWidth: 1200,
          numberOfCols: 30,
          items: [
            { id: "1", x: 0, y: 1, width: 12, height: 15 },
            { id: "2", x: 12, y: 0, width: 18, height: 1 },
            { id: "3", x: 12, y: 1, width: 18, height: 10 },
            { id: "4", x: 12, y: 11, width: 18, height: 1 },
            { id: "5", x: 12, y: 12, width: 18, height: 3 },
            { id: "6", x: 0, y: 14, width: 30, height: 1 },
          ]
        },
        {
          breakpoint: "md",
          breakpointWidth: 996,
          numberOfCols: 8,
          items: [
            { id: "1", x: 0, y: 0, width: 1, height: 1 },
            { id: "2", x: 1, y: 0, width: 2, height: 1 },
          ]
        },
        {
          breakpoint: "sm",
          breakpointWidth: 768,
          numberOfCols: 4,
          items: [
            { id: "1", x: 0, y: 0, width: 1, height: 1 },
            { id: "2", x: 1, y: 0, width: 2, height: 1 },
          ]
        },
        {
          breakpoint: "xs",
          breakpointWidth: 480,
          numberOfCols: 2,
          items: [
            { id: "1", x: 0, y: 0, width: 1, height: 1 },
            { id: "2", x: 1, y: 0, width: 1, height: 1 },
          ]
        },
        {
          breakpoint: "xxs",
          breakpointWidth: 0,
          numberOfCols: 1,
          items: [
            {
              id: "1",
              x: 0,
              y: 0,
              width: 1,
              height: 1
            },
            { id: "2", x: 0, y: 1, width: 1, height: 1 }
          ]
        }
      ],
  }),
  firestore () {
    return {
        problem_info : this.$firebase.firestore().collection('Problems').doc(this.$route.params.problem_key)
    }
  },
  methods: {
    openDialog() {
        this.dialog = true
    },
    closeDialog() {
        this.dialog = false
    },
    highlighter(code) {
      return highlight(code, languages.js); //returns html
    },
    submit () {
        var student_id = this.$store.state.student_id
        console.log(this.problem_info.problem_name)
        this.$http.post('/api/submit_code', { code: this.code, problem: this.problem_info.problem_name, student_id: this.$store.state.student_id, feedback_type: this.problem_info.type })
        .then((response) => {
            if(response.data.correct != response.data.total && this.problem_info.type) {
                this.correct = response.data.correct
                this.total = response.data.total
                response.data.feedback.forEach(each_feedback => {
                    var std_id = each_feedback['File Name'].split('_')[1]
                    std_id = std_id.split('.')[0]
                    if(std_id == this.$store.state.student_id) {
                        this.feedback_data = each_feedback
                        this.$firebase.firestore().collection('Problems').doc(this.problem_info['.key']).set({
                            grade: {[student_id] : response.data.correct + '/' + response.data.total},
                            feedback: {[student_id] : this.feedback_data['Repair']},
                            student_code: {[student_id] : this.feedback_data['Buggy Code']}
                        }, {merge:true})
                    }
                });
                this.openDialog()
            }
            else {
                alert("Congratulations! You got full score! \n Correct case : "+response.data.correct+" in Total : "+response.data.total)
                this.$firebase.firestore().collection('Problems').doc(this.problem_info['.key']).set(
                {
                    grade: {[student_id] : response.data.correct + '/' + response.data.total}, 
                    student_code: {[student_id] : this.code}
                },{merge:true})
            }
        })
    },
    run () {
        console.log(this.problem_info)
        this.overlay = true
         this.$http.post('/api/run_code', { code: this.code, student_id: this.$store.state.student_id })
        .then((response) => {
            console.log(response.data)
            this.result = response.data.toString()
            this.overlay = false
        })
    }
  },
  watch: {
    problem_info: function (val) {
        this.$firebase.firestore().collection('Lectures').doc(val.lecture_key).get().then((doc) => {
            this.lecture_info = doc.data()
            console.log(this.lecture_info)
        })
    },
  }
}
</script>
<style lang="scss">

.my-editor {
  background: #1E1E1E;
  color: rgb(252, 252, 252);
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

// optional
.prism-editor__textarea:focus {
  outline: none;
}
.content {
  height: 100%;
  width: 100%;
  border: 1px solid #1f2d41;
  border-radius: 5px;
}
.bottom {
  height: 100%;
  width: 100%;
}
.solve {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    padding: 0%;
}
.head {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 0%;
    padding:0%;
}
</style>