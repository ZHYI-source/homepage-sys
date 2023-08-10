import service from '../server'
export const blog_articlesList = (data) => {
    return service.post('/v1/blog/blog_articles/list', data)
}
export const blog_articlesCreate = (data) => {
    return service.post('/v1/blog/blog_articles/create', data)
}
export const blog_articlesUpdate = (data) => {
    return service.post('/v1/blog/blog_articles/update', data)
}
export const blog_articlesDelete = (data) => {
    return service.post('/v1/blog/blog_articles/delete', data)
}
export const blog_articlesUploadMd = (data) => {
    return service.post('/v1/blog/blog_articles/uploadMd', data)
}




