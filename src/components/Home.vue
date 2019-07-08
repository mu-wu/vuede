<template>
  <div>
    this is home
    <!-- <el-button type="info" @click="logout"> 退出 </el-button> -->
    <el-button type="info" @click="logout">登录退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // window.sessionStorage.clear()
      // this.$router.push('/login')

      //清空sessionStroage中保存的TOken
      sessionStorage.clear()
      //编程是导航，跳转登陆页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='less' scoped>
</style>
