<template>
    <div>
            <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
            <el-step title="步骤 1" ></el-step>
            <el-step title="步骤 2" ></el-step>
            <el-step title="步骤 3" ></el-step>
            </el-steps>
        <div class="step-one" v-show="active==0"> 
            <el-card class="box-card" >
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="100px" class="demo-ruleForm">
                        <el-form-item label="方案名称" prop="planName">
                            <el-input v-model="ruleForm.planName" placeholder="请输入方案名称"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="remark">
                            <el-input  v-model="ruleForm.remark" placeholder="请输入对方案的简要描述"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="text-align:center">
             <el-button type="primary" @click="next">下一步 </el-button>

        </div>
                </div>
        </el-card>
        </div>
        <div class="step-two" v-show="active==1">
              <div style="margin-left: 400px; margin-top: 100px">
                    <el-transfer
                    style="text-align: left; display: inline-block"
                    v-model="value"
                    :titles="['已选组件', '可选组件']"
                      :button-texts="['选中', '取消']"
                    :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                    }"
                    :data="transferData">
                    </el-transfer>
                </div>
                  <div style="margin-left:600px;margin-top:30px">
             <el-button type="primary" @click="pre">上一步 </el-button>
             <el-button type="primary" @click="next" >下一步  </el-button>
            
        </div>   
        </div>
        <div class="step-three" v-show="active==2">
             <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>添加业务应用Git地址</span>
                </div>
                <div>
                    <el-button type="primary" @click="gitAdd()">增加</el-button>
                    <el-table :data="gitData">
                     <el-table-column type="selection" width="55"></el-table-column>
                     <el-table-column label="Git地址" prop="gitAddr"></el-table-column>
                     <el-table-column label="操作">
                     <template slot-scope="scope"  width="55">
                        <el-button   type="info"  size="small"  @click="handleEdit(scope.row.id)">修改</el-button>
                        <el-button   type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                    </el-table-column>
                    </el-table>
                </div>
                <div style="text-align:center; margin-top:30px;">
                    <el-button type="primary" @click="pre">上一步</el-button>
             <el-button type="primary" @click="next">保存并构建
             </el-button>
        </div>
             </el-card>
        </div>
              <gitAddDialog  :gitShow="addgit" @after-close="afterclose" @add-git="getGit"/>
    </div>

</template>
<script>
import gitAddDialog from './gitAddDialog'
export default {
    data(){
        return{
            active:0,  //步骤0  
            content:"下一步" ,   //按钮名称
            addgit:false, 
            getGitAddr:"",
            gitData:[{
                gitAddr:""
            }], 
            ruleForm:{
                planName:"" ,  //方案名称
                remark:""    ,   //描述
            },
            rules:{
                planName: [
                    {required: true, message: '请输入方案名称', trigger: 'blur'},
             ],
              remark: [
                    {required: true, message: '请输入对方案名称的简要描述', trigger: 'blur'},
             ],
            },
            transferData:[
                { key:1, label:"布控"},
                { key:2, label:"视频源管理<布控组件依赖项>"},
                { key:3, label:"同步服务",},
                { key:4, label:"1400Support<核心>"},
                { key:5, label:"一人一档<业务>"},
                { key:6, label:"异步服务<基础>"},
                 { key:7, label:"UUMS<核心>"},
            ],
            value:[4,5,6,7],

        }
    },
    components:{
       gitAddDialog 
    },
    computed:{
       
    },
    watch:{
        'gitData':function(){
            this.gitData.gitAddr=getGitAddr;
        }
    },
    methods:{

        next:function(){
        let _this=this;
        if(_this.active==0){
             _this.$refs["ruleForm"].validate((valid) => {
                 if(valid==false){
                _this.$message({
                  type: 'warning',
                  message: '有些字段必填'
                });
                 }
                 else{
                     _this.active=1;
                   
                 }
             })
        }
        else if(_this.active==1){
             _this.active=2;
        }
        else if(_this.active==2){
           
            _this.$router.push('/planList')
        }

        },
        pre:function(){
           if(this.active==1){
               this.active=0
           }
           else if(this.active==2){
               this.active=1
           }
        },
        afterclose:function(){
            this.addgit=false;
        },
        gitAdd:function(){
             this.addgit=true;
        },
        getGit:function(git){
            this.getGitAddr=git;
        },
        handleEdit:function(){

        },
        handleDelete:function(){

        },
       
              
        
    }

}
</script>
<style>
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 600px;
    margin-left: 400px;
     margin-top: 100px
  }
</style>

