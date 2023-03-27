<template>
  <div>
    <van-picker title="性别" show-toolbar :columns="columns" :default-index="value" @confirm="onConfirm" @cancel="$emit('close')" @change="onChange" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user.js'

export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  methods: {
    onConfirm(value, index) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        updateUserProfile({
          gender: this.localGender
        })
        // 更新视图
        this.$emit('input', this.localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
    onChange(picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style lang="less" scoped></style>
