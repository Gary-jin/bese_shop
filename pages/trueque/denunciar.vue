<template>
	<view class="bodyBox">
		<view class="bodyBoxCore">
			<!--  -->
			<view class="coreBox" style="margin-top: 36rpx;">
				<view class="itemBox">
					<view class="itemTit">举报事由</view>
					<view class="itemRig">
						<picker @change="bindChangeClase" :value="claseIndex" :range="claseText">
							<text>{{claseText[claseIndex]}}</text>
						</picker>
						<u-icon name="arrow-right" color="#C1C1C1" size="28"></u-icon>
					</view>
				</view>
			</view>
			<!--  -->
			<!--  -->
			<view class="coreBox coreBoxTop">
				<view class="itemBox1">
					<textarea v-model="desvalue" placeholder-style="color:#C1C1C1"  placeholder="请描述事件起因与经过~"/>
				</view>
				<view class="img-box">
					<view class="preview-box" v-for="(item, index) in imgList" :key="index">
						<image class="preview-img" :src="item" mode="aspectFill"></image>
						<text class="cuIcon-close" @tap="DelImg(index)"></text>
					</view>
					<view class="choose-img x-c" @tap="onChooseImg" v-if="imgList.length < 9">
						<image class="preview-img" :src="$IMG_URL + '/imgs/trueque/upimg.png' " mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<!--  -->
		</view>
		<!--  -->
		<view class="coreBox coreBox2">
			<button class="cu-btn btnYao" @tap="onJoin">确认提交</button>
		</view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>
<script>
	// #ifdef APP-PLUS
	import permision from '@/common/permission.js';
	// #endif
	export default {
		computed: {

		},
		components:{
		},
		data() {
			return {
				desvalue:'',
				imgList:[],
				imgListStr:[],
				clase:[],
				claseText:[],//分类数组文字
				claseIndex:0,
				claseVal:'',
				orderId:''
			};
		},
		onLoad(option) {
			this.orderId = option.id
			this.getOlase(option.id)
		},
		methods: {
			getOlase(id) {
				let that = this;
				that.$api('api.sCySale', {id}).then(res => {
					if (res.code === 1) {
						that.clase = res.data
						if(that.clase.length>0){
							this.claseVal = this.clase[this.claseIndex].content
							that.clase.forEach((item)=>{
								that.claseText.push(item.content)
							})
						}
					}
				});
			},
			onJoin(){
				let that = this;
				if(!that.desvalue){
					that.$tools.toast('请描述事件起因与经过');
					return
				}
				if(that.imgListStr.length == 0){
					that.$tools.toast('请选择图片');
					return
				}
				//图片，多张用逗号分隔
				let imgL = '';
				that.imgListStr.forEach((item)=>{
					imgL += item+','
				})
				let images = imgL.slice(0,imgL.length-1)
				
				that.$api('api.sCyafterSale', {
					id: that.orderId,
					reason: that.claseVal,
					content: that.desvalue,
					images: images
				}).then(res => {
					if (res.code === 1) {
						that.$tools.toast(res.msg);
						uni.$emit('myOrderTruequeList')
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							});
						},1000)
					}
				})
			},
			DelImg(index) {
				uni.showModal({
					title: '删除照片',
					content: '确定要删除这张照片么？',
					cancelText: '取消',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(index, 1);
							this.imgListStr.splice(index, 1);
						}
					}
				});
			},
			// 选择图片
			async onChooseImg() {
				let that = this;
				that.$tools.chooseImage(9).then(res => {
					res.forEach(img => {
						that.$tools.uploadImage('index/upload', img).then(res => {
							that.imgList.push(res.full_url);
							that.imgListStr.push(res.url);
						});
					});
				});
			},
			bindChangeClase(e){
				this.claseIndex  = e.target.value
				this.claseVal = this.clase[this.claseIndex].content
			},
		}
	};
</script>
<style lang="scss">
.bodyBox{
	.bodyBoxCore{
		padding: 0 30rpx;
		width: 100%;
		.coreBoxTop{
			margin-top: 20rpx;
		}
		.coreBox{
			background: #FFFFFF;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(231, 231, 231, 0.5);
			border-radius: 18rpx;
			.itemBoxB{
				border-bottom: 1rpx #EEEEEE solid;
			}
			.itemBox{
				padding: 0 30rpx;
				width: 100%;
				height: 120rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.itemTit{
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
				}
				.itemRig{
					width: 460rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					input{
						width: 410rpx;
						color: #C1C1C1;
					}
					.cred{
						color: #FF4623 !important;
					}
					picker{
						width: 410rpx;
						color: #C1C1C1;
						font-size: 32rpx;
					}
					.plInput{
						font-size: 32rpx;
						color: #C1C1C1;
					}
					
				}
			}
			.itemBox1{
				padding:30rpx;
				width: 100%;
				textarea{
					width: 100%;
					height: 200rpx;
				}
			}
			.img-box {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 20rpx;
				padding: 0 30rpx;
				.choose-img,
				.preview-box {
					width: 190rpx;
					height: 190rpx;
					margin-right: 25rpx;
					margin-bottom: 25rpx;
					position: relative;
					&:nth-child(3n) {
						margin-right: 0;
					}
					.cuIcon-cameraadd {
						font-size: 50rpx;
						color: #dfdfdf;
					}
					.preview-img {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
					.cuIcon-close {
						background: linear-gradient(90deg, rgba(216, 159, 100, 1), rgba(235, 193, 150, 1));
						border-radius: 50%;
						width: 40rpx;
						line-height: 40rpx;
						color: #fff;
						text-align: center;
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}
				}
			}
			
			
		}
	}
}
.coreBox2{
	position: fixed;
	bottom: 0;
	width: 100%;
	background: #FFFFFF;
	height: 130rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.btnYao{
	width: 690rpx;
	height: 90rpx;
	background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
	border-radius: 45rpx;
	padding: 0;
	color: #FFFFFF;
	font-size: bold;
}
</style>
