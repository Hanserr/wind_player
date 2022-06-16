import {router} from "@/router/routes";
import Cookies from "js-cookie";

//跳转至歌手页
const toArPage = (id) => {
    if (!id)
        return
     router.push({
        name: 'artistAlbumInfo',
        params: {
            arID: id
        }
    })
}

//跳转至专辑详情页
const toAlbumDetail = (id) => {
     router.push(`/albumDetail/songlistPage/${id}`)
}

//跳转至歌单创建者页面
const toCreator = (id) => {
     router.push({
        name:'creation',
        params:{
            uid:id
        }
    })
}

//跳转至修改歌单页面
const toAlterSongList = (id) => {
     router.push({
        name:'editSongListInfo',
        params:{
            editSongListInfoId:id
        }
    })
}

//跳转至创建的歌单
const toCreation = () => {
     router.push({
        name:'creation',
        params:{
            uid:id.value
        }
    })
}

//跳转至收藏的歌单
const toCollected = () => {
    router.push({
        name:'collected',
        params:{
            uid:id.value
        }
    })
}

//跳转至歌单详情页
const toSongListDetail = (id) => {
    if (id !== -1 && id !== ''){
        router.push({
            name:'songListDetailPage',
            params:{
                songListId:id
            }
        })
    }else if(id === -1){
        if (!Cookies.get('MUSIC_U'))
            return
        router.push('/dailyRecommendation')
    }
}

export default {
    toArPage,
    toAlbumDetail,
    toCreator,
    toAlterSongList,
    toCreation,
    toCollected,
    toSongListDetail,
}
