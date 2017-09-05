<template>
    <section>
        <el-select placeholder="选择车型" v-model="t" @change="vChange">
            <el-option v-for="item in vTypeData" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </section>
</template>

<script>
    import { request } from "../../api/api";
    import { global } from "../../assets/javascript/global";
    export default {
        props: ["type", "tag",'rePull'],//限制上传个数，上传文件列表
        data() {
            return {
                t: this.type,
                flag: this.tag,
                vTypeData: [],
                selected: ""
            }
        },
        methods: {
            //获取车型
            getCarType() {
                if(this.rePull === 'search') {
                    this.t = this.type;
                    return;   
                }
                request.public.queryCarType().then((res) => {
                    if (res.success === true) {
                        this.vTypeData = [];
                        let data = res.object;
                        this.vTypeData.push({
                            label: "全部车型",
                            value: "0"
                        });
                        for (let item in data) {
                            this.vTypeData.push({
                                label: data[item].value,
                                value: data[item].key
                            });
                        }
                    }
                });
            },
            //车型切换
            vChange(val) {
                this.selected = val;
                this.emit();
            },
            //回传数据
            emit() {
                if (this.selected !== "") {
                    this.$emit("child-emit", this.selected, this.flag);
                }
            }
        },
        mounted: function () {
            let sessionData = sessionStorage.getItem('allConditions');
            if(sessionData !== null) {
                let obj = JSON.parse(sessionData);
                this.vTypeData = obj.carModels;
            }
            setTimeout(()=> {
                this.getCarType();
            }, 300);
        }
    }

</script>