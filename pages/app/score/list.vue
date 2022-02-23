<template>
	<view class="page_box">
		<!-- 头部 -->
		<view class="head_box">
			<view class="use_head_box" style="color: #FFFFFF !important;">
				<cu-custom :isBack="true">
					<block slot="content" style="color: #FFFFFF; font-size: 36rpx; font-weight: 600;">积分商城</block>
				</cu-custom>
			</view>
			<view class="roughlyKk">
				<view class="roughly">
					<view class="ruleBox">
						<text class="tet" @tap="jump('/pages/public/richtext', { id: protocolId })">规则</text>
					</view>
					<view class="jifenBox">
						<view class="jifenL">
							<view class="jifen1"><text>{{ userInfo.score || '0' }}</text></view>
							<view class="jifen2"><text>{{ userInfo.score || '0' }}积分有就有效</text></view>
						</view>
						<view class="jifenR">
							<button class="cu-btn close-btn" @tap="jump('/pages/user/wallet/score-balance')">积分账单</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content_box">
			<view class="jifenTit">
				<view class="jifenTitL"></view>
				<text class="jifenTxt">积分兑换</text>
			</view>
			<scroll-view scroll-y="true" class="scroll-box" @scrolltolower="loadMore" enable-back-to-top
				scroll-with-animation>
				<view class="goods-box">
					<view class="goods-list" v-if="goods" v-for="goods in scoreList" :key="goods.id">
						<sh-score-goods :scoreData="goods"></sh-score-goods>
					</view>
				</view>

				<!-- 空白页 -->
				<shopro-empty v-if="!scoreList.length && !isLoading" :emptyData="emptyData"></shopro-empty>
				<!-- 加载更多 -->
				<u-loadmore v-if="scoreList.length" height="80rpx" :status="loadStatus" icon-type="flower"
					color="#ccc" />
				<!-- load -->
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
	import shScoreGoods from '../children/sh-score-goods.vue';
	import { mapMutations, mapActions, mapState } from 'vuex';
	export default {
		components: {
			shScoreGoods
		},
		data() {
			return {
				scoreList: [],
				emptyData: {
					img: this.$IMG_URL + '/imgs/empty/empty_goods.png',
					tip: '暂无积分商品',
					path: '/pages/index/index',
					pathText: '去首页逛逛'
				},
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,
				isLoading: true,
				protocolId: 0
			};
		},
		onLoad() {
			this.getScoreShopsList();
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		methods: {
			// 加载更多
			loadMore() {
				if (this.currentPage < this.lastPage) {
					this.currentPage += 1;
					this.getScoreShopsList();
				}
			},
			//积分商品列表
			getScoreShopsList() {
				let that = this;
				that.loadStatus = 'loading';
				that.$api('score.list', {
					page: that.currentPage
				}).then(res => {
					if (res.code == 1) {
						that.isLoading = false;
						that.scoreList = [...that.scoreList, ...res.data.data];
						that.lastPage = res.data.last_page;
						if(res.data.rules){
							that.protocolId = res.data.rules
						}
						if (that.currentPage < res.data.last_page) {
							that.loadStatus = 'loadmore';
						} else {
							that.loadStatus = 'nomore';
						}
					}
				});
			},
			jump(path, query) {
				this.$Router.push({
					path: path,
					query: query
				});
			}
		}
	};
</script>

<style lang="scss">
	.page_box {
		background: #fff;
	}

	cu-custom-new text {
		color: #FFFFFF !important;
	}

	// 头部卡片
	.head_box {
		background: url($IMG_URL+'/imgs/group/bgc.png') no-repeat;
		background-size: 100% auto;
		height: 308rpx;
		position: relative;
		margin-bottom: 133rpx;

		.roughlyKk {
			position: absolute;
			left: 0;
			bottom: -83rpx;
			width: 100%;
			height: 229rpx;
			padding: 0rpx 30rpx;

			.roughly {
				height: 229rpx;
				width: 100%;
				background: url($IMG_URL+'/imgs/group/teamCard.png') no-repeat;
				background-size: 100% 100%;

				.ruleBox {
					display: flex;
					justify-content: flex-end;

					.tet {
						margin: 10rpx 15rpx 0 0;
						font-size: 24rpx;
						font-weight: 400;
						color: #976A2C;
					}
				}
				.jifenBox{
					height: 150rpx;
					display: flex;
					.jifenL{
						width: 70%;
						height: 100%;
						.jifen1{
							font-size: 80rpx;
							font-weight: 600;
							color: #A47532;
							text-shadow: 2rpx 3rpx 0rpx #C1A889;
							padding-left: 52rpx;
						}
						.jifen2{
							font-size: 26rpx;
							font-weight: 400;
							color: #A47532;
							padding-left: 52rpx;
						}
					}
					.jifenR{
						width: 30%;
						height: 100%;
						display: flex;
						align-items: center;
						.close-btn{
							width: 169rpx;
							height: 56rpx;
							color: #A47532;
							padding: 0;
							background: linear-gradient(90deg, #FEDEBE 0%, #F6C689 100%);
							box-shadow: 0rpx 1rpx 11rpx 0rpx #DEB684;
							border-radius: 28rpx;
						}
					}
				}
			}
		}
		
	}

	.jifenTit{
		display: flex;
		align-items: center;
		// height: 80rpx;
		margin-bottom: 30rpx;
		.jifenTitL{
			width: 10rpx;
			height: 41rpx;
			background: linear-gradient(180deg, #FD7D1A 0%, #FA470B 100%, #FA470B 100%);
			border-radius: 6rpx;
			margin-left: 20rpx;
		}
		.jifenTxt{
			font-size: 36rpx;
			font-weight: 600;
			color: #333333;
			margin-left: 20rpx;
		}
	}


	.goods-box {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;
		background-color: #fff;

		.goods-list {
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			box-shadow: 0px 0px 20rpx 4rpx rgba(199, 199, 199, 0.22);
			border-radius: 20rpx;
			overflow: hidden;

			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
</style>
