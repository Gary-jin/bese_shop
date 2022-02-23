<template>
	<view>
		<sh-scratch-card refs="card" @complete="seatShow" :disabled="false" title="刮开获得奖励" watermark="刮刮乐">
			<!-- 刮刮后将显示的内容 -->
			<view>
				<view class="cardCore">恭喜获得一等奖</view>
			</view>
		</sh-scratch-card>
		<button @click="reset">重置</button>
	</view>

</template>

<script>
	import shScratchCard from "../children/sh-scratch-card.vue"
	export default {
		components: {
			shScratchCard
		},
		data() {
			return {}
		},
		onLoad() {},
		mounted() {

		},
		methods: {
			reset: function() {
				let that = this;
				// that.$refs.card.init();
				uni.$emit('scratchInit')
			},

			seatShow: function() {
				uni.showToast({
					title: '成功',
					icon: 'success'
				});
			}
		}
	}
</script>

<style lang="scss">
	.cardCore {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		height: 200rpx;
	}
</style>
