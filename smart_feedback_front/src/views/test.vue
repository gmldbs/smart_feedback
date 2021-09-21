<template>
  <div class="example-simple">
    <b-form-file
      v-model="files"
      :state="Boolean(files)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      webkitdirectory multiple
    ></b-form-file>
    <button @click="test()"> test </button>
  </div>
  
</template>

<script>
export default {
  data: () => ({
    files: [],
    loading: false,
    page: 1,
    show_files: [],
  }),
  methods: {
    test() {
        console.log(this.files)
    },
  }
}
</script>