<template>
  <div class="example-vuex">
    <h1 id="example-title" class="example-title">Problem data Folder Upload</h1>
    <h3>Input problem name</h3>
    <v-container>
        <v-row>
            <v-text-field
            v-model="problem_name"
            hint="Input Problem Name"
            label="Problem Name"
            style="max-width:50%"
            ></v-text-field>
            <v-btn style="max-width:10%" @click="exist_check">check problem</v-btn>
        </v-row>
        <v-row v-if="problem_name !== '' && name_check">
            You can use this problem name!
        </v-row>
        <v-row v-if="problem_name !== '' && !name_check">
            You have to check problem name first!
        </v-row>
        </v-container>
    <div>
        <h3> Upload reference File </h3>
        <div class="file-upload">
            <v-file-input
            counter
            multiple
            truncate-length="15"
            v-model="reference_files"
            ></v-file-input>
        </div>
        <v-simple-table>
        <template v-slot:default>
        <thead>
            <tr>
            <th class="text-left">
                #
            </th>
            <th class="text-left">
                File Name
            </th>
            <th class="text-left">
                File Size
            </th>
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="(file,i) in reference_show_files"
            :key = i
            >
            <td> {{file.idx}} </td>
            <td>{{ file.name }}</td>
            <td>{{ conv_size(file.size) }}</td>
            </tr>
        </tbody>
        <div class="text-center">
            <v-container>
            <v-row justify="center">
                <v-col cols="8">
                <v-container class="max-width">
                    <v-pagination
                    v-model="reference_page"
                    class="my-4"
                    :length="Math.ceil(reference_files.length / 10)"
                    ></v-pagination>
                </v-container>
                </v-col>
            </v-row>
            </v-container>
        </div>
        </template>
    </v-simple-table>
  </div>
  <div>
        <h3> Upload Test case </h3>
        <div class="file-upload">
            <v-file-input
            counter
            multiple
            truncate-length="15"
            v-model="testcase_files"
            ></v-file-input>
        </div>
        <v-simple-table>
        <template v-slot:default>
        <thead>
            <tr>
            <th class="text-left">
                #
            </th>
            <th class="text-left">
                File Name
            </th>
            <th class="text-left">
                File Size
            </th>
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="(file,i) in testcase_show_files"
            :key = i
            >
            <td> {{file.idx}} </td>
            <td>{{ file.name }}</td>
            <td>{{ conv_size(file.size) }}</td>
            </tr>
        </tbody>
        <div class="text-center">
            <v-container>
            <v-row justify="center">
                <v-col cols="8">
                <v-container class="max-width">
                    <v-pagination
                    v-model="testcase_page"
                    class="my-4"
                    :length="Math.ceil(testcase_files.length / 10)"
                    ></v-pagination>
                </v-container>
                </v-col>
            </v-row>
            </v-container>
        </div>
        </template>
    </v-simple-table>
  </div>
    <v-btn @click="upload" class="upload-button"
        :disabled="reference_files.length == 0 || testcase_files.length == 0">Upload files</v-btn>
    <div class="loading-overlay" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
        {{loading_msg}}
    </div>
  </div>
</template>
<style>
.example-vuex label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
</style>

<script>
export default {
  data: () => ({
    testcase_files: [],
    testcase_page: 1,
    testcase_show_files: [],
    reference_files: [],
    loading: false,
    reference_page: 1,
    reference_show_files: [],
    problem_name: '',
    name_check: false,
    loading_msg: '',
  }),
  methods: {
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
        this.$http.post('/api/exist_check', {problem_name : this.problem_name})
        .then((response) => {
            if(!response.data) {
                this.name_check = true
                alert("Can use this name!")
            }
            else {
                this.name_check = false
                alert("This problem name already exist!")
            }
            this.loading = false
            console.log(response.data)
        })
    },
    upload() {
        if(!this.name_check) return alert("Problem name check first!")
        this.loading = true
        this.loading_msg = ""
        this.$http.post('/api/upload_problem_name', {problem_name: this.problem_name})
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
                    if(testcase_end && reference_end) {
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
                    if(testcase_end && reference_end) {
                        this.loading = false
                        alert("Success upload Problem!")
                        this.$router.go(-1)
                    }
                })
            }
            else alert("Something error!")
            this.loading = false
        })
    }
  },
  watch: {
    reference_files: function (val) {
        this.reference_page = 1
        this.reference_show_files = val.slice(0,10)
        for(var i = 0;i<this.reference_show_files.length;i++)
        {
            this.reference_show_files[i].idx = i + 1
        }
    },
    reference_page: function (val) {
        this.reference_show_files = this.reference_files.slice(10*(val-1), 10*val)
        for(var i = 0;i<this.reference_show_files.length;i++)
        {
            this.reference_show_files[i].idx = 10*(val-1) + i + 1
        }
    },
    testcase_files: function (val) {
        this.testcase_page = 1
        this.testcase_show_files = val.slice(0,10)
        for(var i = 0;i<this.testcase_show_files.length;i++)
        {
            this.testcase_show_files[i].idx = i + 1
        }
    },
    testcase_page: function (val) {
        this.testcase_show_files = this.testcase_files.slice(10*(val-1), 10*val)
        for(var i = 0;i<this.testcase_show_files.length;i++)
        {
            this.testcase_show_files[i].idx = 10*(val-1) + i + 1
        }
    },
    problem_name: function () {
        this.name_check = false
    }
  }
}
</script>
<style lang="scss">
.loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>