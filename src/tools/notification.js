import {ElMessage} from "element-plus";

const GET_USER_FAILED = () => {
    ElMessage({
        type: 'error',
        message: '获取用户状态失败，请稍后再试'
    })
}

const SECRET_WRONG = () => {
    ElMessage({
        message:"手机号或密码错误",
        type:"error"
    })
}

const LOGIN_FAILED = () => {
    ElMessage({
        message:"登陆失败，请稍后重试",
        type:"error"
    })
}

const CHECK_INPUT_STYLE = () => {
    ElMessage({
        message:"请检查输入内容的格式",
        type:"warning"
    })
}

const WRONG = () => {
    ElMessage({
        message:"出错啦，请稍后再试",
        type:"error"
    })
}

const GET_SONG_FAILED = () => {
    ElMessage({
        message:"获取歌曲信息失败",
        type:"error"
    })
}

const GET_ARTIST_FAILED = () => {
    ElMessage({
        message:"获取歌手信息失败",
        type:"error"
    })
}

const SET_NEW_USER_INFO_SUCCESS = () => {
    ElMessage({
        message:"修改成功!",
        type:"success"
    })
}

const SET_NEW_USER_INFO_FAILED = () => {
    ElMessage({
        message:"修改失败!",
        type:"error"
    })
}

const GET_SUBSCRIBED_FAILED = () => {
    ElMessage({
        message:"获取收藏列表失败",
        type: "error"
    })
}

const LESS_COLOR = () => {
    ElMessage({
        message:"请同时设置两个配色",
        type:"warning"
    })
}

export default {
    GET_USER_FAILED,
    SECRET_WRONG,
    LOGIN_FAILED,
    CHECK_INPUT_STYLE,
    WRONG,
    GET_SONG_FAILED,
    GET_ARTIST_FAILED,
    SET_NEW_USER_INFO_SUCCESS,
    SET_NEW_USER_INFO_FAILED,
    GET_SUBSCRIBED_FAILED,
    LESS_COLOR,
}