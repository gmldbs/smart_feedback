<template>
  <b-container fluid>
    <v-col
        class="d-flex"
        cols="12"
        sm="6"
      >
        <v-select
          :items="question_list"
          label="Select question"
          v-model="selected_question"
        ></v-select>
      </v-col>
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
      <v-btn
      class="ma-2"
      outlined
      color="indigo"
      @click = "submit()"
      >
      submit
      </v-btn>
    </b-row>
  </b-container>
</template>

<script>

  export default {
    name: 'Submit_Code',
    data () {
      return {
        code : '',
        question_list : [],
        selected_question : '',
      }
    },
    created () {
      this.$http.get('./api/get_question_list').then((response) => {
        this.question_list = response.data
        console.log(this.question_list)
      })
    },
    methods: {
      submit () {
        if(this.selected_question == '') {
          alert("select question type.")
          return
        }
        this.$http.post('/api/submit_code', { code: this.code, problem: this.selected_question})
        .then((response) => {
          alert("Correct case : "+response.data.correct+" in Total : "+response.data.total)
          console.log(response.data)
        })
      }
    },
  }
</script>
