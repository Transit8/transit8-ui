<template>
<aside class="">
  <h3 class="menu-label">
    Manage Artworks
  </h3>
  <ul class="">
    <li>
      <router-link to="/my-artworks" class="navbar-item">
        My Art Work
      </router-link>
      <!-- <a href="#/provenance/list">My Artworks</a> -->
    </li>
    <li>
      <router-link to="/provenance/create" class="navbar-item">
        Upload Artwork
      </router-link>
      <!-- <a href="#/provenance/create">Upload Artwork</a> -->
    </li>
  </ul>
</aside>
</template>

<script>

export default {
  data: () => ({
  }),
  components: {
  }
}
</script>

<style>
aside {
  margin-left: 50px;
  margin-top: 50px;
}
</style>
