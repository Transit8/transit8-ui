<template>
  <!-- Footer -->
  <footer class="black-bg">
    <div class="footer-top clearfix">
      <div class="col-sm-4 text-left text-uppercase">
        <ul class="list-inline">
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/resources">Resources</router-link></li>
          <li><router-link to="/how-it-works">How it works</router-link></li>
        </ul>
      </div>
      <div class="col-sm-8 text-left">
        <newsletter-form @submit="submitNewsletterEmail($event)"/>
      </div>
    </div>
    <div class="footer-bottom clearfix">
      <div class="col-sm-6">
        <ul class="list-inline">
          <li class="text-uppercase "><span class="copy">&copy;</span>2018 Sybella</li>
          <li><router-link to="/privacy">Privacy Policy</router-link></li>
          <li>Karl Marx Allee 98, 10243 Berlin, DE</li>
        </ul>
      </div>
      <div class="col-sm-6 social">
        <ul class="list-inline ">
          <li class="text-uppercase">Join the conversation</li>
          <li><a href="#"><span class="icon-email"></span></a></li>
          <li><a href="#"><span class="icon-m_social"></span></a></li>
          <li><a href="#"><span class="icon-instagram"></span></a></li>
        </ul>
      </div>
    </div>
  </footer>
  <!-- / Footer -->
</template>

<script>
import NewsletterForm from './NewsletterForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AppFooter',
  components: { NewsletterForm },
  methods: {
    submitNewsletterEmail (email) {
      console.log(email)
      // TODO submit email to newsletter service
    }
  }
}
</script>
