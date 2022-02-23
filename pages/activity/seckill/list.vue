<!-- 秒杀列表 -->
<template>
	<view class="page_box">
		<view class="use_head_box" style="background-color: #FFFFFF;">
			 <cu-custom :isBack="true">
			 	<block slot="content" style="font-size: 34rpx;">限时秒杀</block>
			 </cu-custom>
		</view>
		<view class="head_box">
			<!-- <view class="tab-box x-f">
				<view class="tab-item" @tap="onTab(tab.id)" :class="{ 'tab-active': tabCurrent === tab.id }" v-for="tab in tabList" :key="tab.id">
					<text class="tab-title">{{ tab.title }}</text>
					<text v-show="tabCurrent === tab.id" class="tab-triangle"></text>
				</view>
			</view> -->
			<view class="coupon-nav x-f">
				<view class=" nav-item y-f tab " :class="tabCurrent === tab.id ? 'chosed' : 'chosebe'"
					v-for="tab in tabList" :key="tab.id" @tap="onTab(tab.id)">
					<!-- 切换的横杠 -->
					<view class="whippletree" v-if="tabCurrent === tab.id"></view>
					<view class="tableText">{{  tab.title }}</view>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<view class="goods-item" v-for="item in goodsList" :key="item.id">
					<sh-activity-cardnew :cardId="item.id" :colorstyle="btnType[tabCurrent].color" :title="item.title" :subtitle="item.subtitle" :img="item.image" :price="item.price" :originalPrice="item.original_price">
						<block slot="btn">
							<button class="cu-btn buy-btn" :class="btnType[tabCurrent].color">{{ btnType[tabCurrent].name }}</button>
						</block>
					</sh-activity-cardnew>
				</view>
				<!-- 空白 -->
				<shopro-empty v-if="!goodsList.length && !isLoading" :emptyData="emptyData"></shopro-empty>
				<!-- 加载更多 -->
				<u-loadmore v-if="goodsList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
				<!-- loading -->
				<shopro-load v-model="isLoading"></shopro-load>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shActivityCardnew from '../children/sh-activity-cardnew.vue';
export default {
	components: {
		shActivityCardnew
	},
	data() {
		return {
			emptyData: {
				img: this.$IMG_URL + '/imgs/empty/empty_goods.png',
				tip: '暂无秒杀商品，敬请期待~'
			},
			isLoading: true,
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			lastPage: 1,
			currentPage: 1,
			tabCurrent: 'ing',
			goodsList: [],
			loading: false,
			btnType: {
				ended: {
					name: '已结束',
					color: 'btn-end'
				},
				ing: {
					name: '快去抢购',
					color: 'btn-ing'
				},
				nostart: {
					name: '快去抢购',
					color: 'btn-nostart'
				}
			},
			tabList: [
				{
					id: 'ended',
					title: '已结束'
				},
				{
					id: 'ing',
					title: '进行中'
				},
				{
					id: 'nostart',
					title: '即将开始'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		setTimeout(() => {
			this.loading = true;
		}, 500);
		this.getGoodsList();
	},
	methods: {
		onTab(id) {
			this.tabCurrent = id;
			this.goodsList = [];
			this.currentPage = 1;
			this.$u.debounce(this.getGoodsList);
		},
		// 百分比
		getProgress(sales, stock) {
			let unit = '';
			if (stock + sales > 0) {
				let num = (sales / (sales + stock)) * 100;
				unit = num.toFixed(2) + '%';
			} else {
				unit = '0%';
			}
			return unit;
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getGoodsList();
			}
		},
		// 秒杀列表
		getGoodsList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('goods.seckillList', {
				type: that.tabCurrent,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.tab-box {
	.tab-item {
		flex: 1;
		line-height: 84rpx;
		text-align: center;
		background: #636363;
		color: #fff;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		position: relative;
		border-right: 1rpx solid #fff;
		.tab-triangle {
			position: absolute;
			z-index: 2;
			bottom: -14rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 28rpx;
			height: 28rpx;
			background: #e6b873;
			transform: rotate(45deg);
			transform-origin: center;
		}
	}

	.tab-active {
		background: #e6b873;
	}
}
.goods-item {
	margin-bottom: 2rpx;
	.cu-progress {
		width: 225rpx;
		height: 16rpx;
		.progress--color {
			background: #e6b873;
		}
	}
	.progress-text {
		color: #999999;
		font-size: 20rpx;
		margin-left: 25rpx;
	}
	.buy-btn {
		position: absolute;
		right: 10rpx;
		bottom: 0rpx;
		width: 156rpx;
		height: 48rpx;
		border-radius: 24rpx;
		font-size: 26rpx;
		font-weight: 600;
		padding: 0;
	}
	.btn-end,
	.btn-nostart {
		background: linear-gradient(180deg, #D6D6D6 0%, #9F9F9F 100%);
		color: #FFFFFF;
	}
	.btn-ing {
		background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
		color: #FFFFFF;
	}
}

.coupon-nav {
		background: #fff;
		height: 82rpx;
		padding: 0rpx 30rpx;

		.nav-item {
			flex: 1;

			.item-title {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				line-height: 76rpx;
			}

			.nav-line {
				width: 120rpx;
				height: 4rpx;
				background: #fff;
			}

			.line-active {
				background: rgba(230, 184, 115, 1);
			}
		}
		.tab {
			text-align: center;
			font-size: 30rpx;
			position: relative;
			height: 42rpx;
			line-height: 42rpx;
			display: flex;
			flex-direction: column-reverse;
		}
		
		.chosed {
			font-weight: 600;
			color: #FF2900;
		}
		
		.chosebe {
			font-weight: 400;
			color: #9DA0A5;
		}
		
		.whippletree {
			z-index: 1 !important;
			width: 140rpx;
			height: 10rpx;
			background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
			border-radius: 5rpx;
			opacity: 0.2;
		}
		
		.tableText {
			width: 100%;
			position: absolute;
			left: 0;
			top: 0rpx;
			text-align: center;
			z-index: 1000000;
		}
	}
</style>
