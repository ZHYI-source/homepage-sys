
import { ref, computed} from 'vue';

const currentState = ref('login');

export function useLoginState(){
    function setLoginState(state) {
        currentState.value = state;
    }

    const getLoginState = computed(() => currentState.value);

    function handleBackLogin() {
        setLoginState('login');
    }

    return { setLoginState, getLoginState, handleBackLogin };
}
