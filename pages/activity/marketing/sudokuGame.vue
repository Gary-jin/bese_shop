<template>
	<view class="sudokuBox">
		<view style="padding: 0 50rpx;">
			<view class="topImgBox">
				<image class="topImg" :src="goodsAll.image ||  $IMG_URL+'/imgs/sudoku/suf2.png'" mode="aspectFill"></image>
			</view>
			<view class="horseBox">
				<image class="volumeIcon" :src="$IMG_URL+'/imgs/sudoku/xx.png'" mode="aspectFill"></image>
				<u-notice-bar class="swiperList" font-size="26" :volume-icon="false" mode="horizontal" color="#fff" bg-color="transparent" :list="swiperlist"></u-notice-bar>
			</view>
			<!-- game -->
			<view class="gameBox">
				<view class="gamebg">
					<view class="container-out">
						<view class="circle" v-for="(item,index) in circleList" :key="index"
							:style="{'top':item.topCircle+'rpx','left':item.leftCircle+'rpx','background-color': (index%2==0)?colorCircleFirst:colorCircleSecond}">
						</view>
						<view class="container-in">
							<view class="content-out" v-for="(item,index) in awardList" :key="index"
								:style="{'top':item.topAward+'rpx','left':item.leftAward+'rpx',
								'background-color': (index==indexSelect)?colorAwardSelect:colorAwardDefault,
								'box-shadow': (index==indexSelect) ? '0 5px 0 #f8b963' :'0 5px 0 #F9D3C7' }">
								<view class="coreBox x-c">
									<image class="coreImg" :src="item.icon" mode="aspectFill"></image>
									<text v-if="item.type == 1" class="coreF one-t">{{item.prize}}积分</text>
									<text v-if="item.type == 2" class="coreF one-t">{{item.prize}}元红包</text>
									<text v-if="item.type == 3 || item.type == 4" class="coreF one-t">{{item.name}}</text>
								</view>
							</view>
							<view class="start-btn" @click="startGame">立即抽奖</view>
						</view>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="integBox x-bc">
				<button class="mybtn cu-btn round sm">抽奖次数&nbsp;({{goodsAll.draws_num}}/{{goodsAll.rules.day_limit_buy}})</button>
				<text class="jifen">我的积分:&nbsp;{{userInfo.score }}({{goodsAll.rules.consumptionIntegral}}/次)</text>
			</view>
			<view class="btnBox x-bc">
				<view class="btnM x-c" @click="goWinlist">我的奖品</view>
				<view class="btnM x-c" @click="sharePop"><view>分享给好友</view><view class="cishu">(得抽奖次数)</view></view>
			</view>
			<view class="ruleBox x-c">
				<view class="rule">
					<view class="ruleTit x-c">
						<image class="ruleIcon" :src="$IMG_URL+'/imgs/sudoku/sudicon1.png'" mode="widthFix"></image>
						<text class="ruleTxt">活动规则</text>
						<image class="ruleIcon" :src="$IMG_URL+'/imgs/sudoku/sudicon2.png'" mode="widthFix"></image>
					</view>
					<scroll-view scroll-top="0" scroll-y="true" class="ruleCore scroll-Y" >
						<view >
							<u-parse :html="goodsAll.descr.content"></u-parse>
						</view>
					</scroll-view>
				</view>
			</view>
			
		</view>
		<sh-activity-pop :type="'sudoku'" :show="popShow" :getGoodsList="getGoodsList" @goWinlist="goWinlist" @continueAward="continueAward" @popOff="popOff"></sh-activity-pop>
		
	</view>
</template>

<script>
	import shActivityPop from "../children/sh-activity-pop.vue"
	import { mapMutations, mapActions, mapState } from 'vuex';
	export default {
		components: {
			shActivityPop
		},
		data() {
			return {
				circleList: [], //圆点数组
				awardList: [], //奖品数组
				colorCircleFirst: '#FFDF2F', //圆点颜色1
				colorCircleSecond: '#FE4D32', //圆点颜色2
				colorAwardDefault: '#FDF2EE', //奖品默认颜色
				colorAwardSelect: '#f9eba0', //奖品选中颜色
				indexSelect: 0, //被选中的奖品index
				isRunning: false, //是否正在抽奖
				i: 0,
				transition: 0,
				ti: 0,
				endIndex: '',



				swiperlist: [],
				goodsAll:[],
				popShow: false, //获奖弹窗 	
				drawNum:3 , //抽奖次数
				getGoodsList:{}, //抽奖获得的商品
				timer:null,
				prizeList:[],
				currentPage: 1,
				lastPage: 1,
			};
		},
		computed:{
			...mapState({
				userInfo: state => state.user.userInfo,
			}),
		},
		onUnload(){
			clearInterval(this.timer);
		},
		onLoad() {
			this.list();
			let that = this;
			setTimeout(()=>{
				that.lotteryList()
			},1000)
				
		},
		onShow() {
			var _this = this;
			//圆点设置
			var leftCircle = 15;
			var topCircle = 15;
			var circleList = [];
			for (var i = 0; i < 24; i++) {
				if (i == 0) {
					topCircle = 15;
					leftCircle = 15;
				} else if (i < 6) {
					topCircle = 15;
					leftCircle = leftCircle + 96;
				} else if (i == 6) {
					topCircle = 15;
					leftCircle = 580;
				} else if (i < 12) {
					topCircle = topCircle + 84;
					leftCircle = 580;
				} else if (i == 12) {
					topCircle = 500;
					leftCircle = 580;
				} else if (i < 18) {
					topCircle = 500;
					leftCircle = leftCircle - 102.5;
				} else if (i == 18) {
					topCircle = 500;
					leftCircle = 15;
				} else if (i < 24) {
					topCircle = topCircle - 84;
					leftCircle = 15;
				} else {
					return;
				}
				circleList.push({
					topCircle: topCircle,
					leftCircle: leftCircle
				});
			}
			this.circleList = circleList;
			//圆点闪烁
			_this.timer = setInterval(function() {
				if (_this.colorCircleFirst == '#FFDF2F') {
					_this.colorCircleFirst = '#FE4D32';
					_this.colorCircleSecond = '#FFDF2F';
				} else {
					_this.colorCircleFirst = '#FFDF2F';
					_this.colorCircleSecond = '#FE4D32';
				}
			}, 500);
		},
		methods: {
			...mapActions(['getUserInfo']),
			// 加载更多
			lotteryList(){
				let that = this;
				that.$api('api.newLottery', {
					activity_id: that.goodsAll.id,
					page: that.currentPage
				}).then(res => {
					if(res.code == 1){
						let list = res.data.data
						let listnew = []
						list.forEach(function(item, index) {
							if(item.prize.type == 1){
								listnew.push('恭喜'+item.user.nickname+'获得'+item.prize.prize+'积分')
							}
							if(item.prize.type == 2){
								listnew.push('恭喜'+item.user.nickname+'获得'+item.prize.prize+'元红包')
							}
							if(item.prize.type == 3){
								listnew.push('恭喜'+item.user.nickname+'获得'+item.prize.name)
							}
						});
						that.swiperlist = listnew
						if(res.data.data.length == 0){
							that.swiperlist = ["幸运大抽奖","幸运大抽奖","幸运大抽奖","幸运大抽奖","幸运大抽奖",]
						}
					}
				})
			},
			list() {
				this.$api('api.lucky_draw', {
					type: 'luckydraw',
				}).then(res => {
					var topAward = -30;
					var leftAward = 0;
					this.awardList = res.data.prize
					this.goodsAll = res.data
					uni.setNavigationBarTitle({
						title: res.data.title
					});
					for (var j = 0; j < this.awardList.length; j++) {
						if (j == 0) {
							topAward = -30;
							leftAward = 0;
						} else if (j < 3) {
							topAward = topAward;
							//148是宽.15是间距.下同
							leftAward = leftAward + 148 + 16;
						} else if (j < 5) {
							leftAward = leftAward;
							//122是高,15是间距,下同
							topAward = topAward + 122 + 15;
						} else if (j < 7) {
							leftAward = leftAward - 148 - 16;
							topAward = topAward;
						} else if (j < 8) {
							leftAward = leftAward;
							topAward = topAward - 122 - 15;
						}
						this.awardList[j].topAward = topAward
						this.awardList[j].leftAward = leftAward
					}
				})
			},
			//开始游戏
			startGame: function() {
				var _this = this;
				if (_this.isRunning) {
					_this.$tools.toast("抽奖进行中，请稍后再试!");
					return;
				}
				if (_this.goodsAll.rules.consumptionIntegral>_this.userInfo.score) {
					_this.$tools.toast("您的积分已不足!");
					return;
				}
				if (_this.goodsAll.draws_num>=_this.goodsAll.rules.day_limit_buy) {
					_this.$tools.toast("您今天的抽奖次数已用完!");
					return;
				}
				if (_this.goodsAll.count_num>=_this.goodsAll.rules.limit_buy) {
					_this.$tools.toast("您所有的抽奖次数已用完!");
					return;
				}
				
				_this.isRunning = true;
				
				_this.$api('api.submit', {
					activity_id: _this.goodsAll.id,
				}).then(res => {
					if(res.code == 1){
						_this.ceshiTime()
						_this.getUserInfo() 
						_this.list()
						_this.getGoodsList = res.data
						_this.awardList.forEach(function(value, index) {
							if (value.id == res.data.id) {
								_this.endIndex = index
							}
						});
					}
					
				})
			},
			ceshiTime() {
				var _this = this;

				_this.transition++;
				//这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
				_this.i += 20;
				if (_this.i > 800) {
					_this.ti += 100;
					if (_this.ti > 400) {
						if (_this.indexSelect == _this.endIndex) {
							clearTimeout(timer);
								_this.i = 0
								_this.transition = 0
								_this.ti = 0
								_this.endIndex = ''
								_this.isRunning = false;
								_this.popShow = true
								_this.lotteryList()
							return;
						}
					}
				}
				_this.transition = _this.transition % 8;
				_this.indexSelect = _this.transition;
				var timer = setTimeout(() => {
					_this.ceshiTime()
				}, 100 + _this.ti)

			},
			jump(path, parmas) {
				clearInterval(this.timer);
				this.$Router.push({ path: path, query: parmas });
			},
			popOff(e) {
				this.popShow = e;
			},
			continueAward(){
				this.popShow = false
				this.startGame()
			},
			goWinlist(){
				this.jump('pages/activity/marketing/winlist',
				{activity_id:this.goodsAll.id,activity_type:'sudoku'})
			},
			sharePop(){
				
				
				// 共用
				this.jump('/pages/public/poster/index', {
					posterType: 'user'
				})
			}
		}
	};
</script>

<style lang="scss">
	.sudokuBox {
		width: 750rpx;
		min-height: 2134rpx;
		background: url($IMG_URL+'/imgs/sudoku/sudokuGg2.png') no-repeat;
		background-size: 100% 100%;

		.topImgBox {
			width: 100%;
			height: 570rpx;

			.topImg {
				width: 100%;
				height: 100%;
			}
		}

		.horseBox {
			margin-top: 10rpx;
			width: 100%;
			height: 135rpx;
			background: url($IMG_URL+'/imgs/sudoku/sul2.png') no-repeat;
			background-size: 100% 100%;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 2;
			.volumeIcon{
				width: 32rpx;
				height: 28rpx;
				margin-left: 50rpx;
			}
			.swiperList{
				width: 82%;
				.u-notice-bar{
					padding: 9px 0 !important; 
				}
			}
		}

		.gameBox {
			width: 100%;
			height: 615rpx;
			display: flex;
			justify-content: center;
			position: relative;
			top: -30rpx;
			.gamebg {
				width: 623rpx;
				height: 615rpx;
				background: url($IMG_URL+'/imgs/sudoku/subox2.png') no-repeat;
				background-size: 100% 100%;
			}
		}
		.integBox{
			margin: 0 0 35rpx;
			padding: 0 20rpx;
			.mybtn{
				color: #ffffff;
				background: #E61B19;
				font-size: 24rpx;
			}
			.jifen{
				font-size: 24rpx;
				font-weight: 400;
				color: #FFEC95;
			}
		}
		.btnBox{
			.btnM{
				width: 310rpx;
				height: 96rpx;
				background: linear-gradient(0deg, #feb23f, #ffee9a);
				border-radius: 48rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #EF2823;
				flex-direction: column;
				.cishu{
					font-size: 20rpx;
					font-weight: 400;
				}
			}
		}
		.ruleBox{
			width: 100%;
			height: 508rpx;
			background: #F9D178;
			border-radius: 20rpx;
			margin-top: 29rpx;
			.rule{
				width: 611rpx;
				height: 460rpx;
				background: #FEFCFA;
				border-radius: 20rpx;
				font-weight: 400;
				color: #E61B19;
				overflow: hidden;
				.ruleTit{
					padding: 0 26rpx;
					height: 83rpx;
					.ruleIcon{
						width: 75rpx;
						height: 20rpx;
					}
					.ruleTxt{
						font-size: 30rpx;
						margin: 0 20rpx;
					}
				}
				.ruleCore{
					width: 100%;
					height: 377rpx;
					padding: 0 20rpx 20rpx;
				}
			}
		}
	}





	/**index.wxss**/
	.container-out {
		height: 100%;
		width: 100%;
		margin-top: 57rpx;
		position: relative;
	}

	.container-in {
		width: 485rpx;
		height: 415rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	/**小圆球
	box-shadow: inset 3px 3px 3px #fff2af;*/

	.circle {
		position: absolute;
		display: block;
		border-radius: 50%;
		height: 20rpx;
		width: 20rpx;
	}

	.content-out {
		position: absolute;
		height: 118rpx;
		width: 154rpx; 
		background-color: #FDF2EE;
		border-radius: 15rpx;
		box-shadow: 0 5px 0 #F9D3C7;
	}

	/**居中 加粗*/

	.start-btn {
		position: absolute;
		margin: auto;
		top: -84rpx;
		left: -2rpx;
		bottom: 0;
		right: 0;
		border-radius: 15rpx;
		height: 118rpx;
		width: 154rpx;
		box-shadow: 0 5px 0 #eb9f38;
		background-image:  url($IMG_URL+'/imgs/sudoku/btn.png') ;
		background-size: 100% 100%;
		text-align: center;
		line-height: 118rpx;
		font-size: 31rpx;
		font-weight: 400;
		color: #EC4425;
		
	}
	
	.award-image {
		position: absolute;
		margin: auto;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 118rpx;
		width: 154rpx;
	}
	.coreBox{
		height: 118rpx;
		width: 154rpx;
		flex-direction: column;
		.coreImg{
			width: 92rpx;
			height: 56rpx;
		}
		.coreF{
			width: 130rpx;
			text-align: center;
			font-size: 21rpx;
			font-weight: 400;
			color: #851B00;
			margin-top: 10rpx;
		}
		
	}
</style>
