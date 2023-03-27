<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 导航栏 -->

    <input type="file" hidden ref="file" @change="onFileChange" />

    <!-- 个人信息 -->
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true"></van-cell>
    <van-cell title="性别" :value="user.gender === 1 ? '女' : '男'" is-link @click="isUpdateGenderShow = true"></van-cell>
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdatebirShow = true"></van-cell>
    <!-- 个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNameShow" style="height: 100%" position="bottom">
      <UpdateName v-if="isUpdateNameShow" v-model="user.name" @close="isUpdateNameShow = false"></UpdateName>
    </van-popup>
    <!-- 编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <UpdateGender v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow = false"></UpdateGender>
    </van-popup>
    <!-- 编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdatebirShow" position="bottom">
      <UpdateBirthday v-if="isUpdatebirShow" v-model="user.birthday" @close="isUpdatebirShow = false"></UpdateBirthday>
    </van-popup>
    <!-- 编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" style="height: 100%" position="bottom">
      <UpdatePhoto v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event"></UpdatePhoto>
    </van-popup>
    <!-- 编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/uopdate-photo.vue'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },

  data() {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdatebirShow: false,
      isUpdatePhotoShow: false,
      img: null // 预览的图片
    }
  },

  created() {
    this.loadUserProfile()
  },

  mounted() {},

  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取blob数据
      const data = window.URL.createObjectURL(file)
      // console.log(data)
      this.img = data
      this.isUpdatePhotoShow = true

      // file-input如果选了同一个文件不会触发change事件，解决办法就是每次使用后，将value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
