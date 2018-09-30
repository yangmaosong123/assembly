<template>
<div class="app2">
    <div class="neirongDiv">
        <el-row>
            <el-col :span="4">
                <el-button type="text" @click="open('bj','北京','北京','bj')">北京</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="text" @click="open('sh','上海','上海','sh')">上海</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="text" @click="open('tj','天津','天津','tj')">天津</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="text" @click="open('cq','重庆','重庆','cq')">重庆</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="text" @click="open('xg','香港','香港','xg')">香港</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="text" @click="open('am','澳门','澳门','am')">澳门</el-button>
            </el-col>
        </el-row>

        <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(sf,index) in data" :title="sf.sf" :name="index" :key="index">
                <el-row v-for="(item,index2) in conver(sf.shi)" :key="index+'-'+index2">
                    <el-col :span="2" v-for="(shi,index3) in item" :key="index+'-'+index2+'-'+index3">
                      <!--<span @click="open(sf.sf,sf.sfCode,shi.cn,shi.en)">  {{shi.cn}}  </span>  -->
                      <el-button type="text" @click="open(sf.sf,sf.sfCode,shi.cn,shi.en)">{{shi.cn}} </el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>
    </div>

    <showDialog v-if="dialogShow" :show="dialogShow" @after-close="afterclose"
    :province="province" :provinceCode="provinceCode"
    :city="city" :cityCode="cityCode"/>


    
</div>
</template>

<script>
import showDialog from '@/components/showDialog.vue'

export default {
    name: "app",
    data() {
        return {
            dialogShow: false,
            activeNames: [],
            province:"",
            city:"",
            provinceCode:"",
            cityCode:"",

            data: [{
                    sf: "安徽",
                    sfCode:"ah",
                    shi: [{cn:"合肥",en:"hf"}, {cn:"安庆",en:"aq"}, {cn:" 蚌埠",en:"bb"}, {cn:"亳州",en:"hz"}, {cn:"巢湖",en:"ch"}, {cn:"池州",en:"cz"}, {cn:"滁州",en:"chuz"}, {cn:"阜阳",en:"fy"}, {cn:"淮北",en:"hb"}, {cn:"淮南",en:"hn"}, {cn:"黄山",en:"hs"}, {cn:"六安",en:"la"}, {cn:"马鞍山",en:"mas"}, {cn:"宿州",en:"sz"}]
                },
                
                {
                    sf: "安徽",
                    sfCode:"ah",
                    shi: [{cn:"合肥",en:"hf"}, {cn:"安庆",en:"aq"}, {cn:" 蚌埠",en:"bb"}, {cn:"亳州",en:"hz"}, {cn:"巢湖",en:"ch"}, {cn:"池州",en:"cz"}, {cn:"滁州",en:"chuz"}, {cn:"阜阳",en:"fy"}, {cn:"淮北",en:"hb"}, {cn:"淮南",en:"hn"}, {cn:"黄山",en:"hs"}, {cn:"六安",en:"la"}, {cn:"马鞍山",en:"mas"}, {cn:"宿州",en:"sz"}]
                },
                 {
                    sf: "安徽",
                    sfCode:"ah",
                    shi: [{cn:"合肥",en:"hf"}, {cn:"安庆",en:"aq"}, {cn:" 蚌埠",en:"bb"}, {cn:"亳州",en:"hz"}, {cn:"巢湖",en:"ch"}, {cn:"池州",en:"cz"}, {cn:"滁州",en:"chuz"}, {cn:"阜阳",en:"fy"}, {cn:"淮北",en:"hb"}, {cn:"淮南",en:"hn"}, {cn:"黄山",en:"hs"}, {cn:"六安",en:"la"}, {cn:"马鞍山",en:"mas"}, {cn:"宿州",en:"sz"}]
                },
                 {
                    sf: "安徽",
                    sfCode:"ah",
                    shi: [{cn:"合肥",en:"hf"}, {cn:"安庆",en:"aq"}, {cn:" 蚌埠",en:"bb"}, {cn:"亳州",en:"hz"}, {cn:"巢湖",en:"ch"}, {cn:"池州",en:"cz"}, {cn:"滁州",en:"chuz"}, {cn:"阜阳",en:"fy"}, {cn:"淮北",en:"hb"}, {cn:"淮南",en:"hn"}, {cn:"黄山",en:"hs"}, {cn:"六安",en:"la"}, {cn:"马鞍山",en:"mas"}, {cn:"宿州",en:"sz"}]
                }
                ]
                
        };
    },
    components: {
        showDialog
    },
    created:function(){
      for(var i=0;i<this.data.length;i++){
          this.activeNames.push(i);
      }
    },
    methods: {
        
        open: function (sf,sfCode,cn,en) {
            this.dialogShow = true;
            this.province=sf;
            this.provinceCode=sfCode;
            this.city=cn;
            this.cityCode=en;

        },
        //关闭dialog
        afterclose: function () {
            this.dialogShow = false
        },
        //把市转成多行，每行8个
        conver(sz) {
            var rst = [];
            var row = [];
            for (var i = 0; i < sz.length; i++) {
                if (row.length > 0 && row.length%12 == 0) {
                    rst.push(row);
                    row = [];
                }
                row.push(sz[i]);
            }

            if (row.length > 0) {
                rst.push(row);
            }

            return rst;
        },
    }
};
</script>


<style>
    .neirongDiv{
        width: 80%;
        box-shadow: 5px 5px 5px #888888;
        border:1px solid #888888;
    }
    .app2{
         
        
        width: 100%;  
        ;display:flex;flex-direction: column;align-items:center;
        padding-top:50px;
        
        
    }
</style>
