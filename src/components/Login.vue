<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <!-- model="loginForm"：表单中的数据和它的对象进行绑定 -->
      <!-- ref:="loginFormRef":设置表单的引用，loginFormRef就代表表单本身，可以通过这个名字来找当前的表单 -->
      <el-form
        :model="Loginform"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
        ref="loginFormRef"
      >
        <!-- 登录 -->
        <!-- 如想要验证规则和表单元素进行对应，需要prop来进行设置。验证规则prop跟绑定的表单元素的属性一致 -->
        <el-form-item prop="username">
          <el-input v-model="Loginform.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="Loginform.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单得数据绑定对象
      Loginform: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //验证用户密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  //添加行为，
  methods: {
    //重置表单
    resetLoginForm() {
      this.$refs['loginFormRef'].resetFields()
    },
    //添加表单重置方法
    login() {
      //表单校验
      this.$refs.loginFormRef.validate(async valid => {
        //如共没通过就return，就不会执行后续 其他代码
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.Loginform)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        //保存到sessionStorage
        sessionStorage.setItem('token', res.data.token)
        //跳转到后台管理页面"/home"
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
