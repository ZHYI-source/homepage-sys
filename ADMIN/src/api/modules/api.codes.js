import service from '../server'

export const codesList = (data) => {
    return service.post('/v1/dev/codes/list', data)
}
export const codesDelete = (data) => {
    return service.post('/v1/dev/codes/delete', data)
}
export const codesDeleteAll = (data) => {
    return service.post('/v1/dev/codes/deleteAll', data)
}
export const codesDownload = (data) => {
    return service.get('/v1/dev/codes/download', data)
}
export const codesCollections = (data) => {
    return service.get('/v1/dev/codes/collections', data)
}
export const singleCurdFrontAndBack = (data) => {
    return service.post('/v1/dev/codes/singleCurdFrontAndBack', data)
}







