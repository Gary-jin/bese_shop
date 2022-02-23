<template>
	<view class="bodyBox">
		<view class="goodes_detail_swiper-box">
			<!-- 详情轮播 -->
			<swiper class="carousel" circular @change="swiperChange" :autoplay="true">
				<swiper-item @tap="$tools.previewImage(goodsDetail.images, swiperCurrent)"
					v-for="(img, index) in goodsDetail.images" :key="index" class="carousel-item">
					<image class="swiper-image shopro-selector-rect" :src="img" mode="aspectFill" lazy-load>
					</image>
				</swiper-item>
			</swiper>
			<view v-if="goodsDetail.images" class="swiper-dots">{{ swiperCurrent + 1 }} /
				{{ goodsDetail.images.length }}</view>
		</view>
		<!-- core -->
		<view class="cBox">
			<view class="coreBox">
				<view class="precio">{{goodsDetail.price}}</view>
				<view class="titleBox more-t">
					<image class="tImg" v-if="goodsDetail.is_new == 1" :src="$IMG_URL + '/imgs/trueque/new.png'"  mode="widthFix"></image>
					<text class="titlee">{{goodsDetail.title}}</text>
				</view>
				<view class="titCore">
					{{goodsDetail.description}}
				</view>
			</view>
			<!--  -->
			<view class="listBox">
				<view class="itemBox itemBB">
					<view class="itemT">所属分类</view>
					<view class="itemC">{{goodsDetail.categorys_name}}</view>
				</view>
				<view class="itemBox ">
					<view class="itemT">商品地址</view>
					<view class="itemC">{{goodsDetail.province_name}}-{{goodsDetail.city_name}}-{{goodsDetail.district_name}}</view>
				</view>
			</view>
			<view class="listBox">
				<view class="itemBox itemBB">
					<view class="itemT">运费价格</view>
					<view class="itemC">{{goodsDetail.express_fee}}元</view>
				</view>
				<view class="itemBox ">
					<view class="itemT">配送方式</view>
					<view class="itemC">{{goodsDetail.dispatch}}</view>
				</view>
			</view>
			<view class="listBox listBox1">
				<view class="itemBox itemBB">
					<view class="itemT">限购数量</view>
					<view class="itemC">{{goodsDetail.limit_buy}}</view>
				</view>
				<view class="itemBox ">
					<view class="itemT">库存数量</view>
					<view class="itemC">{{goodsDetail.stock}}</view>
				</view>
			</view>
		</view>
		<!-- footer -->
		<view class="footer">
			<view class="ffl">
				<view class="ffl1" @click="$tools.callPhone(goodsDetail.seller_mobile)">
					<image :src="$IMG_URL + '/imgs/trueque/fill.png'" mode=""></image>
					<text>联系卖家</text>
				</view>
				<view class="ffl1" @click="colismo(goodsDetail.id)">
					<image :src="goodsDetail.favorite?$IMG_URL + '/imgs/trueque/x.png':$IMG_URL + '/imgs/trueque/xx.png'" mode=""></image>
					<text>我要收藏</text>
				</view>
			</view>
			<view class="ffr" v-if="goodsDetail.my_goods !=1">
				<button class="cu-btn btnH" @click="buy()">立即购买</button>
			</view>
			<!-- 我的商品 -->
			<view class="ffr" v-else>
				<button @click="chStatus(goodsDetail.id ,'down')" v-if="goodsDetail.status == 'up'" class="cu-btn btnH1" >下架</button>
				<button @click="chStatus(goodsDetail.id ,'up')" v-if="goodsDetail.status == 'down'" class="cu-btn btnH1" >上架</button>
				<button class="cu-btn btnH2" @click="jump('/pages/trueque/index', { id: goodsDetail.id,path:path })">编辑</button>
			</view>
		</view>
		
		<shopro-skutrueque 
			:showModal="showSku" :goodsInfo="goodsInfo"
			@setShowModal="setShowModal" @gobuy="gobuy"
			></shopro-skutrueque>
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
				goodsDetail:[],
				swiperCurrent: 0, //轮播下标
				path:'', //页面来源  mydictarLis 我的发布  list 易货列表
				id:'',
				showSku: false,
				goodsInfo:{
					stock:'',//库存
					carge: '', //限购
					price:'',
					title:'',
					image:''
				}
			};
		},
		onLoad(option) {
			console.log(option);
			let that = this ;
			that.path = option.path
			that.id = option.id
			that.getDetail(option.id)
			
			uni.$on('myOrderTrueque',function(data){
				that.getDetail(option.id)
			})
		},
		methods: {
			// 列表
			getDetail(id) {
				let that = this;
				that.$api('api.sCyDetail', {id}).then(res => {
					if (res.code === 1) {
						that.goodsDetail = res.data 
						
						that.goodsInfo.stock = res.data.stock
						that.goodsInfo.carge = res.data.limit_buy
						that.goodsInfo.price = res.data.price
						that.goodsInfo.title = res.data.title
						that.goodsInfo.image = res.data.image
					}
				});
			},
			// 轮播图切换
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			// 收藏
			colismo(goods_id){
				this.$api('api.sCyFavorite', {goods_id}).then(res => {
					if (res.code === 1) {
						this.$tools.toast(res.msg)
						this.getDetail(this.id)
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
						if(this.path=='mydictarLis'){
							uni.$emit('myOrderTrueque')
						}
						if(this.path=='list'){
							uni.$emit('myOrderTruequeList')
						}
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							});
						},600)
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
			buy(){
				this.showSku = true
			},
			gobuy(e){
				console.log('购买数量',e);
				this.showSku = false
				this.jump('/pages/trueque/confirm', { id: this.goodsDetail.id,goods_num:e })
				
				
			},
			setShowModal(e){
				this.showSku = e
			}
		}
	};
</script>
<style lang="scss">
	page{
		background: #F5F6F7;
	}
	// 商品图片轮播
	.goodes_detail_swiper-box {
		width: 750rpx;
		height: 750rpx;
		position: relative;

		.carousel {
			width: 750rpx;
			height: 100%;
		}

		.carousel-item {
			width: 750rpx;
			height: 100%;
		}

		.swiper-image {
			width: 750rpx;
			height: 100%;
			background: #ccc;
		}

		.swiper-dots {
			display: flex;
			position: absolute;
			right: 20rpx;
			bottom: 55rpx;
			line-height: 44rpx;
			border-radius: 22rpx;
			padding: 0 15rpx;
			background: rgba(#333, 0.3);
			font-size: 28rpx;
			color: rgba(#fff, 0.9);
		}
	}
	.cBox{
		position: relative;
		top: -30rpx;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		overflow: hidden;
	}
	.coreBox{
		background-color: #FFFFFF;
		padding: 0 30rpx;
		.precio{
			height: 115rpx;
			font-size: 46rpx;
			font-weight: bold;
			color: #FE411C;
			display: flex;
			align-items: center;
			&::before{
				content: '￥';
				font-size: 36rpx;
			}
		}
		.titleBox{
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
			.tImg{
				width:80rpx;
				height:34rpx;
				margin-right: 10rpx;
				position: relative;
				top: 6rpx;
			}
		}
		.titCore{
			padding: 25rpx 0 30rpx 0;
			font-size: 32rpx;
			color: #656667;
		}
	}
	.listBox{
		padding: 0 30rpx;
		background: #FFFFFF;
		margin-top: 20rpx;
		.itemBox{
			height: 105rpx;
			display: flex;
			align-items: center;
			font-size: 32rpx;
			.itemT{
				color: #656667;
				margin-right: 37rpx;
			}
			.itemC{
				color: #333333;
			}
		}
		.itemBB{
			border-bottom: 1px #EEEEEE solid;
		}
	}
	.listBox1{
		margin-bottom: 80rpx;
	}
	.footer{
		padding: 0 30rpx;
		height: 100rpx;
		width: 100%;
		border-bottom: 1px #EEEEEE solid;
		position: fixed;
		bottom: 0;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		.ffl{
			width: 50%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.ffl1{
				display: flex;
				flex-direction: column;
				align-items: center;
				image{
					width: 40rpx;
					height: 40rpx;
				}
				text{
					font-size: 24rpx;
					color: #656667;
					margin-top: 5rpx;
				}
			}
		}
		.ffr{
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.btnH{
				width: 100%;
				height: 76rpx;
				border-radius: 38rpx;
				padding: 0 110rpx;
				font-size: bold;
				background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
				color: #FFFFFF;
			}
			.btnH1{
				width: 48%;
				height: 76rpx;
				border-radius: 38rpx;
				// padding: 0 110rpx;
				font-size: bold;
				background: #FFFFFF;
				color: #333333;
				border: 1rpx solid #CACBCC;
				box-sizing: border-box;
			}
			.btnH2{
				width: 48%;
				height: 76rpx;
				border-radius: 38rpx;
				// padding: 0 110rpx;
				font-size: bold;
				background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
				color: #FFFFFF;
			}
		}
	}
</style>
