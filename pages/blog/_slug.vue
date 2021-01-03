<template>
  <div class="container mt-5" >
    <article :class="(article.lang === 'fa')? {farsi:true}:{farsi:false}" >
      <h1 id="post-title" class="text-center mb-1 ">{{ article.title }}</h1>
      <div class=" text-center">
        <span class="badge badge-pill badge-info m-1" v-for="tag of article.tags">
          {{ tag }}
        </span>
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
      </div>
      <hr class="mb-3" />
      <!--      <div class="d-flex mx-auto justify-content-center">-->
      <!--        <img class="img img-fluid" :src="article.img">-->
      <!--      </div>-->
      <template  v-if="article.tocgenerate">
        <h3 v-if="article.lang==='en'">List of content</h3>
        <h3 v-if="article.lang==='fa'">فهرست مطالب</h3>
        <ul>
          <li v-for="link of article.toc" :key="link.id">
            <NuxtLink :to="`#${link.id}`">{{ link.text }}</NuxtLink>
          </li>
        </ul>
      </template>
      <nuxt-content id="post-content" :document="article" />
      <!--      {{article.path}}-->
    </article>
  </div>

</template>

<script>
let luxon = require('luxon')
export default {
  async asyncData({$content, params}) {
    const article = await $content('articles', params.slug).fetch()
    return {article}
  },
  data() {
    return {
      luxon: luxon
    }
  },
  head() {
    return {
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description },
        // Open Graph
        { hid: 'og:title', property: 'og:title', content: this.article.title },
        { hid: 'og:description', property: 'og:description', content: this.article.description },
        // Twitter Card
        { hid: 'twitter:title', name: 'twitter:title', content: this.article.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.article.description }
      ]
    }
  }
}
</script>

<style>


.nuxt-content h2 {
  display: table;
}
/* blockquote */
blockquote {
  border-left: 4px solid #45A9F9;
  padding: 15px;
  background-color: #0c2c42;
}

.farsi blockquote {
  border-left: 0;
  border-right: 4px solid #45A9F9;
  padding: 15px;
  background-color: #0c2c42;
}

.farsi blockquote blockquote {
  padding-right: 0em;
}
.nuxt-content h2:after {
  content: " ";
  width: 80%;
  display: block;
  --border-opacity: 1;
  box-sizing: border-box;

  margin-top: .5rem;
  margin-bottom: .25rem;
  border-radius: .25rem;
  border-bottom: 3px solid #718096;
  border-color: rgba(113, 128, 150, var(--border-opacity));

}

.nuxt-content h3 {
  font-weight: bold;
  font-size: 22px;
}

.nuxt-content p {
  margin-bottom: 20px;
}

.nuxt-content img{
  width: auto;
  display: block;
  max-width: 100%;
  margin-left: auto;
  margin-right:auto;
}

</style>
