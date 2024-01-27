<template>
  <div id="app" @contextmenu="disableRightClick">
    <router-view></router-view>
  </div>
</template>

<script>
import {getToken} from "@/utils/token";

export default {
  name: 'APP',
  methods: {
    disableRightClick(e) {
      e.preventDefault()
    }
  },
  created() {
    let { bd_vid } = this.$route.query
    if (bd_vid) {
      window.localStorage.setItem('bd_vid', bd_vid)
    }
    if (getToken()) {
      this.$store.dispatch('updateUserInfo')
    }
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
