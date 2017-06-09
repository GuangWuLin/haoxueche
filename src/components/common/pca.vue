<template>
    <section>
        <el-select placeholder="省" v-model="p" @change="pChange">
            <el-option v-for="item in pData" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select placeholder="市" v-model="c" @change="cChange">
            <el-option v-for="item in cData" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select placeholder="区" v-model="a" @change="aChange">
            <el-option v-for="item in aData" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </section>
</template>

<script>
import { global } from "../../assets/javascript/global";
export default {
    props: ["province", "city", "area", "tag"],//限制上传个数，上传文件列表
    data() {
        return {
            p: this.province,
            c: this.city,
            a: this.area,
            flag: this.tag,
            pData: [],
            cData: [],
            aData: [],
            selected: []
        }
    },
    methods: {
        //获取省
        getProvince() {
            let that = this;
            global.getArea("", function (data) {
                that.pData = [];
                for (let item in data) {
                    that.pData.push({
                        label: data[item].name,
                        value: data[item].code
                    });
                }
                if (data.length > 0) {
                    if (that.p !== "") {
                        that.getCity(that.p);
                    }
                }
            });
        },
        //获取市
        getCity(val,isChange) {
            let that = this;
            if(isChange === true){
                this.c = '';
            }
            if(val !== ''){
                global.getArea(val, function (data) {
                    that.cData = [];
                    for (let item in data) {
                        that.cData.push({
                            label: data[item].name,
                            value: data[item].code
                        });
                    }
                    if (data.length > 0) {
                        if (that.c === "") {
                            that.c = data[0].code;
                        }
                        if (that.c !== "") {
                            setTimeout(()=>{
                                that.getCounty(that.c,false);
                            },0);
                        }
                    }
           	    });
           }
            
        },
        //获取区
        getCounty(val,isChange) {
            let that = this;
            if(isChange === true){
                this.a = '';
            }
            if(val!==''){
                global.getArea(val, function (data) {
                    that.aData = [];
                    for (let item in data) {
                        that.aData.push({
                            label: data[item].name,
                            value: data[item].code
                        });
                    }
                    if (that.a === "") {
                        that.a = data[0].code;
                    }
                });
            }
        },
        //省切换
        pChange(val) {
            this.selected = [];
            this.selected[0] = val;
            this.getCity(val,true);
            this.emit();
        },
        //市切换
        cChange(val) {
            this.selected[1] = val;
            this.getCounty(val,true);
            this.emit();
        },
        //区/县切换
        aChange(val) {
            this.selected[2] = val;
            this.emit();
        },
        //回传数据
        emit() {
            if (typeof (this.selected[0]) !== "undefined" && typeof (this.selected[1]) !== "undefined" && typeof (this.selected[2]) !== "undefined") {
                this.$emit("child-emit", this.selected, this.flag);
            }
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.selected = [this.p, this.c, this.a];
            this.getProvince();
        }, 400);
    }
}

</script>