<template>
  <el-select @change="changable" v-model="query" filterable remote placeholder="请输入所属区划代码或名称" :remote-method="remoteMethod" :loading="loading" style="width:485px;" :loading-text="loadingText">
    <el-option v-for="item in data" :key="item.value" :label="item.label" :value="item.value">
      <span style="float: left">{{ item.value }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
    </el-option>
  </el-select>
</template>

<script>
import axios from "axios";
export default {
  props: ["propValue", "tag"],
  data() {
    return {
      data: [],
      query: this.propValue,
      list: [],
      loading: false,
      flag: this.tag,
      selected: [],
      dataArr: [],
      loadingText: "至少输入前4位数字或2位地区汉字"
    }
  },
  methods: {
    remoteMethod(param) {
      let para = "";
      if (Object.prototype.toString.call(param) === "[object String]") {
        for (var i = 0; i < param.length; i++) {
          if (param[i] * 1 !== NaN) {
            para += param[i]
          }
        }
      }
      if (para === "") {
        this.data = [];
      }
      else {
        this.loading = true;
        if (parseInt(para)) {
          if (para.length >= 4) {
            this.getData(para, sessionStorage.getItem('baseUrl') + `/sc/common/area/county?areaCode=` + para);
          }
        }
        else if (para.length >= 2) {
          this.getData(para, sessionStorage.getItem('baseUrl') + `/sc/common/area/county?name=` + encodeURI(para));
        }
      }
    },
    getData(para, url) {
      Promise.resolve(axios.get(url)).then(res => {
        this.loading = false;
        this.dataArr = res.data.object;
        this.data = this.dataArr.map(item => {
          return {
            value: item.code === null ? item.city.code : item.code,
            label: `${item.province.name} - ${item.city.name} ${item.name === null ? '' : ' - ' + item.name}`
          }
        });
      });
    },
    changable(v) {
      this.selected = [v];
      this.emit(v);
    },
    //回传数据
    emit() {
      if (typeof (this.selected[0]) !== "undefined") {
        let tmp = this.dataArr.filter(item => {
          if (item.code === null) {
            return item.city.code === this.selected[0];
          }
          else {
            return item.code === this.selected[0];
          }
        });
        this.$emit("child-emit", tmp, this.flag);
      }
    }
  }
}
</script>