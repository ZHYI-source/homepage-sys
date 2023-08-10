/**
*@author ZY
*@date 2023/8/6 下午10:16:02
*@Description:作品集相关的接口
*/

const express = require('express');
const router = express.Router();

const PortfoliosController = require('@controllers/v1/blog/PortfoliosController')


/****************************************************************************/

/**
* 获取作品集列表
* @route POST /v1/blog/portfolios/list
* @group 作品集管理 - 作品集相关
*/

router.post('/list', PortfoliosController.portfolioslist);

/**
* 创建作品集
* @route POST /v1/blog/portfolios/create
* @group 作品集管理 - 作品集相关
* @returns {object} 200 - 成功响应
*/

router.post('/create', PortfoliosController.portfoliosCreate);


/**
* 删除作品集
* @route POST /v1/blog/portfolios/delete
* @group 作品集管理 - 作品集相关
* @param {string} _id.required - 作品集_ID且唯一
* @returns {object} 200 - 成功响应
*/
router.post('/delete', PortfoliosController.portfoliosDelete);

/**
* 更新作品集信息
* @route POST /v1/blog/portfolios/update
* @group 作品集管理 - 作品集相关
*/
router.post('/update', PortfoliosController.portfoliosUpdate);

/********************前台客户端*****************************/
/**
 * 获取作品集列表
 * @route POST /v1/blog/portfolios/client/list
 * @group 作品集管理 - 作品集相关
 */

router.post('/client/list', PortfoliosController.portfoliosClientlist);

module.exports = router;
