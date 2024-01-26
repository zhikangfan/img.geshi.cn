<template>
  <div class="tabBar">
    <div :class="{tabItem: true, active: $route.path === tab.path}" v-for="(tab,idx) in tabBar" :key="idx" @click="jumpTo(tab.path)">
      <span class="icon" :style="$route.path === tab.path ? {backgroundImage: `url(${tab.activeIcon})`} : {backgroundImage: `url(${tab.icon})`}"></span>
      <span class="txt">{{tab.title}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MyTabBar',
  components: {},
  props: {},
  data() {
    return {
      tabBar: [
        {
          title: '轻秒',
          path: '/',
          icon: require('@/assets/img/nav_icon_qingmiao.svg'),
          activeIcon: require('@/assets/img/nav_icon_qingmiao_active.svg')
        },
        {
          title: '我的',
          path: '/personal-center',
          icon: require('@/assets/img/nav_icon_me.svg'),
          activeIcon: require('@/assets/img/nav_icon_me_active.svg')
        }
      ]
    }
  },
  methods: {
    jumpTo(path) {
      this.$router.replace(path)
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
