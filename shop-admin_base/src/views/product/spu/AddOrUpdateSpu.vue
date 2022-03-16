<template>
  <el-card class="spu-card">
    <el-form ref="formRef" :model="spuForm" :rules="rules"  label-width="100px">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="spuForm.spuName"  placeholder="请输入SPU名称" />
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input  v-model="spuForm.description" type="textarea" :rows="2" placeholder="请输入SPU描述" />
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择SPU品牌">
          <el-option v-for="s1 in trademarkList" :key="s1.id"
            :label="s1.tmName" :value="s1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图片列表" prop="spuImageList">
        <!-- 上传图片组件 -->
        <el-upload
         :class="{
    'spu-upload': spuForm.spuImageList.length >= limit
  }"
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
           :before-upload="beforeAvatarUpload"
           :on-success="handleAvatarSuccess"
           :on-remove="handleRemove"
           :limit="limit"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <el-select placeholder="请选择销售属性" v-model="selectedBaseSaleAttr" >
          <el-option v-for="b1 in filterSaleAttrList" :key="b1.id"
            :label="b1.name" :value="`${b1.id}:${b1.name}`"/>
      
        </el-select>
        <el-button type="primary" icon="el-icon-plus" class="spu-btn"
         :disabled="!selectedBaseSaleAttr"
          @click="addSaleAttr"
        >
          添加销售属性值
        </el-button>
        <el-table :data="spuForm.spuSaleAttrList" border class="spu-table">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column prop="saleAttrName" label="销售属性名称" />
          <el-table-column prop="description" label="销售属性值列表" >
               <template v-slot="{ row, $index }">
              <!-- 展示销售属性值数据 -->
              <el-tag
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="index"
                class="spu-tag"
                closable
                @close="delSaleAttrValue(row, index)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.isShowEdit"
                ref="input"
                v-model="saleAttrValueName"
                placeholder="请输入属性值"
                size="small"
                class="spu-input"
                @blur="addSaleAttrValue(row)"
                @keyup.enter.native="addSaleAttrValue(row)"
              />
              <el-button
                v-else
                size="small"
                icon="el-icon-plus"
                @click="showEdit(row)"
              >
                添加属性值
              </el-button>
            </template>

          </el-table-column>
          <el-table-column label="操作" width="50">
            <template v-slot="{ row }">
              <el-button type="danger" size="small" icon="el-icon-delete"  @click="delSaleAttr($index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSpu">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

import{ getAllTrademarkList, getBaseSaleAttrList,saveSpu}from '@/api/product/spu'
export default {
  name: 'AddOrUpdateSpu',
  data() {
     const validator = (rule, value, callback) => {

      if (value.length === 0) {
        callback(new Error('至少添加一个销售属性'))
        return
      }
     
      if (
        value.some((saleAttr) => saleAttr.spuSaleAttrValueList.length === 0)
      ) {
        callback(new Error('每个销售属性至少添加一个销售属性值'))
        return
      }
    
      callback() // 校验通过
    }
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      trademarkList:[],
      baseSaleAttrList:[],
      spuForm:{
         spuName: '', 
        description: '', 
        tmId: '', 
        spuImageList:[],
         spuSaleAttrList: []
      },
       rules: {
        spuName: [
          { required: true, message: '请输入spu名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入spu描述', trigger: 'blur' }
        ],
        tmId: [{ required: true, message: '请选择spu品牌' }],
        spuImageList: [
          {
            required: true,
            type: 'array',
            message: '请上传spu图片'
          }
        ],
        spuSaleAttrList: [
          {
            required: true,
            validator
          }
        ]
      },
       limit: 20,
       selectedBaseSaleAttr:'',
       saleAttrValueName:"",
    }
  },
  methods: {
     addSpu() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const { category3Id, spuForm } = this

          await saveSpu({
            category3Id,
            ...spuForm
          })

          this.$message.success('添加SPU成功')
          this.cancel()
        }
      })
    },
    cancel() {
      this.$emit('setIsShowSpuList')
    },
    delSaleAttrValue(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file){
       const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt500 = file.size / 1024 <= 500

  if (!isJPGOrPNG) {
    this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt500) {
    this.$message.error('上传头像图片大小不能超过 500KB!')
  }
  
  return isJPGOrPNG && isLt500
    },
    handleAvatarSuccess(res, file) {
  // 将响应的图片地址，更新到表单数据中
  this.spuForm.spuImageList.push({
    imgUrl: res.data,
    imgName: file.name
  })
    },
    handleRemove(file) {
  this.spuForm.spuImageList = this.spuImageList.filter((img) => {
    return img.imgUrl !== file.response.data
  })
    },
      // 添加属性值
    addSaleAttrValue(row) {
   if (this.saleAttrValueName) {
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: row.baseSaleAttrId,
      saleAttrValueName: this.saleAttrValueName
    })
    row.isShowEdit = false
  // 清空数据
  this.saleAttrValueName = ''
  }

    },
    async showEdit(row) {
  // 为了修改没数据时是响应式，添加其实也没有数据
  this.$set(row, 'isShowEdit', true)
  await this.$nextTick()
  this.$refs.input.focus()
    },
    addSaleAttrValue(row) {
      if (this.saleAttrValueName) {
    row.spuSaleAttrValueList.push({
      saleAttrValueName: this.saleAttrValueName
    })
  }
  // 变成显示模式
  row.isShowEdit = false
  // 清空数据
  this.saleAttrValueName = ''
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] =
        this.selectedBaseSaleAttr.split(':')

      this.spuForm.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [] // 这个属性，为了将来添加属性值可以用push方法
      })

      this.selectedBaseSaleAttr = ''
    },
     delSaleAttr(index) {
      this.spuForm.spuSaleAttrList.splice(index, 1)
    },
},
  async mounted() {
  const [trademarkListRes, baseSaleAttrListRes] = await Promise.all([
    getAllTrademarkList(),
    getBaseSaleAttrList()
  ])

  this.trademarkList = trademarkListRes.data
  this.baseSaleAttrList = baseSaleAttrListRes.data
},
  computed: {
  filterSaleAttrList() {
    return this.baseSaleAttrList.filter((baseSaleAttr) => {
      // 判断当前销售属性名称，在不在spuSaleAttrList里面，如果在就要过滤掉
      // some方法：只要有一个满足条件返回true，所有都不满足才是false
      return !this.spuForm.spuSaleAttrList.some(
        (saleAttr) => saleAttr.saleAttrName === baseSaleAttr.name
      )
    })
  }
},
  
}
</script>

<style>
.spu-card {
  margin: 10px;
}
.spu-btn {
  margin-left: 10px;
}
.spu-upload .el-upload--picture-card {
  display: none;
}
</style>