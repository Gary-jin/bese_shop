<template>
	<view class="boxKk">
		<view class="tableKk">
			<!-- :class="index == 0 ? 'tabOne' : '' " -->
			<view class="tab " :class="filterCurrent == item.id ? 'chosed' : 'chosebe'"
				v-for="(item,index) in filterList" :key="index" @click="chose(item,index)">
				<!-- 切换的横杠 -->
				<view class="whippletree" v-if="filterCurrent == item.id"></view>
				<view class="tableText">{{item.title}}</view>
			</view>
		</view>
		<!-- 列表 -->
		<swiper class="swiper" @change="swiperChange" :current="filterCurrent" :disable-touch="true" :touchable="false">
			<swiper-item v-for="(it,ind) in filterList" :key="ind">
				<scroll-view scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
					@scroll="scroll">
					<!-- 真实宝贝 -->
					<view class="listLi" v-for="(item,key) in goodsList" :key="key" v-if="it.typeid ==2">
						<view class="listImgKK">
							<u-lazy-load class="listImg" :image="item.prize.icon" :loading-img="loadingTmg" :error-img="errorImg" img-mode="aspectFill"></u-lazy-load>
						</view>
						<view class="content">
							<view class="conTitle one-t">
								{{item.prize.name}}
							</view>
							<view class="conTime">
								有效时间：
								{{ $u.timeFormat(item.createtime + 86400, 'yyyy/mm/dd') }}
							</view>
							<view class="conbutn">
								<view class="conbutnes" v-if="item.status == 0" @click="receive(item.id)">
									待领取
								</view>
								<view class="conbutnesed" v-if="item.status == 1" @click="$tools.toast('等待发货中~')">
									待发货 
								</view>
								<view class="conbutnesed" v-if="item.status == 2" @click="goLogistics(item)">
									已发货 
								</view>
								<view class="conbutnesed" v-if="item.status == 3" @click="$tools.toast('已经失效了~')">
									已失效
								</view>

							</view>
						</view>
					</view>
					<!-- 虚拟宝贝 -->
					<view class="virtualkk" v-if="it.typeid ==1">
						<view class="virtualLi" v-for="(item,key) in goodsList" :key="key">
							<view class="virLeft">
								<image :src="$IMG_URL+'/imgs/sudoku/jifen.png'" class="wiverIMg"></image>
								<text class="verTitle">{{activity_type=='egg'?'砸金蛋':'转盘抽奖'}}获得{{item.prize.type == 1?'积分':'红包'}}</text>
							</view>
							<view class="virRight">
								<text class="verPice">+{{item.prize.prize}}</text>
								<text class="verState">已到账</text>
							</view>
						</view>
					</view>
					
					<view class="noneData" v-if="noneDataShow">
                        <image :src="$IMG_URL+'/imgs/empty/empty_groupon.png'" class="noneIMg" ></image>
						<text class="noneText">暂无相关{{activity_type=='egg'?'砸金蛋':'抽奖'}}记录，快去{{activity_type=='egg'?'砸金蛋':'抽奖'}}吧~</text>
					</view>
				
					<view class="cu-load" v-if="goodsList.length" :class="isLoad?'loading':'over'"></view>
				</scroll-view>
			</swiper-item>

		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				filterCurrent: 0,
				filterList: [{
						title: '真实宝贝',
						isUnfold: false,
						id: 0,
						typeid:2
					},
					{
						title: '虚拟宝贝',
						isUnfold: false,
						id: 1,
						typeid:1
					},

				],
				errorImg: this.$ERROR_IMG,
				loadingTmg: this.$LOAD_IMG,
				isLoad: false,
				noneDataShow:false,
				activity_id:'',
				currentPage: 1,
				lastPage: 1,
				goodsList:[],
				type: 2 ,  //1=虚拟,2=实物
				activity_type:'',//egg砸金蛋 sudoku转盘
			}
		},
		onLoad(par) {
			this.activity_id = par.activity_id;
			this.activity_type = par.activity_type
			this.getGoodsList()
		},
		methods: {
			getGoodsList(){
				let that = this;
				that.isLoad = false;
				that.noneDataShow = false;
				that.$api('api.prizeLog', {
					activity_id: that.activity_id,
					type:that.type,
					page: that.currentPage
				}).then(res => {
					if(res.code == 1){
						that.goodsList = [...that.goodsList, ...res.data.data];
						if (!that.goodsList.length) {
							that.noneDataShow = true;
						}
						that.lastPage = res.data.last_page;
						if (that.currentPage < res.data.last_page) {
							that.isLoad = true;
						} else {
							that.isLoad = false;
						}
					}
				})
			},
			swiperChange(e){
				if (e.detail.isno){
					return
				} else {
					this.currentPage = 1
					this.goodsList = []
					this.filterCurrent = e.detail.current;
					this.type = this.filterCurrent == 0 ? 2:1
					this.getGoodsList()
				}
			},
			chose(item,index) {
				this.currentPage = 1
				this.filterCurrent = item.id;
				this.type = item.typeid
				
				let i = {detail:{'current':item.id,'isno':1}}
				this.swiperChange(i)
			},
			upper: function(e) {
				// console.log('xxxxxs')
			},
			lower: function(e) {
				console.log(this.currentPage,this.lastPage)
				if (this.currentPage < this.lastPage) {
					this.currentPage += 1;
					this.getGoodsList();
				}
			},
			scroll: function(e) {
				// console.log(e)
				// this.old.scrollTop = e.detail.scrollTop
			},
			// 领取真实宝贝
			receive(id){
				this.$Router.push({
					path: '/pages/user/address/list',
					query: { from: 'marketingActivity',prizeId:id }
				});
			},
			//查看物流
			goLogistics(item){
				let that = this;
				that.$api('order.expressList', {
					order_id: item.id
				}).then(res => {
					if (res.code === 1) {
						if (res.data.length == 1) {
							console.log(item.prize.icon)
							that.$Router.push({
								path: '/pages/order/express',
								query: { orderId: item.id, expressId: res.data[0].id,type:'winlist'}
							});
						} else {
							that.$tools.toast('暂无包裹~');
						}
					}
				});


			}
		}
	}
</script>

<style lang="scss">
	.boxKk {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 100vh;
	}

	.tableKk {
		background-color: #FFFFFF;
		padding: 22rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.tab:first-child {
		margin-right: 86rpx;
	}

	.tabOne {
		// margin-right: 86rpx;
	}

	.tab {
		width: 156rpx;
		text-align: center;
		font-size: 34rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		position: relative;
		height: 48rpx;
		line-height: 48rpx;
		display: flex;
		flex-direction: column-reverse;
	}

	.chosed {
		font-weight: 600;
		color: #FF2900;
	}

	.chosebe {
		font-weight: 400;
		color: #9DA0A5;
	}

	.whippletree {
		z-index: 1 !important;

		width: 100%;
		height: 10rpx;
		background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
		border-radius: 5px;
		opacity: 0.2;
	}

	.tableText {
		width: 100%;
		position: absolute;
		left: 0;
		top: 4rpx;
		text-align: center;
		z-index: 1000000;
	}


	// swiper列表
	.swiper {
		width: 100%;
		flex: 1;

		swiper-item {
			height: 100%;
			width: 100%;

			.scroll-Y {
				height: 100%;
				width: 100%;
				padding: 30rpx;
			}

			// 真实宝贝
			.listLi {
				width: 100%;
				height: 202rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				padding: 20rpx;
				margin-bottom: 30rpx;

				.listImgKK {
					width: 162rpx;
					height: 162rpx;
					background: #D8D8D8;
					border-radius: 14rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
					margin-right: 18rpx;

					.listImg {
						width: 100%;
					}
				}

				.content {
					flex: 1;
					height: 100%;
					padding: 10rpx 0rpx;

					.conTitle {
						width: 470rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #333333;
						line-height: 46rpx;
					}

					.conTime {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 40rpx;
						margin-top: 12rpx;
					}

					.conbutn {
						margin-top: 6rpx;
						display: flex;
						flex-direction: row-reverse;

						.conbutnes {
							width: 132rpx;
							height: 48rpx;
							background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
							border-radius: 31rpx;
							text-align: center;
							line-height: 48rpx;
							font-size: 26rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #FFFFFF;
						}

						.conbutnesed {
							width: 132rpx;
							height: 48rpx;
							background: linear-gradient(180deg, #EBECED 0%, #C7C9CB 100%);
							border-radius: 31rpx;
							text-align: center;
							line-height: 48rpx;
							font-size: 26rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #848788;
						}
					}
				}
			}

			// 虚拟宝贝
			.virtualkk {
				// height: 600rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 0rpx 30rpx;

				.virtualLi {
					padding: 32rpx 0rpx;
					display: flex;
					align-items: center;

					.virLeft {
						display: flex;
						align-items: center;
						width: 366rpx;

						.wiverIMg {
							height: 50rpx;
							width: 50rpx;
							margin-right: 16rpx;
						}

						.verTitle {
							font-size: 32rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #333333;
							line-height: 46rpx;
						}
					}

					.virRight {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.verPice {
							font-size: 32rpx;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: #E61E29;
							line-height: 46rpx;
						}

						.verState {
							font-size: 28rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #909399;
							line-height: 40rpx;
						}
					}
				}
			}

		}

		// height: 100%;
	}

	// 没有数据
	.noneData {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 119rpx;
	}

	.noneIMg {
		width: 348rpx;
		height: 228rpx;
	}

	.noneText {
		font-size: 26rpx;
		color: #999;
		margin-top: 81rpx;
	}

</style>
