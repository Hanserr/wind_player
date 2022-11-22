import {defineStore} from 'pinia'
import axios from "axios";
import Cookies from "js-cookie";
import {ElMessage} from "element-plus";

export const Auth = defineStore('auth',{
    state:() => {
        return {
            cookie: [],
            user: {
                userId:'', //用户ID
                nickname:'', //昵称
                avatarUrl:'', //头像
                city:'', //所在城市
                birthday:'', //生日
                signature:'', //签名
                eventCount: 0, //动态数
                follows: 0, //关注人数
                followeds: 0 //关注我的人数
            }
        }
    },
    getters:{
        getUID(){
            return this.user.userId;
        },
    },
    actions:{
        //  保存用户信息
        saveUserInfo(userId,nickname,avatarUrl,city,birthday,signature,eventCount,follows,followeds){
            this.user.userId = userId;
            this.user.nickname = nickname;
            this.user.avatarUrl = avatarUrl;
            this.user.city = city;
            this.user.birthday = birthday;
            this.user.signature = signature;
            this.user.eventCount = eventCount;
            this.user.follows = follows;
            this.user.followeds = followeds;
        },
        //处理Cookie
        processCookie(cookie){
            const REG_CSRF = /__csrf=.*[Path=/.;]?/g
            const REG_MU = /MUSIC_U=.*[HTTPOnly;]?/g
            this.cookie.push(cookie.match(REG_CSRF))
            this.cookie.push(cookie.match(REG_MU))
            this.saveCookie(this.cookie)
        },
        // 保存Cookie
        saveCookie(inpVal){
            for (let i of inpVal){
                let d = i.split(';')
                let name = d[0].split('=')[0]
                let val = d[0].split('=')[1]
                let expire = new Date(d[2].split('=')[1])
                let p = d[3].split('=')[1]
                Cookies.set(name,val,{
                    expires:expire,
                    path:p
                })
            }
        },
        // 获取/刷新用户登录状态
        getUserStatus(){
            axios.get(`/login/status?timestamp=${Date.now()}`).then(res => {
                if (res.data.data.code === 200){
                    this.saveUserInfo(
                        res.data.data.profile.userId,
                        res.data.data.profile.nickname,
                        res.data.data.profile.avatarUrl,
                        res.data.data.profile.city,
                        res.data.data.profile.birthday,
                        res.data.data.profile.signature,
                        res.data.data.profile.eventCount,
                        res.data.data.profile.follows,
                        res.data.data.profile.followeds
                    )
                    return true
                }else{
                    ElMessage({
                        message:'获取用户状态失败，请稍后再试',
                        type:'error'
                    })
                    return false
                }
            })
        },
    }
})
