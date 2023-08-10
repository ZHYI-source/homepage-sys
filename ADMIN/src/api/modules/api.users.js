import service from '../server'

export const usersList = (data) => {
    return service.post('/v1/sys/users/list', data)
}
export const usersCreate = (data) => {
    return service.post('/v1/sys/users/create', data)
}
export const usersUpdate = (data) => {
    return service.post('/v1/sys/users/update', data)
}
export const usersDelete = (data) => {
    return service.post('/v1/sys/users/delete', data)
}
// 重置密码
export const usersReset = (data) => {
    return service.post('/v1/sys/users/reset', data)
}
// 获取用户信息
export const usersFindOne = (data) => {
    return service.post('/v1/sys/users/findOne', data)
}


