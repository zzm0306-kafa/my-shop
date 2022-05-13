<template>
  <van-nav-bar
    left-arrow fixed
    @click-left="onClickLeft"
  />
  <van-tabs scrollspy color="#FBC546">
    <van-tab title="商品">
      <!-- 1.轮播图区域 -->
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item
          v-for="(item,index) in sliderImage"
          :key="index"
        >
          <img :src="item" alt="">
        </van-swipe-item>
      </van-swipe>
      <!-- 2.商品头部 -->
      <van-cell :border="false" class="productHeader">
        <!-- 2.1商品标题 -->
        <template #title>
          <div class="price">
            <!-- 商品价格 -->
            <span>￥{{ specDetail?.price }}</span>
            <!-- 分享按钮图标 -->
            <van-icon name="share-o" size="20" class="share"></van-icon>
          </div>
          <!-- 标题信息 -->
          <div class="title" v-text="storeInfo?.store_name"></div>
        </template>
        <!-- 2.2商品其他信息 -->
        <template #label>
          <span>原价:￥{{ specDetail?.ot_price }}</span>
          <span>库存:{{ specDetail?.stock + storeInfo?.unit_name }}</span>
          <span>销量:{{ storeInfo?.fsales }}</span>
        </template>
      </van-cell>
      <!-- 3.商品规格选择 -->
      <van-cell
        class="sku_window"
        is-link
        @click="showPopup"
      >
        <template #title>
          <span>已选择: {{ sku }}</span>
        </template>
      </van-cell>
      <!-- 弹出框 -->
      <van-popup
        v-model:show="specState.show"
        position="bottom"
        round
        class="popup"
        >
        <van-cell-group>
          <!--1.头部信息  -->
          <van-cell class="popup-header">
            <!-- 1.1图片 -->
            <img :src="specDetail?.image" alt="">
            <!-- 1.2信息内容区 -->
            <div class="info">
              <!-- 标题 -->
              <p class="title" v-text="storeInfo?.store_name"></p>
              <p class="price">￥{{ specDetail?.price }}</p>
              <p class="stock">库存: {{ specDetail?.stock }}</p>
            </div>
          </van-cell>
          <!-- 2.规格区 -->
          <van-cell
            class="spec"
            v-for="(attr, specIndex) in productAttr"
            :key="attr.id"
          >
            <p v-text="attr.attr_name"></p>
            <span 
              class="tag"
              :class="{ active: specState.spec[specIndex] === tag }"
              v-for="tag in attr.attr_values"
              :key="tag"
              v-text="tag"
              @click="handleTagChage(tag, specIndex)"
            >
            </span>
          </van-cell>
          <!-- 3.购买数量区 -->
          <van-cell title="数量">
            <van-stepper v-model="specState.buyCount" :max="8" />
          </van-cell>
        </van-cell-group>
        </van-popup> 
    </van-tab>
    <van-tab title="评价" class="comment">
      <van-cell-group>
        <van-cell
          is-link
          :title="replyInfo"
          :value="replyRate"
          :to="{
            name: 'comment',
            params: {
              productId: storeInfo?.id
            }
          }"
          ></van-cell>
        <comment-item v-if="replyCount !== 0" :reply="reply"/>
      </van-cell-group>
    </van-tab>
    <van-tab title="推荐">
      <van-cell class="recommend">
        <p class="title">商品推荐</p>
        <van-grid :column-num="3" :border="false">
          <van-grid-item
            v-for="item in goodsList"
            :key="item.id"
            :to="{
              name: 'product',
              params:{
                productId: item.id
              }
            }"
          >
            <van-image :src="item.image"></van-image>
            <p v-text="item.store_name"></p>
            <span>￥{{ item.price }}</span>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-tab>
    <van-tab title="详情">
      <div class="description" v-html="storeInfo?.description"></div>
    </van-tab>
  </van-tabs>
</template>
<script setup>
import { getProductDeatail } from '@/api/product'
import { computed } from '@vue/reactivity'
import { ref, reactive } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import CommentItem from '../../components/CommentItem.vue'
// 路由跳转
const router = useRouter()
const { productId }= defineProps({
  productId: {
     type: String,
     required: true
  }
})
 const onClickLeft = () => {
   router.push({
     name: 'home'
   })
 } 
// 存储商品详情信息
const productDeatails = ref({})
// 商品详情信息功能
const initProductDeatail = async (productId) => {
  const { data } = await getProductDeatail(productId)
  if (data.status !== 200) 
  { 
    return router.push({
      name: 'home'
    })
  }
  productDeatails.value = data.data
  initSpec(data.data.productAttr)
  // console.log(data)
}
initProductDeatail(productId)
// 存储商品信息数据
const storeInfo = computed(() => productDeatails.value.storeInfo)
// 1.商品详情轮播图展示
const sliderImage = computed(() => storeInfo.value?.slider_image)
// ----2用户点评功能----
// 2.1.用户点评数量信息
const replyCount = computed(() => productDeatails.value?.replyCount || 0)
const replyInfo = computed(() => `用户点评(${replyCount.value})`)
// 2.2.好评率
const replyChance = computed(() => productDeatails.value?.replyChance || 0)
const replyRate = computed(() => replyChance.value + '%好评率')
// 2.3.好评信息
const reply = computed(() => productDeatails.value.reply)
// 3.商品推荐
const goodsList = computed(() => productDeatails.value.good_list)
// ---- 通过导航守卫监听路由变化，并请求对应的新商品数据 ----
onBeforeRouteUpdate((to) => {
  productDeatails.value = {}
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  initProductDeatail(to.params.productId)
})
// 4.对商品信息选择规格弹出方层处理
const specState = reactive({
  show: false,// 弹出层的显示状态
  spec: [],// 选中的规格数据
  buyCount: 0 // 购买个数
})
//  1.规格数据处理
const productAttr = computed(() => productDeatails.value.productAttr)
const productValue = computed(() => productDeatails.value.productValue)
// sku 数据处理
const sku = computed(() => specState.spec.toString())
// 根据 sku 获取对应商品信息
const specDetail = computed(() => productValue.value?.[sku.value])
// 初始化规划默认选中数据
const initSpec = (spec) => {
  specState.spec = spec.map(item => item.attr_values[0])
}
// 显示隐藏弹出层
const showPopup = () => {
  specState.show = !specState.show
}
// 对tag标签进行切换
const handleTagChage = (tag, specIndex) => {
  specState.spec[specIndex] = tag
}
</script>
<style lang="scss" scoped>
// 为了避免问题，添加 fixed 样式权重
.van-nav-bar {
  position: fixed !important;
}
.van-tabs {
  background-color: #F2F2F2;
  margin-bottom: 50px;
  // tab区域
  :deep(.van-tabs__wrap){
    width: 80%;
    position: fixed;
    top: 0;
    z-index: 999;
    left: 50%;
    transform: translateX(-50%);
  }
  // 底部内容
  :deep(.van-tabs__content) {
    padding-top: 46px;
  }
  .my-swipe {
    width: 100%;
    height: 300px;
    img {
      width: 100%;
      height: 300px;
    }
  }
  // 商品区域
  :deep(.productHeader) {
    margin-bottom: 10px;
    .van-cell__title {
      .price {
        span {
          font-size: 24px;
          font-weight: 700;
        }
        .share {
          float: right;
          font-weight: 700;
        }
      }
      .title {
        font-size: 16px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        -webkit-box-orient: vertical;
        margin: 8px 0 10px;
      }
    }
    .van-cell__label {
      display: flex;
      justify-content: space-between;
      span {
        margin: 5px 0;
      }
    }
     // 商品规格区域
    .sku_window {
      margin-bottom: 10px;
    }
  }
  .comment {
    margin-top: 10px;
  }
  // 商品推荐
  :deep(.recommend){
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: 700;
      padding: 5px 0;
    }
    .van-grid-item__content {
      padding: 0;
    }
    .van-grid-item {
      img {
        width: 107px;
        height: 107px;
      }
      p {
        padding: 0 3px;
        font-size: 12px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        // text-align: left;
      }
      span {
        color: red;
        font-size: 12px;
        font-weight: 700;
        // 让元素单独靠左，可以设置 grid 的 center，或单独使用 flex 属性
        align-self: flex-start;
      }
    }
  }
  // 商品介绍
  .description {
    width: 100%;
    :deep(img) {
      width: 100%;
    }
  }
  // 弹出层
  :deep(.popup) {
    margin-bottom: 50px;
    max-height: 60%;
    // 弹出层头部
    .popup-header {
      .van-cell__value {
        display: flex;
        img {
          width: 75px;
          height: 75px;
          align-self: center;
        }
        .info {
          padding: 10px;
        }
        .title {
          font-size: 16px;
          font-weight: 700;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1;
          margin-bottom: 10px;
        }
        .price {
          font-size: 16px;
          color: #F2270C;
        }
        .stock {
          font-size: 12px;
          color: #999;
        }
      }
    }
    // 规格区
    .spec {
      p {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 5px;
      }
      .tag {
        display: inline-block;
        min-width: 35px;
        padding: 0 12px;
        border: 1px solid #ccc;
        border-radius: 20px;
        margin-right: 10px;
        background-color: #F2F2F2;
        text-align: center;
      }
      .tag.active {
        border-color: #F2270C;
        color: #F2270C;
        background-color: #FCEDEB;
      }
    }
  }
}
</style>