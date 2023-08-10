import service from '../server'
export const portfoliosList = (data) => {
    return service.post('/v1/blog/portfolios/list', data)
}
export const portfoliosCreate = (data) => {
    return service.post('/v1/blog/portfolios/create', data)
}
export const portfoliosUpdate = (data) => {
    return service.post('/v1/blog/portfolios/update', data)
}
export const portfoliosDelete = (data) => {
    return service.post('/v1/blog/portfolios/delete', data)
}




