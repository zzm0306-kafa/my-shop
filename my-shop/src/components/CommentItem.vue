<template>
  <van-cell class="comment-item">
    <!-- 1.用户信息 -->
    <div class="user-info">
      <!-- 头像 -->
      <img :src="reply?.avatar"/>
      <!-- 昵称 -->
      <span class="nickname" v-text="reply?.nickname"></span>
      <van-rate v-model="star" readonly size="12"/>
    </div>
    <!-- 2.商品信息与时间  -->
    <p class="time">{{ reply?.add_time }},{{ reply?.sku}}</p>
    <!-- 3.评价内容 -->
    <p class="comment-content" v-text="reply?.comment"></p>
    <!-- 4.评价图片 -->
    <ul class="picture">
      <li 
       v-for="(item,index) in pics"
       :key="index"
      ><img :src="item"/></li>
    </ul>
  </van-cell>
</template>
<script setup>
import { computed } from '@vue/reactivity';

const { reply } = defineProps({
  reply: {
    type: Object,
    required: true
  }
})
const star = computed(() => Number(reply?.star))
// 评论图片
const pic = computed(() => reply?.pics)
</script>
<style lang="scss" scoped>
// 商品点评
.comment {
  margin-bottom: 10px;
  .comment-item {
    padding: 10px 15px 20px;
    .user-info {
      font-size: 13px;
      display: flex;
      align-items: center;
      padding: 7px 0;
      img {
        width: 28px;
        height: 28px;
      }
      .nickname {
        padding: 0 20px 0 10px;
      }
    }
    .time {
      font-size: 12px;
      color: #82848f;
      padding: 5px 0;
    }
    .comment-content {
      font-size: 13px;
      margin-bottom: 10px;
    }
    .picture {
      li {
        float: left;
        padding-right: 7px;
      }
      img {
        width: 78px;
        height: 78px;
      }
    }
  }
}
</style>