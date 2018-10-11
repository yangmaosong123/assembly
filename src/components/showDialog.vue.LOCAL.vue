<template>
<el-dialog title="" :visible.sync="show" width="80%" :close-on-click-modal="false" @close="close">
    <h4>{{makeAddr(province,city)}}</h4>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="左上角经度" prop="leftLong">
                        <el-input v-model="ruleForm.leftLong" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="右下角经度" prop="rightLong">
                        <el-input v-model="ruleForm.rightLong" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="左上角纬度" prop="leftLat">
                        <el-input v-model="ruleForm.leftLat" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="右下角纬度" prop="rightLat">
                        <el-input v-model="ruleForm.rightLat" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div>
        <el-row :gutter="20" v-for="(page,index) in conver(data)" :key="index">
            <el-col :span="3" v-for="(item,index2) in page" :key="index+'-'+index2" style="border:1px solid">
                <div>
                    <i style="font-size:200%" :class="find(item)?'el-icon-location':'el-icon-location-outline'" @click="handle(item)">
                     <div style="font-size:50%" class="icon-name">{{item}}级 </div> 
                 </i>
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
                leftLong: this.maxLat, //左上角经度
                rightLong: this.minLat, //右下角经度
                leftLat: this.maxLnt, //左上角纬度
                rightLat: this.minLnt, //右下角纬度
            },
            rules: {
                leftLong: [{
                    required: true,
                    message: '左上角经度不能为空',
                    trigger: 'blur'
                }],
                rightLong: [{
                    required: true,
                    message: '右下角经度不能为空',
                    trigger: 'blur'
                }],
                leftLat: [{
                    required: true,
                    message: '左上角纬度不能为空',
                    trigger: 'blur'
                }],
                rightLat: [{
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
        for (var i = 1; i <= 20; i++) {
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
                //_this.sz = res.data.data
            }
        })
    },
    methods: {
        makeAddr(province, city) {
            if (province == "bj" || province == "sh" || province == "tj" || province == "cq" || province == "xg" || province == "am") {
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
            if (_this.ruleForm.leftLong === "") {
                _this.$message({
                    type: "warning",
                    message: "请输入左上角经度",
                });
            } else if (_this.ruleForm.rightLong === "") {
                _this.$message({
                    type: "warning",
                    message: "请输入右下角经度",
                });
            } else if (_this.ruleForm.leftLat === "") {
                _this.$message({
                    type: "warning",
                    message: "请输入左上角纬度",
                });
            } else if (_this.ruleForm.rightLat === "") {
                _this.$message({
                    type: "warning",
                    message: "请输入右下角纬度",
                });
            } else {
                if (_this.find(lvl) == true) {
                    _this.$confirm('确定是否下载', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.Download(lvl)
                    })
                } else {
                    this.$confirm('服务器上没有该级别的离线地图，是否继续', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const loading = this.$loading({
                            lock: true,
                            text: "正在加载",
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        _this.$axios({
                            method: "post",
                            url: "/fetch",
                            data: {
                                city: this.cityCode,
                                province: this.provinceCode,
                                lvl: lvl,
                                maxLat: this.ruleForm.maxLat,
                                maxLnt: this.ruleForm.maxLnt,
                                minLat: this.ruleForm.minLat,
                                minLnt: this.ruleForm.minLnt,
                            }
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
                                this.$message.error('加载失败');
                            }
                        })
                    })
                }
            }

        },
        Download: function (lvl) {
            document.location.href = this.$axios.defaults.baseURL + "/download?city=" + this.cityCode + "&province=" + this.provinceCode + "&lvl=" + lvl;
        }
    }
}
</script>
