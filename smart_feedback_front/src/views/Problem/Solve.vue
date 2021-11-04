<template>
  <div class="solve">
    <div>
      <b-navbar style="height:62px;" type="dark" variant="dark">
        <router-link to="/">
        <v-img
          style="margin-left:25px"
          src="../../assets/skku_logo.png"
          max-height="60"
          max-width="60"
          contain
        ></v-img>
        </router-link>
        <b-navbar-nav style="padding-left:10px">
          <b-nav-item v-if="lecture_info">{{lecture_info.lecture_name}}</b-nav-item>
          <b-nav-item disabled><v-img
            color="white"
            src="../../assets/angle-right.png"
            max-height="20"
            max-width="20"
            contain
          ></v-img></b-nav-item>
          <b-nav-item v-if="lecture_info">{{problem_info.problem_name}}</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>
    <div>
    <b-tabs card>
      <b-tab style="margin:0px; padding:0px;" :title="problem_info.problem_name" active>
        <div class="content_grid">
          <nav class="content_nav">
            <div style="flex-grow: 1; overflow: auto; margin:10px;">
              <h6>Problem Discription</h6>
              <p style="margin : 15px 15px 5px 5px;" v-html="problem_info.problem_discription"></p>
            </div>
          </nav>
          <header class="content_code">
            <h6 style="margin:10px;">Write your code</h6>
            <hr style="margin:0px" />
            <div class="code" ref="student_code">
            <prism-editor class="my-editor" v-model="code" line-numbers :highlight="highlighter"></prism-editor>
            </div>
          </header>
          <section class="section">
            <b-overlay
                id="overlay-background"
                :show = overlay
                variant="secondary"
                rounded="sm"
                style="height:100%"
            >
            <h6 style="margin:10px;">Result</h6>
            <hr style="margin:0px" />
            <prism-editor class="my-editor" :readonly="false" v-model="result" line-numbers :highlight="highlighter"></prism-editor>
            </b-overlay>
          </section>
        </div>
        <!--dashboard style="margin-top:0px;" :id="'dashExample'">
          <dash-layout
              v-for="layout in dlayouts"
              v-bind="layout"
              :key="layout.breakpoint"
          >
              <dash-item v-for="item in layout.items" v-bind.sync="item" :key="item.id">

                  <b-container style="display: flex !important; flex-direction: column;" class="content" v-if="item.id == 1" >
                      <div style="flex-grow: 1; overflow: auto;">
                      <h6>Problem Discription</h6><br>
                      <p style="text-color:white; margin : 10px;" v-html="problem_info.problem_discription"></p>
                      </div>
                  </b-container>
                      
                  <div class="content1" v-if="item.id == 2">
                      <h6 style="margin:10px;">Write your code</h6>
                      <hr style="margin:0px" />
                      <prism-editor class="my-editor" v-model="code" line-numbers :highlight="highlighter"></prism-editor>
                  </div>
                  
                  <div class="content2" v-if="item.id == 3">
                      <b-overlay
                          id="overlay-background"
                          :show = overlay
                          variant="secondary"
                          rounded="sm"
                          style="height:100%"
                      >
                      <h6 style="margin:10px;">Result</h6>
                      <prism-editor class="my-editor" :readonly="true" v-model="result" line-numbers :highlight="highlighter"></prism-editor>
                      </b-overlay>
                  </div>
              </dash-item>
          </dash-layout>
        </dashboard-->
      </b-tab>
    </b-tabs>
    </div>
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
        <div>
        <hr style="margin-bottom:0px; margin-top:0px;" />
        <v-app-bar
          color="white"
          height="auto"
          flat
          outlined
        >
          <v-btn> 질문하기 </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="info" style="margin-right:10px" @click = "run()">Run</v-btn>
          <v-btn text color="success" @click = "submit()">Submit</v-btn>   
        </v-app-bar>
      </div>
  </div>
  
</template>

<script>
//import { Dashboard, DashLayout, DashItem } from "vue-responsive-dash";
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
    //Dashboard,
    //DashLayout,
    //DashItem
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
            { id: "2", x: 12, y: 0, width: 18, height: 11 },
            { id: "3", x: 12, y: 11, width: 18, height: 4 },
          ]
        },
        {
          breakpoint: "lg",
          breakpointWidth: 1200,
          numberOfCols: 30,
          items: [
            { id: "1", x: 0, y: 1, width: 12, height: 15 },
            { id: "2", x: 12, y: 0, width: 18, height: 11 },
            { id: "3", x: 12, y: 11, width: 18, height: 4 },
          ]
        },
        {
          breakpoint: "md",
          breakpointWidth: 996,
          numberOfCols: 30,
          items: [
            { id: "1", x: 0, y: 1, width: 12, height: 15 },
            { id: "2", x: 12, y: 0, width: 18, height: 11 },
            { id: "3", x: 12, y: 11, width: 18, height: 4 },
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
      problem_info : this.$firebase.firestore().collection('Problems').doc(this.$route.params.problem_key),
      lecture_info : this.$firebase.firestore().collection('Lectures').doc(this.$route.params.lecture_key)
    }
  },
  mounted () {
    console.log(this.$refs.student_code.clientHeight)
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
    
  }
}
</script>
<style lang="scss">

.my-editor {
  background: white;
  color: black;//rgb(252, 252, 252);
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

.content1 {
  height: 100%;
  width: 100%;
  border: 1px solid #1f2d41;
  border-radius: 5px;
}

.content2 {
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
    max-width: 100vw;
    max-height: 100vh;
    min-height: 100vh;
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
div.my_class {
    resize:both;
    overflow:auto; /* something other than visible */
}

.body {
    margin: 10px;
    height: 100%;
}
/*
.content_grid {
    display: grid;
    min-height: calc(100vh - 138px);
    max-height: calc(100vh - 138px);
    grid-template: 
    "div head" min-content
    "div main" 1fr / min-content 1fr;
}
*/
.content_grid {
    display: grid;
    min-height: calc(100vh - 145px);
    max-height: calc(100vh - 145px);
    grid-template: 
    "div head" 1fr
    "div main" 1fr 
    "div main" 1fr 
    "div main" 1fr  / min-content 1fr;
}

.content_nav {
    grid-area: div;
    border-right : 1px solid rgb(200,200,200);
    overflow: auto;
    //resize: horizontal;
    width: 40vw;
}
.content_code {
    grid-area: head;
    height: calc((100vh - 145px) * 0.7);
    //overflow: auto;
    resize: vertical;
}

.section {
    grid-area: main;
    overflow: auto;
    border-top : 1px solid rgb(200,200,200); 
    height: calc((100vh - 145px) * 0.3);
}
</style>