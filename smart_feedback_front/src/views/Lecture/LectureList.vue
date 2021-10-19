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
      <v-card>
        <v-container fluid>
          <v-row dense>
            <v-col
              v-for="lecture in lectures"
              :key="lecture.title"
              cols="4"
            >
              <v-card
                class="mx-auto"
                min-width="30%"
              >
                <v-card-text>
                  <div>{{lecture.year}}년도 - {{lecture.semester}}학기</div>
                  <p class="text-h4 text--primary">
                    {{lecture.lecture_name}}
                  </p>
                  <p>Professor {{$store.state.user_name}}</p>
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
        </v-container>
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
                          <base-material-card>
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
                                    <v-text-field
                                      class="purple-input"
                                      label="Lecture Discription"
                                      v-model="selected_lecture.lecture_description"
                                    />
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
                          </base-material-card>
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
    dialog: false,
    overlay: false,
    selected_lecture: {},
    selected_lecture_key : ''
  }),
  firestore () {
    return {
        lectures : this.$firebase.firestore().collection('Lectures').where("admin", "==", this.$store.state.user)
    }
  },
  methods: {
    openUpdateDialog(lecture) {
      this.selected_lecture = lecture
      this.selected_lecture_key = this.selected_lecture['.key']
      this.dialog = true
    },
    openCreateDialog() {
      this.selected_lecture = {}
      this.selected_lecture_key = ''
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    update_lecture() {
      this.overlay = true
      this.$firebase.firestore().collection('Lectures').doc(this.selected_lecture_key).set(this.selected_lecture, {merge:true}).then(() => {
        this.overlay = false
        alert("Update Success!")
        this.closeDialog()
      })
    },
    create_lecture() {
      this.overlay = true
      this.selected_lecture['admin'] = this.$store.state.user
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
    }
  },
  watch: {
  }
}
</script>