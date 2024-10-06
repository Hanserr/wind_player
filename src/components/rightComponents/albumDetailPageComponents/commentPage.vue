<template>
<div class="album-comment-page" ref="commentsRef" >
  <textarea maxlength="140" v-model="comment"></textarea>
  <button id="sendAlbumComment" @click="sendComment(comment)">发送</button>
  <div class="albumCommentContent" v-if="commentsList">
    <div class="albumCommentContent-son" v-for="i in commentsList" :key="i">
      <img :src="i.user.avatarUrl" alt="" class="albumCommentUserAvatar">
      <div class="albumCommentUserInfo">
        <span class="albumCommentUserNickname">{{i.user.nickname}}:</span>
        <span class="albumCommentUserComment">{{i.content}}</span>
      </div>
      <span class="albumCommentUserTime">{{format.commentTimeFormat(i.time)}}</span>
      <svg-icon name="thumbUp" class="albumThumbupComment" v-if="i.liked" @click="i.liked = false;--i.likedCount;isThumbUpComment(i.commentId,1)"></svg-icon>
      <svg-icon name="unThumbUp" class="albumThumbupComment" v-if="!i.liked" @click="i.liked = true;++i.likedCount;isThumbUpComment(i.commentId,0)"></svg-icon>
      <div class="albumCommentsDivider"></div>
    </div>
  </div>
</div>
</template>

<script setup>

import axios from "axios";
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import SvgIcon from "@/components/SvgIcon";
import api from "@/tools/apiCollection";
import format from "@/tools/format";

const route = useRoute()
let presentPageNo = 1 //当前评论页数
// eslint-disable-next-line no-unused-vars
let commentsList = ref([]) //评论列表
let commentsRef = ref(null)
let cancel = true
// eslint-disable-next-line no-unused-vars
let refreshCommentTimer = null //获取评论冷却时间
// eslint-disable-next-line no-undef
const props = defineProps(['tempScrollTop'])
let comment = ref() //评论

//获取评论
const getComments = (id) => {
    axios.get(`${api.GET_COMMENT_NEW}?type=3&id=${id}&sortType=2&pageNo=${presentPageNo}`).then(res => {
      if (res.data.code === 200){
        ++presentPageNo
        for(let i of res.data.data.comments){
          commentsList.value.push(i)
        }
      }else{
        ElMessage({
          message:'未能获取相关评论，请稍候再试',
          type:'error'
        })
      }
    })
}

//点赞或取消点赞评论
const isThumbUpComment = (cid,val) => {
  axios.get(`${api.LIKE_COMMENT}?id=${route.params.id}&cid=${cid}&t=${val}&type=3`).then(res => {
    if (res.data.code !== 200){
      ElMessage({
        message:'操作失败，请稍后再试',
        type:'error'
      })
    }
  })
}

//发送评论
const sendComment = (value) => {
    axios.get(`${api.COMMENT_SONG}?t=1&type=3&id=${route.params.id}&content=${value}`).then(res => {
      if (res.data.code !== 200){
        ElMessage({
          message:'发送失败，请稍后再试',
          type:'error'
        })
      }
    })
}

watch(() => props.tempScrollTop,next => {
  infiniteScroll(next)
})

// 歌曲评论懒加载
const infiniteScroll = (e) => {
  if (commentsRef.value.clientHeight - e < 800 && cancel){
    cancel = false
    getComments(route.params.id)
    refreshCommentTimer = setTimeout(() => {
      cancel = true
    },5000)
  }
}

onMounted(() => {
  getComments(route.params.id)
})
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/albumDetailPageComponentsCss/commentPage.css";
</style>
