import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import api from "@/tools/apiCollection";
import axios from "axios";
import Notification from "@/tools/notification";

export const useUserStore = defineStore('User', () => {
    const userInfo = ref({
        userId:'', //用户ID
        nickname:'', //昵称
        avatarUrl:'', //头像
        city:'', //所在城市
        birthday:'', //生日
        signature:'', //签名
        eventCount: 0, //动态数
        follows: 0, //关注人数
        follower: 0 //关注我的人数
    })
    const hasLogin = ref(false);

    const getUserInfo = () => computed(() => {return userInfo.value})
    const getLoginStatus = () => computed(() => {return hasLogin.value})

    //每次登陆或进入网页时判断是否已登陆
    const updateUserInfo = async () => {
        let fetchUserStatus = await axios.get(`${api.GET_LOGIN_STATUS}?timestamp=${Date.now()}`)
        if (fetchUserStatus.data.data.code === 200){
            axios.get(`${api.GET_USER_DETAIL}?uid=${fetchUserStatus.data.data.profile.userId}`).then(res => {
                if (res.data.code === 200){
                    userInfo.value.userId = res.data.profile.userId
                    userInfo.value.nickname = res.data.profile.nickname
                    userInfo.value.avatarUrl =  res.data.profile.avatarUrl
                    userInfo.value.city =  res.data.profile.city
                    userInfo.value.birthday =  res.data.profile.birthday
                    userInfo.value.signature = res.data.profile.signature
                    userInfo.value.eventCount = res.data.profile.eventCount
                    userInfo.value.follows = res.data.profile.follows
                    userInfo.value.follower = res.data.profile.followeds
                    hasLogin.value = true
                }else{
                   Notification.GET_USER_FAILED()
                }
            }).catch(() => {
                Notification.GET_USER_FAILED()
            })
        }else{
            Notification.GET_USER_FAILED()
        }
    }

    //清除用户数据
    const clearUserInfo = () => {
        userInfo.value.userId = ''
        userInfo.value.nickname = ''
        userInfo.value.avatarUrl =  ''
        userInfo.value.city =  ''
        userInfo.value.birthday =  ''
        userInfo.value.signature = ''
        userInfo.value.eventCount = 0
        userInfo.value.follows = 0
        userInfo.value.follower = 0
        hasLogin.value = false
    }

    return {
        getUserInfo,
        getLoginStatus,
        updateUserInfo,
        clearUserInfo,
    }
})