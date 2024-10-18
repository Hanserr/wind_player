import {defineStore} from "pinia";
import {ref} from "vue";

export const useThemeStore = defineStore('theme',() => {
    const pageTheme = ref({
        topAndBottomColor:'#212121',
        middleColor: '#2b2b2b',
        tid: null
    })
    const updateTheme = (TABColor, MColor, tid) => {
        pageTheme.value.topAndBottomColor = TABColor
        pageTheme.value.middleColor = MColor
        pageTheme.value.tid = tid
    }

    const resetTheme = () => {
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