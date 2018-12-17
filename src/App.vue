<template>
    <div>
        <el-row>
          <el-col :span="4">
     <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose" style="margin-top:20px" >
      <el-submenu index="1">
        <template slot="title">
           <i class="el-icon-menu"></i>
          <span>方案管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1"> <router-link to="/planAdd" >新建方案</router-link>   </el-menu-item>
          <el-menu-item index="1-2"> <router-link to="/planList" >方案列表</router-link>   </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
       <el-submenu index="2">
        <template slot="title">
           <i class="el-icon-menu"></i>
          <span>组件管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1"><router-link to="/assemblyAdd" >新建组件</router-link></el-menu-item>
          <el-menu-item index="2-2"><router-link to="/assemblyList" >组件列表</router-link></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
  
    </el-menu>
          </el-col>
          <el-col :span="20">
              <router-view></router-view> 
          </el-col>
        </el-row>
       
    </div>
  
</template>

<script>
export default {
   data(){
       return{

       }
   },

   methods:{
     handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
       //进入新建方案页面
       handleAddPlan:function(){
        this.$router.push('/planAdd')
       },
       //进入方案列表页面
      handleToPlan:function(){
          this.$router.push('/planList')
      }, 
      //进入新建组件页面
      handleAddassembly:function(){
           this.$router.push('/assemblyAdd')
      },
      handleToassembly:function(){
           this.$router.push('/assemblyList')
      },
   },
}
</script>
