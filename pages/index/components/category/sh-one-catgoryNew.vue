<template>
	<view class="content_box">
		<view class="x-f wrapper-box" :style="paddingBottom">
			<view class="scroll-box" style="background-color: #F6F6F6;">
				<scroll-view class="left " enable-back-to-top scroll-y>
					<view class="type-list " :class="[{ 'list-active': listId == index }]" v-for="(item, index) in categoryData" :key="index" @tap="onType(index)">
						<view class="one-t xTit" :class="listId == index?'xuan':'noxuan'">{{ item.name }}</view>
						<view :class="[{ 'line-active': listId == index }]"></view>
					</view>
					<view style="height: 160rpx;"></view>
				</scroll-view>
			</view>
			<view style="height: 100%;width: 100%;">
				<scroll-view @scrolltolower="loadMore" scroll-y class="scroll-box" enable-back-to-top scroll-with-animation>
					<view class="right" v-if="categoryData.length">
						<image class="type-img" v-show="categoryData[listId].image" :src="categoryData[listId].image" mode=""></image>
						<view class="item-list">
							<view class="item-box x-f">
								<view class="y-f goods-item" @tap="jump('/pages/goods/detail/index', { id: goods.id })" v-for="(goods, index1) in goodsList" :key="goods.id">
									<view :class="[{ 'rectangle': showType == 5 }]"  class="item-img">
										<u-lazy-load :image="goods.image" :loading-img="loadingTmg" :error-img="errorImg" img-mode="widthFix"></u-lazy-load>
									</view>
									<view :class="[{ 'square': showType == 6 }]" class="item-img">
										<u-lazy-load :image="goods.image" :loading-img="loadingTmg" :error-img="errorImg" img-mode="widthFix"></u-lazy-load>
									</view>
									<text class="item-title more-t">{{ goods.title }}</text>
									<view class="itemPriceBox">
										<text class="item-price">{{ goods.price }}</text>
										<text class="item-price2">{{ goods.price }}</text>
									</view>
									<!-- <view class="item-price">{{ goods.price }}</view> -->
								</view>
							</view>
						</view>
						<view style="height: 160rpx;"></view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			listId: 0,
			isLoading: false,
			categoryData: {},
			listParams: {
				//获取商品数据
				category_id: 0,
				keywords: '',
				page: 1
			},
			lastPage: 1, //总分页
			goodsList: [] ,//商品数据
			errorImg: this.$ERROR_IMG,
			loadingTmg: this.$LOAD_IMG,
			
		};
	},
	props: {
		// categoryId: {
		// 	type: Number,
		// 	default: 0
		// },
		categoryId: '',
		showType:'',  // 5商品长方形  6 商品正方形
	},
	computed: {
		...mapState({
			tabbarList: state => state.init.templateData.tabbar[0].content.list
		}),
		// 是否是底部导航页面
		isTabbar() {
			if (this.tabbarList.length) {
				let arr = [];
				let pages = getCurrentPages();
				// #ifdef H5
				let currentPath = pages[pages.length - 1].__page__.fullPath;
				// #endif
				// #ifdef MP-WEIXIN || APP-VUE
				// let currentPath = pages[pages.length - 1].$page.fullPath;   // 无故无法获取 $page
				let currentPath = this.$Route.path + '?id=' + this.categoryId
				// #endif
				for (let item of this.tabbarList) {
					arr.push(item.path);
				}
				return arr.includes(currentPath);
			}
		},
		paddingBottom() {
			if (this.isTabbar) {
				return 'padding-bottom:100rpx';
			}
		}
	},
	created() {
		let that = this;
		setTimeout(()=>{
			that.getCategory();
		},500)
	},

	methods: {
		// 获取分类
		getCategory() {
			this.$api('category.detail', {
				id: this.categoryId
			}).then(res => {
				if (res.code === 1) {
					this.categoryData = res.data.children;
					this.listParams.category_id = res.data.children[0].id;
					this.getGoodsList();
				}
			});
		},

		// 获取分类商品
		getGoodsList() {
			let that = this;
			that.isLoading = true;
			that.$api('goods.lists', that.listParams).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.lastPage = res.data.last_page;
				}
			});
		},

		// 商品底部
		loadMore() {
			if (this.listParams.page < this.lastPage) {
				this.listParams.page += 1;
				this.getGoodsList();
			}
		},

		onType(index) {
			this.listId = index;
			this.listParams.category_id = this.categoryData[index].id;
			this.goodsList = [];
			this.listParams.page = 1;
			!this.isLoading && this.getGoodsList();
		},
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		}
	}
};
</script>

<style lang="scss">
.content_box {
	margin-top: 1upx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.wrapper-box {
	flex: 1;
	margin-top: 1upx;
	height: 100%;
}

.scroll-box {
	height: 100%;
	flex: 1;
	background: #fff;
}

.left {
	width: 207rpx;
	height: 100%;
	flex: 1;
	background: #F5F7FA;
	.list-active {
		background: #fff;
		color: #333333 !important;
		font-weight: bold !important;
	}

	.line-active {
		width: 140rpx;
		height: 14rpx;
		background: linear-gradient(270deg, rgba(255, 149, 92, 0) 0%, #FE5C2F 100%);
		position: relative;
		top: -13rpx;
	}

	.type-list {
		height: 128rpx;
		width: 207rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.xTit{
		max-width: 200rpx;
	}
	.xuan{
		font-size: 32rpx;
		font-weight: bold;
		color: #303133;
		z-index: 9;
	}
	.noxuan{
		font-size: 30rpx;
		font-weight: 400;
		color: #303133;
	}
}

.right {
	padding: 0 20rpx;
	flex: 1;
	height: 100%;

	.type-img {
		width: 100%;
		height: 172rpx;
		background: #ccc;
		margin: 30rpx 0 20rpx 0;
		border-radius: 10rpx;
	}

	.item-list {
		.type-box {
			height: 84rpx;
			.type-title {
				font-size: 28rpx;
				font-weight: bold;
			}
			.more {
				font-size: 26rpx;
				color: #999;
			}
		}

		.item-box {
			flex-wrap: wrap;
			justify-content: space-between;
			width: 504rpx;
			.goods-item {
				// margin-right: 12rpx;
				margin-bottom: 18rpx;
				background: #ffffff;
				box-shadow: 0px 0px 20rpx 4rpx rgba(199, 199, 199, 0.22);
				border-radius: 10rpx;

				.item-img {
					border-radius: 10rpx 10rpx 0px 0px;
					// width: 100%;
					// height: 100%;
					overflow: hidden;
				}
				.rectangle{
					width: 244rpx;
					// height: 378rpx;
				}
				.square{
					width: 241rpx;
					height: 241rpx;
				}
				.item-title {
					font-size: 26rpx;
					width: 200rpx;
					text-align: left;
					margin: 20rpx;
					color: #333333;
				}
				.itemPriceBox{
					width: 100%;
					text-align: left;
					margin-bottom: 30rpx;
					.item-price {
						font-size: 36rpx;
						font-weight: bold;
						color: #FF2900;
						margin: 0 20rpx 20rpx;
						&::before {
							content: '￥';
							font-size: 18rpx;
						}
					}
					.item-price2 {
						font-size: 20rpx;
						color: #BBB2B2;
						&::before {
							content: '￥';
							font-size: 20rpx;
						}
					}
				}
			}
		}
	}
}
</style>
