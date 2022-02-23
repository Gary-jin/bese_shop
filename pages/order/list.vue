<template>
	<view class="page_box">
		 <cu-custom-new
        :isBack="true"
      >
        <block slot="backText">订单列表</block>
        <block slot="content"></block>
      </cu-custom-new>
		<view class="head_box">
			<view class="order-nav x-f">
				<view class="nav-item y-f" v-for="nav in orderState" :key="nav.id" @tap="onNav(nav.type)">
					<view class="item-title" :class="{ 'titleCol': orderType === nav.type }">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': orderType === nav.type }"></text>
				</view>
			</view>
		</view>
		<view class="content_box contentBox">
			<scroll-view scroll-y="true" enable-back-to-top refresher-enabled :refresher-triggered="thresh" @refresherrefresh="pullDown" @scrolltolower="loadMore" class="scroll-box">
				<view class="order-list" v-for="(order, orderIndex) in orderList" :key="order.id" @tap.stop="jump('/pages/order/detail', { id: order.id })">
					<view class="order-head x-bc">
						<text class="no">订单编号：{{ order.order_sn }}</text>
						<text class="state">{{ order.status_name }}</text>
					</view>
					<view class="goods-order" v-for="goods in order.item" :key="goods.id">
						<view class="order-content">
							<shopro-mini-card :type="'order'" :detail="goods" :orderType="order.type"></shopro-mini-card>
						</view>
					</view>
					<view class="order-bottom">
						<view class="all-msg x-f">
							优惠
							<text class="all-unit">￥</text>
							{{ order.discount_fee }} <text class="xx"></text> 运费
							<text class="all-unit">￥</text>
							{{ order.dispatch_amount }} <text class="xx"></text> 
							<text class="shifu">{{ order.status <= 0 ? '需付款' : '实付款' }}</text>
							<view class="all-money">{{ order.total_fee }}</view>
						</view>
						<view class="btn-box x-f" v-if="order.btns.length">
							<block v-for="orderBtn in order.btns" :key="orderBtn">
								<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(order.id, orderIndex)" class="cu-btn obtn1">取消订单</button>
								<button v-if="orderBtn === 'pay'" @tap.stop="onPay(order.id)" class="cu-btn obtn2">立即支付</button>
								<button v-if="orderBtn === 'groupon'" @tap.stop="jump('/pages/activity/groupon/detail', { id: order.ext_arr.groupon_id })" class="cu-btn obtn2">
									拼团详情
								</button>
								<button v-if="orderBtn === 'delete'" @tap.stop="onDelete(order.id, orderIndex)" class="cu-btn obtn1">
									删除
								</button>
								<button v-if="orderBtn === 'express'" @tap.stop="onExpress(order.id, orderIndex)" class="cu-btn obtn1">查看物流</button>
							</block>
						</view>
					</view>
				</view>
				<!-- 空白页 -->
				<shopro-empty v-if="!orderList.length && !isLoading" :emptyData="emptyData"></shopro-empty>
				<!-- load -->
				<shopro-load v-model="isLoading"></shopro-load>
				<!-- 更多 -->
				<u-loadmore v-if="orderList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			routerTo: this.$Router,
			isLoading: true,
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			orderType: 'all',
			orderList: [],
			emptyData: {
				img: this.$IMG_URL + '/imgs/empty/empty_groupon.png',
				tip: '暂无商品，还有更多好货等着你噢~'
			},
			orderState: [
				{
					id: 0,
					title: '全部',
					type: 'all'
				},
				{
					id: 1,
					title: '待付款',
					type: 'nopay'
				},
				{
					id: 2,
					title: '待发货',
					type: 'nosend'
				},
				{
					id: 3,
					title: '待收货',
					type: 'noget'
				},
				{
					id: 4,
					title: '待评价',
					type: 'nocomment'
				}
			],
			thresh:''
		};
	},
	computed: {},
	onLoad() {
		if (this.$Route.query.type) {
			this.orderType = this.$Route.query.type;
		}
		this.getOrderList();
	},
	onShow() {},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		onNav(id) {
			this.orderType = id;
			this.orderList = [];
			this.currentPage = 1;
			this.$u.debounce(this.getOrderList);
		},
		// 订单列表
		getOrderList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('order.index', {
				type: that.orderType,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.orderList = [...that.orderList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
					that.thresh = false
				}
			});
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getOrderList();
			}
		},
		pullDown(){
			this.currentPage = 1;
			this.orderList = [];
			this.thresh = true;
			this.getOrderList();
		},
		// 删除订单
		onDelete(orderId, orderIndex) {
			let that = this;
			uni.showModal({
				title: '删除订单',
				content: '确定要删除这个订单么？',
				cancelText: '取消',
				confirmText: '删除',
				success: res => {
					if (res.confirm) {
						that.$api('order.deleteOrder', {
							id: orderId
						}).then(res => {
							if (res.code === 1) {
								this.$tools.toast(res.msg);
								this.orderList.splice(orderIndex, 1);
							}
						});
					}
				}
			});
		},
		// 取消订单
		onCancel(id, orderIndex) {
			let that = this;
			that.$api('order.cancel', {
				id: id
			}).then(res => {
				if (res.code === 1) {
					this.$tools.toast(res.msg);
					this.orderList.splice(orderIndex, 1);
				}
			});
		},
		// 立即购买
		onPay(id) {
			uni.navigateTo({
				url: `/pages/order/payment/method?orderId=${id}`
			});
		},
		// 查看物流
		onExpress(orderId) {
			let that = this;
			that.$api('order.expressList', {
				order_id: orderId
			}).then(res => {
				if (res.code === 1) {
					if (res.data.length == 1) {
						this.jump('/pages/order/express', { orderId: orderId, expressId: res.data[0].id });
					} else if (res.data.length > 1) {
						this.jump('/pages/order/express-list', { orderId: orderId });
					} else {
						this.$tools.toast('暂无包裹~');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.order-nav {
	background: #fff;
	height: 80rpx;

	.nav-item {
		flex: 1;

		.item-title {
			font-size: 30rpx;
			line-height: 76rpx;
			font-size: 30rpx;
			font-weight: 600;
			color: #9DA0A5;
		}
		.titleCol{
			color: #FF2900;
		}

		.nav-line {
			width: 100rpx;
			height: 10rpx;
			border-radius: 5rpx;
			position: relative;
			top: -26rpx;
		}

		.line-active {
			background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
			opacity: 0.2;
		}
	}
}
.contentBox{
	padding: 0 30rpx;
}
.order-list {
	background: #fff;
	margin: 20rpx 0;
	border-radius: 18rpx;
	.order-bottom {
		padding-bottom: 40rpx;
		.btn-box {
			justify-content: flex-end;
		}
		.all-msg {
			font-size: 28rpx;
			color: #909399;
			justify-content: flex-end;
			margin-bottom: 30rpx;
			padding: 0 30rpx;
			.xx{
				width: 30rpx;
			}
			.all-unit {
				font-size: 20rpx;
			}
			.shifu{
				color: #333;
				font-weight: bold;
				font-size: 28rpx;
			}
			.all-money {
				font-size: 28rpx;
				color: #333;
				font-weight: bold;
				&::before {
					content: '￥';
					font-size: 22rpx;
				}
			}
		}
		.obtn1 {
			width: 160rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1px solid #CACBCC;
			border-radius: 30rpx;
			font-size: 30rpx;
			color: #333333;
			margin-right: 20rpx;
			padding: 0;
		}
		.obtn2 {
			width: 160rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1px solid #FF2900;
			border-radius: 30rpx;
			margin-right: 20rpx;
			font-size: 30rpx;
			color: #FF2900;
			padding: 0;
		}
	}
	.order-head {
		padding: 0 30rpx;
		height: 90rpx;

		.no {
			font-size: 24rpx;
			color: #333333;
		}

		.state {
			font-size: 26rpx;
			color: #FF2900;
		}
	}
	.order-content {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #EEEEEE;
	}
	.goods-order {
		padding: 10rpx 30rpx 0;
		margin-bottom: 20rpx;
	}

	.goods-bottom {
		background: #fff;
		padding-bottom: 30rpx;
	}
}
</style>
