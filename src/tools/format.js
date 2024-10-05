//歌词时间格式化
const lyricTimeFormat = (time) => {
    let temp = time.slice(1,time.length-1)
    let tList = temp.split(':')
    let min = tList[0]
    let sec = tList[1]
    return min*60+sec*1
}

export default {
    lyricTimeFormat
}