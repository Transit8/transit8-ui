<template>
  <!-- Footer -->
  <footer class="black-bg">
    <div class="container-fluid footer-top">
      <div class="col-sm-4 text-left text-uppercase">
        <ul class="list-inline">
          <li><a href="#">About</a></li>
          <li><a href="#">Resources</a></li>
          <li><a href="#">How it works</a></li>
        </ul>
      </div>
      <div class="col-sm-8 text-left">
        <span class="grey">Join our mailing list and stay updated</span>
        <form class="form-inline newsletter-form">
          <input type="email" placeholder="Your email address" class="form-control input-lg grey">
          <button class="btn btn-lg black" type="submit">Submit</button>
        </form>
      </div>
    </div>
    <div class="container-fluid footer-bottom">
      <div class="col-sm-6">
        <ul class="list-inline inline-block">
          <li class="text-uppercase "><span class="copy">&copy;</span>2018 Sybella</li>
          <li><a>Privacy Policy</a></li>
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
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AppFooter',
}
</script>
