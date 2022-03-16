<template>
    <el-card class="box-card">
    <el-button type="primary"  @click="showAddTrademark"  >添加品牌</el-button>
   <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
   
      label="序号"
      type="index"
      width="70">
    </el-table-column>
    <el-table-column
      prop="tmName"
      label="品牌"
      width="180">
    </el-table-column>
    <el-table-column
      label="品牌 LOGO">
       <template v-slot="{ row }">
          <img :src="row.logoUrl" :alt="row.tmName" class="trademark-img" />
        </template>
    </el-table-column>
      <el-table-column
      label="操作">
       <template v-slot="{ row }">
      <el-button type="warning" icon="el-icon-edit"  size="mini"  @click="showupdateTrademark(row)" >操作</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini"  @click="open(row)">删除</el-button>
       </template>
    </el-table-column>
  </el-table>
   <!-- 分页器 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper,sizes,total "
      :total="total">
    </el-pagination>
  <!-- 弹窗 -->

  <el-dialog :title="`${ruleForm.id?'修改品牌':'添加品牌'}`" :visible.sync="dialogFormVisible" width="30%">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="100px"  >
  <el-form-item label="品牌名称" prop="tmName">
    <el-input v-model="ruleForm.tmName"></el-input>
  </el-form-item>
   <el-form-item label="品牌Logo" prop="imageUrl">
  <el-upload
  class="avatar-uploader"
  action="/dev-api/admin/product/fileUpload"
  :show-file-list="true"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="ruleForm.logoUrl" :src="ruleForm.logoUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addTrademark">确 定</el-button>
  </div>
</el-dialog>

    </el-card>
</template>

<script>
import {getTrademarkList,addTrademark,delTrademark,updateTrademark}  from "@/api/product/trademark"

export default {
        name: 'trademark',

    mounted(){
      this.getTrademarkList()
    },
      data() {
      return {
        tableData: [],
        currentPage:1,
        total:0,
        pageSize:3,
        dialogFormVisible:false,
        
         ruleForm: {
          tmName: '',
          logoUrl: '',
        },
         rules: {
          tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          ],
          logoUrl: [
          { required: true, message: "请上传图片", trigger: "blur" },
        ],
         }
      }
    },
      methods: {
      handleSizeChange(val) {
        tihs.pageSize = val
        this.getTrademarkList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getTrademarkList()
},
     async getTrademarkList(){
       const {currentPage,pageSize} = this
        const res = await getTrademarkList(currentPage,pageSize)
       this.tableData = res.data.records
       this.total = res.data.total
     },
  
    handleAvatarSuccess(res, file) {
        this.ruleForm.logoUrl = res.data;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 <= 500;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 500KB!');
        }
        return isJPG && isLt2M;
      },
   async addTrademark(){
      this.$refs.ruleForm.validate(async (valid) => {
    if (valid) {
      const { id,tmName,logoUrl } = this.ruleForm
      if(id){
         await updateTrademark({ id, tmName, logoUrl })
      }
      await addTrademark(tmName, logoUrl)
      this.$message.success('添加品牌成功')
      // 隐藏对话框
      this.dialogFormVisible = false
      // 清空数据
      this.ruleForm.tmName = ''
      this.ruleForm.logoUrl = ''
    }
  })
    },
    showAddTrademark(){
       this.dialogFormVisible = true
    
       this.$nextTick(()=>{
          this.$refs.ruleForm.clearValidate()
       })
       this.ruleForm = {
          tmName: '',
          logoUrl: '',
       }
    },
    showupdateTrademark(row){
      this.dialogFormVisible = true
      this.ruleForm = row
    },
    open(row) {
        this.$confirm(`此操作将删除${row.tmName}品牌, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
             await delTrademark(row.id)
             this.getTrademarkList()

          this.$message({
            type: 'success',
            message: '删除成功!',
           
            
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }

  
}

        
</script>

<style>
.el-pagination__sizes ,
.el-pagination__total{
  float: right;
}
.el-table--border{
  margin: 20px 0;
}
.trademark-img {
  width: 120px;
  height: 100px;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>