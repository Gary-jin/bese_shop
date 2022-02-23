<template>
	<view class="catgory-wrap">
		<view class="x-f wrapper-box" :style="paddingBottom">
			<!-- 左侧分类列表 -->
			<view class="scroll-box" style="background-color: #F6F6F6; width: 200rpx;">
				<scroll-view class="left left-scroll-box flex-sub" :scroll-top="scrollLeftTop" enable-back-to-top scroll-y scroll-with-animation>
					<view
						class="type-list"
						:class="item.class"
						v-for="(item, index) in categoriesList"
						:key="index"
						@tap="onType(index,item.id)"
					>
						<image class="iconBox" :src="item.icon" mode="widthFix"></image>
						<view class="iconName one-t">{{ item.name }}</view>
					</view>
					<view style="height: 115rpx;"></view>
				</scroll-view>
			</view>
			<!-- 右侧商品列表 -->
			<view class="right-wrap scroll-box" style="min-width: 550rpx;">
				<scroll-view scroll-y class="scroll-box righ-scroll-box flex-sub" :scroll-top="scrollRightTop" @scrolltolower="lowerMore" scroll-with-animation @scroll="rightScroll">
					<view class="right" v-if="categoryData.length">
						<view class="item-list" >
							<view class="type-box y-c" v-if="showType == 8">
								<image class="type-img" v-if="catTopImg" :src="catTopImg" lazy-load></image>
								<text class="type-title">{{ catTopTit }}</text>
							</view>
							<view class="item-box" :class="showType == 7 ? 'mt30':'mt20'">
								<view class="goods-item x-bc"  v-for="(mlist, index2) in categoryData" :key="index2">
									<view @tap="jump('/pages/goods/detail/index', { id: mlist.id })" class="item-img" v-if="showType == 7">
										<u-lazy-load :image="mlist.image" :loading-img="loadingTmg" :error-img="errorImg" img-mode="aspectFill"></u-lazy-load>
										<image v-if="mlist.activity" class="tag-img" :src="tagPath[mlist.activity.type]" mode=""></image>
									</view>
									<view @tap="jump('/pages/goods/detail/index', { id: mlist.id })" class="item-img1" v-if="showType == 8">
										<u-lazy-load :image="mlist.image" :loading-img="loadingTmg" :error-img="errorImg" img-mode="aspectFill"></u-lazy-load>
										<image v-if="mlist.activity" class="tag-img" :src="tagPath[mlist.activity.type]" mode=""></image>
									</view>
									
									<view class="goods-item--right y-b" :class="showType == 7 ? 'HH7':'HH8'">
										<view>
											<view :class="showType == 7 ? 'more-t':'one-t'" class="item-right--title">{{ mlist.title }}</view>
											<view :class="showType == 7 ? 'more-t':'one-t'" class="subtitleBox more-t">{{mlist.subtitle}}</view>
										</view>
										<!-- <view class="item-right--sales">销量{{ mlist.sales }}份</view> -->
										<view class="x-bc item-right--bottom">
											<view class="price-box x-end">
												<view class="current-price">
													<text class="current-price--unit">￥</text>
													{{mlist.price}}
												</view>
												<!-- <view class="origin-price" v-if="!isCart(mlist.id)">
													<text class="origin-price--unit">￥</text>
													{{ mlist.original_price }}
												</view> -->
											</view>
											<button class="cu-btn item-btn add-cart" v-if="!mlist.is_sku">
												<view v-if="mlist.activity">
													<view v-if="mlist.activity.type == 'groupon'&&mlist.activity.rules.is_alone == 1">
														<text class="cuIcon-roundaddfill"
														v-if="!isCart(mlist.id)" @tap="addCart(mlist.sku_price[0])"></text>
														<view class="num-step" v-else>
															<uni-number-box
																@change="onChangeNum($event, mlist.sku_price[0], index1)"
																:value="checkCart[mlist.id].num"
																:step="1"
																:min="0"
																:disabled="numberDisabled"
															></uni-number-box>
														</view>
													</view>
													<view v-if="mlist.activity.type == 'seckill'">
														<text class="cuIcon-roundaddfill"
														v-if="!isCart(mlist.id)" @tap="addCart(mlist.sku_price[0])"></text>
														<view class="num-step" v-else>
															<uni-number-box
																@change="onChangeNum($event, mlist.sku_price[0], index1)"
																:value="checkCart[mlist.id].num"
																:step="1"
																:min="0"
																:disabled="numberDisabled"
															></uni-number-box>
														</view>
													</view>
													
												</view>
												<view v-else>
													<text class="cuIcon-roundaddfill" v-if="!isCart(mlist.id)" @tap="addCart(mlist.sku_price[0])"></text>
													<view class="num-step" v-else>
														<uni-number-box
															@change="onChangeNum($event, mlist.sku_price[0], index1)"
															:value="checkCart[mlist.id].num"
															:step="1"
															:min="0"
															:disabled="numberDisabled"
														></uni-number-box>
													</view>
												</view>
											</button>
											<button class="cu-btn item-btn sel-sku" @tap.stop="selSku(mlist)" v-else>选规格</button>
										</view>
									</view>
									
								</view>
							</view>
						</view>
						<view class="cu-load"  :class="isLoad?'loading':'over'"></view>
						<view style="height: 160rpx;;"></view>
					</view>
					
					<view class="noneData" v-if="noneShow">
					    <image :src="$IMG_URL+'/imgs/sudoku/noneData.png'" class="noneIMg" ></image>
						<text class="noneText">暂无相关记录~</text>
					</view>
					
				</scroll-view>
			</view>

			<!-- 购物车 -->
			<view class="cart-box x-f" v-show="takeoutTotalCount.totalNum" :style="isTabbar ? 'bottom:100rpx' : 'bottom:0'">
				<view class="cart-left flex-sub x-f">
					<view class="cart-img-box" @tap="onShowCartList">
						<image class="cart-img" :src="$IMG_URL + '/imgs/category/icon.png'" mode=""></image>
						<view class="cu-tag badge" v-if="totalCount.totalNum">{{ takeoutTotalCount.totalNum }}</view>
					</view>
					<view class="price-box x-f">
						<text class="price">{{ totalCount.totalPrice.toFixed(2) }}</text>
					</view>
				</view>
				<button class="cu-btn pay-btn" @tap="onPay" :disabled="!isSel">去结算</button>
				<!-- 购物车商品列表 -->

				<view class="cart-list-box page_box" :class="showCartList ? '' : 'hide-cart-list'">
					<view class="head_box x-bc cart-list__head px20">
						<label class="check-all x-f" @tap="onAllSel">
							<radio :checked="allSel" :class="{ checked: allSel }" class="check-all-radio color_ff2900"></radio>
							<text>全选</text>
						</label>
						<view class="delete-box" @tap="deleteAll">
							<text class="cuIcon-delete"></text>
							<text>删除商品</text>
						</view>
					</view>
					<view class="block cart-list">
						<checkbox-group class="block" v-if="cartList.length">
							<view class="collect-list x-start" v-for="(g, index) in cartList" :key="index">
								<view class="x-c" style="height: 200rpx;" @tap="onSel(index, g.checked)">
									<checkbox :checked="g.checked" :class="{ checked: g.checked }" class="goods-radio round color_ff2900"></checkbox>
								</view>
								<shopro-mini-card :detail="g.goods" :sku="g.sku_price" :type="'sku'">
									<block slot="goodsBottom">
										<view class="x-bc price-box">
											<view class="price">￥{{ g.sku_price.price }}</view>
											<view class="num-step">
												<uni-number-box
													@change="onChangeNum($event, g, index)"
													:disabled="numberDisabled"
													v-model="g.goods_num"
													:step="1"
													:min="0"
												></uni-number-box>
											</view>
										</view>
									</block>
								</shopro-mini-card>
							</view>
						</checkbox-group>
					</view>
				</view>
			</view>
		</view>
		<!-- 规格 -->
		<sh-takeout-sku v-if="goodsInfo.id && showSku" v-model="showSku" :goodsInfo="goodsInfo" :buyType="'cart'"></sh-takeout-sku>
		<!-- 遮罩 -->
		<view class="mask" @tap="hideCartList" v-if="takeoutTotalCount.totalNum && showCartList"></view>
	</view>
</template>

<script>
import shTakeoutSku from './sh-takeout-sku.vue';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
let timer = null; //节流定时器
export default {
	components: {
		shTakeoutSku
	},
	data() {
		return {
			currentTab: 0,
			scrollLeftTop: 0, //左边滚动距离
			oldScrollTop: 0,
			scrollRightTop: 0, //右边滚动距离
			leftHeight: 0, //左边高度
			leftItemHeight: 0, //左边边item高度
			rightHeight: 0, //右边高度
			rightArr: [], //右边item距离顶部数组。
			isTap: true,
			categoryData: [], //商品分类数据
			showSku: true, //是否显示规格弹窗
			goodsInfo: {}, //点击商品详情
			showCartList: false,
			numberDisabled: false ,//购物车计数器
			
			errorImg: this.$ERROR_IMG,
			loadingTmg: this.$LOAD_IMG,
			currentPage: 1,//初始分页
			lastPage:'', //总页数
			isLoad:false,
			categoriesList:[], // nav
			catTopImg:'',
			catTopTit:'',
			noneShow:false,
			tagPath: {
				groupon: this.$IMG_URL + '/imgs/groupon_tag.png',
				seckill: this.$IMG_URL + '/imgs/seckill_tag.png'
			},
			
		};
	},
	props: {
		categoryId: {
			type: Number,
			default: 0
		},
		showType:'',
	},
	computed: {
		...mapState({
			cartNum: state => state.cart.cartNum,
			cartList: state => state.cart.cartList,
			allSel: ({ cart }) => cart.allSelected,
			tabbarList: state => state.init.templateData.tabbar[0].content.list
		}),
		...mapGetters(['totalCount', 'takeoutTotalCount', 'isSel']),
		// 购物车检测
		checkCart() {
			let obj = {};
			this.cartList.forEach(item => {
				obj[item.goods_id] = {
					num: item.goods_num,
					cartOrderId: item.id
				};
			});
			return obj;
		},
		// 是否是底部导航页面
		isTabbar() {
			if (this.tabbarList.length) {
				let arr = [];
				let pages = getCurrentPages();
				// #ifdef H5
				let currentPath = pages[pages.length - 1].__page__.fullPath;
				// #endif
				// #ifdef MP-WEIXIN || APP-VUE
				// let currentPath = pages[pages.length - 1].$page.fullPath;
				let currentPath = this.$Route.path + '?id=' + this.categoryId
				// #endif
				for (let item of this.tabbarList) {
					arr.push(item.path);
				}
				return arr.includes(currentPath);
			}
		},
		paddingBottom() {
			if (this.takeoutTotalCount.totalNum && !this.isTabbar) {
				return 'padding-bottom:80rpx';
			}
			if (this.takeoutTotalCount.totalNum && this.isTabbar) {
				return 'padding-bottom:180rpx';
			}
			if (!this.takeoutTotalCount.totalNum && this.isTabbar) {
				return 'padding-bottom:100rpx';
			}
			if (!this.takeoutTotalCount.totalNum && !this.isTabbar) {
				return 'padding-bottom:20rpx';
			}
		}
	},
	mounted() {
		this.getCategory();
		this.getCartList();
		this.getRightItemTop();
	},
	methods: {
		...mapActions(['getCartList', 'changeCartList', 'addCartGoods', 'getAllSellectCartList']),
		...mapMutations(['changeAllSellect']),
		// 显示购物车列表
		onShowCartList() {
			if (!this.takeoutTotalCount.totalNum) return;
			this.showCartList = !this.showCartList;
		},
		hideCartList() {
			this.showCartList = false;
		},
		// 全选
		onAllSel() {
			let that = this;
			that.$store.commit('changeAllSellect'); //按钮切换全选。
			that.$store.commit('getAllSellectCartList', that.allSel); //列表全选
		},
		// 单选
		onSel(index, flag) {
			let that = this;
			that.$store.commit('selectItem', {
				index,
				flag
			});
		},
		// 清空购物车
		deleteAll() {
			let that = this;
			let { cartList } = this;
			let selectedIdsArray = [];
			cartList.map(item => {
				if (item.checked) {
					selectedIdsArray.push(item.id);
				}
			});
			if (selectedIdsArray.length == cartList.length) {
				this.showCartList = false;
			}
			this.changeCartList({
				ids: selectedIdsArray,
				art: 'delete'
			});
		},
		// 加入购物车
		addCart(goods) {
			let obj = {
				goods_id: goods.goods_id,
				goods_num: 1,
				sku_price_id: goods.id,
				goods_price: goods.price
			};
			let confirmGoodsList = {
				list: [obj],
				from: 'goods'
			};
			this.addCartGoods(confirmGoodsList).then(res => {
				if (res.code === 1) {
					this.$tools.toast(res.msg);
				}
			});
		},
		// 检测商品在购物车中的下标
		checkGoodsIndex(id) {
			let cIndex = 0;
			this.cartList.forEach((item, index) => {
				if (id == item.goods_id) {
					cIndex = index;
				}
			});
			return cIndex;
		},
		// 更改商品数
		async onChangeNum(e, goods, index) {
			let gIndex = this.checkGoodsIndex(goods.goods_id);
			if (e != this.checkCart[goods.goods_id].num) {
				this.numberDisabled = true;
				uni.showLoading({
					mask: true
				});
				this.$set(this.cartList[gIndex], 'goods_num', +e);
				await this.changeCartList({
					ids: [this.checkCart[goods.goods_id].cartOrderId],
					goodsNum: +e,
					art: 'change'
				}).then(() => {
					this.numberDisabled = false;
				});
				await uni.hideLoading();
			}
		},
		// 检测是否为购物车商品
		isCart(id) {
			let goodsId = id + '';
			return Object.keys(this.checkCart).includes(goodsId);
		},
		// 结算
		onPay() {
			let that = this;
			let { cartList } = this;
			let confirmcartList = [];
			if (this.isSel) {
				this.cartList.forEach(item => {
					if (item.checked) {
						confirmcartList.push({
							goods_id: item.goods_id,
							goods_num: item.goods_num,
							sku_price_id: item.sku_price_id,
							goods_price: item.sku_price.price
						});
					}
				});
				that.jump('/pages/order/confirm', {
					goodsList: JSON.stringify(confirmcartList),
					from: 'cart'
				});
			}
		},
		// 添加购物车
		async selSku(info) {
			this.goodsInfo = {};
			this.getGoodsDetail(info.id);
			this.showSku = true;
		},
		// 商品详情
		getGoodsDetail(id) {
			let that = this;
			that.$api('goods.detail', {
				id: id
			}).then(res => {
				if (res.code === 1) {
					that.goodsInfo = res.data;
				}
			});
		},
		// 获取分类数据
		getCategory(nowId) {
			this.$api('category.goodsNew', {
				category_id: this.categoryId
			}).then(res => {
				if (res.code === 1) {
					this.categoriesList = res.data.categories;
					let nowId = this.categoriesList[this.currentTab].id
					this.getCategoryMore(nowId);
					
					this.categoriesList.forEach((item,ind)=>{
						if(ind == 0) {
							this.$set(item,'class','myBox')
						}  else if(ind == 1) {
							this.$set(item,'class','downBox')
						}else {
							this.$set(item,'class','otherBox')
						}
						
					})
					
				}
			});
		},
		getCategoryMore(nowId) {
			let that = this
			that.isLoad = false
			that.$api('category.goodsList', {
				category_id: nowId,
				page:that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.categoryData = [...that.categoryData, ...res.data.goods.data];
					that.lastPage = res.data.goods.last_page
					
					if(that.currentPage == 1){
						this.catTopImg = res.data.categorie.image;
						this.catTopTit = res.data.categorie.name;
					}
					if(that.categoryData.length == 0){
						that.noneShow = true
					} else {
						that.noneShow = false
					}
					if (that.currentPage < res.data.goods) {
						that.isLoad = true;
					} else {
						that.isLoad = false;
					}
				
				}
			});
		},

		// 选择分类
		async onType(index,id) {
			// if (this.rightArr.length == 0) {
			// 	await this.getRightItemTop();
			// }
			// if (this.currentTab == index) return;
			// this.scrollRightTop = this.oldScrollTop;
			// this.$nextTick(function() {
			// 	this.scrollRightTop = this.rightArr[index];
				this.currentTab = index;
			// 	this.setLeftStatus(index);
			// });
			
			
			this.currentPage = 1;
			this.categoryData = []
			let nowId = id
			this.getCategoryMore(nowId);
			
			this.categoriesList.forEach((item,ind)=>{
				if(index == ind) {
					this.$set(item,'class','myBox')
				} else if(ind+1 == index){
					this.$set(item,'class','upBox')
				} else if(ind-1 == index){
					this.$set(item,'class','downBox')
				} else {
					this.$set(item,'class','otherBox')
				}
				
			})
			
		},

		// 设置左侧
		async setLeftStatus(index) {
			// this.currentTab = index;
			// if (this.rightHeight == 0 || this.leftItemHeight == 0) {
			// 	await this.getElRect('left-scroll-box', 'leftHeight');
			// 	await this.getElRect('type-list', 'leftItemHeight');
			// }
			// this.scrollLeftTop = index * this.leftItemHeight + this.leftItemHeight / 2 - this.leftHeight / 2;
		},

		// 右侧滑动
		async rightScroll(e) {
			this.oldScrollTop = e.detail.scrollTop;
			if (this.rightArr.length == 0) {
				await this.getRightItemTop();
			}
			if (timer) return;
			if (!this.leftHeight) {
				await this.getElRect('left-scroll-box', 'leftHeight');
			}
			setTimeout(() => {
				timer = null;
				let middleRightHeight = this.oldScrollTop + this.rightHeight / 2;
				for (let i = 0; i < this.rightArr.length; i++) {
					let h1 = this.rightArr[i];
					let h2 = this.rightArr[i + 1];
					if (!h2 || (middleRightHeight >= h1 && middleRightHeight < h2)) {
						this.setLeftStatus(i);
						return;
					}
				}
			}, 10);
		},
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 获取右边item到达顶部的距离
		getRightItemTop() {
			new Promise(resolve => {
				let query = uni.createSelectorQuery().in(this);
				query
					.selectAll('.item-list')
					.boundingClientRect(rects => {
						if (!rects.length) {
							setTimeout(() => {
								this.getRightItemTop();
							}, 10);
							return;
						}
						rects.forEach(rect => {
							this.rightArr.push(rect.top - rects[0].top);
							resolve();
						});
					})
					.exec();
			});
		},
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this); //这个in(this),小程序自定义组件，一定要带
				query
					.select('.' + elClass)
					.fields(
						{
							size: true
						},
						res => {
							// 如果节点尚未生成，res值为null，循环调用执行
							if (!res) {
								setTimeout(() => {
									this.getElRect(elClass);
								}, 10);
								return;
							}
							this[dataVal] = res.height;
							resolve();
						}
					)
					.exec();
			});
		},
		lowerMore(e){
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				let nowId = this.categoriesList[this.currentTab].id
				this.getCategoryMore(nowId);
			}
		},
		
	}
};
</script>

<style lang="scss">
// 购物车列表
.mask {
	position: fixed;
	background: rgba(#000, 0.3);
	width: 100%;
	height: 100%;
}

// 最外层结构包裹
.catgory-wrap {
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	overflow: hidden;
}

.hide-cart-list {
	transform: scaleY(0);
	transform-origin: center bottom;
	transition: all linear 0.1s;
}

.cart-list-box {
	position: absolute;
	width: 750rpx;
	bottom: 100rpx;
	background: #fff;
	height: 700rpx;
	z-index: 66;
	transform-origin: center bottom;
	transition: all linear 0.1s;
	border-radius: 20rpx 20rpx 0 0;

	.cart-list__head {
		height: 90rpx;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);

		.check-all {
			font-size: 28rpx;

			.check-all-radio {
				transform: scale(0.7);
				color: #e9b564;
			}
		}

		.delete-box {
			font-size: 26rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);

			.cuIcon-delete {
				font-size: 30rpx;
				margin-right: 10rpx;
			}
		}
	}

	// 购物车列表
	.block {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.collect-list {
		padding: 0 20rpx;
		background: #fff;
		margin-top: 20rpx;

		/deep/ .goods-title {
			width: 420rpx !important;
		}

		.tag-box {
			.tag1 {
				line-height: 36rpx;
				padding: 0 8rpx;
				font-size: 18rpx;
				color: rgba(#fff, 0.9);
				background: #f39800;
				display: inline-block;
				box-sizing: border-box;
			}

			.tag2 {
				line-height: 34rpx;
				padding: 0 8rpx;
				font-size: 18rpx;
				color: rgba(#f39800, 0.9);
				background: #fff;
				border-top: 1rpx solid #f39800;
				border-right: 1rpx solid #f39800;
				border-bottom: 1rpx solid #f39800;
				display: inline-block;
				box-sizing: border-box;
			}
		}

		.goods-radio {
			transform: scale(0.7);
			margin-right: 20rpx;
			// background:  #E9B564;
		}

		.price-box {
			width: 420rpx;

			.price {
				color: #e1212b;
			}
		}
	}
}
.cart-box {
	position: absolute;
	z-index: 77;
	width: 750rpx;
	display: flex;
	align-items: flex-end;
	.cart-left {
		height: 130rpx;
		position: relative;
		background: url($IMG_URL + '/imgs/category/bg1.png') no-repeat;
		background-size: 100% 100%;
		z-index: 99;
		.cart-img-box {
			position: absolute;
			left: 88rpx;
			top: 10rpx;
			width: 96rpx;
			height: 96rpx;
			z-index: 88;
			background: #fff;
			border-radius: 48rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.cart-img {
				width: 47rpx;
				height: 47rpx;
			}
			.badge{
				border: 7rpx #FFFFFF solid;
				height: 42rpx;
				top: -20rpx;
			}
		}

		.price-box {
			padding-left: 207rpx;
			padding-top: 24rpx;
			.original-price {
				font-size: 22rpx;
				font-family: OPPOSans;
				font-weight: 400;
				text-decoration: line-through;
				color: rgba(153, 153, 153, 1);
				margin-left: 10rpx;
			}

			.price {
				font-size: 52rpx;
				font-family: OPPOSans;
				font-weight: 500;
				color: rgba(250, 253, 253, 1);

				&::before {
					content: '￥';
					font-size: 28rpx;
				}
			}
		}
	}

	.pay-btn {
		width: 250rpx;
		height: 102rpx;
		border-radius: 0;
		background: linear-gradient(90deg, #FD7D1A 0%, #FA470B 100%);
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		z-index: 99;
	}
}

.wrapper-box {
	flex: 1;
	height: 100%;
}

.scroll-box {
	height: 100%;
	background: #F5F6F7;
}

.left {
	width: 200upx;
	height: 100%;
	flex: 1;
	.type-list {
		width: 200rpx;
		height: 278rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #303133;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.iconBox{
			width: 94rpx;
			height: 94rpx;
		}
		.iconName{
			width: 95%;
			font-size: 28rpx;
			font-weight: 400;
			color: #303133;
			margin-top: 34rpx;
			text-align: center;
		}

	}
	.upBox{
		border-radius:  0 0 47rpx 0;
		background: #FFFFFF;
	}
	.myBox{
		background: #F5F6F7;
		font-weight: bold !important;
	}
	.downBox{
		border-radius:  0 47rpx 0 0;
		background: #FFFFFF;
	}
	.otherBox{
		background: #FFFFFF;
	}
}

.right {
	padding: 0 20upx;
	flex: 1;
	height: 100%;

	.item-list {
		.type-box {
			min-height: 84rpx;

			.type-title {
				font-size: 28rpx;
				font-weight: bold;
				margin: 10rpx 0 30rpx 0 ;
			}

			.more {
				font-size: 26rpx;
				color: #999;
			}

			.type-img {
				width: 505rpx;
				height: 172rpx;
				margin: 30rpx 0 20rpx 0;
				border-radius: 15rpx;
				overflow: hidden;
			}
		}
		.mt30{
			margin-top: 30rpx;
		}
		.mt20{
			margin-top: 20rpx;
		}
		.item-box {
			flex-wrap: wrap;

			.goods-item {
				background: #FFFFFF;
				padding: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 18rpx;
				.goods-item--right {
					// @include flex($direction: column, $justify: around, $align: top);
					position: relative;
					width: 300rpx;
				}
				.HH7{
					height: 213rpx;
				}
				.HH8{
					height: 157rpx;
				}
				.item-right--bottom {
					width: 100%;
				}

				.item-img {
					width: 157rpx;
					height: 213rpx;
					border-radius: 15rpx;
					overflow: hidden;
					position: relative;
					.tag-img {
						position: absolute;
						left: 0;
						top: 0;
						z-index: 2;
						width: 80rpx;
						height: 40rpx;
					}
				}
				.item-img1 {
					width: 157rpx;
					height: 157rpx;
					border-radius: 15rpx;
					overflow: hidden;
					position: relative;
					.tag-img {
						position: absolute;
						left: 0;
						top: 0;
						z-index: 2;
						width: 80rpx;
						height: 40rpx;
					}
				}

				.item-right--title {
					// width: 270rpx;
					font-weight: bold;
					font-size: 30rpx;
					color: #303133;
				}
				.subtitleBox{
					font-size: 22rpx;
					font-weight: 400;
					color: #9A9DA2;
					margin: 10rpx 0 10rpx 0;
				}

				.item-right--sales {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
				}

				.price-box {
					.current-price {
						color: #FF2900;
						font-size: 40rpx;
						font-weight: bold;

						.current-price--unit {
							font-size: 22rpx;
						}
					}

					.origin-price {
						color: #999;
						font-size: 18rpx;
						margin-left: 12rpx;

						.origin-price--unit {
							font-size: 14rpx;
						}
					}
				}

				.item-btn {
					background: none;
					position: absolute;
					bottom: -10rpx;
					right: -8rpx;
					padding: 0;

					.cuIcon-roundaddfill {
						color: #FA470B;
						font-size: 40rpx;
					}
				}

				.sel-sku {
					width: 100rpx;
					height: 40rpx;
					background: #FA470B;
					border-radius: 20rpx;
					font-size: 22rpx;
					font-weight: 500;
					color: rgba(250, 253, 253, 1);
					position: relative;
					top: 0;
					line-height: 37rpx;
				}

				.num-step {
					/deep/.uni-numbox__value {
						width: 32rpx;
					}
				}
			}
		}
	}
}

// 没有数据
	.noneData {
		width: 550rpx;
		// height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 370rpx;
	}

	.noneIMg {
		width: 348rpx;
		height: 260rpx;
	}

	.noneText {
		font-size: 26rpx;
		color: #999;
		margin-top: 81rpx;
	}
	
</style>
