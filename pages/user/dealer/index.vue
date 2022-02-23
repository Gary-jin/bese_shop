<!-- 个人信息 -->
<template>
	<view class="borderbox">
		<view class="head_box">
			<cu-custom-new :isBack="true" :fixed="'false'">
				<block slot="backText" style="color: #FFFFFF; font-size: 36rpx; font-weight: 600;">升级{{detail.team_disname}}</block>
				<block slot="content"></block>
			</cu-custom-new>
		</view>
		<view class="dealerCore">
			<view class="coreTop">
				<view class="coreTit one-t">
					升级{{detail.team_disname}}规则
				</view>
				<scroll-view scroll-top="0" scroll-y="true" class="coreScroll scroll-Y" >
					<view >
						<u-parse :html="detail.team_content"></u-parse>
					</view>
				</scroll-view>
			</view>
			<view class="coreCen x-bc">
				<image class="dealerIcon" :src="$IMG_URL+'/imgs/user/dealerIcon.png'" mode="widthFix"></image>
				<image class="dealerIcon" :src="$IMG_URL+'/imgs/user/dealerIcon.png'" mode="widthFix"></image>
			</view>
			<view class="coreBtn">
				<view class="coreTit one-t">
					升级{{detail.team_disname}}条件
					<text style="padding-left: 10rpx;" v-if="detail.condition_mode">({{detail.condition_mode}})</text>
				</view>
				<scroll-view scroll-top="0" scroll-y="true" class="coreScroll scroll-Y" >
					<view v-for="(item,index) in detail.require_condition" :key="index">
						{{index+1}}:{{item}}
					</view>
				</scroll-view>
			</view>
			<view class="btnBox">
				<button class="cu-btn  upgradeBtn" @tap="upgrade">升级{{detail.team_disname}}</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			detail:[]
		};
	},
	computed: {
	},
	onLoad() {
		this.getData()
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		getData(){
			this.$api('api.dealerSet').then(res => {
				if(res.code == 1){
					this.detail = res.data
				}
			})
		},
		upgrade(){
			this.jump('/pages/user/dealer/goodsList',{ids: this.detail.require_goods_id,tit:this.detail.team_disname})
		}
	}
};
</script>

<style lang="scss">
.borderbox{
	    background: url($IMG_URL+'/imgs/user/dealerBg.png') no-repeat;
	    background-size: 100% 100%;
		width: 100%;
		min-height: 2060rpx;
		.head_box{
			color: #FFFFFF;
		}
		.dealerCore{
			padding: 0 30rpx;
			margin-top: 420rpx;
			.coreTop{
				height: 695rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 1rpx 24rpx 0rpx #FF711E;
				border-radius: 18rpx;
				padding: 45rpx ;
				.coreTit{
					font-size: 30rpx;
					font-weight: 600;
					color: #333333;
					margin-bottom: 30rpx;
				}
				.coreScroll{
					height: 525rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #656667;
				}
			}
			.coreCen{
				height: 108rpx;
				position: relative;
				top: -39rpx;
				z-index: 99;
				.dealerIcon{
					width: 20rpx;
					height: 108rpx;
					margin: 0 66rpx;
				}
			}
			.coreBtn{
				height: 547rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 1rpx 24rpx 0rpx #FF711E;
				border-radius: 18rpx;
				padding: 45rpx ;
				position: relative;
				top: -85rpx;
				.coreTit{
					font-size: 30rpx;
					font-weight: 600;
					color: #333333;
					margin-top: 30rpx;
					margin-bottom: 30rpx;
				}
				.coreScroll{
					height: 368rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #656667;
				}
			}
			.btnBox{
				.upgradeBtn{
					width: 100%;
					height: 90rpx;
					background: linear-gradient(109deg, #4B443C 0%, #17130E 100%);
					border-radius: 61rpx;
					padding: 0;
					color: #FFFFFF;
				}
			}
		}
}
</style>
