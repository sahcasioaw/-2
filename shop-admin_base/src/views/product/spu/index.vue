<template>
  <div>
    <Category :disabled="isShow !== 1"  />
    <SpuList   v-if="isShow === 2" @setIsShow="isShow = $event" />
    <AddOrUpdateSpu v-else />
  </div>
</template>

<script>
import Category from '../category'
import SpuList from './spuList'
import AddOrUpdateSpu from './AddOrUpdateSpu.vue'

export default {
  name: 'Spu',
  data(){
    return {
      isShow:2
      }
  },
  components: {
    Category,
    SpuList,
    AddOrUpdateSpu
  },
  methods:{
  //  setIsShow(isShow) {
  //     this.isShow = isShow
  //   }
  }
}
</script>

<style></style>