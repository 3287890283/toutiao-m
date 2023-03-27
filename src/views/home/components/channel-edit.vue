<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button class="edit-btn" type="danger" plain round size="mini" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in myChannels" :key="index" @click="onMychannelClick(channel, index)">
        <van-icon v-show="isEdit && !fixedChannels.includes(channel.id)" slot="icon" name="clear"></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item v-for="(c, index) in recommendChannels" :key="index" :text="c.name" class="grid-item" icon="plus" @click="onAddChannel(c)" />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示
      fixedChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((mychannel) => mychannel.id === channel.id)
      })
      // const channels = []
      // this.allChannels.forEach((channel) => {
      //   const ret = this.myChannels.find((myChannel) => {
      //     return channel.id === myChannel.id
      //   })
      //   // 没找到
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // return channels
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onAddChannel(channel) {
      // eslint-disable-next-line vue/no-mutating-props
      this.myChannels.push(channel)

      // 数据持久化处理
      if (!this.user) {
        // 未登录，把数据储存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      } else {
        // 已登录，用数据请求接口放到线上
        try {
          addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      }
    },
    onMychannelClick(channel, index) {
      if (this.isEdit) {
        // 编辑状态就执行删除频道；
        // 1 固定状态不删除
        if (this.fixedChannels.includes(channel.id)) {
          return
        }

        // 2 如果删除的是激活频道之前的频道，则需要进行如下操作
        // eslint-disable-next-line vue/no-mutating-props
        if (index <= this.active) {
          // 让激活频道的索引 - 1
          this.$emit('update-active', this.active - 1)
        }

        // 3 删除频道
        // eslint-disable-next-line vue/no-mutating-props
        this.myChannels.splice(index, 1)

        // 4 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态就执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(channel) {
      if (this.user) {
        // 已登录，将数据更新到线上
        try {
          await deleteUserChannel(channel.id)
        } catch (err) {
          this.$toast('操作失败，请稍后重试')
        }
      } else {
        // 未登录，将数据更新到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
      }
      .van-grid-item__text {
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        white-space: nowrap;
        flex-direction: row;
        .van-grid-item__icon {
          margin-right: 6px;
          font-size: 28px;
        }
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
}
</style>
