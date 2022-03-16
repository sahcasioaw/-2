<template>
  <el-card class="attr-card">
    <el-form ref="formRef" :model="attrForm" :rules="rules">
      <el-form-item label="属性名" label-width="70px"
      prop="attrName">
        <el-input placeholder="请输入属性名" class="attr-input"  v-model="attrForm.attrName" />
      </el-form-item>
      <el-form-item prop="attrValueList" >
        <el-button type="primary" icon="el-icon-plus"
         :disabled="!attrForm.attrName"
         @click="showAddAttrValue"
        >添加属性值</el-button>

        <el-table :data="attrForm.attrValueList" border class="attr-table">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column label="属性值名称">
            <template v-slot="{ row,$index }">
                <el-input
                 ref="input"
                 v-if="row.isShowEdit"
                placeholder="请输入属性值"
                size="small"
                v-model="row.valueName"
                @blur="addAttrValue(row,$index)"
              />
              <div 
                v-else
              @click="showEdit(row)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="{$index }">
              <el-popconfirm
                title="确定删除吗？"
                icon="el-icon-info"
                icon-color="red"
                @onConfirm="delAttrValue($index)"
              >
                <el-tooltip
                  slot="reference"
                  effect="dark"
                  content="删除属性值"
                  placement="top"
                >
                  <el-button type="danger" size="small" icon="el-icon-delete" />
                </el-tooltip>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="addAttr">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { addAttr } from '@/api/product/attr'
import { mapState } from 'vuex'
export default {
  name: 'AddOrUpdateAttr',
  data() {
    return {
    attrForm:this.$store.state.attr.attr,
    rules: {
      attrName: [{ required: true, message: '请输入属性名', trigger: 'blur' }],
      attrValueList: [
          {
            required: true,
            type: 'array', // 数组至少有一项值才能通过
            message: '请至少添加一个属性值',
            trigger: 'blur'
          }
        ]
    }
  }
    
  },
  methods: {
    cancel() {
      this.$emit('setIsShowAttrList')
    },
    async showAddAttrValue() {
    this.attrForm.attrValueList.push({
        isShowEdit: true
    })

    await this.$nextTick()

    this.$refs.input.focus()
    },
   async showEdit(){
        this.$set(row, 'isShowEdit', true) // 定义响应式数据
      // 更新是异步的
      await this.$nextTick()
      this.$refs.input.focus()
    },
    addAttrValue(row,index){
        if (!row.valueName) {
        this.attrForm.attrValueList.splice(index, 1)
        return
      }
      row.isShowEdit = false
    },
     addAttr(){
        this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const { category3Id, attrForm } = this
    
          await addAttr({
            ...attrForm,
            categoryId: category3Id,
            categoryLevel: 3
          })
          this.$message.success(`${attrForm.id ? '更新' : '添加'}属性成功`)
          this.cancel() 
        }
      })
     },
      delAttrValue(index) {
      this.attrForm.attrValueList.splice(index, 1)
    },
  },
  computed:{
      ...mapState('category', ['category3Id'])
  }
}
</script>

<style>
.attr-card {
  margin: 10px;
}
.attr-input {
  width: 200px;
}
</style>