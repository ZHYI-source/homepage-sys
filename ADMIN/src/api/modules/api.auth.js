import service from '../server'
// 验证码
export const authCaptcha = (data) => {
    return service.get('/v1/sys/auth/captcha', data)
}
// 登录
export const authLogin = (data) => {
    return service.post('/v1/sys/auth/login', data)
}
// 注册
export const authRegister = (data) => {
    return service.post('/v1/sys/auth/register', data)
}

