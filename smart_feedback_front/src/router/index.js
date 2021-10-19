import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AppHeader from '../components/AppHeader.vue'
import Login from '../views/Session/Login.vue'
import SignUp from '../views/Session/SignUp.vue'
import Submit from '../views/Problem/Submit.vue'
import AppFooter from '../components/AppFooter.vue'
import HomeHeader from '../components/HomeHeader.vue'
import ManageProblem from '../views/Problem/ManageProblem.vue'
import ProblemList from '../views/Problem/ProblemList.vue'
import StudentProblemList from '../views/Problem/StudentProblemList.vue'
import LectureList from '../views/Lecture/LectureList.vue'
import StudentLectureList from '../views/Lecture/StudentLectureList.vue'
import ProblemLectureList from '../views/Lecture/ProblemLectureList.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      header: HomeHeader,
      default: Home,
      footer: AppFooter
    }
  },
  {
    path: '/submit/:problem_id',
    name: 'Submit',
    components: {
      header: AppHeader,
      default: Submit,
      footer: AppFooter
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    components: {
      default: Login
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    components: {
      default: SignUp
    }
  },
  {
    path: '/manage_problem',
    name: 'Manage Problem',
    components: {
      header: AppHeader,
      default: ManageProblem,
      footer: AppFooter
    }
  },
  {
    path: '/lecture_list',
    name: 'Lecture List',
    components: {
      header: AppHeader,
      default: LectureList,
      footer: AppFooter
    }
  },
  {
    path: '/my_page',
    name: 'Student Lecture List',
    components: {
      header: AppHeader,
      default: StudentLectureList,
      footer: AppFooter
    }
  },
  {
    path: '/problem_lecture_list',
    name: 'Problem Lecture List',
    components: {
      header: AppHeader,
      default: ProblemLectureList,
      footer: AppFooter
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue')
  },
  {
    path: '/firebase_test',
    name: 'firebase_test',
    component: () => import('../views/FirebaseTest.vue')    
  },
  {
    path: '/problem_list/:lecture_key',
    name: 'Problem List',
    components: {
      header: AppHeader,
      default: ProblemList,
      footer: AppFooter
    }
  },
  {
    path: '/problems/:lecture_key',
    name: 'Student Problem List',
    components: {
      header: AppHeader,
      default: StudentProblemList,
      footer: AppFooter
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
