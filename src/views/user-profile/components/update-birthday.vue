<template>
  <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" @cancel="$emit('close')" @confirm="onConfirm" />
</template>

<script>
import { updateUserProfile } from '@/api/user.js'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },

  mounted() {},

  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: currentDate
        })
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
