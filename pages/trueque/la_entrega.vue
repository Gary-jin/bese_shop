<template>
	<view class="bodyBox">
		<view class="titTop">
			需要您联系快递员，并自行协商运费与货品安全保障。推荐使用 <text>裹裹寄件</text>，平台保障，更放心，丢必赔。
		</view>
		<view class="coreBo">
			<view class="coreBox coreBB">
				<view class="tit">
					快递单号
				</view>
				<view class="tInp">
					<input type="text" v-model="scanCodes" placeholder-class="plc"  placeholder="请输入快递单号"/>
					<image @click="scanCode" class="icon1" :src="$IMG_URL + '/imgs/trueque/saoma.png'" mode=""></image>
				</view>
			</view>
			<view class="coreBox">
				<view class="">
					快递公司
				</view>
				<view class="tInp">
					<picker @change="bindChangeClase" :value="claseIndex" :range="clase">
						<text>{{clase[claseIndex]}}</text>
					</picker>
					<image class="icon2" :src="$IMG_URL + '/imgs/trueque/left.png'" mode=""></image>
				</view>
			</view>
		</view>
		<!--  -->
		<view class="footer">
			<button class="cu-btn btnH" @click="confirm">确认提交</button>
		</view>
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
				scanCodes:'',
				clase:[],
				claseIndex:0,
				claseVal:'',
				orderid :'',
				expList:[],
				expCode:'',
				expName:'',
			};
		},
		onLoad(option) {
			this.orderid = option.id
			this.getExp()
		},
		methods: {
			// 扫码
			scanCode() {
				let platform = uni.getStorageSync('platform');
				switch (platform) {
					case 'wxOfficialAccount':
						// #ifdef H5
						this.$wxsdk.scanQRCode(res => {
							this.scanCodes = res.resultStr;
						});
						// #endif
						break;
					case 'wxMiniProgram' || 'App':
						uni.scanCode({
							success: res => {
								this.scanCodes = res.result;
							},
							fail: err => {
								console.log(err);
							}
						});
						break;
					case 'App':
						uni.scanCode({
							success: res => {
								this.scanCodes = res.result;
							},
							fail: err => {
								console.log(err);
							}
						});
						break;
					default:
						this.$tools.toast('请使用小程序或微信浏览器');
				}
			},
			bindChangeClase(e){
				this.claseIndex  = e.target.value
				this.expList.forEach((item,index)=>{
					if(this.claseIndex == index){
						this.expCode = item.code
						this.expName = item.name
					}
				})
			},
			getExp(){
				this.$api('api.sCyOrderEXP', {}).then(res => {
					if (res.code === 1) {
						this.expList = res.data;
						this.expList.forEach((item,index)=>{
							this.clase.push(item.name)
							if(this.claseIndex == index){
								this.expCode = item.code
								this.expName = item.name
							}
						})
					}
				});
			},
			confirm(){
				this.$api('api.sCyOrderSend', {
					id: this.orderid,
					express_no: this.scanCodes,
					express_code: this.expCode,
					express_name: this.expName
				}).then(res => {
					if (res.code === 1) {
						this.$tools.toast(res.msg);
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							});
						},600)
					} else{
						this.$tools.toast(res.msg);
					}
				});
			}
		}
	};
</script>
<style lang="scss">
page{
	background: #F5F6F7;
}
.bodyBox{
	padding: 0 30rpx;
	.titTop{
		font-size: 28rpx;
		color: #909399;
		margin-top: 15rpx;
		text{
			color: #FF3101;
		}
	}
	.coreBo{
		background: #FFFFFF;
		margin-top: 30rpx;
		border-radius: 18rpx;
		padding: 0 30rpx;
		.coreBB{
			border-bottom: 1px #EEEEEE solid;
		}
		.coreBox{
			height: 200rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.tit{
				font-size: 32rpx;
				color: #333333;
			}
			.tInp{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 15rpx;
				input{
					width: 80%;
				}
				picker{
					width: 80%;
					color: #C1C1C1;
				}
				.plc{
					font-size: 32rpx;
					color: #C1C1C1;
				}
				.icon1{
					width: 40rpx;
					height: 40rpx;
				}
				.icon2{
					width: 12rpx;
					height: 24rpx;
				}
			}
		}
	}
	.footer{
		height: 130rpx;
		border-top: 1px #EEEEEE solid;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0;
		.btnH{
			height: 90rpx;
			width: 690rpx;
			border-radius: 45rpx;
			font-size: bold;
			background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
			color: #FFFFFF;
		}
	}
}
</style>
