<template>
  <el-card>
    <el-button type="primary" icon="el-icon-plus"   @click="showAddSpu">添加SPU</el-button>

    <el-table :data="spuList" border class="spu-table">
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column prop="spuName" label="SPU名称" />
      <el-table-column prop="description" label="SPU描述" />
      <el-table-column label="操作" width="250">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" icon="el-icon-plus" />
          <el-button type="warning" size="small" icon="el-icon-edit" />
          <el-button type="info" size="small" icon="el-icon-info" />
          <el-button type="danger" size="small" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>

import { mapState } from 'vuex'
import { getSpuList } from '@/api/product/spu'
export default {
  name: 'SpuList',
  data() {
    return {
      spuList: [],
      currentPage: 1,
      pageSize: 3,
      total: 0
    }
  },
  methods: {
    handleSizeChange(pageSize) {
    this.pageSize = pageSize
      this.getSpuList()
    },
    handleCurrentChange(currentPage) {
        this.currentPage = currentPage
      this.getSpuList()
    },
    async getSpuList() {
      const { currentPage, pageSize, category3Id } = this

      const res = await getSpuList({
        page: currentPage,
        limit: pageSize,
        category3Id
      })

      this.spuList = res.data.records
      this.total = res.data.total
    },
    showAddSpu() {
      this.$emit('setIsShow', 1)
    },
  },
  computed:{
      ...mapState('category', ['category3Id'])
  },
  watch:{
      category3Id: {
       handler(category3Id) {
        if (!category3Id) {
          this.spuList = []
          this.total = 0
          this.currentPage = 1
          this.pageSize = 3
          return
        }
        this.getSpuList()
      },
      immediate: true
    },
 
  }
}
</script>

<style>
.spu-table {
  margin: 20px 0;
}
.el-pagination__sizes,
.el-pagination__total {
  float: right;
}
</style>