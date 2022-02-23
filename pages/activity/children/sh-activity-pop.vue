<template>
	<view class="">
		<u-popup v-model="show" :mask-close-able='false' mode="center" width="588" :POPbg="POPbg">
			<view class="popBox">
				<view class="x-r">
					<image @click="offPop" class="popOff" :src="$IMG_URL+'/imgs/sudoku/popoff.png'" mode="aspectFill"></image>
				</view>
				
				<view class="x-c">
					<view class="popCore">
						<view class="coreImgBox x-c">    
							<image class="goodsImg" :src="getGoodsList.icon" mode="aspectFill"></image>
							<!-- <image  class="goodsImg" :src="$IMG_URL+'/imgs/sudoku/awardPop.png'" mode="aspectFill"></image> -->
						</view>
						<view class="x-c">
							<view class="coreTxt">
								<text v-if="getGoodsList.type == 1" class="coreF more-t">恭喜获得{{getGoodsList.prize}}积分</text>
								<text v-if="getGoodsList.type == 2" class="coreF more-t">恭喜获得{{getGoodsList.prize}}元红包</text>
								<text v-if="getGoodsList.type == 3" class="coreF more-t">恭喜获得{{getGoodsList.name}}</text>
								<text v-if="getGoodsList.type == 4" class="coreF more-t">{{getGoodsList.name}}</text>
							</view>
						</view>
						<view class="coreBtn">
							<view class="x-bc">
								<button @click="continueAward" class="btn1 cu-btn round">{{type=='sudoku'?'继续抽':'继续砸'}}</button>
								<button @click="goWinlist" class="btn2 cu-btn round">去查看</button>
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</u-popup>
	</view>
</template>

<script>
/**
 * 页面级功能组件。
 * @property {Boolean} show  - POP展示
 * @property {Object} getGoodsList  - 商品数据
 */
export default {
	name: 'shActivityPop',
	components: {},
	data() {
		return {
			POPbg: true
		};
	},
	props: {
		show : { 
			type : Boolean ,
			default : false
		},
		getGoodsList:{
			type : Object ,
			default : false
		},
		type:{
			type : String ,
			default : ''
		}
	},
	computed: {},
	created() {
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({ path: path, query: parmas });
		},
		offPop(){
			this.$emit('popOff', false);
		},
		goWinlist(){
			// this.jump('pages/activity/marketing/winlist')
			this.$emit('goWinlist');
		},
		continueAward(){
			this.$emit('continueAward');
		}
		
	}
};
</script>

<style lang="scss">
	.popBox{
		width: 588rpx;
		.popOff{
			width: 78rpx;
			height: 141rpx;
			margin-right: 30rpx;
		}
		.popCore{
			background: #FFFFFF;
			border-radius: 21rpx;
			width: 100%;
			.coreImgBox{
				height: 264rpx;
				.goodsImg{
					width: 433rpx;
					height: 203rpx;
				}
			}
			.coreTxt{
				font-size: 32rpx;
				font-weight: 600;
				color: #333333;
				text-align: center;
				padding: 0 50rpx;
			}
			.coreBtn{
				padding: 36rpx 63rpx 63rpx 63rpx;
				
				.btn1{
					background: linear-gradient(360deg, #F32755 0%, #FD4F46 100%);
					box-shadow: 0rpx 0rpx 37rpx 0rpx rgba(255, 255, 255, 0.5);
					border: 0rpx solid #FFFFFF;
					color: #FFFFFF;
				}
				.btn2{
					background: linear-gradient(180deg, #F3C227 0%, #FD9246 100%);
					box-shadow: 0rpx 0rpx 37rpx 0rpx rgba(255, 255, 255, 0.5);
					border: 0rpx solid #FFFFFF;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
