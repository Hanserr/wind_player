import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import axios from "axios";
import api from "@/tools/apiCollection";
import notification from "@/tools/notification";
import format from "@/tools/format"

export const useSongStore = defineStore('Song', () => {
    //待播放歌曲列表
    const songList = ref([])
    //当前播放的歌曲在列表中的位置
    const curIndexInList = ref(0)
    //当前播放的歌曲信息
    const curSong = ref({
        id:null,
        name:null,
        src:null,
        cover:null,
        artist:null,
        album:null,
        duration:null,
        currentTime:null,
        lyric:null, //歌词
        transUser:null, //翻译提供者
        total:-1, //评论数
        hotComments:[],
        comments:[],
        canGetHotComment: true
    });
    //歌曲加载状态
    const songHasLoaded = ref(false);
    //全局audio组件
    const shareAudio = ref(null)

    const getSongList = () => computed(() => {return songList.value})
    const getCurSong = () => computed(() => {return curSong.value})
    const getCurIndexInList = () => computed(() => {return curIndexInList.value})

    //接收audio实例
    function initAudio(ref) {
        shareAudio.value = ref
    }

    //更新歌曲列表
    const updateSongList = (data) => {
        songList.value = []
        for(let i of data) {
            songList.value.push(i)
        }
    }

    //更新待播放列表中歌曲位置
    const updateIndexInList = (index) => {
        curIndexInList.value = index
    }

    //清空歌曲列表
    const clearSongList = () => {
        songList.value = []
    }

    //更新当前歌曲信息
    function updateCurSong(id){
        //清空当前歌曲信息
        shareAudio.value.pause()
        songHasLoaded.value = false
        clearCurSong()
        curSong.value.id = id
        Promise.all([
            //获取新歌曲详情
            axios.get(`${api.GET_SONG_DETAIL}?ids=${id}`),
            //获取播放地址
            axios.get(`${api.GET_SONG_URL}?id=${id}`),
            //获取并整合歌词
            axios.get(`${api.GET_LYRIC}?id=${id}`)
        ]).then(([detail, songUrl, res]) => {
            if (detail.data.code === 200) {
                curSong.value.cover = detail.data.songs[0].al.picUrl
                curSong.value.artist = detail.data.songs[0].ar
                curSong.value.name = detail.data.songs[0].name
                curSong.value.album = detail.data.songs[0].al
            } else {
                getSongFailed()
                return
            }
            if (songUrl.data.code === 200) {
                curSong.value.src = songUrl.data.data[0].url
            } else {
                getSongFailed()
                return
            }
            if (res.data.code === 200){
                let lyric = (res.data.lrc.lyric).toString().split('\n')
                for (let i in lyric){
                    let lyricList = lyric[i].split(']')
                    lyric[i] = {time: format.lyricTimeFormat(lyricList[0]+']'),content:lyricList[1],tlyric:null}
                }
                let tempTLyric = []
                if (res.data.tlyric && res.data.tlyric.lyric.length>=1){
                    let tlyric = (res.data.tlyric.lyric).toString().split('\n')
                    let tlyricReg = /^\[[0-9]{2}:[0-9]{2}\.[0-9]{2,3}$/
                    for (let i = 0;i<tlyric.length;i++){
                        let tlyricList = tlyric[i].split(']')
                        //去空
                        if (tlyricReg.test(tlyricList[0])){
                            tempTLyric.push({time: format.lyricTimeFormat(tlyricList[0]+']'),content:tlyricList[1]})
                        }
                    }
                    let tlyricSum = 0
                    for (let a = 0;a < lyric.length-1;a++){
                        if (lyric[a].time === tempTLyric[tlyricSum].time) {
                            lyric[a].tlyric = "\n"+tempTLyric[tlyricSum].content
                            tlyricSum === tempTLyric.length-1?tlyricSum = tempTLyric.length-1:tlyricSum++
                        }
                    }
                }
                lyric.splice(lyric.length-1,1)
                curSong.value.lyric = lyric
                curSong.value.transUser = res.data.transUser
            } else {
                getSongFailed()
            }
        }).catch(([err1, err2, err3]) => {
            console.log(err1)
            console.log(err2)
            console.log(err3)
        })
        songHasLoaded.value = true
        shareAudio.value.play()
    }

    //清空当前歌曲信息
    function clearCurSong(){
        curSong.value.id = null
        curSong.value.name = null
        curSong.value.src = null
        curSong.value.cover = null
        curSong.value.artist = null
        curSong.value.album = null
        curSong.value.duration = null
        curSong.value.currentTime = null
        curSong.value.lyric = null
        curSong.value.transUser = null
        curSong.value.total = -1
        curSong.value.hotComments = []
        curSong.value.comments = []
        curSong.value.canGetHotComment = true
    }

    //获取歌曲信息失败
    function getSongFailed() {
        clearCurSong()
        notification.ERROR_INFO("获取歌曲信息失败")
    }

    return {
        curSong,
        songHasLoaded,
        shareAudio,
        getSongList,
        clearSongList,
        getCurSong,
        getCurIndexInList,
        updateSongList,
        updateCurSong,
        updateIndexInList,
        initAudio,
    }
})