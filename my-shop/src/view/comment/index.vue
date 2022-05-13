<template>
  <van-cell-group class="comment">
    <!-- 总体评价情况 -->
    <van-cell title="商品评价" :value="`好评率:${state.replyChance}`"></van-cell>
    <!-- 标签切换区域 -->
    <van-cell class="tags">
      <van-button size="small" @click="tagHandle('0')" :class="{ active: state.isSum }">全部({{ state.sumCount }})</van-button>
      <van-button size="small" @click="tagHandle('1')" :class="{ active: state.isGood }">好评({{ state.goodCount }})</van-button>
      <van-button size="small" @click="tagHandle('2')" :class="{ active: state.isIn }">中评({{ state.inCount }})</van-button>
      <van-button size="small" @click="tagHandle('3')" :class="{ active: state.isPoor }">差评({{ state.poorCount }})</van-button>
    </van-cell>
     <!-- 评价列表 -->
     <div v-if="state.noComment">
       <comment-item
        v-for="reply in state.commentList"
        :key="reply.id"
        :reply="reply"
      >
      </comment-item>
     </div>
     <van-empty v-else description="该商品还没评论，快去评论一下"></van-empty>
  </van-cell-group>
</template>
<script setup>
import CommentItem from '../../components/CommentItem.vue'
import { getCommentCount, getCommentByTag } from '@/api/product'
import { reactive } from 'vue';
import { computed } from '@vue/reactivity';
const { productId } = defineProps({
  productId: {
    type: String,
    required: true
  }
})
// 存储评论的相关数据
const state = reactive({
  // 存储所有个数信息
  commentCounts: {},
  // 通过计算属性，处理不同类别的评论个数
  sumCount: computed(() => state.commentCounts?.sum_count || 0),
  goodCount: computed(()=> state.commentCounts?.good_count || 0),
  poorCount: computed(()=> state.commentCounts?.poor_count || 0),
  inCount: computed(()=> state.commentCounts?.in_count || 0),
  replyChance: computed(()=> state.commentCounts?.reply_chance || 100),
  // 存储评价信息
  commentList: [],
  //  控制显示的评价状态
  active: '0',
  // 通过计算属性来进行控制按钮
  isSum: computed(() => state.active === '0'),
  isGood: computed(() => state.active === '1'),
  isIn: computed(() => state.active === '2'),
  isPoor: computed(() => state.active === '3'),
  // 没有评论判断
  noComment: computed(() => state.commentList.length || 0)
})
// 获取好评个数接口信息
const initReplyData = async() => {
  const { data } = await getCommentCount(productId)
  console.log(data)
  if(data.status !== 200) { return }
  state.commentCounts = data.data
} 
initReplyData()
// 请求商品评价信息
const initCommentByTag = async(type) => {
  const { data } = await getCommentByTag(productId, { type })
  console.log(data)
  if (data.status !== 200) { return }
  state.commentList = data.data
}
initCommentByTag('0')
// 切换类别点击事件
function tagHandle(tagKey) {
  state.active = tagKey
  // 发送新类型的评价请求
  initCommentByTag(tagKey)
}
</script>
<style lang="scss" scoped>
  .tags {
    .van-button {
      border-radius: 15px;
      margin-right: 10px;
    }

    .active {
      background-color: #FBC546;
    }
  }
</style>