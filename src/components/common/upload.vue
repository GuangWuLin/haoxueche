<template>
    <div>
        <el-upload action="http://139.224.226.169:8080/pay/file" list-type="picture-card" :on-remove="handleRemove" :before-upload="beforeUploadCheck"
            :on-success="handleUploadScucess" :on-error="handleUploadError" :file-list="fileList">
            <i class="el-icon-plus"></i>
            </el-upload>
    </div>
</template>

<script>
    export default {
        props: ["uploadLimit", "uploadList"],//限制上传个数，上传文件列表
        data() {
            return {
                fileList: this.uploadList
            }
        },
        methods: {
            handleUploadScucess: function (res, file, fileList) {
                console.log("scucess");
                this.fileList = fileList;
                this.$emit("child-emit", this.fileList);
            },
            handleRemove: function (file, fileList) {
                console.log("remove");
                this.fileList = fileList;
                this.$emit("child-emit", this.fileList);
            },
            handleUploadError: function (err, file, fileList) {
                console.log("err");
            },
            beforeUploadCheck(file) {
                const limit = this.fileList.length < this.uploadLimit;
                if (!limit) {
                    this.$message.error("最多允许上传" + this.uploadLimit + "张工单图片!");
                }
                const fileType = (file.type === "image/jpg" || file.type === "image/png" || file.type === "image/jpeg" ? file.type : false);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!fileType) {
                    this.$message.error("请选择图片文件，可支持jpg、png两种格式!");
                }
                if (!isLt2M) {
                    this.$message.error("图片文件不能超过 2MB!");
                }
                return fileType && isLt2M && limit;
            }
        },
        mounted: function () {
            console.log(this.uploadLimit);
        }
    }

</script>