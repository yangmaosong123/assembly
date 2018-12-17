<template>
    <div>
            <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
            <el-step title="步骤 1" ></el-step>
            <el-step title="步骤 2" ></el-step>
            <el-step title="步骤 3" ></el-step>
            <el-step title="步骤 4" ></el-step>
            </el-steps>
        <div class="step-one" v-show="active==0"> 
            <el-card class="box-card" >
                <div slot="header" class="clearfix">
                    <span>组件基本信息</span>
                </div>
                <div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="100px" class="demo-ruleForm">
                        <el-form-item label="组件名称" prop="assemblyName">
                            <el-input v-model="ruleForm.assemblyName" placeholder="请输入组件名称"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="remark">
                            <el-input  v-model="ruleForm.remark" placeholder="请输入对组件的简要描述"></el-input>
                        </el-form-item>
                        <el-form-item label="版本" prop="versionNumber">
                            <el-input v-model="ruleForm.versionNumber" placeholder="请输入当前组件版本号"></el-input>
                        </el-form-item>
                        <el-form-item label="组件类型" prop="versionType" clearable >
                            <el-select v-model="ruleForm.versionType" placeholder="请选择组件类型">
                              <el-option v-for="item in versionTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="组件级别" prop="versionLvl" clearable >
                            <el-select v-model="ruleForm.versionLvl" placeholder="请选择组件级别">
                              <el-option v-for="item in versionLvls" :key="item.id" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div style="text-align:center">
             <el-button type="primary" @click="next" v-show="showBtn" >{{content}}
             </el-button>
        </div>
                </div>
        </el-card>
        </div>
        <div class="step-two" v-show="active==1">
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
        <div class="step-three" v-show="active==2">
                 <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>组件依赖</span>
                </div>
                <div>
                    <el-form :model="assemblyDepand" label-width="120px">
                      <el-form-item label="选择依赖组件" prop="depand" >
                           <!--<el-select v-model="assemblyDepand.depend" placeholder="请选择组件类型">
                              <el-option v-for="item in depends" :key="item.id" :label="item.label" :value="item.value"></el-option>
                            </el-select>-->
                            <el-row v-for="gp in data " :key="gp">
                                <el-col :span="12" v-for="item in gp" :key="item">
                                    <el-checkbox :label="item.name" name="depand"></el-checkbox>
                                </el-col>
                            </el-row>
                      </el-form-item>
                    </el-form>
                </div>
                 <div style="text-align:center; margin-top:30px;">
                    <el-button type="primary" @click="pre">上一步</el-button>
             <el-button type="primary" @click="next">下一步
             </el-button>
        </div>
             </el-card>
        </div>
        <div class="step-four" v-show="active==3">
             <div >
                  <el-card class="box-card">
                        <el-row>
                            <el-col :span="20" style="font-size:20px;text-align:center">
                                <span><i class="el-icon-success"></i></span>  组件构建成功
                            </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="20" style="font-size:20px;text-align:center">
                              <el-button type="success">去完善开发者文档</el-button>
                          </el-col>
                        </el-row>
                      </el-card>
             </div>
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
            showBtn:true  ,       //是否显示按钮
            addgit:false,
            ruleForm:{
                assemblyName:"" ,  //组件名称
                remark:""    ,   //描述
                versionNumber:"",  //版本
                versionType:""  ,   //组件类型
                versionLvl:""   ,  //组件级别
            },
            data:[[{name:"一人一档<业务>"},{name:"同步服务<基础>"}],
                  [{name:"异步服务<基础>"},{name:"视频源<核心>"}]
                 ],
            //组件类型数据
            versionTypes:[
                {id:1,lable:"基础jar库",value:"基础jar库"},
                {id:2,lable:"独立jar库",value:"独立jar库"},
                {id:3,lable:"基础Rpc",value:"基础Rpc"},
                {id:4,lable:"独立应用",value:"独立应用"}
            ],
            //组件级别
            versionLvls:[
                {id:1,lable:"基础",value:"基础"},
                {id:2,lable:"核心",value:"核心"},
                {id:3,lable:"业务",value:"业务"},
            ],
            //依赖组件数据
            depends:[
                {id:1,lable:"一人一档<业务>",value:"一人一档<业务>"},
                {id:2,lable:"同步服务<基础>",value:"同步服务<基础>"},
                {id:3,lable:"异步服务<基础>",value:"异步服务<基础>"},
                {id:4,lable:"视频源<核心>",value:"视频源<核心>"}
            ],
            rules:{
                assemblyName: [
                    {required: true, message: '请输入组件名称', trigger: 'blur'},
             ],
              remark: [
                    {required: true, message: '请输入对组件名称的简要描述', trigger: 'blur'},
             ],
              versionNumber: [
                    {required: true, message: '请输入当前组件版本号', trigger: 'blur'},
             ],
             versionType:[
                  {required: true, message: '请选择组件类型', trigger: 'change'},
             ],
               versionLvl:[
                  {required: true, message: '请选择组件级别', trigger: 'change'},
             ]
            },
            assembly:{
                gitAddr:"" ,   //组件源码git地址
            },
            assemblyDepand:{
                depand:[] ,   //依赖组件
            }
        }
    },
    components:{
       gitAddDialog 
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
             _this.content="下一步"
             _this.active=2;

        }
        else if(_this.active==2){
            if(!_this.assemblyDepand.depand){
                  _this.$message({
                  type: 'warning',
                  message: '请选择组件依赖'
                });
                return 
            }
            _this.active=3;
            _this.showBtn=false
        }

        },
        pre:function(){
            if(this.active==1){
                this.active=0
            }
            else if(this.active==2){
                this.active=1
            }
            else if(this.active==3){
                this.active=2
            }
        },
        gitAdd:function(){
            this.addgit=true;
        },
        afterclose:function(){
            this.addgit=false;
        },
        getGit:function(){

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

