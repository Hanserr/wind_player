const api = {
    //------------------------------网易云API--------------------------------
    //获取搜索建议
    GET_SUGGEST_SEARCH:"http://localhost:3000/search/suggest",
    //获取歌曲详细信息
    GET_SONG_DETAIL:"http://localhost:3000/song/detail",
    //获取歌曲Url
    GET_SONG_URL:"http://localhost:3000/song/url",
    //获取歌词
    GET_LYRIC:"http://localhost:3000/lyric",
    //注销
    LOGOUT:"http://localhost:3000/logout",
    //获取歌曲评论
    GET_SONG_COMMENT:"http://localhost:3000/comment/music",
    //点赞或取消点赞歌曲评论1
    LIKE_COMMENT:"http://localhost:3000/comment/like",
    //评论歌曲
    COMMENT_SONG:"http://localhost:3000/comment",
    //每日签到
    DAILY_SIGNIN:"http://localhost:3000/daily_signin",
    //获取登陆二维码Unikey
    GET_LOGIN_QR_UNIKEY:"http://localhost:3000/login/qr/key",
    //获取登陆二维码base64编码
    GET_LOGIN_QR_BASE64:"http://localhost:3000/login/qr/create",
    //轮询登录二维码状态
    POLLING_LOGIN_QR_STATUS:"http://localhost:3000/login/qr/check",
    //获取账户信息
    GET_ACCOUNT_INFO:"http://localhost:3000/user/account",
    //获取用户详情
    GET_USER_DETAIL:"http://localhost:3000/user/detail",
    //获取歌单详情
    GET_PLAYLIST_DETAIL:"http://localhost:3000/playlist/detail",
    //收藏歌单
    COLLECT_PLAYLIST:"http://localhost:3000/playlist/subscribe",
    //收藏专辑
    SUB_ALBUM:"http://localhost:3000/album/sub",
    //获取手机验证码
    GET_CAPTCHA:"http://localhost:3000/captcha/sent",
    //验证手机验证码
    VERIFY_CAPTCHA:"http://localhost:3000/captcha/verify",
    //换绑手机
    REBIND_PHONE:"http://localhost:3000/rebind",
    //获取搜索结果
    SEARCH:"http://localhost:3000/cloudsearch",
    //获取FM
    GET_FM:"http://localhost:3000/personal_fm",
    //音乐垃圾桶
    MUSIC_TRASH:"http://localhost:3000/fm_trash",
    //喜欢歌曲
    LIKE_SONG:"http://localhost:3000/like",
    //获取首页轮播图
    GET_BANNER:"http://localhost:3000/banner",
    //获取日推歌单
    GET_DAILY_RECOMMEND_LIST:"http://localhost:3000/recommend/resource",
    //获取日推歌曲
    GET_DAILY_RECOMMEND_SONGS:"http://localhost:3000/recommend/songs",
    //获取登陆状态
    GET_LOGIN_STATUS:"http://localhost:3000/login/status",
    //获取动态
    GET_EVENT:"http://localhost:3000/event",
    //点赞资源  params:type 0: 歌曲  1: mv 2: 歌单 3: 专辑 4: 电台节目 5: 视频 6: 动态 7: 电台
    LIKE_RESOURCE:"http://localhost:3000/resource/like",
    //更新用户信息
    UPDATE_USER_INFO:"http://localhost:3000/user/update",
    //修改歌单信息
    UPDATE_PLAYLIST_INFO:"http://localhost:3000/playlist/update",
    //获取歌手部分信息
    GET_ARTIST_DETAIL:"http://localhost:3000/artists",
    //获取专辑
    GET_ALBUM:"http://localhost:3000/album",
    //获取用户歌单
    GET_USER_PLAYLIST:"http://localhost:3000/user/playlist",
    //获取歌手专辑
    GET_ARTIST_ALBUM:"http://localhost:3000/artist/album",
    //获取歌手的50首热门歌曲
    GET_ARTIST_TOP50_SONGS:"http://localhost:3000/artist/top/song",
    //获取相似歌手
    GET_SIMILAR_ARTIST:"http://localhost:3000/simi/artist",
    //新版评论接口
    GET_COMMENT_NEW:"http://localhost:3000/comment/new",
    //收藏的歌手
    SUBSCRIBED_ARTIST: "http://localhost:3000/artist/sublist",
    //收藏的专辑
    SUBSCRIBED_ALBUM: "http://localhost:3000/album/sublist",
    //------------------------------网易云API--------------------------------

    //---------------------------后端数据处理API------------------------------
    //用户首次登陆后将uid存入数据库 uid
    PUSH_USER_INFO_TO_SERVER: "http://localhost:8080/usertotheme/check",
    //获取配色方案
    GET_COLOR_SET: "http://localhost:8080/usertheme/getall",
    //根据获取配色方案
    GET_COLOR_SET_BY_TID: "http://localhost:8080/usertheme/get",
    //上传用户自定义的配色方案
    UPLOAD_CUSTOM_COLOR: "http://localhost:8080/usertheme/insert",
    //删除当前用户配置颜色方案 tid uid
    DELETE_CUSTOM_COLOR: "http://localhost:8080/usertheme/delete",
    //修改当前的配色方案
    ALTER_CUR_SET: "http://localhost:8080/usertotheme/settheme"
    //---------------------------后端数据处理API------------------------------
}
export default api