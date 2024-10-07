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

export default {
    GET_USER_FAILED,
    SECRET_WRONG,
    LOGIN_FAILED,
    CHECK_INPUT_STYLE,
    WRONG,
    GET_SONG_FAILED,
}