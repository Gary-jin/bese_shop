<!-- 收藏列表 -->
<template>
	<view class="page_box">
		<view class="head_box x-bc" v-if="favoriteList.length">
			<view class="count-box">
				共
				<text class="all-num">{{ total }}</text>
				件商品
			</view>
			<button class="cu-btn set-btn" @tap="onSet">{{ isSel ? '完成' : '编辑' }}</button>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<checkbox-group @change="onSel" v-if="favoriteList.length">
					<view class="collect-list x-f" v-if="f.goods" v-for="f in favoriteList" :key="f.id">
						<checkbox v-if="isSel" :value="f.goods_id.toString()" :checked="f.checked" :class="{ checked: f.checked }" class="goods-radio round color_ff2900"></checkbox>
						<shopro-mini-card :detail="f" :type="'trueque'"></shopro-mini-card>
					</view>
				</checkbox-group>
				<!-- 缺省页 -->
				<shopro-empty v-if="!favoriteList.length" :emptyData="emptyData"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="favoriteList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
		<view class="foot_box ">
			<view class="tools-box x-bc" v-if="isSel && favoriteList.length">
				<label class="check-all" @tap="onAllSel">
					<radio :checked="allSel" :class="{ checked: allSel }" class="check-all-radio color_ff2900"></radio>
					<text>全选</text>
				</label>
				<button class="cu-btn  close-btn" @tap="cancelFavorite">删除</button>
			</view>
		</view>
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
	components: {},
	data() {
		return {
			isSel: false,
			allSel: false,
			routerTo: this.$Router,
			selList: [],
			emptyData: {
				img: this.$IMG_URL + '/imgs/empty/empty_goods.png',
				tip: '暂无收藏商品，赶紧去收藏好货吧~'
			},
			favoriteList: [],
			total: 0,
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onShow() {
		this.init();
	},
	onHide() {
		this.favoriteList = [];
	},
	methods: {
		// init
		init() {
			return Promise.all([this.getFavoriteList()]);
		},
		onSel(e) {
			let items = this.favoriteList,
				values = e.detail.value;
			this.selList = values;
			items.forEach(i => {
				if (values.includes(i.goods_id.toString())) {
					this.$set(i, 'checked', true);
				} else {
					this.$set(i, 'checked', false);
				}
			});
			if (this.selList.length < items.length) {
				this.allSel = false;
			} else {
				this.allSel = true;
			}
		},
		onSet() {
			this.isSel = !this.isSel;
		},
		onAllSel() {
			this.allSel = !this.allSel;
			this.selList = [];
			const { favoriteList } = this;
			favoriteList.forEach(i => {
				if (this.allSel) {
					this.$set(i, 'checked', true);
					this.selList.push(i.goods_id);
				} else {
					this.$set(i, 'checked', false);
				}
			});
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getFavoriteList();
			}
		},
		// 收藏列表
		getFavoriteList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('api.sCyFavoriteList', {}).then(res => {
				if (res.code === 1) {
					that.total = res.data.total;
					that.favoriteList = [...that.favoriteList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		},
		// 取消收藏
		cancelFavorite() {
			let that = this;
			let ids = that.selList;
			const { favoriteList } = this;
			that.$api('api.sCyFavorite', {
				goods_ids: ids
			}).then(res => {
				if (res.code === 1) {
					if (that.allSel) {
						that.favoriteList = [];
						that.total = that.favoriteList.length;
					} else {
						that.favoriteList = favoriteList.filter(f => !ids.includes(f.goods_id.toString()));
						that.total = that.favoriteList.length;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.head_box {
	height: 70rpx;
	padding: 0 30rpx;
	background: #ffffff;

	.count-box {
		font-size: 26rpx;
		color: #999;

		.all-num {
			// color: #a8700d;
		}
	}

	.set-btn {
		background: none;
		font-size: 26rpx;
		color: #FF2900;
	}
}

.collect-list {
	margin: 30rpx 20rpx;
	background: #ffffff;
	border-radius: 18rpx;
	overflow: hidden;
	box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(231, 231, 231, 0.5);
	margin-bottom: 20rpx;

	.goods-radio {
		transform: scale(0.7);
		margin-left: 20rpx;
	}
}

.tools-box {
	height: 100rpx;
	width: 750rpx;
	padding: 0 20rpx;
	background: #fff;

	.check-all {
		font-size: 26rpx;

		.check-all-radio {
			transform: scale(0.7);
		}
	}

	.close-btn {
		width: 116rpx;
		height: 46rpx;
		border-radius: 23rpx;
		padding: 0;
		color: #FF2900;
		background: none;
		border-radius: 23rpx;
		border: 1px solid #FF2900;
	}
}
</style>
