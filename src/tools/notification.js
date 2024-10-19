import {ElMessage} from "element-plus";

const SUCCESS_INFO = (info) => {
    ElMessage({
        message: info,
        type:"success",
        plain: true,
    })
}

const WARNING_INFO = (info) => {
    ElMessage({
        message: info,
        type:"warning",
        plain: true,
    })
}
const NORMAL_INFO = (info) => {
    ElMessage({
        message: info,
        type:"info",
        plain: true,
    })
}
const ERROR_INFO = (info) => {
    ElMessage({
        message: info,
        type:"error",
        plain: true,
    })
}

export default {
    SUCCESS_INFO,
    WARNING_INFO,
    ERROR_INFO,
    NORMAL_INFO
}