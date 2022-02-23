<template>
	<view>
		<u-popup v-model="show" mode="center"  border-radius="14" closeable="true">
			<view class="coerPop">
				<view class="popTxt">当前小程序已过期，请跳转到e客小店{{site}}</view>
				<view class="btnBox">
					<button @click="goJs" class="cu-btn bg-red margin-tb-sm lg">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				show : true
			};
		},
		computed: {},
		props: {
			site:''
		},
		methods: {
			goJs(){
				wx.navigateToMiniProgram({
				  appId: 'wxca4b29b073dab8c5',
				  path: '',
				  extraData: {
				    foo: ''
				  },
				  envVersion: 'develop',
				  success(res) {
				  }
				})
			}
		}
	};
</script>

<style lang="scss">
	.coerPop{
		padding:20rpx;
		.popTxt{
			padding-top: 70rpx;
			padding-bottom: 20rpx;
		}
		.btnBox{
			display: flex;
			justify-content: center;
		}
	}
</style>
