// 数据持久化

import {defineStore} from 'pinia';
import storage from '../libs/util.strotage.js'

export const useDbStore = defineStore('db', () => {
    function setSysInfo(value) {
        storage.sysSet(value)
    }

    function getSysInfo() {
        storage.sysGet()
    }

    function removeSysInfo() {
        storage.sysRemove()
    }

    function removeAllInfo() {
        storage.clear()
    }

    return {
        setSysInfo,
        getSysInfo,
        removeSysInfo,
        removeAllInfo
    };
});
