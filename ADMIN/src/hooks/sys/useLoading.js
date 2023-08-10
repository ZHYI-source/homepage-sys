import {ref, computed} from 'vue';

const showLoading = ref(false);

export function useShowLoading() {
    function setLoadingState(state) {
        showLoading.value = state;
    }

    const getLoadingState = computed(() => showLoading.value);


    return {setLoadingState, getLoadingState};
}
