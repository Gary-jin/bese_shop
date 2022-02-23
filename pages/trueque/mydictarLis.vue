<template>
	<view class="bodyBox">
		<scroll-view class="scroll-box" scroll-y enable-back-to-top scroll-with-animation @scrolltolower="loadMore">
			<view class="listCore" v-for="(item,index) in gList" :key="index">
				<view class="listCore1" @click="jump('/pages/trueque/listDetail', {id:item.id,path:'mydictarLis'})">
					<image class="ymq" v-if="item.status == 'selled'" :src="$IMG_URL + '/imgs/trueque/ymc.png' " mode="aspectFill"></image>
					<view class="itemBT">
						<view class="itemTcore">
							<view class="itemImgBox">
								<!-- <image class="itemImg" :src="item.image" mode=""></image> -->
								<u-lazy-load class="itemImg" :image="item.image" :loading-img="loadingTmg" :error-img="errorImg" img-mode="aspectFill"></u-lazy-load>								
							</view>
							<view class="itemRig">
								<view class="itemTit" :class="item.status == 'selled'?'estaZ':'estaC'">{{item.title}}</view>
								<view class="itemPic" :class="item.status == 'selled'?'estaZ1':'estaC1'">{{item.price}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="btnBox" v-if="item.status != 'selled'">
					<view class="bbt">
						<button @click="chStatus(item.id ,'down')" v-if="item.status == 'up'" class="cu-btn btnH" >下架</button>
						<button @click="chStatus(item.id ,'up')" v-if="item.status == 'down'" class="cu-btn btnH" >重新上架</button>						
						<button class="cu-btn btnH1" @click="jump('/pages/trueque/index', { id: item.id,path:'mydictarLis' })">编辑</button>
					</view>
				</view>
			</view>
			<!-- 空白 -->
			<shopro-empty  v-if="!gList.length && !isLoading" :emptyData="emptyData"></shopro-empty>
			<!-- 加载更多 -->
			<u-loadmore v-if="gList.length" height="80rpx" :status="loadStatus" icon-type="flower"
				color="#ccc" />
			<!-- loading -->
			<shopro-load v-model="isLoading"></shopro-load>
		</scroll-view>
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
		computed: {

		},
		components:{
		},
		data() {
			return {
				emptyData: {
					img: this.$IMG_URL + '/imgs/empty/empty_groupon.png',
					tip: '暂无相关数据~',
				},
				errorImg: this.$ERROR_IMG,
				loadingTmg: this.$LOAD_IMG,
				isLoading: true,
				loadStatus: 'loadmore', //loadmore:加载前的状态，loading:加载中的状态，nomore:没有更多的状态
				lastPage: 1,
				currentPage: 1,
				gList: []
			};
		},
		onLoad(option) {
			let that = this;
			that.getList()
			uni.$on('myOrderTrueque',function(data){
				that.gList = []
				that.currentPage = 1
				that.getList()
			})
		},
		methods: {
			// 加载更多
			loadMore() {
				if (this.currentPage < this.lastPage) {
					this.currentPage += 1;
					this.getList();
				}
			},
			getList() {
				let that = this;
				that.isLoading = true;
				that.loadStatus = 'loading';
				that.$api('api.secondhandGoodsList', {
					page: that.currentPage,
					my_goods:1
				}).then(res => {
					if (res.code === 1) {
						that.isLoading = false;
						that.gList = that.gList.concat(res.data.data);
						that.lastPage = res.data.last_page;
						if (that.currentPage < res.data.last_page) {
							that.loadStatus = 'loadmore';
						} else {
							that.loadStatus = 'nomore';
						}
					}
				});
			},
			// 更新商品状态
			chStatus(id,status){
				this.$api('api.sCyChangeStatus', {
					id,status
				}).then(res => {
					if (res.code === 1) {
						this.$tools.toast(res.msg)
						this.currentPage = 1
						this.gList = []
						this.getList()
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
		}
	};
</script>
<style lang="scss">
.bodyBox{
	.scroll-box{
		height: 100vh;
	}
	padding: 0 30rpx;
	.listCore{
		margin-top: 20rpx;
		background: #FFFFFF;
		border-radius: 18rpx;
	}
	.listCore1{
		height: 253rpx;
		position: relative;
		.ymq{
			position: absolute;
			bottom: 0;
			right: 0;
			width: 210rpx;
			height: 170rpx;
		}
		.itemBT{
			width: 100%;
			height: 253rpx;
			position: absolute;
			top: 0;
			.itemTcore{
				height: 100%;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.itemImgBox{
					width: 190rpx;
					height: 190rpx;
					border-radius: 15rpx;
					overflow: hidden;
					.itemImg{
						width: 190rpx;
						height: 190rpx;
					}
				}
				.itemRig{
					width: 420rpx;
					.itemTit{
						font-size: 32rpx;
						font-weight: bold;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.estaC{
						color: #303133;
					}
					.estaZ{
						color: #C7CACD;
					}
					.itemPic{
						font-size: 32rpx;
						font-weight: bold;
						margin-top: 50rpx;
					}
					.itemPic::before{
						content: '￥';
						font-size: 22rpx;
					}
					.estaC1{
						color: #FF2900;
					}
					.estaZ1{
						color: #898D91;
					}
				}
			}
		}
	}
	.btnBox{
		padding: 0 30rpx;
		.bbt{
			height: 110rpx;
			border-top: 1px solid #EEEEEE;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
		.btnH{
			height: 66rpx;
			border-radius: 33rpx;
			padding: 0 44rpx;
			font-size: bold;
			border: 1px solid #CACBCC;
			color: #333333;
			margin-left: 25rpx;
			background: #FFFFFF;
		}
		.btnH1{
			height: 66rpx;
			border-radius: 33rpx;
			padding: 0 44rpx;
			font-size: bold;
			border: 1px solid #FF2900;
			color: #FF2900;
			margin-left: 25rpx;
			background: #FFFFFF;
		}
	}
}
</style>
