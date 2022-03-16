<template>
  <el-card class="attr-list">
    <el-button type="primary" icon="el-icon-plus"
      :disabled="!category3Id"
     @click="showAddAttr()" >添加属性</el-button>

    <el-table :data="attrList" border class="attr-table">
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column prop="attrName" label="属姓名" />
      <el-table-column label="属性值列表">
        <template v-slot="{ row }">
           <el-tag
      v-for="attrValue in row.attrValueList"
      :key="attrValue.id"
      class="attr-tag"
    >
      {{ attrValue.valueName }}
    </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="{ row ,$index}">
          <el-button type="warning" size="small" icon="el-icon-edit"
           @click="showAddAttr(row)" />
          <el-button type="danger" size="small" icon="el-icon-delete"
          @click="delAttr(row.id, $index)" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  import { getAttrList } from '@/api/product/attr'

export default {
  name: 'AttrList',
  data() {
    return {
      // 属性列表数据
      attrList: []
    }
  },
  computed: {
  ...mapState('category', ['category1Id', 'category2Id', 'category3Id'])
},
watch: {
  category3Id:{
    async handler(category3Id){
     if (!category3Id) {
      this.attrList = []
      return
    }
    const { category1Id, category2Id } = this

    const res = await getAttrList({
      category1Id,
      category2Id,
      category3Id
    })

    this.attrList = res.data
  },
  immediate:true
},
},
methods:{
    ...mapMutations('attr', ['SET_ATTR']),

  showAddAttr( row = {
        attrName: '',
        attrValueList: [] // 为了让添加属性时不报错
      }){
     this.$emit('setIsShowAttrList')
      this.SET_ATTR(row)
  },
    async delAttr(id, index) {
      // 发送请求删除服务器的数据
      await delAttr(id)
      this.attrList.splice(index, 1)
      this.$message.success('删除成功')
    }
  }

}
</script>

<style>
.attr-list {
  margin: 10px;
}
.attr-table {
  margin-top: 20px;
}
.attr-tag {
  margin: 5px 10px 0;
}
</style>