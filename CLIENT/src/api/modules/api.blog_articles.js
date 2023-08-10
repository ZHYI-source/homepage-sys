import service from '../server'

export const blog_articlesList = (data) => {
    return service.post('/v1/blog/blog_articles/client/list', data)
}
export const blog_articlesDetail = (data) => {
    return service.post('/v1/blog/blog_articles/client/detail', data)
}
export const blog_articlesRelate = (data) => {
    return service.post('/v1/blog/blog_articles/client/relate', data)
}
export const blog_articlesLike = (data) => {
    return service.post('/v1/blog/blog_articles/client/like', data)
}




