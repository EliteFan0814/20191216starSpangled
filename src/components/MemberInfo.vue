<template>
  <div class="memberInfo">
    <img v-if="avatar"
      :src="avatar"
      alt>
    <img v-else
      src="@/assets/logo.png">
    <div class="mbInfoText">
      <span class="mbInfoName">{{name}}</span>
      <span class="mbInfoMobile">{{phone}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['avatar', 'name', 'phone'],
  name: 'memberInfo'
}
</script>

<style lang="scss" scoped>
.memberInfo {
  white-space: nowrap;
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    margin: 5px;
  }
  .mbInfoText {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
}
</style>