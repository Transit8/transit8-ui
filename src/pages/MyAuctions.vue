<template>
  <section class="white-bg black">
    <div class="row">
      <div class="col-md-2 pt-80">
        <ul>
          <li>
            <router-link to="/my-auctions/upload">
              New Auction
            </router-link>
          </li>
          <li>
            <router-link to="/my-auctions">
              My Auctions
            </router-link>
          </li>
        </ul>
      </div>
      <div class="col-sm-10 pt-60 pl-60">
        <router-view>
        </router-view>
      </div>
    </div>
  </section>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyAuctions',
  components: { },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  },
}
</script>
