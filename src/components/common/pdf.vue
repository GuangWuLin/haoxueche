<template>
    <div class="cpdf">
        <div class="center">
            <canvas class="canvasstyle" id="the-canvas"></canvas>
        </div>
    </div>
</template>

<style>
    .cpdf {
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .5);
        width: 100%;
        height: 100%;
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
        .center {
            text-align: center;
            height: 100%;
            overflow: auto;
            padding-top: 20px;
            .contor {
                margin-bottom: 10px;
            }
        }
    }
</style>

<script>
    import {pdf} from "assets/javascript/pdf/pdf.js";
    // import Pdfjs from "pdfjs"
    export default {
        name: "c-pdf",
        props: ["pdfurl"],
        mounted() {
            let vm = this
            console.log(PDFJS);
            console.log(vm.pdfurl);
            //return;
            PDFJS.getDocument(vm.pdfurl).then(function (pdfDoc_) {  //初始化pdf
                console.log(pdfDoc_);
                vm.pdfDoc = pdfDoc_;
                vm.page_count = vm.pdfDoc.numPages
                //vm.renderPage(vm.pageNum);
            });
            //console.log(vm);
            // console.log(vm.padfurl);
            // console.log(pdf);
        }
    }

</script>