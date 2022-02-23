<template>
	<view class="sh-richtext-box pa20 mb20 mx20" v-if="richText.content"><u-parse :html="richText.content"></u-parse></view>
</template>

<script>
	/**
	 * 自定义之富文本卡片 局部
	 * @property {String} richText - 富文本信息
	 */
export default {
	components: {
	},
	data() {
		return {
			richText: ''
		};
	},
	computed: {},
	props: {
		detail: {
			type: Object,
			default: null
		}
	},
	created() {
		this.detail.id && this.getRichText();
	},
	methods: {
		getRichText() {
			this.$api('richtext', {
				id: this.detail.id
			}).then(res => {
				this.richText = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
.sh-richtext-box {
	background: #fff;
	padding: 20rpx;
	border-radius: 20rpx;
	overflow: hidden;
}
</style>
