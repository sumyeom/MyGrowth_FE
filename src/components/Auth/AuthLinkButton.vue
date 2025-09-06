<template>
  <button class="text-myBlue hover:underline px-2" @click="onClick"><slot /></button>
  
</template>
<script>
export default {
  name: 'AuthLinkButton',
  props: {
    onClick: { type: Function, required: true }
  }
}
</script>
<style scoped>
</style>