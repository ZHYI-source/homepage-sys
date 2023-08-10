import service from '../server'
export const resourcesList = (data) => {
    return service.post('/v1/sys/resources/list', data)
}
export const resourcesCreate = (data) => {
    return service.post('/v1/sys/resources/create', data)
}
export const resourcesUpdate = (data) => {
    return service.post('/v1/sys/resources/update', data)
}
export const resourcesDelete = (data) => {
    return service.post('/v1/sys/resources/delete', data)
}




