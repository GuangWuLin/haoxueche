<template id="highcharts">
    <section id="hc-container"></section>
</template>

<script>
    

    export default {
        props: {
            transactionData: {
                type: Object,
                default: {
                    categories:'',
                    series:'',
                    chartColors:'',
                    unit:''
                }
            }
        },
        data() {
            return {
                data: this.transactionData
            }
        },
        methods: {
            
        },
        mounted: function () {
            //global.highchart.init("hc-container",this.data);
        }
    }

</script>

<style>
    #hc-container {
        height: 230px;
    }
</style>