<template>
    <div>
         <el-dialog ref="dialog" @close="close" title="添加业务应用Git地址" :visible.sync="gitShow" :close-on-click-modal="false" width="40%">
                <el-card class="carddiv">
                <div>
                    <el-form :model="business">
                      <el-form-item label="业务源码Git地址" >
                          <el-input v-model="business.gitAddr" placeholder="在此输入业务源码在Github的地址，用于自动化CI&cd"></el-input>
                      </el-form-item>
                    </el-form>
                </div>
             </el-card>
             <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddGit()">确定</el-button>
        <el-button type="primary" @click="gitShow=false">关闭</el-button>
      </div>
         </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            business:{
              gitAddr:"" ,   //git地址  
            },
        }
    },
    props:["gitShow"],
    methods:{
        handleAddGit:function(){
            let _this=this;
           _this.$emit('add-git' , _this.business.gitAddr) 
            _this.gitShow=false;
        },
        close:function(){
            this.$emit('after-close')
        },
    }
}
</script>
<style scoped>
 .carddiv {
    width: 600px;
    margin-left: 80px;
     margin-top: 40px
  }
</style>
