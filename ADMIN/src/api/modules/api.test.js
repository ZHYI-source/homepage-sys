import service from '../server'

export const uploadImg = (data) => {
    return service.post('/v1/common/files/upload/img', data)
}
// 导出需要指定响应类型未blob
export const users_opt_logsExport = (data) => {
    return service.post('/v1/sys/users_opt_logs/export', data,null,'blob')
}
// 导入
export const users_opt_logsImport = (data) => {
    return service.post('/v1/sys/users_opt_logs/import', data)
}
// 导出模板
export const users_opt_logsDownloadTemplate = (data) => {
    return service.post('/v1/sys/users_opt_logs/downloadTemplate', data,null,'blob')
}




