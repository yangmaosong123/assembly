<template>
<el-dialog title="" :visible.sync="show" width="80%" :close-on-click-modal="false" @close="close">
    <h4>{{makeAddr(province,city)}}</h4>

    <div>

        <el-row :gutter="20" v-for="(page,index) in conver(data)" :key="index">
            <el-col :span="3" v-for="(item,index2) in page" :key="index+'-'+index2">
                <div>
                    <i style="font-size:200%" :class="find(item)?'el-icon-location':'el-icon-location-outline'" @click="handle(item)">
                     <div style="font-size:50%" class="icon-name">{{item}}级 </div> 
                     <hr>
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
            data: []
        }
    },
    props: ["show", "province", "provinceCode", "city", "cityCode"],
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

        },
        Download: function (lvl) {
            let _this = this
            _this.$axio({
                method: "post",
                url: "/download",
                data: {
                    city: this.cityCode,
                    province: this.provinceCode,
                    lvl: lvl,
                }
            }).then(res => {
                if (res.data.status == 200) {
                    this.$message({
                        message: '下载成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '下载失败',
                        type: 'warning'
                    });
                }
            })
        }
    }
}
</script>

