function generateThemeColor(name, fixed, primaryColor, errorColor, warningColor, successColor, infoColor) {
    return {
        name: name,
        fixed: fixed,//默认
        value: {
            primaryColor: primaryColor,
            errorColor: errorColor,
            warningColor: warningColor,
            successColor: successColor,
            infoColor: infoColor,
        }
    };
}
// 调整颜色的亮度
function shadeColor(color, percent) {
    const f = parseInt(color.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00ff;
    const B = f & 0x0000ff;
    const newColor =
        "#" +
        (0x1000000 +
            (Math.round((t - R) * p) + R) * 0x10000 +
            (Math.round((t - G) * p) + G) * 0x100 +
            (Math.round((t - B) * p) + B))
            .toString(16)
            .slice(1);

    return newColor;
}

export default {
    // 网站信息
    websiteInfo: {
        name: 'ZY·Admin',
        version: '1.0.0',
        desc: '开箱即用的中后台管理系统',
        // logo仅支持在线地址
        // logo: 'http://zhouyi.run:5222/api/public/admin/getFiles?id=5d38c26acf509bdcab4f8c677ce90088.png&&mimetype=image/png',
    },


    // 快捷键
    // 支持快捷键 例如 ctrl+shift+s
    hotkey: {
        search: {
            open: 's',
            close: 'esc'
        }
    },
    // 页脚备案信息
    reference: {
        show: true, //是否展示页脚
        number: '黔ICP备2022001745号-1',//备案号
        authorization: '芒果快熟', // 站点所属机构
        authorizationUrl: 'https://gitee.com/Z568_568', // 站点所属机构链接
    },
    // 注册的主题  fixed:true, 默认主题（必填一个）
    theme: {
        list: [
            generateThemeColor('金色沙滩', true, '#d2b48c', '#c98a7d', '#e2b14c', '#80b178', '#d8c49a'),
            generateThemeColor('绿野仙踪', false, '#8BC34A', '#E91E63', '#FF9800', '#009688', '#03A9F4'),
            generateThemeColor('蓝色海洋', false, '#3F51B5', '#F44336', '#FFC107', '#4CAF50', '#2196F3'),
            generateThemeColor('粉红梦幻', false, '#FF4081', '#4CAF50', '#FFC107', '#F44336', '#2196F3'),
            generateThemeColor('黑白经典', false, '#000000', '#F44336', '#FFC107', '#4CAF50', '#2196F3'),
            generateThemeColor('橙色夕阳', false, '#FF9800', '#F44336', '#FFC107', '#4CAF50', '#2196F3'),
            generateThemeColor('紫罗兰花园', false, '#9C27B0', '#FF5722', '#FFC107', '#8BC34A', '#03A9F4'),
            generateThemeColor('薄荷清新', false, '#88c7b1', '#e88f78', '#f0c175', '#85b17e', '#c6d4a2'),
            generateThemeColor('海岸微风', false, '#8db6d2', '#d98f83', '#e7c687', '#a3cc9c', '#d8d6a7'),
            generateThemeColor('宁静花园', false, '#b7d1a4', '#e79585', '#f2ce6e', '#8eb392', '#d7d3ae'),
            generateThemeColor('宁静水域', false, '#a4cfd9', '#e89f8a', '#f2cf7d', '#9dc4a1', '#dcd9be'),
            generateThemeColor('蓝天白云', false, '#4fa1b1', '#8b4172', '#d7a643', '#539e61', '#ac7e5f'),
            generateThemeColor('晨曦绿野', false, '#9c567f', '#76a95f', '#b04a3e', '#deba50', '#4f97a3'),
            generateThemeColor('秋叶金黄', false, '#698ab0', '#c7a446', '#947a48', '#4b9d7d', '#87477d'),
            generateThemeColor('玫瑰红粉', false, '#b4555e', '#5a9a73', '#dc9256', '#4c7e95', '#976d87'),
            generateThemeColor('柠檬青绿', false, '#9b674a', '#438486', '#b95945', '#6e9a53', '#4e7394'),
            generateThemeColor('阳光明媚', false, '#a98258', '#3c8a66', '#d27c4a', '#5280a9', '#b75791'),
            generateThemeColor('清晨露珠', false, '#558c92', '#98634e', '#c5b54c', '#6a8754', '#4d6b94'),
            generateThemeColor('紫罗兰梦境', false, '#7d608d', '#7b9965', '#be4b6a', '#487b98', '#9a7057'),
            generateThemeColor('金秋收获', false, '#8a7d4d', '#499b85', '#b85b72', '#4e7c9e', '#6d8a57'),
            generateThemeColor('梅花雪霜', false, '#9f5d85', '#4f986c', '#c16a40', '#5d7d9a', '#826d54'),
            generateThemeColor('星空夜幕', false, '#0D47A1', '#D32F2F', '#FFA000', '#388E3C', '#1976D2'),
            generateThemeColor('橘子晨光', false, '#FF9800', '#BF360C', '#FFD54F', '#388E3C', '#1565C0'),
            generateThemeColor('青草田野', false, '#689F38', '#D32F2F', '#FF5722', '#0288D1', '#4CAF50'),
            generateThemeColor('蓝宝石', false, '#03A9F4', '#D32F2F', '#FFC107', '#4CAF50', '#E040FB'),
            generateThemeColor('紫色幻影', false, '#9C27B0', '#C2185B', '#FFD600', '#388E3C', '#FF5722'),
            generateThemeColor('柠檬黄昏', false, '#FFEB3B', '#E64A19', '#CDDC39', '#4CAF50', '#03A9F4'),
            generateThemeColor('淡雅蓝灰', false, '#607D8B', '#D32F2F', '#FFC107', '#8BC34A', '#03A9F4'),
            generateThemeColor('草原风情', false, '#8BC34A', '#FF5722', '#FFC107', '#03A9F4', '#9C27B0'),
            generateThemeColor('橙黄橘红', false, '#FF9800', '#FF5722', '#FFC107', '#FF6F00', '#FF3D00'),
            generateThemeColor('钢铁侠', false, '#FFD700', '#FF4500', '#FFA500', '#32CD32', '#1E90FF'),
        ]
    },
}
