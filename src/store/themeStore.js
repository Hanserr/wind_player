import {defineStore} from "pinia";
import {ref} from "vue";

export const useThemeStore = defineStore('theme',() => {
    const pageTheme = ref({
        uid: null,
        topAndBottomColor:'#212121',
        middleColor: '#2b2b2b',
        tid: null
    })
    const updateTheme = (uid, TABColor, MColor, tid) => {
        pageTheme.value.uid = uid
        pageTheme.value.topAndBottomColor = TABColor
        pageTheme.value.middleColor = MColor
        pageTheme.value.tid = tid
    }

    const resetTheme = () => {
        pageTheme.value.uid = null
        pageTheme.value.topAndBottomColor = '#212121'
        pageTheme.value.middleColor = '#2b2b2b'
        pageTheme.value.tid = null
    }
    return {
        pageTheme,
        updateTheme,
        resetTheme,
    }
})