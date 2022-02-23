<template>
	<view>
		<view class="bodyBox">
			<cu-custom-new
			  :isBack="true" :fixed="'false'"
			  style="color: #FFFFFF;"
			>
			  <block slot="backText">订单详情</block>
			  <block slot="content"></block>
			</cu-custom-new>
			<view class="coreBox">
				<view class="coreB1" v-if="obj.dispatch_type == 'express'">
					<view class="b1Name">
						<view class="name one-t">
							{{obj.consignee}}
						</view>
						<view class="phone">
							{{obj.phone}}
						</view>
					</view>
					<view class="address more-t">
						{{obj.province_name}}{{obj.city_name}}{{obj.area_name}}{{obj.address}}
					</view>
				</view>
				<view class="coreB1 core1selfetch" v-if="obj.dispatch_type == 'selfetch'">
					<view class="sel1">
						自提商品
					</view>
					<view class="sel2">
						请联系卖家发货呦~
					</view>
				</view>
				<view class="coreB2">
					<view class="itemTcore">
						<image class="itemImg" :src="item.goods_image" mode=""></image>
						<view class="itemRig">
							<view class="itemTit estaC more-t">{{item.goods_title}}</view>
							<view class="itemPic">
								<text class="txt1">数量：{{item.goods_num}}</text>
								<text class="txt2">{{item.goods_original_price}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="coreB3">
					<view class="itembt" style="margin-top: 20rpx;">
						<view class="tit">{{type==1?'联系卖家':'联系买家'}}</view>
						<view class="titc">{{type==1?seller.nickname:user.nickname}}</view>
					</view>
					<view class="itembt">
						<view class="tit">配送方式</view>
						<view class="titc">{{obj.dispatch}}</view>
					</view>
					<view class="itembt">
						<view class="tit">下单时间</view>
						<!-- <view class="titc">{{ $tools.dateFormat('YYYY-mm-dd HH:MM', new Date(1634193423656)) }}</view> -->
						<view class="titc">{{obj.createtime}}</view>
					</view>
					<view class="itembt">
						<view class="tit">支付方式</view>
						<view class="titc">{{payType[obj.pay_type]}}</view>
					</view>
					<view class="itembt">
						<view class="tit">支付时间</view>
						<view class="titc">{{obj.paytime == 0?'未支付':obj.paytime}}</view>
					</view>
					<view class="itembt">
						<view class="tit">订单编号</view>
						<view class="titc">{{obj.order_sn}}</view>
					</view>
					<view class="itembt1">
						<button class="cu-btn btnH" @click="onCopy(obj.order_sn)">复制</button>
					</view>
				</view>
				<view class="coreB4">
					<view class="itembt">
						<view class="tit">商品金额</view>
						<view class="titc">￥{{obj.goods_amount}}</view>
					</view>
					<view class="itembt itembto">
						<view class="tit">运费金额</view>
						<view class="titc">￥{{obj.dispatch_amount}}</view>
					</view>
					<view class="pagoReal">
						<text>实付款</text>
						<text class="r2">￥{{obj.total_fee}}</text>
					</view>
				</view>
			</view>
			<!--  -->
			<view style="padding: 0 17rpx;">
				<view class="coreBox1">
					<view class="itembt">
						<view class="tit">快递单号</view>
						<view class="titc">{{item.express_no?item.express_no:'暂无'}}</view>
					</view>
					<button class="cu-btn btnH" @click="onCopy(item.express_no?item.express_no:'暂无')">复制</button>
				</view>				
			</view>
			<!-- 举报 -->
			<view class="coreBoxC"  v-if="obj.aftersale_status != 0">
				<view class="coreBox2">
					<view class="itembt">
						<view class="tit">举报事由</view>
						<view class="titc">{{aftersale.reason}}</view>
					</view>
				</view>
				<view class="coreBox2">
					<view class="itembt">
						<view class="tit">举报描述</view>
						<view class="titc">{{aftersale.content}}</view>
					</view>
				</view>
				<view class="coreBox2">
					<view class="itembt">
						<view class="tit">举报图片</view>
						<view class="titc titcImg">
							<view class="imgBox" v-for="(item,index) in aftersale.images" :key="index">
								<image @tap="$tools.previewImage(aftersale.images, index)" :src="item" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="coreBox2">
					<view class="itembt">
						<view class="tit">审核结果</view>
						<view class="titc">{{aftersale.result == 0 ?'待审核': aftersale.result == 1 ?'同意':'拒绝'}}</view>
					</view>
				</view>
				<view class="coreBox2">
					<view class="itembt">
						<view class="tit">结果说明</view>
						<view class="titc">{{aftersale.remark || '暂无'}}</view>
					</view>
				</view>
				<view style="height: 30rpx;"></view>
			</view>
			<view style="height: 150rpx;"></view>
		</view>
		<view class="footer">
			<button class="cu-btn btnH"  @click="$tools.callPhone(type==1?seller.mobile:user.mobile)">
				<image :src="$IMG_URL + '/imgs/trueque/fill.png'" mode=""></image>
				{{type==1?'联系卖家':'联系买家'}}</button>
			<view class="jbBox" @tap.stop="jump('/pages/trueque/denunciar', { id: obj.id })">
				<image :src="$IMG_URL + '/imgs/trueque/jubao.png'" mode=""></image>
				举报卖家
			</view>
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
				goodsId:'',
				type:'',
				payType:{
					'wechat':'微信支付',
					'alipay':'支付宝支付',
					'wallet':'余额支付'
				},
				obj:{},
				item:{},
				seller:{},
				user:{},
				aftersale:{}
			};
		},
		onShow() {
			this.getOrderDatil()
		},
		onLoad(option) {
			this.goodsId = option.id
			this.type = option.type
			console.log(option);
			// this.getOrderDatil()
		},
		methods: {
			getOrderDatil(){
				let that = this;
				that.$api('api.sCyOrderDetail', {
					id: that.goodsId
				}).then(res => {
					if (res.code === 1) {
						this.obj = res.data,
						this.item = res.data?.item
						this.seller = res.data?.seller
						this.user = res.data?.user
						this.aftersale = res.data?.aftersale
					}
				});
			},
			// 路由跳转
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			// 复制
			onCopy(code) {
				let that = this;
				uni.setClipboardData({
					data: code,
					success: function(data) {
						//#ifdef H5
						that.$tools.toast('已复制到剪切板');
						//#endif
					},
					fail: function(err) {},
					complete: function(res) {}
				});
			},
		}
	};
</script>
<style lang="scss">
page{
	width: 100%;
	background: url($IMG_URL+'/imgs/trueque/topbg2.png') no-repeat;
	background-size: 100% 340rpx;
	background-color: #F5F6F7;
}
.bodyBox{
	padding: 0 30rpx;
	.coreBox{
		width: 690rpx;
		height: 1500rpx;
		background: url($IMG_URL+'/imgs/trueque/odbg.png') no-repeat;
		background-size: 100% 1500rpx;
		margin-top: 70rpx;
		padding: 0 46rpx;
		.coreB1{
			height: 245rpx;
			overflow: hidden;
			.b1Name{
				display: flex;
				align-items: center;
				margin-top: 60rpx;
				.name{
					max-width: 150rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
					margin-right: 30rpx;
				}
				.phone{
					font-size: 30rpx;
					color: #333333;
				}
			}
			.address{
				font-size: 30rpx;
				font-weight: 400;
				color: #636465;
				margin-top: 10rpx;
			}
		}
		.core1selfetch{
			padding: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.sel1{
				font-size: 40rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
			.sel2{
				color: #C1C1C1;
				font-size: 32rpx;
			}
		}
		.coreB2{
			height: 290rpx;
			overflow: hidden;
			.itemTcore{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 40rpx;
				.itemImg{
					width: 190rpx;
					height: 190rpx;
					border-radius: 15rpx;
				}
				.itemRig{
					width: 385rpx;
					.itemTit{
						font-size: 32rpx;
						font-weight: bold;
					}
					.estaC{
						color: #303133;
					}
					.itemPic{
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 50rpx;
						.txt1{
							font-size: 28rpx;
							font-weight: 400;
							color: #909399;
						}
						.txt2{
							font-size: 32rpx;
							font-weight: bold;
							color: #FF3C17;	
							&::before{
								content: '￥';
								font-size: 22rpx;
							}
						}
					}
					
				}
			}
		}
		.coreB3{
			height: 625rpx;
			overflow: hidden;
			.itembt{
				height: 88rpx;
				display: flex;
				align-items: center;
				.tit{
					font-size: 28rpx;
					color: #656667;
					margin-right: 24rpx;
				}
				.titc{
					font-size: 28rpx;
					color: #333333;
				}
			}
			.itembt1{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.btnH{
					width: 120rpx;
					height: 48rpx;
					border-radius: 24rpx;
					font-size: bold;
					background: #F0F0F0;
					padding: 0;
					color: #656565;
				}
			}
		}
		.coreB4{
			overflow: hidden;
			.itembt{
				margin-top: 46rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.tit{
					font-size: 28rpx;
					color: #656667;
					margin-right: 24rpx;
				}
				.titc{
					font-size: 28rpx;
					color: #333333;
				}
			}
			.itembto{
				padding-bottom: 50rpx;
				border-bottom: 1px #EEEEEE solid;
			}
			.pagoReal{
				text-align: right;
				margin-top: 25rpx;
				font-size: 28rpx;
				color: #333435;
				.r2{
					font-size: 28rpx;
					font-weight: bold;
					color: #FF3C17;
					margin-left: 10rpx;
				}
			}
		}
	}
	.coreBox1{
		background: #FFFFFF;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		margin-top: 20rpx;
		border-radius: 18rpx;
		.itembt{
			display: flex;
			align-items: center;
			.tit{
				font-size: 28rpx;
				color: #656667;
				margin-right: 24rpx;
			}
			.titc{
				font-size: 28rpx;
				color: #333333;
			}
		}
		.itembt1{
			display: flex;
			align-items: center;
			.tit1{
				font-size: 28rpx;
				color: #656667;
				margin-right: 24rpx;
			}
			.titc1{
				font-size: 28rpx;
				color: #333333;
			}
		}
		.btnH{
			width: 120rpx;
			height: 48rpx;
			border-radius: 24rpx;
			font-size: bold;
			background: #F0F0F0;
			padding: 0;
			color: #656565;
		}
	}
	
	.coreBoxC{
		margin: 0 17rpx;
		background: #FFFFFF;
		margin-top: 20rpx;
		border-radius: 18rpx;
		.coreBox2{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 30rpx 0 30rpx;
			.itembt{
				display: flex;
				align-items: center;
				.tit{
					font-size: 28rpx;
					color: #656667;
					margin-right: 24rpx;
				}
				.titc{
					width: 450rpx;
					font-size: 28rpx;
					color: #333333;
				}
				.titcImg{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					.imgBox{
						width: 145rpx;
						height: 145rpx;
						border-radius: 10rpx;
						margin-bottom: 10rpx;
						overflow: hidden;
					}
				}
			}
		}
	}
}
.footer{
	width: 100%;
	height: 100rpx;
	border-top: 1px #EEEEEE solid;
	background: #FFFFFF;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	bottom: 0;
	.btnH{
		height: 66rpx;
		width: 250rpx;
		border-radius: 33rpx;
		font-size: bold;
		border: 1px solid #CACBCC;
		color: #333333;
		margin-left: 47rpx;
		background: #FFFFFF;
		image{
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}
	}
	.jbBox{
		margin-right: 47rpx;
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: bold;
		color: #FF4E2C;
		image{
			width: 23rpx;
			height: 31rpx;
			margin-right: 10rpx;
		}
	}
}
</style>
