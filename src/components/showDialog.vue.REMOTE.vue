<template>
<el-dialog title="" :visible.sync="show" width="50%" :close-on-click-modal="false" @close="close">
    
    <h4>{{makeAddr(province,city)}}</h4>
    <el-card class="box-card">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="左上角经度" prop="minLng">
                        <el-input v-model="ruleForm.minLng" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="右下角经度" prop="maxLng">
                        <el-input v-model="ruleForm.maxLng" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="左上角纬度" prop="minLat">
                        <el-input v-model="ruleForm.minLat" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="右下角纬度" prop="maxLat">
                        <el-input v-model="ruleForm.maxLat" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="text-align:right">
                <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">获取经纬度范围</a>
            </el-row>
        </el-form>
    </el-card class="box-card">
    <br>
    <div>
        <el-row :gutter="20" v-for="(page,index) in conver(data)" :key="index">
            <el-col :span="3" v-for="(item,index2) in page" :key="index+'-'+index2">
                <div>
                     <el-tooltip class="item" effect="dark" content="点击下载" placement="top-start">
                        <i style="font-size:200%" :class="find(item)?'el-icon-location':'el-icon-location-outline'" @click="handle(item)">
                        <div style="font-size:50%" class="icon-name">{{item}}级 </div> 
                    </i>
                    </el-tooltip>
                </div>
            </el-col>
        </el-row>
    </div>
</el-dialog>
</template>

<script>
export default {
    data() {
        return {
            sz: [],
            data: [],
            ruleForm: {
                minLat: "", //左上角经度
                minLng: "", //右下角经度
                maxLat: "", //左上角纬度
                maxLng: "", //右下角纬度
                province:this.provinceCode,
                city:this.cityCode,
                lvl:0,
            },
            rules: {
                minLng: [{
                    required: true,
                    message: '左上角经度不能为空',
                    trigger: 'blur'
                }],
                maxLng: [{
                    required: true,
                    message: '右下角经度不能为空',
                    trigger: 'blur'
                }],
                minLat: [{
                    required: true,
                    message: '左上角纬度不能为空',
                    trigger: 'blur'
                }],
                maxLat: [{
                    required: true,
                    message: '右下角纬度不能为空',
                    trigger: 'blur'
                }]

            }
        }
    },
    props: ["show", "province", "provinceCode", "city", "cityCode", "maxLat", "maxLnt", "minLat", "minLnt"],
    computed: {

    },
    created: function () {
        for (var i = 18; i <= 18; i++) {
            this.data.push(i);
        }

        let _this = this;
        _this.$axios({
            method: "post",
            url: "/findLvls",
            data: {
                city: this.cityCode,
                province: this.provinceCode
            }
        }).then(res => {
            if (res.data.status == 200) {
                _this.sz = res.data.data
            }
        })
    },
    methods: {
        makeAddr(province, city) {
            if (province == "北京" || province == "上海" || province == "天津" || province == "重庆" || province == "香港" || province == "澳门") {
                return city;
            } else {
                return province + '/' + city
            }
        },
        //转成多行，每行8个
        conver(sz) {
            var rst = [];
            var row = [];
            for (var i = 0; i < sz.length; i++) {
                if (row.length > 0 && row.length % 8 == 0) {
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

        close: function () {
            this.$emit('after-close')
        },

        find: function (lvl) {
            for (var i = 0; i < this.sz.length; i++) {
                if (this.sz[i] == lvl) {
                    return true;
                }
            }
            return false;
        },
        handle: function (lvl) {
            
            let _this = this
             if (_this.find(lvl) == true) {
                    _this.$confirm('确定是否下载', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.Download(lvl)
                    })
                    return;
            }  
             this.$refs["ruleForm"].validate((valid) => {
                if (valid == false) {
                     _this.$message({
                                type: 'warning',
                                message: "操作不能继续，有必填字段需要填写！"
                            });
                    return;
                }

                this.$confirm('服务器上没有该级别的离线地图，是否继续', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const loading = _this.$loading({
                            lock: true,
                            text: "正在加载",
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        _this.ruleForm.lvl=lvl;

                        _this.$axios({
                            method: "post",
                            url: "/fetch",
                            data: _this.ruleForm,
                        }).then(res => {
                            loading.close();
                            if (res.data.status == 200) {
                                _this.sz.push(lvl)
                                _this.Download(lvl)
                            } else if (res.data.status == 600) {
                                _this.$message({
                                    message: '正在下载中，请稍后再试',
                                    type: 'warning'
                                });
                            } else {
                                _this.$message.error('加载失败');
                            }
                        })
                    })


                
            });

 

        },
        Download: function (lvl) {
            document.location.href = this.$axios.defaults.baseURL + "/download?city=" + this.cityCode + "&province=" + this.provinceCode + "&lvl=" + lvl;
        }
    }
}
</script>
<style scoped>
.el-card{
    width:100%;
}
</style>
