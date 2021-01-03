<template>
  <div class="container mt-5 mb-5">
    <div class="text-center mb-5">
      <h1>Blog Posts</h1>
      <span style="color: darkgray">These are all the post that I published around the web, here I just gather them together for simpler access</span>
      <div class="row mt-3">
        <div class="col-lg-4 offset-lg-4 text-center">
          <form @submit.prevent="subscribe" method="post" name="mc-embedded-subscribe-form" class="validate" novalidate>
            <label class="pr-3 text-info" for="mce-EMAIL">Would you like to get notified about updates? Subscribe!</label>
            <div class="input-group" style="align-items: center">
              <input type="email" value="" name="EMAIL" class="email form-control bg-dark text-white" id="mce-EMAIL"  ref="subemail" placeholder="Email Address"  required>
              <input value="all" name="which" hidden/>
              <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
              <div style="position: absolute; left: -5000px;" aria-hidden="true">
                <input type="text" ref="token" name="b_d474a9136ae52aac644d9a47a_4267b78c35" tabindex="-1" value="2952045506">
              </div>
              <button type="submit" class="btn btn-primary">Subscribe</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <b-row>
      <b-col class="col-12 col-lg-6 mt-4 overflow-hidden"
             v-for="article of articles" :key="article.slug"
             :class="(article.lang === 'fa')? {farsi: true}:{farsi:false}">
        <b-col class="col-12 post bg " :style="{backgroundImage: `url(${article.img})`}">
        </b-col>
        <b-col class="col-12 post border border-secondary" style="border-radius: 10px">
          <!--        <b-col class="col-sm-12" style="min-height: 40vh; background: rgba(238,232,213,.125); border-radius: 5px"  >-->
          <b-row>
            <!--            <img class="card-img" style="border-radius: 5px; max-height: 30vh" :src="article.img">-->
          </b-row>
          <nuxt-link :to="{ name: 'blog-slug', params: { slug: article.slug }}" class="nuxtlink">
            <b-row class="mt-2">
              <b-col>
                <h3 class="card-title text-left font-weight-bold"
                    :class="(article.lang==='fa')? `text-right`:`text-left`">
                  {{ article.title }}</h3>
              </b-col>
            </b-row>
          </nuxt-link>
          <b-row>
            <b-col>
              <p align="justify" class="" style="font-size:  min(1.5vw,15px); color: lightgray;">
                {{  article.description.substring(0,140)}}
                <span v-if="article.description.length > 140">...</span>
              </p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div>
                <span class="badge badge-pill badge-info m-1" v-for="tag of article.tags">
                  {{ tag }}
                </span>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span class="badge badge-pill badge-primary">
                <fa class="navicon" :icon="['fas','calendar-alt']"/>
              {{
                  luxon.DateTime.fromISO(article.createdAt).toLocaleString({
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                }}
              </span>
            </b-col>
          </b-row>
        </b-col>
      </b-col>
    </b-row>

  </div>
</template>

<script>
let luxon = require('luxon')
export default {
  async asyncData({$content, params}) {
    const articles = await $content('articles', params.slug)
      .without('body')
      .where({publish:true})
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      articles
    }
  },
  data() {
    return {
      luxon: luxon
    }
  }
  ,
  methods:{
    subscribe(){
      this.$axios.post('http://server.hamedj.ir:2688/BotGateway/blogSubscribe',
        `token=${this.$refs.token.value}&email=${this.$refs.subemail.value}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

    }
  }
}
</script>

<style>

</style>
