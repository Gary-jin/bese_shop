<template>
	<view class="page_box">
		 <cu-custom-new
        :isBack="true"
      >
        <block slot="backText">{{title}}</block>
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
				<view class="order-list" v-for="(order, orderIndex) in orderList" :key="orderIndex" >
					<view class="orderTop">
						<view class="topL">
							<image :src="type==1?order.seller.avatar:order.user.avatar" mode="scaleToFill"></image>
							<text>{{type==1?order.seller.nickname:order.user.nickname}}</text>
						</view>
						<text class="esta">{{order.aftersale_status != 0 ? order.aftersale_status == 1 ?'举报中':'已处理': order.status_name}}</text>
					</view>
					<view class="itemTcore" @tap.stop="godata(order)">
						<image class="itemImg" :src="order.item.goods_image" mode=""></image>
						<view class="itemRig">
							<view class="itemTit estaC more-t">{{order.item.goods_title}}</view>
							<view class="itemPic">
								<text class="txt1">数量：{{order.item.goods_num}}</text>
								<text class="txt2">{{order.item.goods_original_price}}</text>
							</view>
						</view>
					</view>
					<view class="btnBox" >
						<view class="bbt">
							<button class="cu-btn btnH" @click="$tools.callPhone(type==1?order.seller.mobile:order.user.mobile)">
								<image :src="$IMG_URL + '/imgs/trueque/fill.png' " mode="widthFix"></image>
								{{type==1?'联系卖家':'联系买家'}}
							</button>
							<view class="bbtr" v-if="order.btns.length">	
								<block v-for="orderBtn in order.btns" :key="orderBtn">
									<button class="cu-btn btnH1" v-if="type==1 && orderBtn === 'cancel'" @click="onCancel(order.id, orderIndex)">取消订单</button>
									<button class="cu-btn btnH1" v-if="type==1 && orderBtn === 'pay'" @click="onPay(order.id)">立即支付</button>	
									<button class="cu-btn btnH1" v-if="type==1 && orderBtn === 'delete'" @click="onDelete(order.id, orderIndex)">删除</button>
									<button class="cu-btn btnH1" v-if="type==2 && orderBtn === 'send'"  @click="fabu(order.id)">去发货</button>
									<button class="cu-btn btnH1" v-if="type==2 && orderBtn === 'stock_up'"  @click="beiH(order.id)">去备货</button>
								</block>
									<button class="cu-btn btnH1" v-if="type==1 && order.status_code=='noget'" @click="confirm(order)">确认收货</button>
							</view>
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
		<u-popup v-model="popShow" mode="center" border-radius="14" :closeable="true">
			<view class="popCore">
				<image :src="$IMG_URL + '/imgs/trueque/xl.png' " mode="widthFix"></image>
				<view class="poptit1">请确定您已收到货并验收无误</view>
				<view class="poptit2">
					确认收货后钱款将打入卖家账户，<text>您无法再发起退款等收货申请</text>，请谨慎操作
				</view>
				<button class="cu-btn btnH2" @click="popCon()">
					我已收到货，确认收货
				</button>
				<view class="poptit3" @click="popCle()">
					未收到货
				</view>				
			</view>
		</u-popup>
		<shopro-pay 
		ref="jpPwds" @completed="completed" @inputPwd="inputPwd" @forget="forget" :money="pwd.money"
					payType='two' keyType='one' pawType='one' 
					:cancelType="pwd.cancelType" :keep="pwd.keep" :msg="pwd.msg" :places="pwd.places"
					contentsColor="#555"  :isPwy="pwd.isPwy" titeColor="#333"></shopro-pay>
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
				{id: 0,title: '全部',  type: 'all'},
				{id: 1,title: '易货中',type: 'nosend'},
				{id: 2,title: '待确认',type: 'noget'},
				{id: 3,title: '待结算',type: 'nosettle'},
				{id: 4,title: '已完成',type: 'finish'}
			],
			pwd: {
				id:'',
				money: 100, //支付金额
				cancelType: false, //是否输入完密码后消失
				keep: false, //点击遮挡是否关闭
				msg: '', // 密码错误提示语
				places: 6,
				isPwy: true,
				passer:"",//支付密码
			},
			popShow :false,
			thresh:'',
			title:'',
			type:'',//1我换到的，我是买家，2我换出的，我是卖家
		};
	},
	computed: {},
	onLoad(options) {
		console.log(options);
		this.type = options.type
		if (options.type ==1) {
			this.title = '换到宝贝';
		} else {
			this.title = '换出宝贝';
		}
	},
	onShow() {
		this.orderList = [];
		this.currentPage = 1;
		this.getOrderList();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		fabu(id){
			this.jump('/pages/trueque/la_entrega', { id: id })
		},
		beiH(id){
			let that = this;
			uni.showModal({
				title: '备货',
				content: '确定要备货么？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						that.$api('api.sCyStockUp', {
							id: id
						}).then(res => {
							if (res.code === 1) {
								this.currentPage = 1;
								this.orderList = [];
								this.getOrderList();
							}
						});
					}
				}
			});
		},
		godata(order){
				this.jump('/pages/trueque/orderDetail', { id: order.id,type:this.type})
			// if(this.type == 1){ //换到宝贝
			// }else{
			// 	this.jump('/pages/trueque/listDetail', { id: order.item.goods_id })
			// }
		},
		onNav(type) {
			this.orderType = type;
			this.orderList = [];
			this.currentPage = 1;
			this.$u.debounce(this.getOrderList);
		},
		// 订单列表
		getOrderList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('api.sCyOrderList', {
				type: that.type,
				status: that.orderType,
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
						that.$api('api.sCyOrderDel', {
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
			that.$api('api.sCyOrderCancel', {
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
				url: `/pages/order/payment/method?orderId=${id}&type=trueque`
			});
		},
		// // 查看物流
		// onExpress(orderId) {
		// 	let that = this;
		// 	that.$api('order.expressList', {
		// 		order_id: orderId
		// 	}).then(res => {
		// 		if (res.code === 1) {
		// 			if (res.data.length == 1) {
		// 				this.jump('/pages/order/express', { orderId: orderId, expressId: res.data[0].id });
		// 			} else if (res.data.length > 1) {
		// 				this.jump('/pages/order/express-list', { orderId: orderId });
		// 			} else {
		// 				this.$tools.toast('暂无包裹~');
		// 			}
		// 		}
		// 	});
		// },
		confirm(item){
			this.pwd.id= item.id
			this.pwd.money= item.pay_fee
			
			this.popShow = true
			
		},
		popCon(){
			this.popShow = false
			this.$refs.jpPwds.toOpen()
		},
		inputPwd(e) {
			this.pwd.msg = ''
		},
		popCle(){
			this.popShow = false
		},
		forget() {
			uni.navigateTo({
				url:'/pages/user/set'
			})
		},
		completed(e) {
			this.$refs.jpPwds.backs()
			this.$api('api.sCyConfirm', {
				id: this.pwd.id,
				pay_password:e
			}).then(res => {
				console.log(JSON.stringify(res));
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration:1500
				})
				this.$refs.jpPwds.toCancel()
				if (res.code === 1) {
					this.currentPage = 1;
					this.orderList = [];
					this.getOrderList();
				}else{
					if(res.msg == "请先设置支付密码"){
						setTimeout(()=>{
							uni.navigateTo({
								url:'/pages/user/set'
							})
						},1500)
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
	padding: 0 30rpx;
	.orderTop{
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.topL{
			display: flex;
			image{
				width: 40rpx;
				height: 40rpx;
				border-radius: 20rpx;
			}
			text{
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
				margin-left: 10rpx;
			}
		}
		.esta{
			font-size: 28rpx;
			color: #FF2900;
		}
	}
	.itemTcore{
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30rpx;
		.itemImg{
			width: 190rpx;
			height: 190rpx;
			border-radius: 15rpx;
		}
		.itemRig{
			width: 420rpx;
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
					color: #333333;	
					&::before{
						content: '￥';
						font-size: 22rpx;
					}
				}
			}
		}
	}
	.btnBox{
		.bbt{
			height: 110rpx;
			border-top: 1px solid #EEEEEE;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.bbtr{
				height: 110rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
		.btnH{
			height: 66rpx;
			border-radius: 33rpx;
			padding: 0 20rpx;
			font-size: bold;
			border: 1px solid #CACBCC;
			color: #333333;
			background: #FFFFFF;
			display: flex;
			image{
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
		.btnH1{
			height: 66rpx;
			border-radius: 33rpx;
			padding: 0 20rpx;
			font-size: bold;
			border: 1px solid #FF2900;
			color: #FF2900;
			margin-left: 25rpx;
			background: #FFFFFF;
		}
	}
	
}

.popCore{
	text-align: center;
	width: 600rpx;
	padding: 0 60rpx;
	image{
		margin-top: 60rpx;
		width: 80rpx;
		height: 80rpx;
	}
	.poptit1{
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 30rpx;
	}
	.poptit2{
		font-size: 28rpx;
		color: #c1c1c1;
		margin-top: 30rpx;
		text{
			color: #ff0000;
		}
	}
	.btnH2{
		margin-top: 30rpx;
		width: 100%;
		height: 66rpx;
		background: linear-gradient(90deg, #ED8137 0%, #D83267 100%);
		border-radius: 33rpx;
		font-size: bold;
		color: #FFFFFF;
	}
	.poptit3{
		padding: 30rpx 0;
		font-size: 32rpx;
		color: #7EBCF9;
	}
}
</style>
