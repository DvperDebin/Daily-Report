<template>
  <div class="main_detail">
    <aside class="left_aside">
      <section class="title">

      </section>
      <nav>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#fff"
          text-color="rgb(130,130,130)"
          router
          unique-opened
          :default-active="parentPath"
        >
          <div v-for="(item,index) in navData" :key="index" >
            <el-submenu v-if="item.children && item.children.length > 0" :index="item.path">
              <template slot="title">
                <span>{{$t(item.name)}}</span>
              </template>
              <el-menu-item :index="childItem.path" :key="index+ind" v-for="(childItem,ind) in item.children" v-show="childItem.meta.navShow">{{$t(childItem.name)}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.path">
              <span slot="title">{{$t(item.name)}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </nav>
    </aside>
    <main class="right_main">
      <header class="main_header"></header>
      <section class="content">
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>

<script>
import Router from '@/router/index'
export default {
  data () {
    return {
      parentPath: '',
      navData: []
    }
  },
  methods: {
    findParentPath () {
      if (this.$route.matched.length < 3) {
        this.parentPath = this.$route.matched[1].path
      } else {
        this.parentPath = this.$route.matched[2].path
      }
    },
    asideNav () {
      let routerData = this.$easyDeepClone(Router.options.routes[2].children)
      this.navData = routerData
    }
  },
  mounted () {
    this.findParentPath()
    this.asideNav()
  }
}

</script>

<style scoped src="./dashboard.scss" lang="scss">

</style>
