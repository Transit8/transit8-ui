<template>
<section class="container">
  <div class="columns">
    <div class="column">
      <h1 class="title">Content Block</h1>
      <p>Content Block consists of two applications.
      The first allows content to be created and the second
      allows it to be consumed.</p>
    </div>
  </div>
  <div class="columns">
  <div class="column">
    <div class="card">
      <div class="card-content is-warning">
        <h2 class="title">DCMS</h2>
        <h3 class="subtitle">A Headless CMS dApp</h3>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <a href="#" class="button is-success">
            <i class="fa fa-thumbs-o-down"></i>
          </a>
        </div>
        <div class="card-footer-item">
          <a href="#" class="button is-info">
            <i class="fa fa-retweet"></i>
          </a>
        </div>
      </footer>
    </div>
  </div>
  <div class="column">
    <div class="card">
      <div class="card-content">
        <h2 class="title">PeaPods</h2>
        <h3 class="subtitle">A dummy podcasting dApp</h3>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <a href="#" class="button is-success">
            <i class="fa fa-thumbs-o-down"></i>
          </a>
        </div>
        <div class="card-footer-item">
          <a href="#" class="button is-info">
            <i class="fa fa-retweet"></i>
          </a>
        </div>
      </footer>
    </div>
  </div>
  </div>
</section>
</template>

<script>
export default {
  data: () => ({
  })
}
</script>

<style>
.container {
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>
