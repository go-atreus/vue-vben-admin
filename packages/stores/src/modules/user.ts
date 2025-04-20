import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: string[];
  indexConfig: {};
  defaultOption: {};
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
    indexConfig: {
      leftBottomSwiper: true, //左轮播
      rightBottomSwiper: true, //右下轮播
    },
    defaultOption: {
      step: 4, // 数值越大速度滚动越快
      hover: true, // 是否开启鼠标悬停stop
      wheel: false, //在开启鼠标悬停的情况下是否开启滚轮滚动，默认不开启
      openWatch: true, // 开启数据实时监控刷新dom
      direction: 1, // 0向下 1向上 2向左 3向右
      limitScrollNum: 4, // 开始无缝滚动的数据量 this.dataList.length
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      singleWaitTime: 3000, // 单步运动停止的时间(默认值1000ms)
    },
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
