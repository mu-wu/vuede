import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    // 进行全局挂载：VUE实例上
Vue.prototype.$message = Message;