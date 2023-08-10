/**
 *@author ZY
 *@date 2023/7/17 下午1:26:24
 *@Description:博文管理相关的接口
 */

const express = require('express');
const router = express.Router();

const Blog_articlesController = require('@controllers/v1/blog/Blog_articlesController')


/****************************************************************************/

/**
 * 获取博文管理列表

 * @route POST /v1/blog/blog_articles/list
 * @group 博文管理管理 - 博文管理相关
 */

router.post('/list', Blog_articlesController.blog_articleslist);

/**
 * 创建博文管理
 * @route POST /v1/blog/blog_articles/create
 * @group 博文管理管理 - 博文管理相关
 * @returns {object} 200 - 成功响应
 */

router.post('/create', Blog_articlesController.blog_articlesCreate);


/**
 * 删除博文管理
 * @route POST /v1/blog/blog_articles/delete
 * @group 博文管理管理 - 博文管理相关
 * @param {string} _id.required - 博文管理_ID且唯一
 * @returns {object} 200 - 成功响应
 */
router.post('/delete', Blog_articlesController.blog_articlesDelete);

/**
 * 更新博文管理信息
 * @route POST /v1/blog/blog_articles/update
 * @group 博文管理管理 - 博文管理相关
 */
router.post('/update', Blog_articlesController.blog_articlesUpdate);


/**
 * 上传并读出md文件
 * @route POST /v1/blog/blog_articles/uploadMd
 * @group 博文管理管理 - 博文管理相关
 */
router.post('/uploadMd', Blog_articlesController.blog_articlesUploadMd);


/*************************************前台************************************************/

/**
 * 前台获取博文管理列表
 * @route POST /v1/blog/blog_articles/client/list
 * @group 博文管理管理 - 博文管理相关
 */

router.post('/client/list', Blog_articlesController.client_blog_articleslist);
/**
 * 前台获取博文详情
 * @route POST /v1/blog/blog_articles/client/detail
 * @group 博文详情 - 博文管理相关
 */
router.post('/client/detail', Blog_articlesController.client_blog_articlesDetail);


/**
 * 前台获取博文相关文章
 * @route POST /v1/blog/blog_articles/client/relate
 * @group 博文详情 - 博文管理相关
 */
router.post('/client/relate', Blog_articlesController.client_blog_articlesRelate);
/**
 * 前台点赞博文相关文章
 * @route POST /v1/blog/blog_articles/client/like
 * @group 博文详情 - 博文管理相关
 */
router.post('/client/like', Blog_articlesController.client_blog_articlesLike);


module.exports = router;
