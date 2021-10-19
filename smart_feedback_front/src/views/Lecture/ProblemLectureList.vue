<template>
  <v-container>
      <h1 class="problem_title">Lecture List</h1>
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
            :items="lecture_list"
            :search="search"
            @click:row="handleClick"
            ></v-data-table>
      </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: '',
    headers: [
        {
            text: 'Lecture Name',
            align: 'start',
            value: 'lecture_name'
        },
        {
            text: 'year',
            value: 'year'
        },
        {
            text: 'semester',
            value: 'semester'
        }
    ],
    lecture_list: [],
  }),
  firestore () {
    return {
        lecture_list : this.$firebase.firestore().collection('Lectures').where("admin", "==", this.$store.state.user)
    }
  },
  methods: {
    handleClick(val) {
        console.log(val)
        this.$router.push('/problem_list/'+val['.key'])
    },
  },
  watch: {
  }
}
</script>