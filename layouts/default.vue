<template>
  <div class="main-container h-100">
    <b-navbar toggleable="sm" type="dark" variant="dark" class="">
      <b-navbar-brand>
        <NuxtLink class="nuxtlink" to="/">Hamed Jafarzadeh</NuxtLink>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <NuxtLink to="/blog">Blog</NuxtLink>
          </b-nav-item>
          <b-nav-item href="http://hamedj.ir/cv">CV</b-nav-item>
          <b-nav-item-dropdown text="Projects">
            <b-dropdown-item>
              <nuxt-link class="nuxtlink" to="/IMPAQT">IMPAQT ultrasonic telemetry system</nuxt-link>
            </b-dropdown-item>
            <!--            <b-dropdown-item href="#">FUM Bionic Hand robot</b-dropdown-item>-->
            <!--            <b-dropdown-item href="#">FUM Lawn Mower robot</b-dropdown-item>-->
            <!--            <b-dropdown-item href="#">FUM Segway Personal Transporter</b-dropdown-item>-->
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <!--        <b-navbar-nav class="ml-auto">-->
        <!--          <b-nav-form>-->
        <!--            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>-->
        <!--            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>-->
        <!--          </b-nav-form>-->
        <!--        </b-navbar-nav>-->
      </b-collapse>
    </b-navbar>

    <Nuxt/>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
