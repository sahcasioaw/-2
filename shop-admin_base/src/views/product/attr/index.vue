<template>
<div>
      <Category :disabled="!isShowAttrList"  />
      <AttrList v-show="isShowAttrList" 
       @setIsShowAttrList="isShowAttrList = false"/> 
      <AddOrUpdateAttr v-show="!isShowAttrList"
       @setIsShowAttrList="isShowAttrList = true" />
</div>


</template>

<script>
 import Category from '../category'
 import AttrList from './attrList.vue'
 import AddOrUpdateAttr from './AddOrUpdateAttr.vue'
export default {
    name:'Attr',
    components:{
      Category,
      AttrList,
      AddOrUpdateAttr
    },
    data(){
      return{
         isShowAttrList: true
      }
    }

}
</script>

<style>

</style>