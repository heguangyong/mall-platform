<template>
  <div class="layout-navbars-breadcrumb-user" :style="{ flex: layoutUserFlexNum }">
    <div class="layout-navbars-breadcrumb-user-icon" @click="refresh">
      <i class="el-icon-refresh-right" title="刷新"></i>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
      <i class="el-icon-search" title="菜单搜索"></i>
    </div>

    <!-- <div class="layout-navbars-breadcrumb-user-icon">
      <el-dropdown trigger="click" :hide-on-click="true" placement="top" @visible-change="getTodoList">
        <span class="item">
          <i class="el-icon-bell"></i>
          <i v-if="dealtList.length > 0" class="icon-tip"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="noticedrop">
          <el-dropdown-item class="clearfix">
            <el-tabs>
              <el-card v-if="dealtList.length > 0" class="box-card">
                <div slot="header" class="clearfix">
                  <span>系统通知</span>
                </div>
                <router-link
                  v-for="(item, i) in dealtList"
                  :key="i"
                  class="text item_content"
                  :to="{ path: item.path }"
                >
                  <div class="title">{{ item.title }}</div>
                  <div class="message">{{ item.message }}</div>
                </router-link>
                <div
                  v-if="list.length > 3 && list.length != dealtList.length"
                  class="moreBtn"
                  @click.stop="dealtList = list"
                >
                  展开全部<span class="el-icon-arrow-down"></span>
                </div>
              </el-card>
              <el-card v-else class="box-card">
                <div slot="header" class="clearfix">
                  <span>系统通知</span>
                </div>
                <div class="tab-empty">
                  <img src="@/assets/images/no-message.png" class="empty-img" alt="" />
                  <div class="empty-text">暂无系统通知</div>
                </div>
              </el-card>
            </el-tabs>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
    <div class="layout-navbars-breadcrumb-user-icon" @click="onScreenfullClick">
      <i
        :title="isScreenfull ? '关全屏' : '开全屏'"
        :class="!isScreenfull ? 'el-icon-full-screen' : 'el-icon-crop'"
      ></i>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon">
      <div class="platformLabel">平台</div>
    </div>
    <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onDropdownCommand">
      <span class="layout-navbars-breadcrumb-user-link">
        {{ getUserInfos.name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="users">个人中心</el-dropdown-item>
        <el-dropdown-item command="password">修改密码</el-dropdown-item>
        <el-dropdown-item divided command="logOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSetingClick">
      <i class="el-icon-setting" title="布局配置"></i>
    </div>
    <Search ref="searchRef" />
  </div>
</template>

<script>
import screenfull from 'screenfull';
import { Session, Local } from '@/utils/storage.js';
import UserNews from '@/layout/navBars/breadcrumb/userNews.vue';
import Search from '@/layout/navBars/breadcrumb/search.vue';
import Cookies from 'js-cookie';
// todo 消息
import { editFormApi } from '@/api/user';
export default {
  name: 'layoutBreadcrumbUser',
  components: { UserNews, Search },
  data() {
    return {
      isScreenfull: false,
      isShowUserNewsPopover: true,
      disabledI18n: 'zh-cn',
      disabledSize: '',
      isDot: false,
      label: {
        mer_name: 'admin',
      },
      list: [],
      dealtList: [],
    };
  },
  computed: {
    // 获取用户信息
    getUserInfos() {
      return this.$store.state.user;
    },
    // 设置弹性盒子布局 flex
    layoutUserFlexNum() {
      let { layout, isClassicSplitMenu } = this.$store.state.themeConfig.themeConfig;
      let num = '';
      if (layout === 'defaults' || (layout === 'classic' && !isClassicSplitMenu) || layout === 'columns') num = 1;
      else num = null;
      return num;
    },
  },
  mounted() {
    if (Local.get('JavaPlatThemeConfigPrev')) {
      this.initComponentSize();
    }
  },
  methods: {
    initIsDot(status) {
      this.isDot = status;
    },
    openNews() {
      // this.isShowUserNewsPopover = !this.isShowUserNewsPopover;
      this.isDot = false;
    },
    // 搜索点击
    onSearchClick() {
      this.$refs.searchRef.openSearch();
    },
    // 布局配置点击
    onLayoutSetingClick() {
      this.bus.$emit('openSetingsDrawer');
    },
    refresh() {
      this.bus.$emit('onTagsViewRefreshRouterView', this.$route.path);
    },
    // 全屏点击
    onScreenfullClick() {
      if (!screenfull.isEnabled) {
        this.$message.warning('暂不不支持全屏');
        return false;
      }
      screenfull.toggle();
      screenfull.on('change', () => {
        if (screenfull.isFullscreen) this.isScreenfull = true;
        else this.isScreenfull = false;
      });
      // 监听菜单 horizontal.vue 滚动条高度更新
      this.bus.$emit('updateElScrollBar');
    },
    // 初始化全局组件大小
    initComponentSize() {
      switch (Local.get('JavaPlatThemeConfigPrev').globalComponentSize) {
        case '':
          this.disabledSize = '';
          break;
        case 'medium':
          this.disabledSize = 'medium';
          break;
        case 'small':
          this.disabledSize = 'small';
          break;
        case 'mini':
          this.disabledSize = 'mini';
          break;
      }
    },
    // `dropdown 下拉菜单` 当前项点击
    onDropdownCommand(path) {
      if (path === 'logOut') {
        setTimeout(() => {
          this.$msgbox({
            closeOnClickModal: false,
            closeOnPressEscape: false,
            title: '提示',
            message: '此操作将退出登录, 是否继续?',
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '退出中';
                setTimeout(async () => {
                  await this.$store.dispatch('user/handleLogout');
                  this.$router.push(`/login?redirect=${this.$route.fullPath}`);
                  done();
                }, 150);
              } else {
                done();
              }
            },
          })
            .then(() => {
              // 清除缓存/token等
              Session.clear();
              // 使用 reload 时，不需要调用 resetRoute() 重置路由
              window.location.reload();
            })
            .catch(() => {});
        }, 150);
      } else {
        this.$router.push(`/operation/maintain/user/${path}`);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &-link {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &-photo {
      width: 30px;
      height: 30px;
      border-radius: 100%;
    }
  }

  i {
    line-height: 50px;
  }

  &-icon {
    padding: 0 10px;
    cursor: pointer;
    color: var(--prev-bg-topBarColor);
    line-height: 50px;
    display: flex;
    align-items: center;

    &:hover {
      background: var(--prev-color-hover);

      i {
        display: inline-block;
        animation: logoAnimation 0.3s ease-in-out;
      }
    }

    .item {
      position: relative;
    }

    .icon-tip {
      position: absolute;
      background: #f56464;
      width: 6px;
      height: 6px;
      border-radius: 100%;
      top: -1px;
      right: 0px;
    }

    .el-icon-bell {
      font-size: 15px;
      color: var(--prev-bg-topBarColor);
    }
  }

  & ::v-deep .el-dropdown {
    color: var(--prev-bg-topBarColor);
    cursor: pointer;
  }

  & ::v-deep .el-badge {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }

  & ::v-deep .el-badge__content.is-fixed {
    top: 12px;
  }
}

.platformLabel {
  display: inline-block;
  background: var(--prev-color-primary);
  color: #fff;
  vertical-align: text-bottom;
  font-size: 12px;
  padding: 0 8px;
  height: 26px;
  line-height: 26px;
  border-radius: 10px;
  position: relative;
  width: 40px;
}

.noticedrop {
  padding: 0;
}

.noticedrop .el-dropdown-menu {
  padding: 0;
}

.noticedrop .el-dropdown-menu__item {
  background-color: #ffffff;
  padding: 0;
  border-radius: 6px;
}

.item_content {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10px;
  line-height: 20px;
  font-size: 13px;
}

.item_content .title {
  color: #333333;
  font-weight: bold;
}

.item_content .message {
  color: #666666;
}

.moreBtn {
  color: #666666;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
}

::v-deep .el-card__body {
  padding: 0 24px 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 240px;
}

::v-deep .el-tabs__header {
  margin: 0;
}

::v-deep .el-card__header {
  padding: 10px 24px 0;
  font-weight: bold;
  border: none;
}

.tab-empty {
  text-align: center;
  margin-top: 15px;
}

.empty-text {
  color: #999999;
  font-size: 12px;
}

.empty-img {
  display: inline-block;
  width: 160px;
  height: 123px;
}
</style>
