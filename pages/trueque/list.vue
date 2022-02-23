<template>
<view style="height: 100vh;">	
	<view class="head_box" >
		<u-tabs :list="orderState" active-color="#FF2900" 
		inactive-color="#9DA0A5" name="name"
		:current="orderType" @change="onNav()"></u-tabs>
	</view>
	<view style="padding: 100rpx 20rpx 0 20rpx;height: 100%;">
		<view >
			<view class="coreBox">
				<view class="coreBox1" v-for="leftGoods in list" :key="leftGoods.id" @click="goGoodDetail(leftGoods.id)">
					<view class="img-box">
						<u-lazy-load  :image="leftGoods.image" :loading-img="loadingTmg" :error-img="errorImg"></u-lazy-load>	
					</view>
					<view class="cnt">
						<text class="titlee">
							<text class="tc" v-if="leftGoods.is_new==1">全新</text> {{leftGoods.title}}
						</text>
						<view class="price-box">
							<view class="flex x-bc align-end">
								<view class="current">{{leftGoods.price}}</view>
								<view class="sales">已有{{leftGoods.likes}}人收藏</view>
							</view>
						</view>
					</view>	
				</view>
			</view>
			<!-- 空白页 -->
			<shopro-empty v-if="!list.length && !isLoading" :emptyData="emptyData"></shopro-empty>
			<!-- load -->
			<shopro-load v-model="isLoading"></shopro-load>
			<!-- 更多 -->
			<u-loadmore v-if="list.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</view>
</template>

<script>
import {mapState} from 'vuex';
export default {
	components: {},
	data() {
		return {
			isLoading: true,
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			orderType: 'all',
			emptyData: {
				img: this.$IMG_URL + '/imgs/empty/empty_groupon.png',
				tip: '暂无商品，还有更多好货等着你噢~'
			},
			errorImg: this.$ERROR_IMG,
			loadingTmg: this.$LOAD_IMG,
			list:[],
			orderType: 0,
			orderState: [],
			typeID:''
		};
	},
	computed: {
		...mapState({
				initData: state => state.init.initData
		})
	},
	onLoad() {
		// this.$refs.uWaterfall.clear();
		this.init();
		
		let that = this;
		uni.$on('myOrderTruequeList',function(data){
			// that.$refs.uWaterfall.clear();
			that.list = [];
			that.currentPage = 1;
			that.getOrderList()
		})
	},
	// 加载更多
	onReachBottom() {
		console.log(this.currentPage , this.lastPage);
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getOrderList();
		}
	},
	methods: {
		async init(){
			let result = await this.getTab();
			if(result.code == 1){
				if(result.data.categories[0]){
					this.typeID = result.data.categories[0]?.id
					this.getOrderList()
				}
			}
		},
		getTab(){
			let that = this;
			return new Promise((resolve, reject) => {
				that.$api('api.sCyGoodsList', {category_id: that.initData.secondhand_category_id}).then(res => {
					if (res.code === 1) {
						that.orderState = res.data.categories
					}
						resolve(res);
				});
			});
			
		},
		onNav(index) {
			this.typeID = this.orderState[index].id
			this.orderType = index;
			this.list = [];
			// this.$refs.uWaterfall.clear();
			this.currentPage = 1;
			// this.$u.debounce();
			this.getOrderList()
		},
		// 列表
		getOrderList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('api.secondhandGoodsList', {
				page: that.currentPage,
				category_id: that.typeID 
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.list = that.list.concat(res.data.data);
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
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		goGoodDetail(val){
			this.jump('/pages/trueque/listDetail', { id: val,path:'list' })
		}
	}
};
</script>

<style lang="scss">
	.head_box{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 9999;
	}
	.coreBox{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.coreBox1{
			width: 345rpx;
			background: #FFFFFF;
			margin-bottom: 25rpx;
			border-radius: 14rpx;
			overflow: hidden;
			.cnt{
				padding: 15rpx;
			}
		}
	}
	.img-box {
		width: 100%;
		height: 345rpx;
		border-radius: 14rpx;
		overflow: hidden;
		
	}
	
	.titlee {
		width: 100%;
		max-height: 40px;
		color: #333;
		font-size: 30rpx;
		font-weight: bold;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		.tc{
			color: #ff0000;
			padding: 0 8rpx;
			border: 1rpx #ff0000 solid;
			border-radius: 10rpx;
			font-size: 22rpx;
			margin-right: 8rpx;
			position: relative;
			top: -2rpx;
		}
	}
	.tImg{
		width:80rpx !important;
		height:34rpx ;
		margin-top: 10px;
	}

	.price-box {
		width: 100%;
		.sales {
			font-size: 24rpx;
			font-weight: 400;
			color: #BBB2B2;
			margin-top: 10rpx;
		}
		.current {
			font-size: 40rpx;
			font-weight: bold;
			color: #FF2900 ;
			margin-top: 10rpx;
			&:before {
				content: '￥';
				font-size: 22rpx;
			}
		}	
	}

</style>
