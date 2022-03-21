import {createStore} from "vuex";

export default createStore({
    state:{
        searchResultList:'testAAA'
    },
    mutations:{
        setSearchResultList(state,result){
            state.searchResultList = result
        }
    },
    actions:{

    },
    getters:{
        getSearchResultList(state){
            return state.searchResultList
        }
    }
})