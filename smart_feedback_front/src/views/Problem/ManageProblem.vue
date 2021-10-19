<template>
  <v-container>
      <h1 class="problem_title">Problem List</h1>
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
            <v-data-table
            :headers="headers"
            :items="question_list"
            :search="search"
            @click:row="handleClick"
            ></v-data-table>
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
            <v-toolbar-title>{{selectedProblem.name}}</v-toolbar-title>
            </v-toolbar>
            <v-list
            three-line
            subheader
            >
            <v-subheader>Control Smart Feedback</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Do Smart Feedback</v-list-item-title>
                    <v-btn color="success" @click="doFeedback()"> Do Smart Feedback </v-btn>
                    <v-btn color="primary" @click="getFeedbackData()" v-if="csv_name.length>0"> Get Smart Feedback Data</v-btn>
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
                <v-data-table
                :headers="Feedback_headers"
                :items="Feedback_data"
                :search="Feedback_search"
                @click:row="handleClick"
                ></v-data-table>
            </v-card>
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
    Feedback_search: '',
    question_list : [],
    headers: [
        {
        text: 'Problem Name',
        align: 'start',
        value: 'name',
        }
    ],
    selectedProblem: {},
    dialog: false,
    overlay: false,
    csv_name: '',
    Feedback_data : [],
    Feedback_headers: [
        {
            text: 'File Name',
            align: 'start',
            value: 'File Name'
        },
        {
            text: '#Test Case',
            value: '#Test Case'
        },
        {
            text: '#Passed Test Case',
            value: '#Passed Test Case'
        },
        {
            text: 'Origin Code',
            value: 'Buggy Code'
        },
        {
            text: 'Repair Code',
            value: 'Refactored Correct Code'
        },
    ]
  }),
  created () {
    this.$http.get('./api/get_question_list').then((response) => {
        response.data.forEach(problem => {
            var temp = {}
            temp.name = problem
            this.question_list.push(temp)
        });
    //this.question_list = response.data
    console.log(this.question_list)
    })
  },
  methods: {
    handleClick(val) {
        this.selectedProblem = val
        this.dialog = true
        this.overlay = true
        this.$http.post('/api/get_question_info', {problem_name : this.selectedProblem.name})
        .then((response) => {
            this.csv_name = response.data
            this.overlay = false
        })
    },
    getFeedbackData() {
        this.overlay = true
        this.$http.post('/api/get_feedback_info', {problem_name : this.selectedProblem.name, csv_name : this.csv_name})
        .then((response) => {
            this.Feedback_data = response.data
            this.overlay = false
            console.log(this.Feedback_data)
        })
    },
    doFeedback() {
        this.overlay = true
        this.$http.post('/api/do_feedback', {problem_name : this.selectedProblem.name})
        .then((response) => {
            console.log(response.data)
            this.overlay = false
        })
    },
    closeDialog() {
        this.dialog = false
        this.selectedProblem = {},
        this.Feedback_data = []
        this.csv_name = []
    }
  },
  watch: {
  }
}
</script>