//歌词时间格式化
const lyricTimeFormat = (time) => {
    let temp = time.slice(1,time.length-1)
    let tList = temp.split(':')
    let min = tList[0]
    let sec = tList[1]
    return min*60+sec*1
}

//评论时间格式化
const commentTimeFormat = (val) => {
    if (val === null){
        return ''
    }else {
        let date = new Date(val)
        let y = date.getFullYear()
        let m = date.getMonth()+1 < 10?'0'+(date.getMonth()+1):date.getMonth()+1
        let d = date.getDate() < 10?'0'+date.getDate():date.getDate()
        let H = date.getHours() < 10?'0'+date.getHours():date.getHours()
        let mm = date.getMinutes() < 10?'0'+date.getMinutes():date.getMinutes()
        return `${y}年${m}月${d}日 ${H}:${mm}`
    }
}

//歌曲时长格式化
const durationFormat = (val) => {
    let time = Math.floor(val/1000)
    let min = Math.floor(time/60)
    min = min < 10?'0'+min:min
    let sec = time%60
    sec = sec < 10?'0'+sec:sec
    return `${min}:${sec}`
}

//时间格式化
const dateFormat = (val) => {
    if (val === null){
        return ''
    }else {
        let date = new Date(val)
        let y = date.getFullYear()
        let m = date.getMonth()+1
        m = m < 10?'0'+m:m
        let d = date.getDate()
        d = d < 10?'0'+d:d
        return `${y}-${m}-${d}`
    }
}

export default {
    lyricTimeFormat,
    commentTimeFormat,
    durationFormat,
    dateFormat,
}