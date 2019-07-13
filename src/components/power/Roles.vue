<template>
  <div>
    <h3>权限列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index1===0 ? 'bdtop' : 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 第一个el-col渲染的是所有的一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ?' ':'bdtop','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,index3) in item2.children"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                      :key="item3.authName"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
            <el-button
              icon="el-icon-setting"
              type="warning"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 弹窗主体 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认的选中的节点的ID值数组
      defKeys: [],
      //当前即将分配权限的角色ID
      rowId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      console.log(res.data)
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    async removeRightById(row, id) {
      const result = await this.$confirm('此操作将永久删除文件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (result === 'cancel') {
        //用户点击的是取消
        return this.$message.info('取消了删除操作')
      }
      //当用户点击确定按钮，删除角色对应的权限
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      )

      console.log(res)

      if (res.meta.status !== 200) {
        this.$message.error('取消权限失败')
      }
      this.$message.success('取消权限成功')
      // this.getRolesList();
      row.children = res.data
    },

    //展示分配权限的对话框
    async showSetRightDialog(row) {
      this.rowId=row.id
      //获取所有的权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) {
        return this.$message.error('获取角色权限失败')
      }
      console.log('............')
      console.log(res)

      this.setRightDialogVisible = true
      this.rightsList = res.data

      this.getLeafKeys(row, this.defKeys)
    },

    //通过递归的形式角色下的所有三级权限的ID
    //etLeafKeys数组中

    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      //如果当前的node 节点不包含children属性，则是三级节点
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotRights(){
      const keys =[
        ...this.$refs.treeRef.
        getCheckedKeys(),
        ...this.$refs.treeRef.
        getHalfCheckedKeys()
      ]
      // console.log(keys);
      const idstr = keys.join(',')

      const {data:res} =await this.$http.post(`roles/${this.rowId}/rights`,{rids:idstr})

      if(res.meta.status !==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
