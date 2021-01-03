<template>
  <div  class="d-flex " style="margin-top: 0; min-height: 90vh">
<!--    <div style="width: 100%; background: #343a40" class="d-flex  justify-content-center">-->
<!--      <img src="imgs/headerimg.jpg" class="img-fluid">-->
<!--    </div>-->

    <div class="container-fluid no-gutters my-auto">
      <div class="container-fluid" style="max-width: 65rem">
        <div class="row text-center justify-content-center mt-5">
          <div class="card">
            <b-row class="no-gutters">
              <div class="col-sm-3">
                <img class="card-img" src="imgs/blogPicture.jpg">
              </div>
              <div class="col-sm-9 my-auto">
                <div class="card-body ">
                  <h5 class="card-title text-left">Welcome 😍</h5>
                  <hr>

                  <p class="card-text my-auto" align="justify" style="font-size:  min(1.5vw,15px);">
                    My name is Hamed. I am computer and electronics engineer with over 5 years of software and hardware
                    programming
                    experiences in industry and academic projects. <br/> Recently I watched the Big Bang theory series
                    and I realized how much I have in common with Sheldon 🤓
                    You know why? I started programming at age of 11 👶 and I released a serious software at age of 15
                    😅, my life is all around computers, electronics and sciences 😂
                    I also feel deeply connected with Robots 🤖
                  </p>
                  <!--                  <a href="#" class="btn btn-primary">View Profile</a>-->
                </div>
              </div>
            </b-row>
            <!--            <div class="card-footer">-->
            <!--              aasd-->
            <!--            </div>-->
          </div>
        </div>
      </div>

        <div class="row mt-4 justify-content-center text-center" style="font-size: xx-large">
          <b-col class="col-5">
              <b-row>
                <b-col>
                  <a href="https://github.com/HamedJafarzadeh" >
                    <fa class="navicon" :icon="['fab','github']"/>
                  </a>
                </b-col>
                <b-col>
                  <a href="https://www.linkedin.com/in/hjafarzadeh/">
                    <fa class="navicon" :icon="['fab','linkedin']"/>
                  </a>
                </b-col>
                <b-col>
                  <a href="https://t.me/hamedjafarzadeh">
                    <fa class="navicon" :icon="['fab','telegram']"/>
                  </a>
                </b-col>
                <b-col>
                  <a href="https://twitter.com/HJafarzadeh511">
                    <fa class="navicon" :icon="['fab','twitter']"/>
                  </a>
                </b-col>
                <b-col>
                  <a href="https://www.instagram.com/hamedjafarzadeh/">
                    <fa class="navicon" :icon="['fab','instagram']"/>
                  </a>
                </b-col>
              </b-row>
          </b-col>
        </div>
      <b-row>
        <b-col class="text-center mt-2 mb-2 fixed-bottom" style="font-size: small;">
          Built with NuxtJS framework
        </b-col>

      </b-row>
    </div>


  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueLuxon from "vue-luxon";

Vue.use(VueLuxon);
export default Vue.extend({})

</script>

<style>

</style>
