<template>
    <section>
        <!--<PCA :province="province" :city="city" :area="area" v-on:child-emit="listenData"></PCA>
                            <PCA :province="regprovince" :city="regcity" :area="regarea" v-on:child-emit="listenRegData"></PCA>
                            <el-button type="primary" size="large" @click="lookValue">查看已选值</el-button>-->
    </section>
</template>

<script>
import PCA from "../components/common/pca.vue";
export default {
    data() {
        return {
            province: "",
            city: "",
            area: "",
            regprovince: "",
            regcity: "",
            regarea: ""
        }
    },
    methods: {
        listenData(result) {
            this.province = result[0];
            this.city = result[1];
            this.area = result[2];
        },
        listenRegData(result) {
            this.regprovince = result[0];
            this.regcity = result[1];
            this.regarea = result[2];
        },
        lookValue() {
            console.log(this.province);
            console.log(this.city);
            console.log(this.area);
            console.log("----------------------------------------------------------------");
            console.log(this.regprovince);
            console.log(this.regcity);
            console.log(this.regarea);
        },
        initData() {
            setTimeout(() => {
                //alert(123);
                this.regprovince = "510000";
                this.regcity = "510100";
                this.regarea = "510108";
            }, 5000);
        }
    },
    components: {
        PCA
    },
    activated() {
        //alert(1);
        //this.lookValue();
        //console.log("总览 activated every one");
    },
    mounted() {
        //this.initData();
    }
}

</script>