<template>
  <div>
    <app-header/>
  <v-container>
      <v-row justify="end">
        <v-col
          cols="12"
          sm="6"
          md="8"
        >
          <h1>Problem List</h1>
        </v-col>
        <v-col
          cols="6"
          md="4"
          class="text-right"
        >
          <v-btn color="primary" @click="openCreateDialog()">Add problem</v-btn>
        </v-col>
      </v-row>
      <hr>
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
                <v-icon @click="Feedback(item)">
                  mdi-pencil
                </v-icon>
              </template>
              <template v-slot:[`item.update`]="{ item }" ]>
                <v-icon @click="openUpdateDialog(item)">
                  mdi-pencil
                </v-icon>
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
            </v-toolbar>
            <v-list
            three-line
            subheader
            >
            <v-subheader v-if="type">Update Problem Informatin</v-subheader>
            <v-subheader v-else>Create Problem Informatin</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <v-container
                      id="user-profile"
                      fluid
                      tag="section"
                    >
                      <h3 v-if="type">Update Problem Information</h3>
                      <h3 v-else>Create Problem Information</h3>
                      <v-row justify="center">
                        <v-col
                          cols="12"
                          md="12"
                        >
                            <v-form>
                              <v-container class="py-0">
                                <v-container>
                                    <v-row>
                                        <v-text-field
                                        class="purple-input"
                                        v-model="selected_problem.problem_name"
                                        :hint="problem_name_state"
                                        label="Problem Name"
                                        style="max-width:50%"
                                        ></v-text-field>
                                        <v-btn style="width:20%" text @click="exist_check">Check problem name</v-btn>
                                    </v-row>
                                    </v-container>
                                    <div style="display:flex;">
                                        <div style="width:48%;float:left">
                                <h5> Upload reference File </h5>
                                    <div class="file-upload">
                                        <v-file-input
                                        counter
                                        multiple
                                        show-size
                                        v-model="reference_files"
                                        ></v-file-input>
                                    </div>
                                    <v-text-field
                                        v-model="reference_search"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                        hide-details
                                        v-if="reference_files.length !== 0"
                                    ></v-text-field>
                                    <v-data-table  :headers="file_headers" :items="reference_file_list" :search="reference_search" v-if="reference_files.length !== 0">
                                    <template v-slot:[`item.size`]="{ item }" ]>
                                        {{conv_size(item.size)}}
                                    </template>
                                    </v-data-table>
                                </div>
                                <div style="width:48%;float:left;margin-left:4%">
                                    <h5> Upload Test case </h5>
                                    <div class="file-upload">
                                        <v-file-input
                                        counter
                                        multiple
                                        show-size
                                        v-model="testcase_files"
                                        ></v-file-input>
                                    </div>
                                    <v-text-field
                                        v-model="testcase_search"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                        hide-details
                                        v-if="testcase_files.length !== 0"
                                    ></v-text-field>
                                    <v-data-table :headers="file_headers" :items="testcase_file_list" :search="testcase_search" v-if="testcase_files.length !== 0">
                                    <template v-slot:[`item.size`]="{ item }" ]>
                                        {{conv_size(item.size)}}
                                    </template>
                                    </v-data-table>
                                </div>
                                    </div>
                                
                                <div style="display:flex;">
                                <div style="width:48%;height:20%;">
                                    <h5>Due Date</h5>
                                    <v-date-picker
                                    v-model="selected_problem.due_date"
                                    elevation="15"
                                    ></v-date-picker>
                                </div>

                                 <div style="width:48%;height:20%;margin-left:4%;">
                                    <h5>Realtime Feedback Option</h5>
                                    <v-switch v-model="selected_problem.type" :label="`Realtime Feedback : ${selected_problem.type.toString()}`" v-if="selected_problem.type!=undefined"></v-switch>
                                </div>
                                </div>
                                <div style="margin-top:5%;">
                                    <h5 >Problem discription</h5>
                                    <ckeditor v-model="selected_problem.problem_discription" :config="editorConfig"></ckeditor>
                                </div>
                                
                                <v-btn outlined color="primary" width="100%" style="margin-top:3%" @click="upload" class="upload-button"
                                    :disabled="(reference_files.length == 0 || testcase_files.length == 0)" v-if="!type">Create Problem</v-btn>
                                <v-btn outlined color="primary" width="100%" style="margin-top:3%" @click="upload" class="upload-button" v-else>Update Problem</v-btn>
                                <div class="loading-overlay" v-if="loading">
                                    <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
                                    {{loading_msg}}
                                </div>
                              </v-container>
                            </v-form>
                        </v-col>
                      </v-row>
                    </v-container> 
                </v-list-item-content>
            </v-list-item>
            </v-list>
            <v-divider></v-divider>
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
            color="cyan"
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
            <v-subheader>Control Smart Feedback</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Do Smart Feedback</v-list-item-title>
                    <v-btn color="success" @click="doFeedback()" disabled v-if="selected_problem.state != undefined && selected_problem.state == 1"> Do Smart Feedback </v-btn>
                    <v-btn color="success" @click="doFeedback()" v-else> Do Smart Feedback </v-btn>
                    <v-btn color="primary" @click="getFeedbackData()" v-if="csv_name!=''"> Get Smart Feedback Data</v-btn>
                    <v-btn color="blue-grey" @click="publishFeedbackData()" v-if="csv_name!=''"> Publish Smart Feedback Data</v-btn>
                </v-list-item-content>
            </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list
            three-line
            subheader
            >
            <v-subheader>Feedback Result</v-subheader>
            <v-card>
                <v-card-title>
                    <v-text-field
                        v-model="Feedback_search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table :headers="Feedback_headers" :items="Feedback_data" :search="Feedback_search">
                  <template v-slot:[`item.origin_code`]="{ item }" ]>
                    <span style="white-space: pre;">{{item.origin_code}}</span>
                  </template>
                  <template v-slot:[`item.repair_code`]="{ item }" ]>
                    <span style="white-space: pre;">{{item.repair_code}}</span>
                  </template>
                </v-data-table>
            </v-card>
            </v-list>
        </v-card>
        </v-dialog>
    </v-row>
  </v-container>
  </div>
</template>

<script>
import AppHeader from '../../components/AppHeader.vue'
export default {
  components: { AppHeader },
  data: () => ({
    search: '',
    reference_search: '',
    testcase_search: '',
    problem_list : [],
    type: false,
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
          text: 'Feedback',
          value: 'feedback'
        },
        {
          text: 'Update',
          value: 'update'
        }
    ],
    file_headers: [
        {
            text: '#',
            align: 'start',
            value: 'idx'
        },
        {
            text: 'File Name',
            value: 'name'
        },
        {
            text: 'File Size',
            value: 'size'
        },
    ],
    dialog:false,
    overlay:false,
    selected_problem: {},
    testcase_files: [],
    reference_files: [],
    reference_file_list: [],
    testcase_file_list: [],
    loading: false,
    name_check: false,
    loading_msg: '',
    problem_name_state: 'You have to check problem name first!',
    editorConfig: {
    },
    Feedback_dialog: false,
    Feedback_overlay: false,
    Feedback_data : [],
    csv_name: '',
    Feedback_search: '',
    Feedback_headers: [
        {
            text: 'Student ID',
            align: 'start',
            value: 'student_id'
        },
        {
            text: '#Test Case',
            value: 'num_total'
        },
        {
            text: '#Passed Test Case',
            value: 'num_correct'
        },
        {
            text: 'Origin Code',
            value: 'origin_code'
        },
        {
            text: 'Repair Code',
            value: 'repair_code'
        },
    ]
  }),
  firestore () {
    return {
        problem_list : this.$firebase.firestore().collection('Problems').where("lecture_key", "==", this.$route.params.lecture_key)
    }
  },
  methods: {
    closeDialog() {
      this.selected_problem = {}
      this.testcase_files = []
      this.reference_files = []
      this.name_check = false
      this.loading_msg = ''
      this.problem_name_state = 'You have to check problem name first!'
      this.dialog = false
    },
    openUpdateDialog(val) {
      this.selected_problem = val
      this.type = true
      this.dialog = true
    },
    openCreateDialog() {
      this.selected_problem = {type:false}
      this.type = false
      this.dialog = true
    },
    conv_size(size) {
        size = Number(size)
        if (size > 1024 * 1024 * 1024 * 1024) {
            return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
        } else if (size > 1024 * 1024 * 1024) {
            return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
        } else if (size > 1024 * 1024) {
            return (size / 1024 / 1024).toFixed(2) + ' MB'
        } else if (size > 1024) {
            return (size / 1024).toFixed(2) + ' KB'
        }
        return size + ' B'
    },
    exist_check() {
        this.loading = true
        this.$http.post('/api/exist_check', {problem_name : this.selected_problem.problem_name})
        .then((response) => {
            if(!response.data) {
                this.name_check = true
                this.problem_name_state = 'You can use this problem name!'
                alert("Can use this name!")
            }
            else {
                this.name_check = false
                this.problem_name_state = 'You have to check problem name first!'
                alert("This problem name already exist!")
            }
            this.loading = false
            console.log(response.data)
        })
    },
    upload() {
        if(!this.name_check) return alert("Problem name check first!")
        var backend_finish = false
        var db_finish = false
        this.loading = true
        this.loading_msg = ""
        this.$http.post('/api/upload_problem_name', {problem_name: this.selected_problem.problem_name})
        .then((response) => {
            if(response.data=="Success") {
                var reference_end = false, testcase_end = false
                const reference_formData = new FormData()
                this.reference_files.forEach(file => {
                    reference_formData.append("file",file)
                });
                this.loading_msg += "\nStart reference file Uploading"
                this.$http.post('/api/upload_reference', reference_formData)
                .then((response) => {
                    this.loading_msg += "End reference file Uploading"
                    if(response.data == "success") reference_end=true
                    if(testcase_end && reference_end) backend_finish = true
                    if(db_finish && backend_finish) {
                        this.loading = false
                        alert("Success upload Problem!")
                        this.$router.go(-1)
                    }
                })
                this.loading_msg += "\nStart testcase file Uploading"
                const testcase_formData = new FormData()
                this.testcase_files.forEach(file => {
                    testcase_formData.append("file",file)
                });
                this.$http.post('/api/upload_testcase', testcase_formData)
                .then((response) => {
                    this.loading_msg += "\nEnd testcase file Uploading"
                    if(response.data == "success") testcase_end=true 
                    if(testcase_end && reference_end) backend_finish = true
                    if(db_finish && backend_finish) {
                        this.loading = false
                        alert("Success upload Problem!")
                        this.$router.go(-1)
                    }
                })
            }
            else alert("Something error!")
        })
        var temp = this
        this.$firebase.firestore().collection('Problems').add({
            admin : this.$store.state.user,
            problem_name : this.selected_problem.problem_name,
            due_date : this.selected_problem.due_date,
            problem_discription : this.selected_problem.problem_discription,
            lecture_key : this.$route.params.lecture_key,
            type : this.selected_problem.type
        }).then(function() {
            db_finish = true
            if(db_finish && backend_finish) {
                temp.loading = false
                alert("Success upload Problem!")
                temp.$router.go(-1)
            }
        })
    },
    Feedback(problem) {
      this.Feedback_dialog = true
      this.selected_problem = problem
      this.Feedback_overlay = true
      this.$http.post('/api/get_question_info', {problem_name : this.selected_problem.problem_name})
      .then((response) => {
          if(response.data.length>0) this.csv_name = response.data[0]
          else this.csv_name = ''
          this.Feedback_overlay = false
      })
    },
    getFeedbackData() {
        this.Feedback_overlay = true
        this.$http.post('/api/get_feedback_info', {problem_name : this.selected_problem.problem_name, csv_name : this.csv_name})
        .then((response) => {
            var result = []
            response.data.forEach(each_result => {
              var student_id = each_result['File Name'].split('_')
              student_id = student_id[student_id.length-1].split('.')[0]
              var each = {}
              each['origin_code'] = each_result['Buggy Code']
              each['repair_code'] = each_result['Repair']
              each['student_id'] = student_id
              each['num_correct'] = each_result['#Passed Test Case']
              each['num_total'] = each_result['#Test Case']
              result.push(each)
              
            })
            this.Feedback_data = result
            this.Feedback_overlay = false
        })
    },
    doFeedback() {
      this.Feedback_overlay = true
      this.$http.post('/api/do_feedback', {problem_name : this.selected_problem.problem_name, problem_key : this.selected_problem['.key']})
      .then((response) => {
        if(response.data) this.Feedback_overlay = false
        alert("Smart Feedback System is executing now!")
        this.closeFeedbackDialog()
      })
    },
    closeFeedbackDialog() {
      this.Feedback_dialog = false
      this.selected_problem = {},
      this.Feedback_data = []
      this.csv_name = ''
    },
    publishFeedbackData() {
      this.Feedback_overlay = true
        this.$http.post('/api/get_feedback_info', {problem_name : this.selected_problem.problem_name, csv_name : this.csv_name})
        .then((response) => {
          var result = {}
            response.data.forEach(file => {
              var student_id = file['File Name'].split('_')
              student_id = student_id[student_id.length-1].split('.')[0]
              var each_result = {}
              each_result['origin_code'] = file['Buggy Code'].split('\n').join('<br/>')
              each_result['repair_code'] = file['Repair'].split('\n').join('<br/>')
              each_result['num_correct'] = file['#Passed Test Case']
              each_result['num_total'] = file['#Test Case']
              result[student_id] = each_result
            });
            console.log(result)
            this.$firebase.firestore().collection("Problems").doc(this.selected_problem['.key']).set({
              feedback : result
            }, {merge:true})
            this.Feedback_overlay = false
            alert("Publish End!")
        })
    },
  },
  watch: {
    reference_files: function (val) {
        this.reference_file_list = []
        for(var i=0;i<val.length;i++)
        {
            var temp = {}
            temp.idx = i+1
            temp.name = val[i].name
            temp.size = val[i].size
            this.reference_file_list.push(temp)
        }
    },
    testcase_files: function (val) {
        this.testcase_file_list = []
        for(var i = 0;i<val.length;i++)
        {
            var temp = {}
            temp.idx = i+1
            temp.name = val[i].name
            temp.size = val[i].size
            this.testcase_file_list.push(temp)
        }
    },
    problem_name: function () {
        this.name_check = false
        this.problem_name_state = 'You have to check problem name first!'
    }
  }
}
</script>
<style>
.example-vuex label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
</style>