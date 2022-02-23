<!-- 分类 -->
<template>
	<view class="category-box">
		
		<!-- <scroll-view :scroll-y="false" enable-back-to-top refresher-enabled :refresher-triggered="thresh" @refresherrefresh="pullDown"  class="scroll-box"> -->
		
			<view class="use_head_box">
				<cu-custom bgColor="bgc" :isBack="true">
					<block slot="content">{{title}}</block>
				</cu-custom>
			</view>
				<!-- 三级分类 -->
				<sh-three-catgory :categoryId="categoryId" v-if="categoryType === 4"></sh-three-catgory>
				<!-- 二级分类 -->
				<sh-two-catgory :categoryId="categoryId" v-if="categoryType === 3"></sh-two-catgory>
				<!-- 一级分类-->
				<sh-one-catgory :categoryId="categoryId" :showType="categoryType" v-if="categoryType === 2"></sh-one-catgory>
				<sh-one-catgoryNew :categoryId="categoryId" :showType="categoryType" v-if="categoryType === 5 || categoryType ===6 "></sh-one-catgoryNew>
				<!--直接购买，点餐 -->
				<!-- <sh-takeout-catgory :categoryId="categoryId" v-if="categoryType === 1"></sh-takeout-catgory> -->
				<sh-takeout-catgoryNew :categoryId="categoryId" v-if="categoryType === 1"></sh-takeout-catgoryNew>
				<sh-takeout-catgoryNews :categoryId="categoryId" :showType="categoryType" v-if="categoryType === 7 || categoryType === 8"></sh-takeout-catgoryNews>
		<!-- </scroll-view> -->
			<!-- 自定义底部导航 -->
			<shopro-tabbar   v-if="queryObj.id"  :queryObj="queryObj"></shopro-tabbar>
			<!-- 关注弹窗 -->
			<shopro-float-btn></shopro-float-btn>
			<!-- 连续弹窗提醒 -->
			<shopro-notice-modal></shopro-notice-modal>
			<!-- 登录提示 -->
			<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shTakeoutCatgory from './components/category/sh-takeout-catgory.vue';
import shTakeoutCatgoryNew from './components/category/sh-takeout-catgoryNew.vue';
import shTakeoutCatgoryNews from './components/category/sh-takeout-catgoryNews.vue';
import shThreeCatgory from './components/category/sh-three-catgory.vue';
import shTwoCatgory from './components/category/sh-two-catgory.vue';
import shOneCatgory from './components/category/sh-one-catgory.vue';
import shOneCatgoryNew from './components/category/sh-one-catgoryNew.vue';
export default {
	components: {
		shTakeoutCatgory,
		shThreeCatgory,
		shTwoCatgory,
		shOneCatgory,
		shOneCatgoryNew,
		shTakeoutCatgoryNew,
		shTakeoutCatgoryNews
	},
	data() {
		return {
			categoryType: 0, //1:快速购买,2 5 6 7 8 :一级分类，3:二级分类，4:三级分类
			categoryId: 0, //分类Id
			queryObj: {},
			title:'',
			thresh:'',
		};
	},
	computed: {},
	onLoad(options) {
		this.queryObj = options;
		this.getCategory();
	},
	methods: {
		/**
		 * 获取分类数据
		 *  type4:三级分类， type3:二级分类 ,type2:一级分类,type1:快速购买
		 */
		getCategory() {
			this.$api('category.info', {
				id: this.$Route.query.id ? this.$Route.query.id : 0
			}).then(res => {
				if (res.code === 1) {
					if (res.data.type) {
						this.categoryType = Number(res.data.type);
						this.categoryId = Number(res.data.id);
					}
					
					this.title =  res.data.name
					this.thresh = false;
				}
			});
		},
		pullDown(){
			this.thresh = true;
			this.getCategory();
		},
	}
};
</script>

<style lang="scss">
.category-box {
	height: 100%;
	flex: 1;
	overflow: hidden;
}
.bgc{
	background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
	color: #FFFFFF;
}
</style>
