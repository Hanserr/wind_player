import {defineStore} from "pinia";
import {ref} from "vue";

export const useThemeStore = defineStore('theme',() => {
    const pageTheme = ref({
        uid: -1,
        topAndBottomColor:'#212121',
        middleColor: '#2b2b2b',
        tid: -1
    })
    const updateTheme = (uid, TABColor, MColor, tid) => {
        pageTheme.value.uid = uid
        pageTheme.value.topAndBottomColor = TABColor
        pageTheme.value.middleColor = MColor
        pageTheme.value.tid = tid
    }

    const resetTheme = () => {
        pageTheme.value.uid = -1
        pageTheme.value.topAndBottomColor = '#212121'
        pageTheme.value.middleColor = '#2b2b2b'
        pageTheme.value.tid = -1
    }
    return {
        pageTheme,
        updateTheme,
        resetTheme,
    }
})