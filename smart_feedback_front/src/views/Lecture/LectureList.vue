<template>
  <v-container>
      <v-row justify="end">
        <v-col
          cols="12"
          sm="6"
          md="8"
        >
          <h1>Lecture List</h1>
        </v-col>
        <v-col
          cols="6"
          md="4"
          class="text-right"
        >
          <v-btn color="primary" @click="openCreateDialog()">Add Lecture</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <div>
        <v-row class="ma-2">
          <v-col md="4" class="pa-3 d-flex flex-column" v-for="lecture in lectures" :key="lecture['.key']">
            <v-card class="elevation-5 flex d-flex flex-column">
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
                <v-card-actions>
                  <v-btn
                    text
                    color="teal accent-4"
                    @click="openUpdateDialog(lecture)"
                  >
                    Update
                  </v-btn>
                </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
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
            <!--v-toolbar-title>{{selectedProblem.name}}</v-toolbar-title-->
            </v-toolbar>
            <v-list
            three-line
            subheader
            >
            <v-subheader v-if="selected_lecture_key == ''">Create Lecture Informatin</v-subheader>
            <v-subheader v-else>Update Lecture Informatin</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <v-container
                      id="user-profile"
                      fluid
                      tag="section"
                    >
                      <h3 v-if="selected_lecture_key == ''">Create Lecture Information</h3>
                      <h3 v-else>Update Lecture Information</h3>
                      <v-row justify="center">
                        <v-col
                          cols="12"
                          md="12"
                        >
                            <v-form>
                              <v-container class="py-0">
                                <v-row>
                                  <v-col
                                    cols="12"
                                    md="12"
                                  >
                                    <v-text-field
                                      class="purple-input"
                                      label="Lecture Name"
                                      v-model="selected_lecture.lecture_name"
                                    />
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    md="6"
                                  >
                                    <v-text-field
                                      class="purple-input"
                                      label="Year"
                                      v-model="selected_lecture.year"
                                    />
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    md="6"
                                  >
                                    <v-text-field
                                      class="purple-input"
                                      label="Semester"
                                      v-model="selected_lecture.semester"
                                    />
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    md="12"
                                  >
                                    <v-textarea
                                      v-model="selected_lecture.lecture_description"
                                      auto-grow
                                      filled
                                      label="Lecture Discription"
                                      rows="1"
                                    ></v-textarea>
                                  </v-col>
                                  <v-col cols="12" md="12">
                                    <v-data-table
                                      :headers="student_header"
                                      :items="selected_lecture.students"
                                      class="elevation-1"
                                    >
                                      <template v-slot:top>
                                        <v-toolbar
                                          flat
                                        >
                                          <v-toolbar-title>Students Info</v-toolbar-title>
                                          <v-divider
                                            class="mx-4"
                                            inset
                                            vertical
                                          ></v-divider>
                                          <v-spacer></v-spacer>
                                          <v-btn
                                                color="primary"
                                                dark
                                                class="mb-2"
                                                @click="openStudentCreateDialog()"
                                              >
                                                Add students
                                          </v-btn>
                                          <v-dialog
                                            v-model="createDialog"
                                            max-width="500px"
                                          >
                                            <v-card>
                                              <v-card-title>
                                                <span class="text-h5">Student ID</span>
                                              </v-card-title>

                                              <v-card-text>
                                                <v-container>
                                                  <v-row>
                                                    <v-col
                                                      cols="12"
                                                      sm="6"
                                                      md="4"
                                                    >
                                                      <v-text-field
                                                        v-model="createStudent_id"
                                                        label="Student ID"
                                                      ></v-text-field>
                                                    </v-col>
                                                  </v-row>
                                                </v-container>
                                              </v-card-text>

                                              <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                  color="blue darken-1"
                                                  text
                                                  @click="closeStudentCreateDialog"
                                                >
                                                  Cancel
                                                </v-btn>
                                                <v-btn
                                                  color="blue darken-1"
                                                  text
                                                  @click="createStudent"
                                                >
                                                  Save
                                                </v-btn>
                                              </v-card-actions>
                                            </v-card>
                                          </v-dialog>
                                          <v-dialog
                                            v-model="editedDialog"
                                            max-width="500px"
                                          >
                                            <v-card>
                                              <v-card-title>
                                                <span class="text-h5">Student ID</span>
                                              </v-card-title>

                                              <v-card-text>
                                                <v-container>
                                                  <v-row>
                                                    <v-col
                                                      cols="12"
                                                      sm="6"
                                                      md="4"
                                                    >
                                                      <v-text-field
                                                        v-model="edited_item.student_id"
                                                        label="Student ID"
                                                      ></v-text-field>
                                                    </v-col>
                                                  </v-row>
                                                </v-container>
                                              </v-card-text>

                                              <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                  color="blue darken-1"
                                                  text
                                                  @click="closeEditDialog"
                                                >
                                                  Cancel
                                                </v-btn>
                                                <v-btn
                                                  color="blue darken-1"
                                                  text
                                                  @click="save"
                                                >
                                                  Save
                                                </v-btn>
                                              </v-card-actions>
                                            </v-card>
                                          </v-dialog>
                                          <v-dialog v-model="deleteDialog" max-width="600px">
                                            <v-card>
                                              <v-card-title class="justify-center">Are you sure you want to delete this student ID?</v-card-title>
                                              <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                                <v-spacer></v-spacer>
                                              </v-card-actions>
                                            </v-card>
                                          </v-dialog>
                                        </v-toolbar>
                                      </template>
                                      <template v-slot:[`item.actions`]="{ item }" ]>
                                        <v-icon
                                          small
                                          class="mr-2"
                                          @click="openEditDialog(item)"
                                        >
                                          mdi-pencil
                                        </v-icon>
                                        <v-icon
                                          small
                                          @click="openDeleteDialog(item)"
                                        >
                                          mdi-delete
                                        </v-icon>
                                      </template>
                                    </v-data-table>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    class="text-right"
                                  >
                                    <v-btn
                                      color="success"
                                      class="mr-0"
                                      @click="create_lecture()"
                                      v-if="selected_lecture_key == ''"
                                    >
                                      Create Lecture Information
                                    </v-btn>
                                    <v-btn
                                      color="success"
                                      class="mr-0"
                                      @click="update_lecture()"
                                      v-else
                                    >
                                      Update Lecture Information
                                    </v-btn>
                                  </v-col>
                                </v-row>
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
  </v-container>
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
    student_header: [
      {
        text: 'Student_id',
        align: 'start',
        value: 'student_id'
      },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    student_dialog: false,
    student_overlay: false,
    dialog: false,
    overlay: false,
    selected_lecture: {},
    selected_lecture_key : '',
    edited_item : {},
    edited_idx : 0,
    editedDialog: false,
    delete_idx : 0,
    deleteDialog: false,
    createDialog: false,
    createStudent_id: ''
  }),
  firestore () {
    return {
        lectures : this.$firebase.firestore().collection('Lectures').where("admin", "==", this.$store.state.user)
    }
  },
  methods: {
    cloneObject(obj) {
      var clone = {}
      for (var key in obj) {
          clone[key] = obj[key]
      }
      return clone;
    },
    openUpdateDialog(lecture) {
      this.selected_lecture = this.cloneObject(lecture)
      this.selected_lecture_key = this.selected_lecture['.key']
      this.dialog = true
    },
    openCreateDialog() {
      this.selected_lecture = {students: []}
      this.selected_lecture_key = ''
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    update_lecture() {
      this.overlay = true
      for(var i = 0; i<this.selected_lecture['students'].length; i++) {
        this.selected_lecture['students'][i] = this.selected_lecture['students'][i]['student_id']
      }
      this.$firebase.firestore().collection('Lectures').doc(this.selected_lecture_key).set(this.selected_lecture, {merge:true}).then(() => {
        this.overlay = false
        alert("Update Success!")
        this.closeDialog()
      })
    },
    create_lecture() {
      this.overlay = true
      this.selected_lecture['admin'] = this.$store.state.user
      this.selected_lecture['admin_name'] = this.$store.state.user_name
      for(var i = 0; i<this.selected_lecture['students'].length; i++) {
        this.selected_lecture['students'][i] = this.selected_lecture['students'][i]['student_id']
      }
      this.$firebase.firestore().collection('Lectures').add(this.selected_lecture).then((doc) => {
          console.log("Document written with ID: ", doc.id);
          this.overlay = false
          alert("Create Success")
          this.closeDialog()
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
          this.overlay=false
          alert("Create Fail..!")
          this.closeDialog()
      })
    },
    openStudentCreateDialog() {
      this.createStudent_id = ''
      this.createDialog = true
    },
    closeStudentCreateDialog() {
      this.createDialog = false
      this.createStudent_id = ''
    },
    createStudent() {
      this.selected_lecture['students'].push({student_id: this.createStudent_id})
      this.createStudent_id = ''
      this.createDialog = false
    },
    openEditDialog(item) {
      this.edited_item = item
      this.edited_idx = this.selected_lecture.students.indexOf(item)
      this.editedDialog = true
    },
    closeEditDialog () {
      this.edited_item = {}
      this.editedDialog = false
    },
    save () {
      this.selected_lecture.students[this.edited_idx] = this.edited_item.student_id
      this.editedDialog = false
    },
    openDeleteDialog(item) {
      this.edited_idx = this.selected_lecture.students.indexOf(item)
      this.deleteDialog = true
    },
    closeDelete() {
      this.deleteDialog = false
    },
    deleteItemConfirm () {
      this.selected_lecture.students.splice(this.edited_idx, 1)
      this.deleteDialog = false
    },
  },
  watch: {
    lectures: function (val) {
      for(var i=0; i<val.length; i++) {
        var temp_student_array = []
        for(var j=0; j<val[i].students.length; j++) {
          var temp_each_student = {student_id : val[i].students[j]}
          temp_student_array.push(temp_each_student)
        }
        val[i].students = temp_student_array
      }
    },
  }
}
</script>