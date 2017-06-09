<template>
    <section>
        <p>getPhoto page</p>
        <p>
            <input type="button" value="拍现场照" @click="Start1_onclick" v-if="this.takePictures===true">
            <input type="button" value="拍身份证照" @click="Start2_onclick" v-if="this.takePictures===true">
            <input type="button" value="上传" @click="Start3_onclick" v-else>
        </p>
        <p>
            <!--{{phtml}}-->
            <object id="captrue" classid="clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE" width="400" height="300"></object>
        </p>
    </section>
</template>

<script>
    var firstLoad = true;
    import $ from 'jquery';
    export default {
        data() {
            return {
                //firstLoad: true,
                phtml: "",
                takePictures: true
            }
        },
        methods: {
            Start1_onclick() {
                var str = captrue.bStopPlay();
                var str = captrue.bStartPlay2(0);
                var timer = setInterval(function () {
                    if (str) {
                        clearInterval(timer);
                        this.takePictures = true;
                    }
                }, 50);
            },
            Start2_onclick() {
                var str = captrue.bStopPlay();
                var str = captrue.bStartPlay();
                var timer = setInterval(function () {
                    if (str) {
                        clearInterval(timer);
                        this.takePictures = true;
                    }
                }, 50);
            },
            Start3_onclick() {
                captrue.bSaveJPG("D:\\", "JPG");
            }
        },
        created() {
            // let refs = this.$refs;
            // setTimeout(function () {
            //     alert("1:" + refs.ccc);
            //     refs.ccc.innerHTML = "<object id=\"captrue\" classid=\"clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE\" width=\"400\" height =\"300\"></object>";
            // }, 3000);
        },
        mounted() {
            //alert(firstLoad);
            //firstLoad = false;
            if (firstLoad) {
                //this.phtml = "<object id=\"captrue\" classid=\"clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE\" width=\"400\" height =\"300\"></object>";
                //alert(firstLoad);
                $("#aa").html(function () {
                    //alert("000");
                    firstLoad = false;
                    setTimeout(function () {
                        //alert(firstLoad);
                        //$("#aa").html("<object id=\"captrue\" classid=\"clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE\" width=\"400\" height =\"300\"></object>");
                    }, 1)
                });
            }
            // if (this.firstLoad) {
            //     this.firstLoad = false;
            //     //document.getElementById("object_inner").innerHTML = "<object id=\"captrue\" classid=\"clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE\" width=\"400\" height =\"300\"></object>";
            // }
            //alert(this.$refs.object_inner);
            //this.$refs.object_inner.innerHTML = "<object id=\"captrue\" classid=\"clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE\" width=\"400\" height =\"300\"></object>";
            //alert(captrue.getAttribute("id"));
            //setTimeout(function () {
            //captrue.classid = "clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE";
            //captrue.setAttribute("classid","clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE");
            //}, 3000)
            //document.getElementById("").setAttribute
            //captrue.setAttribute("classid","clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE");
            //captrue.classid = "";
        }
    }

</script>