<template>
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
        problem_info : {},
        selected_question : '',
      }
    },
    firestore () {
      return {
        problem_list : this.$firebase.firestore().collection('Problems').where("admin", "==", this.$store.state.user)
      }
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
