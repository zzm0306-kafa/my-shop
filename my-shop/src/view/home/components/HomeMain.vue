<template>
  <div class="home-main">
    <van-pull-refresh 
      v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <!-- 区域1.轮播图 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="(item,index) in swipeData"
        :key="index"
      >
        <img :src="item.img"/>
      </van-swipe-item>
        </van-swipe>
        <!-- 区域2:菜单列表 -->
        <van-grid icon-size="40">
      <van-grid-item
        v-for="(item,index) in menusData"
        :key="index"
        :icon="item.img" 
        :text="item.info[0].value"
         />
        </van-grid>
        <!-- 区域3：公告区域 -->
        <van-notice-bar left-icon="fire-o" :scrollable="false">
    <span>热点资讯公告:</span>
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item,index) in newsData"
          :key="index"
          v-text="item.chiild[0].val"
        />
      </van-swipe>
        </van-notice-bar>
        <!-- 区域4:商品列表 -->
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="initProductsData"
        >
      <product-list :products-data="productsData">
      </product-list>
        </van-list>
    </van-pull-refresh>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { getIndexList } from '@/api/index'
import { computed } from '@vue/reactivity'
import ProductList from '@/components/ProductList.vue'
import { getProductList } from '@/api/product'
// --------------首页功能-----------
// 存储首页所有数据
const indexData = ref({})
// 封装首页初始化数据
const initIndexData = async () => {
  const { data } = await getIndexList()
  if(data.status !== 200) { return } 
  indexData.value = data.data
  refreshing.value = false
}
initIndexData()
// 通过计算属性来保存数据
// 1.轮播图数据
const swipeData = computed(() => indexData.value.swiperBg?.default.imgList.list)
// 2.菜单列表数据
const menusData = computed(() => indexData.value.menus?.default.imgList.list)
// 3.公共区域
const newsData = computed(() => indexData.value.news?.default.newList.list)
// -------2.商品列表信息功能---------
// 存储商品列表信息
const productsData = ref([])
// 存储数据加载完毕状态
const state = reactive({
  loading: false,
  finished: false
})
// 每次请求限制数据数量
let page = 1
let limit = 4
// 请求商品列表信息
const initProductsData = async () => {
  const { data } = await getProductList({
    page,
    limit
  })
  if (data.status !== 200) { return } 
  // 请求每次得到的是新一段数据，需要将新数据添加到 productsData 中
  productsData.value.push(...data.data)
  // 将本次加载状态更改为完成
  state.loading = false
  // 判断商品数据是否加载完毕
  if (data.data.length < limit) {
    // 将finished改变true
    state.finished = true
    return
  }
  page++
}
// 不在调用这个方法，因为在数据加载时van-list@load进行加载了，如果调用会增加多一次
// initProductsData()
// ----下拉刷新-----
const refreshing = ref(false)
// 创建下拉刷新方法
const onRefresh = () => {
  // 下拉刷新时，清空数据，重新使页面加载到第一页
  indexData.value = {}
  productsData.value = []
  page = 1
  state.loading = false
  state.finished = false
  initIndexData()
  initProductsData()
}
</script>
<style lang="scss" scoped>
.home-main {
  // 轮播图
  .my-swipe img {
    width: 100%;
    height: 170px;
    padding-top: 10px;
    border-radius: 10px;
  }
  // 区域3：公告区域
  :deep(.van-notice-bar__content) {
    display: flex;
    align-items: center;
  }

  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }
}
</style>