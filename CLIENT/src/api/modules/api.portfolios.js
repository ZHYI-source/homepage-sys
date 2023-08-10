import service from '../server'

export const portfoliosList = (data) => {
    return service.post('/v1/blog/portfolios/client/list', data)
}
export const blog_articlesDetail = (data) => {
    return service.post('/v1/blog/portfolios/client/detail', data)
}





