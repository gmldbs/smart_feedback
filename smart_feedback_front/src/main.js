import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import vuetify from './plugins/vuetify'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import VueFirestore from 'vue-firestore'
import VueLazyload from "vue-lazyload"
import CKEditor from 'ckeditor4-vue';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles
//import 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCyP12_GNBAc7JM2dKoCumP2qsqNNGwotE",
  authDomain: "smartfeedback-e67ce.firebaseapp.com",
  projectId: "smartfeedback-e67ce",
  storageBucket: "smartfeedback-e67ce.appspot.com",
  messagingSenderId: "931637563443",
  appId: "1:931637563443:web:92910e2f5b335f39095346",
  measurementId: "G-FNS5H7F0ML"
};

firebase.initializeApp(firebaseConfig)

Vue.use(BootstrapVue)
Vue.use(VueMaterial)
Vue.use(VueFirestore)
Vue.use(VueLazyload)
Vue.use(CKEditor)

Vue.component('PrismEditor', PrismEditor);
Vue.config.productionTip = false
Vue.prototype.$http = axios
//Vue.prototype.$db = firebase.firestore()
Vue.prototype.$firebase = firebase
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')