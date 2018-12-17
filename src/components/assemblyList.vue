<template>
<div>
    <div>
      <el-card>
        <el-form :model="form" ref="form" label-width="80px">
        <el-row>
            <el-col :span="5">
                <el-form-item label="名称">
                    <el-input v-model="form.name" placeholder="请输入组件名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item label="创建人">
                    <el-input v-model="form.creater" placeholder="请输入创建人"></el-input>
                </el-form-item>
            </el-col>
              <el-col :span="10">
                <el-form-item label="创建时间">
                    <el-date-picker v-model="form.fromDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
                    至
                    <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>

                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="handleGetTableData()">查询</el-button>
            </el-col>
             </el-row>
           
       
        <el-form-item label=""></el-form-item>
    </el-form>
    </el-card>
    </div>
    <el-table :data="tableData"  border style="width: 100%">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="版本" prop="type"></el-table-column>
      <el-table-column label="创建人" prop="creater"></el-table-column>
      <el-table-column label="创建时间" prop="createDate"></el-table-column>
      <el-table-column label="描述" prop="remark"></el-table-column>
       <el-table-column label="状态">
          <template slot-scope="scope">
           <el-button type="text" v-show="scope.row.state=='finish'">已完成，可点击下载</el-button>
            <el-button type="text" v-show="scope.row.state!=='finish'">未完成</el-button>
          </template>
       </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button   type="info"    @click="handleEdit(scope.row.id)">修改</el-button>
        <el-button   type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>  
      <div class="block">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </div>
      <assemblyEdit :show="showEdit"  @close-edit="closeedit" />
</div>
</template>
<script>
import assemblyEdit from './assemblyEdit'
export default {
    data(){
        return{
          showEdit:false,
          tableData:[
              {
                  id:"101",
                  name:"A地区布控方案",
                  type:"1.1.1",
                  creater:"张三",
                  createDate:"2018/12/1",
                  remark:"用于A地区布控",
                  state:"finish"
              },
              {
                  id:"102",
                  name:"B地区一人一档方案",
                  type:"1.1.2",
                  creater:"张三",
                  createDate:"2018/12/1",
                  remark:"用于B地区一人一档",
                  state:"fail"
              },
               {
                  id:"103",
                  name:"视频源实战Demo",
                  type:"1.1.3",
                  creater:"李四",
                  createDate:"2018/12/1",
                  remark:"实战视频源组件使用",
                  state:"fail"
              },
          ]  ,
          form:{
            name:"",  //组件名称
            creater:"", //创建人
            fromDate:"",//创建开始时间
            endDate:"",  //创建结束时间
          },
    //分页
     page: {
        total: 0, //总数
        currentPage: 1, //当前页
        pageSize: 10 //每页条数
      },
        }
    },
    components:{
      assemblyEdit
    },
    created:function(){
     this.handleGetTableData();
    },
    
    methods:{
      handleEdit:function(){
        this.showEdit=true;
      },
      closeedit:function(){
         this.showEdit=false;
      },
      handleDelete:function(row){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i] == row) {
          this.tableData.shift(i, 1);
          break;
          }
       }
        })

  },
    //加载列表数据
    handleGetTableData() {
      let _this = this;
      _this
        .$axios({
          method: "post",
          url: "/person/list",
          data: {
            name: _this.form.name, //
            page: {
              pageNum: _this.page.currentPage, //页数,
              pageSize: _this.page.pageSize //每页条数
            }
          }
        })
        .then(res => {
          _this.page.total = 0;
          _this.tableData = [];
          if (res.data.status == 200) {
            _this.page.total = res.data.data.total;
            _this.tableData = res.data.data.list;
          } else {
            _this.tableData = [];
          }
        });
    },
         //（分页）改变每页条数事件
    handleSizeChange: function(val) {
      this.page.pageSize = val;
      this.handleGetTableData();
    },
    //(分页)改变页数事件
    handleCurrentChange: function(val) {
      this.page.currentPage = val;
      this.handleGetTableData();
    },

    }
}
</script>
<style>
  
</style>
