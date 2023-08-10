import service from '../server'

export const rolesList = (data) => {
    return service.post('/v1/sys/roles/list', data)
}
export const rolesCreate = (data) => {
    return service.post('/v1/sys/roles/create', data)
}
export const rolesUpdate = (data) => {
    return service.post('/v1/sys/roles/update', data)
}
export const rolesDelete = (data) => {
    return service.post('/v1/sys/roles/delete', data)
}
export const rolesFindOne = (data) => {
    return service.post('/v1/sys/roles/findOne', data)
}

