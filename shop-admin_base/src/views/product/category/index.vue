<template>
  <el-card class="category-selector">
    <!--
      inline 水平排列表单
     -->
    <el-form :inline="true"  :disabled="disabled" >
      <el-form-item label="一级分类">
        <el-select v-model="category1Id" placeholder="请选择一级分类">
          <el-option  v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id" />
      
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="category2Id" placeholder="请选择二级分类">
          <el-option v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id" />
       
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="category3Id" placeholder="请选择三级分类">
          <el-option  v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id" />
      
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Category',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: ''
    }
  },
   mounted() {
    this.getCategory1List()
  },
    methods: {
    ...mapActions('category', [
      'getCategory1List',
      'getCategory2List',
      'getCategory3List'
    ]),
    ...mapMutations('category', ['SET_CATEGORY3_ID','RESET'])
  },
   computed: {
    ...mapState('category', [
     'category1List',
      'category2List',
      'category3List'
    ])
  },
    watch: {
    async category1Id(category1Id) {
      // 发送请求，请求二级分类数据
      await this.getCategory2List(category1Id)
      this.category2Id = ''
      this.category3Id = ''
    },
    async category2Id(category2Id) {
      // 当二级分类id为空时，不应该发送请求
      if (!category2Id) return
      // 发送请求，请求三级分类数据
      await this.getCategory3List(category2Id)
      this.category3Id = ''
    },
    category3Id(category3Id) {
      if (!category3Id) return
      this.SET_CATEGORY3_ID(category3Id)
    }
  },
  props: {
  disabled: Boolean
},
  beforeDestroy() {
  // 清空分类数据
  this.RESET()
}
}
</script>

<style>
.category-selector {
  margin: 10px;
}
.el-form-item {
  margin: 10px 0;
}
</style>