<template>
	<view class="bodyBox">
		<view class="head_box">
			<view class="add-address-box flex-sub x-f" v-if="!addressId" @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" :src="$IMG_URL + '/imgs/address_line.png'" mode=""></image>
				<view class="box-bg x-bc flex-sub pad">
					<text class="select-notice">请选择收货地址</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="address-list" v-else @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" :src="$IMG_URL + '/imgs/address_line.png'" mode=""></image>
				<view class="top x-f">
					<text class="name">{{ address.consignee }}</text>
					<text class="phone">{{ address.phone }}</text>
					<text class="tag" v-if="address.is_default == 1">默认</text>
				</view>
				<view class="detail x-bc">
					<view class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		<!--  -->
		<view class="content_box">
			<!-- 确认订单商品卡片 -->
			<view class="coreBox1">
				<view class="goods-list">
					<view class="goods-card">
						<shopro-mini-card :detail="detail" :type="'truequeConfirm'">
							<block slot="goodsBottom">
								<view class="goods-price x-bc">
									<view class="">
										<text>￥{{detail.price}}</text>
									</view>
									<text class="goods-num">x{{goods_num}}</text>
								</view>
							</block>
						</shopro-mini-card>
					</view>
					<!-- 配送方式  new -->
					<view style="padding: 0 25rpx;">
						<view class="logistic item-list x-bc">
							<view class="x-f"><view class="item-title">配送方式</view></view>
							<view class="x-f">
								<view class="detail">{{detail.dispatch}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view style="padding: 0 30rpx;margin-top: 20rpx;">
				<view style="border-radius: 18rpx;overflow: hidden;">
					<view class="remark-box x-bc item-list">
						<view class="item-title item-title1">运费金额</view>
						<view class="x-f">
							<text class="price">￥{{goodData.dispatch_amount}}</text>
						</view>
					</view>
					<view class="totaBox">
						<text class="tit">实付款</text>
						<text class="totaPic">{{goodData.total_fee}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- footer -->
		<view class="foot_box x-bc">
			<view class="all-money">
				<text class="num">共1件</text>
				<text class="tota">合计：</text>
				<text class="price">{{goodData.total_fee}}</text>
			</view>
			<button class="cu-btn sub-btn" @tap="subOrder" >
				提交订单
			</button>
		</view>
	</view>
</template>
<script>
	export default {
		computed: {

		},
		components:{
		},
		data() {
			return {
				addressId: 0,
				address: {
					is_default: 0
				},
				detail: {},
				goods_id:'',
				goods_num:'',
				goodData: {}
			};
		},
		watch: {
			address(val, oldVal) {
				if (this.address) {
					this.addressId = this.address.id;
				}
			}
		},
		async onLoad(option) {
			this.goods_id = this.$Route.query.id;
			this.goods_num = this.$Route.query.goods_num;
			await this.init();
		},
		methods: {
			init() {
				return Promise.all([this.getDefaultAddress(),this.getData()]);
			},
			getData(){
				this.$api('api.sCyPre', {
					goods_id: this.goods_id,
					goods_num: this.goods_num,
					address_id: this.address_id
				}).then(res => {
					if (res.code === 1) {
						this.detail = res.data.new_goods_list.detail
						this.goodData = res.data
					} else {
						this.$tools.toast(res.msg)
					}
				});
			},
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			// 初始地址
			getDefaultAddress() {
				this.$api('address.defaults').then(res => {
					if (res.code === 1) {
						if (res.data) {
							this.address = res.data;
						}
					}
				});
			},
			// 提交订单
			subOrder() {
				let that = this;
				that.$api('api.sCyCreateOrder', {
					goods_id: that.goods_id,
					goods_num: that.goods_num,
					address_id: that.addressId
				}).then(res => {
					if (res.code === 1) {
						let orderId = res.data.id;
						let orderSn = res.data.order_sn;
						if (res.data.status > 0) {
							that.$Router.replace({
								path: '/pages/order/payment/result',
								query: {
									orderSn: orderSn,
									type: '',
									pay: 1
								}
							});
						} else {
							uni.redirectTo({
								url: `/pages/order/payment/method?orderId=${orderId}&type=trueque`
							});
						}
					} else {
						that.$tools.toast(res.msg)
					}
				});
			},
		}
	};
</script>
<style lang="scss">
	.head_box{
		padding: 30rpx  30rpx 0 ;
		box-shadow: 0 2rpx 4rpx 0 rgba(231, 231, 231, 0.5);
	}
	.cuIcon-right {
		color: #656668;
		font-size: 38rpx;
	}
	.add-address-box {
		height: 100rpx;
		background: #fff;
		position: relative;
		border-radius: 18rpx;
		overflow: hidden;
		.address-bg {
			position: absolute;
			bottom: 0;
			height: 8rpx;
			width: 100%;
		}
		.select-notice {
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 40rpx;
		}
	}
	
	.address-list {
		padding: 30rpx;
		background: #fff;
		position: relative;
		border-radius: 18rpx;
		overflow: hidden;
		.address-bg {
			position: absolute;
			bottom: 0;
			height: 4rpx;
			width: 690rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	
		.name{
			font-size: 32rpx;
			color: #333333;
		}
		.phone {
			font-size: 32rpx;
			color: #636465;
			margin: 0 20rpx;
		}
		.tag {
			background: #FEDBCF;
			border-radius: 6rpx;
			padding: 0 16rpx;
			line-height: 38rpx;
			color: #FF2900;
			font-size: 22rpx;
		}
	
		.detail {
			.address {
				margin-top: 25rpx;
				width: 543rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
				line-height: 40rpx;
			}
		}
	}
	
	
	
	.foot_box {
		width: 100%;
		height: 100rpx;
		padding: 0 25rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		z-index: 999;
	
	
		.all-money {
			font-size: 32rpx;
			.num {
				color: #C5C6C7;
				margin-right: 10rpx;
			}
			.tota{
				color: #303133;
			}
			.price {
				font-weight: bold;
				color: #FF3C17;
				font-size: 42rpx;
			}
			.price::before{
				content: "￥";
				font-size: 28rpx;
			}
		}
	
		.sub-btn {
			width: 229rpx;
			height: 75rpx;
			background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
			border-radius: 37.5rpx;
			font-size: 32rpx;
			color: #fff;
		}
	}
	
	// 商品卡片
	.coreBox1{
		padding: 0 30rpx;
	}
	.goods-list {
		background: #fff;
		position: relative;
		margin-top: 20rpx;
		border-radius: 18rpx;
		/deep/ .goods-title {
			width: 425rpx !important;
			font-weight: bold !important;
			font-size: 32rpx !important;
		}
		.goods-card {
			padding: 30rpx;
		}
		.goods-price {
			font-size: 30rpx;
			font-weight: 500;
			width: 425rpx;
			.goods-num {
				font-size: 28rpx;
				color: #c4c4c4;
			}
		}
	}
	.item-list {
		height: 100rpx;
		background: #fff;
	
		.item-title {
			font-size: 32rpx;
			margin-right: 20rpx;
			color: #626667;
		}
		.item-title1{
			color: #333435;
		}
	
		.detail {
			font-size: 32rpx;
			color: #333;
			margin-right: 20rpx;
		}
	
		.price {
			font-size: 32rpx;
			color: #333333;
		}
		.price1{
			font-size: 32rpx;
			color: #626667;
			margin-right: 20rpx;
		}
		.sel-coupon {
			font-size: 32rpx;
			color: #626667;
			margin-right: 20rpx;
		}
	}
	.item-list {
		height: 100rpx;
		padding: 0 30rpx;
		background: #fff;
	
		.item-title {
			font-size: 32rpx;
			margin-right: 20rpx;
			color: #626667;
		}
		.item-title1{
			color: #333435;
		}
	
		.detail {
			font-size: 32rpx;
			color: #333;
			margin-right: 20rpx;
		}
	
		.price {
			font-size: 32rpx;
			color: #333333;
		}
		.price1{
			font-size: 32rpx;
			color: #626667;
			margin-right: 20rpx;
		}
		.sel-coupon {
			font-size: 32rpx;
			color: #626667;
			margin-right: 20rpx;
		}
	}
	.totaBox{
		border-top:1rpx solid #EEEEEE;
		padding: 23rpx  0 37rpx 0 ;
		display: flex;
		justify-content: flex-end;
		background: #FFFFFF;
		.tit{
			font-size: 32rpx;
			color: #333435;
			padding-top: 7rpx;
		}
		.totaPic{
			padding: 0 30rpx 0 6rpx;
			font-size: 42rpx;
			font-weight: bold;
			color: #FF2900;
		}
		.totaPic::before{
			content: "￥";
			font-size: 32rpx;
		}
	}
</style>
