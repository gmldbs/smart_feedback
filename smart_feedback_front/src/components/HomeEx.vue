<template>
    <div>
        <home-header/>
        <section class="section back1">
            <!--h1 class="title2">Submit & Grading</h1-->
            <div class="container">
                <div class="row row-grid align-items-center">
                    <div class="col-md-6">
                        <div class="card bg-default shadow border-0">
                            <img src="@/assets/submit_image.png">
                            <blockquote class="card-blockquote">
                                <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 583 95"
                                     class="svg-bg">
                                    <polygon points="0,52 583,95 0,95" class="fill-default"></polygon>
                                    <polygon points="0,42 583,95 683,0 0,95" opacity=".2" class="fill-default"></polygon>
                                </svg>
                                <h5 class="display-3 text-black">Grading System</h5>
                                <p class="lead text-italic text-black">The Arctic Ocean freezes every winter and much of
                                    the sea-ice then thaws every summer, and that process will continue whatever
                                    happens.</p>
                            </blockquote>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="pl-md-5">
                            <h3>Submit & Grading</h3>
                            <p class="lead">You can submit and be grade where submit page.</p>
                            <p>You can see your grade that represent number of corrects and total</p>
                            <p>You can complain about your score <a href="#" class="font-weight-bold text-warning mt-5">in here</a></p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="section back2">
            <!--h1 class="title1">Feedback System</h1-->
            <div class="container">
                <div class="row row-grid align-items-center">
                    <div class="col-md-6">
                        <div class="pl-md-5">
                            <h3>Feedback</h3>
                            <p class="lead">You can submit and be grade where submit page.</p>
                            <p>You can see your grade that represent number of corrects and total</p>
                            <p>You can complain about your score <a href="#" class="font-weight-bold text-warning mt-5">in here</a></p>
                            
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card bg-default shadow border-0">
                            <img src="@/assets/submit_image.png">
                            <blockquote class="card-blockquote">
                                <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 583 95"
                                     class="svg-bg">
                                    <polygon points="0,52 583,95 0,95" class="fill-default"></polygon>
                                    <polygon points="0,42 583,95 683,0 0,95" opacity=".2" class="fill-default"></polygon>
                                </svg>
                                <h5 class="display-3 text-black">Grading System</h5>
                                <p class="lead text-italic text-black">The Arctic Ocean freezes every winter and much of
                                    the sea-ice then thaws every summer, and that process will continue whatever
                                    happens.</p>
                            </blockquote>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.section {
    min-height: 100vh;
    padding-top: 5%;
}
.card {
    position: relative;
}

.profile-page {
    .card-profile {
        margin-top: -150px;

        .card-profile-image {
            position: relative;
            //min-height: 130px;

            img {
                max-width: 180px;
                transform: translate(-50%,-30%);
                position: absolute;
                left: 50%;

                &:hover {
                    transform: translate(-50%, -33%);
                }
            }
        }

        .card-profile-stats {
            padding: 1rem 0;

            > div {
                text-align: center;
                margin-right: 1rem;
                padding: .875rem;

                &:last-child {
                    margin-right: 0;
                }

                .heading {
                    font-size: 1.1rem;
                    font-weight: bold;
                    display: block;
                }
                .description {
                    font-size: .875rem;
                }
            }
        }

        .card-profile-actions {
            padding: .875rem;
        }
    }
}

// Card with blockquotes

.card {
    .card-blockquote {
        padding: 2rem;
        position: relative;

        .svg-bg {
            display: block;
            width: 100%;
            height: 95px;
            position: absolute;
            top: -94px;
            left: 0;
        }
    }
}

// Animated cards

.card-lift--hover {
    &:hover {
        transform: translateY(-20px);
    }
}
.title1 { color: #2f7c5f; font-family: 'Trocchi', serif; font-size: 45px; font-weight: normal; line-height: 48px; margin: auto auto 3% 7%; }
.title2 { color: #271972; font-family: 'Trocchi', serif; font-size: 45px; font-weight: normal; line-height: 48px; margin: auto auto 3% 7%; }

.back1 {
  background-image: linear-gradient(#ffffff 0%, rgb(63, 114, 161) 100%);
  background-size:cover;
}
.back2 {
  background-image: linear-gradient(#ffffff 0%, rgb(85, 207, 136) 100%);
  background-size:cover;
}
</style>
