const state = {
    categoryText: null
}

const mutations = {
    SET_CATEGORYTEXT: (state, categoryText) => {
        state.categoryText = categoryText
      },
}

const actions = {
    changeCategoryText({ commit }, data) {
        commit('SET_CATEGORYTEXT', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

