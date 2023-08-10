const express = require('express');
const router = express.Router();
const apiResponse = require('@utils/utils.apiResponse')


/**
 * 主页
 * @route GET /v1/sys
 * @group API - 根路径
 */
router.get('/', function (req, res) {
    apiResponse.successResponse(res, '欢迎来到ZY.API')
});

module.exports = router;
