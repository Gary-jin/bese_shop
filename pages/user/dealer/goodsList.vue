<template>
	<view class="page_box">
		<!-- 头部 -->
		<view class="topBox" style="color:#FFFFFF;">
			<cu-custom-new :isBack="true">
				<block slot="backText" style="color: #FFFFFF; font-size: 36rpx; font-weight: 600;">升级{{tit}}</block>
				<block slot="content"></block>
			</cu-custom-new>
		</view>
		
		<view class="content_box">
				<scroll-view scroll-y="true" class="scroll-box" @scrolltolower="loadMore" enable-back-to-top
					scroll-with-animation>
					<view class="goods-box">
						<view class="goods-list" v-if="goods" v-for="goods in scoreList" :key="goods.id">
							<shopro-goods-card :detail="goods" :isTag="true"></shopro-goods-card>
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
	export default {
		components: {
			
		},
		data() {
			return {
				scoreList: [],
				emptyData: {
					img: this.$IMG_URL + '/imgs/empty/empty_goods.png',
					tip: '暂无积分商品'
				},
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,
				isLoading: true,
				tit: ''
			};
		},
		onLoad() {
			this.getScoreShopsList();
			this.tit = this.$Route.query.tit
		},
		computed: {
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
				that.$api('goods.lists', {
					page: that.currentPage,
					goods_ids: that.$Route.query.ids
				}).then(res => {
					if (res.code == 1) {
						that.isLoading = false;
						that.scoreList = [...that.scoreList, ...res.data.data];
						that.lastPage = res.data.last_page;
						
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
		background: #f2f2f2;
	}

	cu-custom-new text {
		color: #FFFFFF !important;
	}
	.topBox{
		background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
	}

	.content_box {
		padding: 20rpx;
		width: 750rpx;
	}

	.goods-box {
		display: flex;
		flex-wrap: wrap;

		.goods-list {
			margin-right: 20rpx;
			margin-bottom: 20rpx;

			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
</style>
