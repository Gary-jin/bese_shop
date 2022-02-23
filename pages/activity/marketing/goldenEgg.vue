<template>
	<view class="eggBoby">
		<view class="eggTit">
			<text class="titColor titT">抽奖次数&nbsp;({{goodsAll.draws_num}}/{{goodsAll.rules.day_limit_buy}})</text>
			<text class="titColor titB">我的积分:&nbsp;{{userInfo.score }}({{goodsAll.rules.consumptionIntegral}}/次)</text>
		</view>

		<view class="box">
			<view class="egg-box">
				<view @click="smashedEgg(item,index)" v-for="(item, index) in giftArr" :key="item.id" class="item">
					<view class="vg-parent">
						<view class="egg-size">
							<view v-if="item.sort == currentSelect" class="egg-pic"></view>
							<view class="vg-wfull vg-hfull" v-else>
								<view class="vg-wfull vg-hfull" v-if="item.isOpen">
									<view class="item-img opentype"
										:style="{background: `url(${item.img})50% 50% / cover no-repeat`}"></view>
								</view>
								<view  v-else class="item-img unopen" :class="item.sort == currentIndex ? 'active': ''">
								</view>
							</view>
						</view>
						<view v-if="item.sort == currentIndex && !item.isOpen" class="hammer-box">
							<image class="hammer-img" :class="item.sort == currentIndex ? activeName : ''"
								mode="widthFix" :src="$IMG_URL+'/imgs/sudoku/egg/hammer.png'"></image>
						</view>
						<view v-if="item.sort == currentSelect" class="hammer-box">
							<image class="hammer-img" :class="item.sort == currentSelect ? 'active' : ''"
								mode="widthFix" :src="$IMG_URL+'/imgs/sudoku/egg/hammer.png'"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="coreBox">
			<view class="prizeBox mt" v-if="prizeList.length!=0">
				<view class="x-c">
					<view class="prizeTit"><text class="titColor">本期中奖名单</text></view>
				</view>
				<view class="x-c core">
					<view>
						<view class="coreCt x-ac">
							<text class="coreL1">用户名</text><text class="coreL2">砸得奖品</text>
						</view>
						<scroll-view scroll-top="0" scroll-y="true" class="prizeCore scroll-Y">
							<view v-for="(item,index) in prizeList" :key="index">
								<view class="x-ac">
									<text class="coreL1 one-t">{{item.user.nickname}}</text>
									<text class="coreL2 one-t" v-if="item.prize.type == 1">获得{{item.prize.prize}}积分</text>
									<text class="coreL2 one-t" v-if="item.prize.type == 2">获得{{item.prize.prize}}元红包</text>
									<text class="coreL2 one-t" v-if="item.prize.type == 3">获得{{item.prize.name}}</text>
									<text class="coreL2 one-t" v-if="item.prize.type == 4">{{item.prize.name}}</text>
								</view>
							</view>
						</scroll-view>
					</view>
					
				</view>
			</view>
			
			<view class="btnBox x-bc">
				<view @click="goWinlist" class="btnM btnM1 x-c"><text class="tt">我的奖品</text></view>
				<view  @click="sharePop" class="btnM btnM2 x-c"><view class="tt">分享给好友</view><view class="cishu tt">(得抽奖次数)</view></view>
			</view>
			
			<view class="prizeBox mb">
				<view class="x-c">
					<view class="prizeTit"><text class="titColor">活动规则</text></view>
				</view>
				<view class="x-c core">
					<scroll-view scroll-top="0" scroll-y="true" class="prizeCore scroll-Y">
						<view style="padding: 22rpx;">
							<u-parse :html="goodsAll.descr.content"></u-parse>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<sh-activity-pop :type="'egg'" :show="popShow" :getGoodsList="getGoodsList"  @goWinlist="goWinlist" @continueAward="continueAward" @popOff="popOff"></sh-activity-pop>
		
	</view>
</template>

<script>
	import shActivityPop from "../children/sh-activity-pop.vue"
	import { mapMutations, mapActions, mapState } from 'vuex';
	export default {
		name: 'goldenEgg',
		components: {
			shActivityPop
		},
		data() {
			return {
				currentIndex: 0,
				runArr: [], // 运行中金蛋选中顺序
				giftArr: [ 
					// {
					// 	sort: 1,
					// 	isOpen: 0,
					// }
				],
				timer1: null,
				currentSelect: 0,
				activeName: '', // 用于锤子移动动画类
				// maskNumber: 6, // 剩余门板数
				playNumber: 6, // 剩余次数
				openCount: 0, // 打开金蛋的个数
				currentCore: 0, // 当前抽奖金币显示数
				
				goodsAll:{},
				popShow: false,
				getGoodsList:{},
				prizeList:[],
				currentPage: 1,
				lastPage: 1,
			}
		},
		computed:{
			...mapState({
				userInfo: state => state.user.userInfo,
			}),
		},
		onLoad() {
			this.initegg()
		},
		onShow(){
			let that = this;
			setTimeout(()=>{
				that.run()
			},500)
		},
		onUnload(){
			clearInterval(this.timer1);
		},
		methods: {
			...mapActions(['getUserInfo']),
			lotteryList(){
				let that = this;
				that.$api('api.newLottery', {
					activity_id: that.goodsAll.id,
					page: that.currentPage
				}).then(res => {
					if(res.code == 1){
						that.prizeList =res.data.data;
					}
				})
			},
			initegg(){
				let that = this;
				that.$api('api.lucky_draw', {
					type: 'sge',
				}).then(res => {
					if(res.code == 1){
						that.goodsAll = res.data
						uni.setNavigationBarTitle({
							title: res.data.title
						});
						if(res.data.prize.length == 3){
							that.runArr = [1, 2, 3] // 运行中金蛋选中顺序
						}
						if(res.data.prize.length == 6){
							that.runArr = [1, 2, 3, 6, 5, 4] // 运行中金蛋选中顺序
						}
						if(res.data.prize.length == 9){
							that.runArr = [1, 2, 3, 6, 5, 4, 7, 8, 9] // 运行中金蛋选中顺序
						}
						let list = res.data.prize
						list.forEach(function(item, index) {
							that.$set(item, 'isOpen',0)
							that.$set(item, 'sort',index +1)
						});
						that.giftArr = list;
						that.lotteryList()
					}
				})
			},
			shinitegg(){
				let that = this;
				that.$api('api.lucky_draw', {
					type: 'sge',
				}).then(res => {
					if(res.code == 1){
						that.goodsAll = res.data
						that.lotteryList()
					}
				})
			},
			draw(item, index) { // 抽奖
				let that = this;
				clearInterval(this.timer1);
				that.currentIndex = 0;
				that.currentSelect = item.sort;
				that.giftArr[index].isOpen = 1;
				let temA = that.runArr.filter(itemv => itemv != item.sort);
				that.runArr = temA;
				setTimeout(function() {
					that.currentSelect = 0;
				}, 1000)
			},
			run() { // 砸金蛋锤子走动特效
				let that = this;
				this.timer1 = setInterval(function() {
					if (that.runArr.length < 1) {
						return false
					}
					let tempv = that.runArr[0];
					that.currentIndex = that.runArr[0];
					let preIndex = that.runArr[that.runArr.length - 1];
					let tempX = that.giftArr[that.currentIndex - 1].x - that.giftArr[preIndex - 1].x;
					let tempY = that.giftArr[that.currentIndex - 1].y - that.giftArr[preIndex - 1].y;
					that.activeName = 'active' + tempX + tempY;
					that.runArr.shift();
					that.runArr.push(tempv);
				}, 2000)
			},

			smashedEgg(item, index) { // 砸金蛋
				
				let that = this;
				if (item.isOpen) {
					that.$tools.toast("金蛋已经砸开");
					return false
				}
				if (that.goodsAll.rules.consumptionIntegral>that.userInfo.score) {
					that.$tools.toast("您的积分已不足!");
					return;
				}
				if (that.goodsAll.draws_num>=that.goodsAll.rules.day_limit_buy) {
					that.$tools.toast("您今天的抽奖次数已用完!");
					return;
				}
				if (that.goodsAll.count_num>=that.goodsAll.rules.limit_buy) {
					that.$tools.toast("您所有的抽奖次数已用完!");
					return;
				}

				that.$set(that.giftArr[index], 'img',that.$IMG_URL+'/imgs/sudoku/egg/sharkegg2.png')
				that.$api('api.submit', {
					activity_id: that.goodsAll.id,
				}).then(res => {
					if(res.code == 1){
						that.getUserInfo()
						that.draw(item, index);
						that.getGoodsList = res.data
						setTimeout(()=>{
							that.popShow = true
							that.shinitegg()
						},1000)
					}
				})
			},
			jump(path, parmas) {
				this.$Router.push({ path: path, query: parmas });
			},
			popOff(e) {
				this.popShow = e;
			},
			continueAward(){
				this.popShow = false
			},
			goWinlist(){
				clearInterval(this.timer1);
				this.jump('pages/activity/marketing/winlist',
				{activity_id:this.goodsAll.id,activity_type:'egg'})
			},
			sharePop(){
				clearInterval(this.timer1);
				
				// 共用
				this.jump('/pages/public/poster/index', {
					posterType: 'user'
				})
				
				
				
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.eggBoby {
		width: 750rpx;
		min-height: 1390rpx;
		background: url("https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp/imgs/sudoku/egg/eggbg.png") no-repeat;
		background-size: 100% 1390rpx;
		background-color: #b41e27;
		overflow: hidden;

		.eggTit {
			margin-top: 965rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			.titT {
				font-size: 40rpx;
				font-weight: 600;
				margin-bottom: 16rpx;
			}

			.titB {
				font-size: 28rpx;
				font-weight: 400;
			}
		}

		.coreBox {
			padding: 0 43rpx;
			.mt{
				margin-top: 96rpx;
			}
			.mb{
				margin-bottom: 72rpx;
			}
			.prizeBox {
				width: 100%;
				background: #CD3450;
				box-shadow: 0 0 20rpx 0 rgba(176, 26, 35, 0.75);
				overflow: hidden;
				
				.prizeTit {
					width: 545rpx;
					height: 57rpx;
					background: #C12441;
					border: 1rpx solid #E84F6D;
					box-shadow: 0 0 13rpx 0 rgba(193, 36, 65, 0.5);
					border-radius: 8rpx;
					margin: 21rpx 0;
					font-size: 32rpx;
					font-weight: 600;
					text-align: center;
					line-height: 57rpx;
				}
				.core{
					margin-bottom: 33rpx;
					.coreCt{
						width: 621rpx;
						height: 47rpx;
						background: #E84F6D;
						border: 2rpx solid #E84F6D;
						color: #FFFFFF;
						.coreL1{
							width: 40%;
							text-align: center;
						}
						.coreL2{
							width: 60%;
							text-align: center;
						}
					}
				}
				.prizeCore {
					width: 621rpx;
					height: 420rpx;
					background: #D84360;
					border: 2rpx solid #E84F6D;
					padding: 10rpx 0;
					color: #FFFFFF;
					.coreL1{
						width: 40%;
						text-align: center;
					}
					.coreL2{
						width: 60%;
						text-align: center;
					}
					
				}
			}
			.btnBox{
				margin: 55rpx 0;
				.btnM{
					font-size: 38rpx;
					font-weight: bold;
					color: #EF2823;
					flex-direction: column;
					background-image: url(https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp/imgs/sudoku/egg/btn.png);
					background-size: 100% 100%;
					color: #FFFFFF;
					.cishu{
						font-size: 20rpx;
						font-weight: 400;
					}
					.tt{
						position: relative;
						top: -10rpx;
					}
				}
				.btnM1{
					width: 286rpx;
					height: 124rpx;
					
				}
				.btnM2{
					width: 350rpx;
					height: 124rpx;
				}
			}
		}

	}

	.titColor {
		background-image: linear-gradient(0deg, #FFAE00, #FDF123, #FFFBE5);
		-webkit-background-clip: text;
		-moz-background-clip: text;
		background-clip: text;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		-moz-box-decoration-break: clone;
		color: transparent;
		position: relative;
	}

	.vg-parent {
		position: relative;
	}

	.vg-text-white {
		color: #fff;
	}

	.vg-wfull {
		width: 100%;
	}

	.vg-hfull {
		height: 100%;
	}

	@-webkit-keyframes shake-egg {
		0% {
			-webkit-transform: translateX(3px) rotate(2deg);
		}

		100% {
			-webkit-transform: translateX(-3px) rotate(-2deg);
		}
	}

	/*金蛋动画*/
	@-webkit-keyframes hammer {
		0% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer00 {
		0% {
			transform: translate(0, 0px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer0-1 {
		0% {
			transform: translate(0, 75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer-1-1 {
		0% {
			transform: translate(75px, 75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer-2-1 {
		0% {
			transform: translate(150px, 75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer10 {
		0% {
			transform: translate(-75px, 0px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer1-1 {
		0% {
			transform: translate(-75px, 75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer20 {
		0% {
			transform: translate(-150px, 0px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer2-1 {
		0% {
			transform: translate(-150px, 75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer01 {
		0% {
			transform: translate(0px, -75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer-11 {
		0% {
			transform: translate(75px, -75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer-21 {
		0% {
			transform: translate(150px, -75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer-10 {
		0% {
			transform: translate(75px, 0px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer-20 {
		0% {
			transform: translate(150px, 0px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer11 {
		0% {
			transform: translate(-75px, -75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammer21 {
		0% {
			transform: translate(-150px, -75px);
		}

		30% {
			transform: translate(0px, 0px);
		}

		80% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammera {
		0% {
			transform: translateY(75px);
		}

		30% {
			transform: translateY(0px);
		}

		60% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammerb {
		0% {
			transform: translateX(-75px);
		}

		30% {
			transform: translateX(0px);
		}

		40% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammerc {
		0% {
			transform: translateY(-75px);
		}

		30% {
			transform: translateY(0px);
		}

		40% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammerd {
		0% {
			transform: translateX(75px);
		}

		30% {
			transform: translateX(0px);
		}

		40% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammere {
		0% {
			transform: translateX(75px) translateY(-75);
		}

		30% {
			transform: translateX(0px) translateY(0);
		}

		40% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes hammerf {
		0% {
			transform: translateX(150px) translateY(75);
		}

		30% {
			transform: translateX(0px) translateY(0);
		}

		40% {
			transform: rotate(-10deg) rotate(-10deg);
		}

		100% {
			transform: rotate(0deg) rotate(0deg);
		}
	}

	@-webkit-keyframes smashedegg {
		0% {
			background-image: url("https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp/imgs/sudoku/egg/sharkegg.png");
		}

		25% {
			background-image: url("https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp/imgs/sudoku/egg/sharkegg.png");
		}

		50% {
			background-image: url("https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp/imgs/sudoku/egg/sharkegg1.png");
		}

		100% {
			background-image: url("https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp/imgs/sudoku/egg/sharkegg2.png");
		}
	}

	.box {
		width: 100%;
		background-size: cover;
		// padding-top: 10px;
		position: relative;

		.egg-box {
			width: 100%;
			margin-top: 26px;
			padding: 0 22px;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			box-sizing: border-box;

			.item {
				width: 210rpx;
				height: 366rpx;
				.egg-size {
					width: 210rpx;
					height: 366rpx;

					.egg-pic {
						width: 100%;
						height: 100%;
						background-size: cover;
						background-position: center;
						-webkit-animation-name: smashedegg;
						-webkit-animation-duration: 1s;
						-webkit-animation-timing-function: linear;
						-webkit-animation-iteration-count: 1;
					}

					.item-img {
						width: 100%;
						height: 100%;

						&.opentype {
							background-size: 100% 100%;
							background-position: center;
						}

						&.unopen {
							background: url("https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp/imgs/sudoku/egg/sharkegg.png");
							background-size: 100% 100%;
							background-position: center;
						}

						&.active {
							-webkit-animation-name: shake-egg;
							-webkit-animation-duration: 0.1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 6;
						}
					}
				}

				.text-box {
					position: absolute;
					width: 80px;
					height: 40px;
					top: -30px;
					left: 50%;
					margin-left: -50px;

					.txt-img {
						width: 100%;
					}
				}

				.hammer-box {
					width: 128px;
					height: 128px;
					position: absolute;
					position: absolute;
					top: -10px;
					right: -82px;
					z-index: 99;

					.hammer-img {
						width: 105rpx;
						height: 118rpx;
						position: relative;
						z-index: 99;

						&.active {
							-webkit-animation-name: hammer;
							-webkit-animation-duration: 0.2s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 2;
						}

						&.active00 {
							-webkit-animation-name: hammer0-1;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1000;
						}

						&.active0-1 {
							-webkit-animation-name: hammer0-1;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active-1-1 {
							-webkit-animation-name: hammer-1-1;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active-2-1 {
							-webkit-animation-name: hammer-2-1;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active10 {
							-webkit-animation-name: hammer10;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active1-1 {
							-webkit-animation-name: hammer1-1;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active20 {
							-webkit-animation-name: hammer20;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active2-1 {
							-webkit-animation-name: hammer2-1;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active01 {
							-webkit-animation-name: hammer01;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active-11 {
							-webkit-animation-name: hammer-11;
							-webkit-animation-duration: 1.5s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active-21 {
							-webkit-animation-name: hammer-21;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active-10 {
							-webkit-animation-name: hammer-10;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active-20 {
							-webkit-animation-name: hammer-20;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active11 {
							-webkit-animation-name: hammer11;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}

						&.active21 {
							-webkit-animation-name: hammer21;
							-webkit-animation-duration: 1s;
							-webkit-animation-timing-function: linear;
							-webkit-animation-iteration-count: 1;
						}
					}
				}
			}
		}

		.last-count {
			width: 185px;
			height: 26px;
			margin: 32px auto 18px auto;
			background: linear-gradient(270deg, rgba(222, 37, 18, 0.32) 0%, rgba(0, 0, 0, 0.10) 49%, rgba(226, 44, 20, 0.32) 100%);
			color: #fff;
			text-align: center;
			font-size: 11px;
			line-height: 26px;

			.last-text {
				font-size: 11px;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 12px;
				color: rgba(255, 255, 255, 1);
				text-shadow: 0px 1px 2px rgba(177, 17, 14, 1);
				opacity: 1;
			}

			.small-egg {
				width: 10px;
				height: 16px;
			}
		}

	}

	.anim {
		transition: all 0.5s;
		margin-top: -18px;
	}
</style>
