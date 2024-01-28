<template>
  <div id="app" @contextmenu="disableRightClick">
    <router-view></router-view>
  </div>
</template>

<script>
import { getToken } from '@/utils/token'
import { mapActions } from 'vuex'

export default {
  name: 'APP',
  methods: {
    ...mapActions({
      updateAllCert: 'userStore/updateAllCert',
      logout: 'userStore/logout'
    }),
    disableRightClick(e) {
      e.preventDefault()
    }
  },
  created() {
    let { bd_vid } = this.$route.query
    if (bd_vid) {
      window.localStorage.setItem('bd_vid', bd_vid)
    }
    if (!!getToken()) {
      this.updateAllCert()
    } else {
      this.logout()
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
