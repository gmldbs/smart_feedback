<template>
    <div>
        <div class="background">
            <StickyElement>
                <app-header :isFlat="scrollPosition ==0 || scrollPosition == null ? true : false" />
            </StickyElement> 
            <v-container>
                <v-row class="text-center">
                <v-col cols="12">
                    <v-img
                    :src="require('../assets/skku_logo.png')"
                    class="my-3"
                    contain
                    height="200"
                    />
                </v-col>
                <v-col class="mb-4">
                    <h1 class="display-2 font-weight-bold mb-3" style="color:white">
                    Welcome to SKKU Smart Feedback System
                    </h1>
                    <p class="subheading font-weight-regular" style="color:white">
                    This is SKKU Smart Feedback System,
                    <br> You can join us
                    <a
                        href="https://cs.skku.edu/ko/"
                        target="_blank"
                    >SKKU Software</a>
                    </p>
                </v-col>
                </v-row>
            </v-container>
            </div>
        
        <section class="back1">
            <div class="container">
                <v-img
                src="../assets/list.png"
                max-height="150"
                max-width="150"
                contain
                style="margin-top:30px;margin-left: auto; margin-right: auto;margin-bottom:30px;"
                ></v-img>
                <h2 style="text-align:center">SKKU Smart Feedback System</h2>
                <p style="text-align:center; margin-bottom:50px;">
                    Our Feedback System can manage lectuers & problems & feedback
                </p>
                <div class="row row-grid align-items-center">
                    <div class="col-md-6">
                        <div class="pl-md-5">
                            <v-hover style="margin-bottom:30px;" v-slot="{ hover }" open-delay="30" close-delay="30">
                                <button style="text-align:left">
                                <v-card
                                :elevation="hover ? 16 : 0"
                                :class="{ 'on-hover': hover }"
                                class="mx-auto cardColor"
                                @click.native="select(1)"
                                >
                                    <v-card-text :style="select_component == 1 ? 'color:black' : 'color:grey'">
                                        <h3>Writing code & Submit</h3>
                                        <p class="lead">You can write code & submit where problem solve page.</p>
                                        <p>You can see code highlight in most language.</p>
                                        <p>You can suggest about this function <a href="#" class="font-weight-bold text-warning mt-5">in here</a></p>
                                    </v-card-text>
                                </v-card>
                                </button>
                            </v-hover>
                            <v-hover style="margin-bottom:20px;" v-slot="{ hover }" open-delay="30" close-delay="30">
                                <button style="text-align:left">
                                <v-card
                                :elevation="hover ? 16 : 0"
                                :class="{ 'on-hover': hover }"
                                class="mx-auto cardColor"
                                @click.native="select(2)"
                                >
                                    <v-card-text :style="select_component == 2 ? 'color:black' : 'color:grey'">
                                        <h3>Grading & Feedback</h3>
                                        <p class="lead">grade and get feedback where problem solve page & problem list page.</p>
                                        <p>You can see your repair code when submit or professor publish students' feedback.</p>
                                        <p>You can see your grade that represent number of corrects and total</p>
                                        <p>You can complain about your score <a href="#" class="font-weight-bold text-warning mt-5">in here</a></p>
                                    </v-card-text>
                                </v-card>
                                </button>
                            </v-hover>
                            <v-hover style="margin-bottom:20px;" v-slot="{ hover }" open-delay="30" close-delay="30">
                                <button style="text-align:left">
                                <v-card
                                :elevation="hover ? 16 : 0"
                                :class="{ 'on-hover': hover }"
                                class="mx-auto cardColor"
                                @click.native="select(3)"
                                >
                                    <v-card-text :style="select_component == 3 ? 'color:black' : 'color:grey'">
                                        <h3>Manage Lectures & Problems</h3>
                                        <p class="lead">Professor can create & manage Lectures & Problems.</p>
                                        <p>Professor can manage students' feedback in manage problems page.</p>
                                        <p>If you have any question about this function, <a href="#" class="font-weight-bold text-warning mt-5">refer here</a></p>
                                    </v-card-text>
                                </v-card>
                                </button>
                            </v-hover>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <transition name="fade" class="card bg-default shadow">
                            <v-img :src="selected_image"/>
                        </transition>
                        
                    </div>
                </div>
            </div>
        </section>
        <section class="back2">
            <div class="container">
                <v-img
                src="../assets/list.png"
                max-height="150"
                max-width="150"
                contain
                style="margin-top:30px;margin-left: auto; margin-right: auto;margin-bottom:30px;"
                ></v-img>
                <div class="row row-grid align-items-center">
                    <div class="col-md-6" style="text-align : center">
                        <h3>Notice</h3>
                    </div>
                    <div class="col-md-6" style="text-align : center">
                        <h3>How to Use</h3>
                    </div>
                </div>
            </div>
        </section>
        <app-footer />
    </div>
</template>
<script>
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import StickyElement from 'vue-sticky-element'
export default {
  components: { AppHeader,  AppFooter,  StickyElement},
  data: () => ({
    scrollPosition: null,
    select_component : 1,
    selected_image: require('@/assets/solve_page.png'),
    image_src : [
        '@/assets/solve_page.png',
        '@/assets/submit_image.png',
        '@/assets/manage.png'
        ]

  }),
  methods: {
    updateScroll() {
        this.scrollPosition = window.scrollY
    },
    select(target) {
        this.select_component = target
        if(target == 1) this.selected_image = require('@/assets/solve_page.png')
        else if(target == 2) this.selected_image = require('@/assets/feedback.png')
        else this.selected_image = require('@/assets/manage.png')
    }
  },
  mounted() {
      window.addEventListener('scroll', this.updateScroll)
  },
  destroy() {
      window.removeEventListener('scroll', this.updateScroll)
  }
}
</script>
<style lang="scss" scoped>
.back1 {
    height: min-content;
}
.back2 {
    height: min-content;
}
.background {
  min-height: min-content;
  background-color: rgb(36,41,47);
  background-size:cover;
}
</style>
