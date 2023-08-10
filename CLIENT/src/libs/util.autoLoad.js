/**
 * Created by truncate on 2017/10/2.
 * Author: 带鞋拖地
 * QQ: 327056088
 *
 * 《江畔独步寻花》· 杜甫
 * 黄四娘家花满蹊，千朵万朵压枝低。
 * 留连戏蝶时时舞，自在娇莺恰恰啼。
 */
export default function autoLoad(url, hasCallback) {
  return createScript(url)
  /**
   * 创建script
   * @param url
   * @returns {Promise}
   */
  function createScript(url) {
    const scriptElement = document.createElement('script')
    document.body.appendChild(scriptElement)
    const promise = new Promise((resolve, reject) => {
      scriptElement.addEventListener('load', e => {
        removeScript(scriptElement)
        if (!hasCallback) {
          resolve(e)
        } else {
          hasCallback()
        }
      }, false)
      scriptElement.addEventListener('error', e => {
        removeScript(scriptElement)
        reject(e)
      }, false)
      if (hasCallback) {
        window.____callback____ = function() {
          resolve()
          window.____callback____ = null
        }
      }
    })
    if (hasCallback) {
      url += '&callback=____callback____'
    }
    scriptElement.src = url
    return promise
  }
  /**
   * 移除script标签
   * @param scriptElement script dom
   */
  function removeScript(scriptElement) {
    document.body.removeChild(scriptElement)
  }
}
