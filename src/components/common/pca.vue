<template>
  <el-select @change="changable" v-model="value9" filterable remote placeholder="请输入所属区划代码" :remote-method="remoteMethod" :loading="loading" style="width:485px;">
    <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
      <span style="float: left">{{ item.value }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
    </el-option>
  </el-select>
</template>

<script>
import axios from 'axios';
// import { global } from "../../assets/javascript/global";

export default {
  props: ['county', 'tag'],
  data() {
    return {
      options4: [],
      value9:this.county,
      list: [],
      loading: false,
      flag: this.tag,
      selected: [],
      dataArr:[]
    }
  },
  methods: {
    remoteMethod(param) {
      let para = '';
      if (Object.prototype.toString.call(param) === '[object String]') {
        for (var i = 0; i < param.length; i++) {
          if (param[i] * 1 !== NaN) {
            para += param[i]
          }
        }
      }
      // console.log(para.length);
      if (para !== '' && para.length >= 4) {
        this.loading = true;
        this.getData(para)
          .then(res => {
            this.loading = false;
            // console.log(res);
            this.dataArr = res.data.object;
            this.list = this.dataArr.map(item => {
              return {
                value:item.code,
                label: `${item.province.name} - ${item.city.name} - ${item.name}`
              }
            });
            this.options4 = this.list.filter(m => {
              return m.value.toLowerCase()
                .indexOf(para.toLowerCase()) > -1;
            });

            // console.info(this.value9)
          });
      } else {
        this.options4 = [];
      }
    },
    getData(para) {
      return Promise.resolve(axios.get(`http://182.148.114.194:8900/hxc/sc/common/area/county?areaCode=` + para));
    },
    changable(v) {
     
      this.selected = [v];
      this.emit(v);
    },
    //回传数据
    emit() {
     
      if (typeof (this.selected[0]) !== "undefined") {
        let tmp = this.dataArr.filter(item=>{
          return item.code === this.selected[0];
        })
        this.$emit("child-emit", tmp, this.flag);
        
      }
    
    }
  },

    beforeMount: function () {
   
    }
}
</script>