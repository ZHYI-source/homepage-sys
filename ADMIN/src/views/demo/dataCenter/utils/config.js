/**
 *@author ZY
 *@date 2023/7/11
 *@Description:大屏图表的配置
 */

import echarts from 'echarts'

// require('echarts/theme/macarons') // echarts theme


// 峰值环比
export const PeakCycleRatioOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {type: 'shadow'},
  },
  grid: {
    left: '2%',
    right: '3%',
    bottom: '15%',
    top: '15%',
    containLabel: true
  },
  legend: {
    data: ['上周订单', '上上周订单'],
    right: 0,
    top: 0,
    textStyle: {
      color: "#fff"
    },
    itemWidth: 10,
    itemHeight: 10,
    // itemGap: 35
  },

  xAxis: [{
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      textStyle: {
        color: "rgba(255,255,255,.6)",
        // color: "rgba(255,255,255,1)",
        fontSize: 12,
      },
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)'
      }

    },

    data: [
      '周一', '周二', '周三', '周四', '周五', '周六', '周日']

  }, {

    axisPointer: {show: false},
    axisLine: {show: false},
    position: 'bottom',
    offset: 20,


  }],

  yAxis: [{
    type: 'value',
    axisTick: {show: false},
    // splitNumber: 6,
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)'
      }
    },
    axisLabel: {
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: 12,
      },
    },

    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        type: "dotted"
      }
    }
  }],
  series: [
    {
      name: '上周订单',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      showSymbol: true,
      lineStyle: {
        normal: {
          color: 'rgba(228, 228, 126, 1)',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(228, 228, 126, .8)'
          }, {
            offset: 0.8,
            color: 'rgba(228, 228, 126, 0.1)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        }
      },
      itemStyle: {
        normal: {
          color: '#dddc6b',
          borderColor: 'rgba(221, 220, 107, .1)',
          borderWidth: 12
        }
      },
      data: [600, 200, 600, 200, 400, 200, 400]
    },
    {
      name: '上上周订单',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      showSymbol: true,
      lineStyle: {
        normal: {
          color: 'rgba(255, 128, 128, 1)',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(255, 128, 128,.8)'
          }, {
            offset: 0.8,
            color: 'rgba(255, 128, 128, .1)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(255, 128, 128, 1)',
          borderColor: 'rgba(221, 220, 107, .1)',
          borderWidth: 12
        }
      },
      data: [300, 100, 300, 400, 300, 400,  600]
    },
  ]
}
// 交易峰值统计
export const TradingPeakOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {type: 'shadow'},
    formatter: "{b} : 平均{c}单"
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: ['0时', '2时', '4时', '6时', '8时', '10时', '12时', '14时', '16时', '18时', '20时', '22时', '24时'],
    axisLine: {
      show: true,
      lineStyle: {
        color: "#ffffff",
        width: 1,
        type: "solid",
        opacity: 0.3
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: "rgba(255,255,255,.5)",
      }
    },
  }],
  yAxis: [{
    type: 'value',
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      formatter: '{value}',
      textStyle: {
        color: "rgba(255,255,255,.5)",
      }
    },
    axisTick: {
      show: false
    },
    splitNumber: 3,
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        type: "dotted"
      }
    }
  }],
  series: [{
    type: 'pictorialBar',
    symbol: 'path://M35,0L35,70L0,70z M35,0L35,70L70,70z',
    barWidth: '45%', //柱子宽度
    data: [
      {value: 135, time: '0时'},
      {value: 205, time: '2时'},
      {value: 180, time: '4时'},
      {value: 225, time: '6时'},
      {value: 441, time: '8时'},
      {value: 521, time: '10时'},
      {value: 608, time: '12时'},
      {value: 520, time: '14时'},
      {value: 830, time: '16时'},
      {value: 242, time: '18时'},
      {value: 384, time: '20时'},
      {value: 183, time: '22时'},
      {value: 266, time: '24时'},
    ],

    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: '#247ed1'
        }, {
          offset: 0.5,
          color: '#173f9a'
        }, {
          offset: 0.5,
          color: '#247ed1'
        }
          , {
            offset: 1,
            color: '#247ed1'
          }]),
        opacity: 1,
      }
    }
  }],
}
// 投诉风险分析
export const ComplaintRiskOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {type: 'shadow'},
    formatter: function (params) {
      let marker =  params[0].marker
      let name = params[0].data.driverName; // 姓名
      let company = params[0].data.orgName; // 公司名称
      let value = params[0].value;
      return `${marker}<br/>姓名：${name}<br/>公司：${company}<br/>数量：${value}`
    }
  },
  color: ['#1aa1ff', '#31c17b', '#ff6535'],
  grid: {
    left: '2%',
    right: '2%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    data: ["赵伟", "钱秀英", "孙志强", "李娜", "周健", "吴秀兰", "郑宇航", "王丽", "冯涛", "陈静"],
    axisLine: {show: false,},
    axisLabel: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 12
    }
  },
  yAxis: {
    splitNumber: 4,
    nameTextStyle: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 12
    },
    axisLine: {show: false,},
    axisLabel: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        type: "dotted"
      }
    }
  },
  series: [{
    type: 'bar',
    barWidth: '25%',
    itemStyle: {
      normal: {
        barBorderRadius: 50,
        color: function (params) {
          var colorList = ['#4591e3', '#04b8e5', '#04dde5', '#04e5bd', '#04e57e', '#fedb5b', '#e59e04', '#ff632d', '#ff639e', '#ff82e9', '#b562e4'];
          return colorList[params.dataIndex]

        },

        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          color: 'rgba(255,255,255,.4)',
          fontSize: 12
        }
      }

    },

    data: [
      {value: 225, orgName: '贵州公交', driverName: '赵佳佳'},
      {value: 505, orgName: '贵州公交1', driverName: '钱秀英'},
      {value: 384, orgName: '贵州公交2', driverName: '孙志强'},
      {value: 485, orgName: '贵州公交4', driverName: '周健'},
      {value: 201, orgName: '贵州公交7', driverName: '吴秀兰'},
      {value: 351, orgName: '贵州公交5', driverName: '郑宇航'},
      {value: 415, orgName: '贵州公交2', driverName: '王丽'},
      {value: 171, orgName: '贵州公交1', driverName: '冯涛'},
      {value: 191, orgName: '贵州公交', driverName: '陈静'},
      {value: 391, orgName: '贵州公交', driverName: '陈静时'}
    ]
  }]
}
// 近期投诉热词
export const RecentComplaintsHotWordsOption = {
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    top: '10%',
    containLabel: true
  },
  tooltip: {
    trigger: 'item',
    // axisPointer: {type: 'shadow'},
    formatter: "{b}"
  },
  label: {
    show: true,  // 显示标签
    formatter: function (params) {
      return (
        params.value[0] + ',' + params.value[1]
      )
    },
    position: 'inside'  // 标签位置
  },
  xAxis: [{
    gridIndex: 0,
    min: 0,
    show: false,
    max: 100,
    nameLocation: 'middle',
    nameGap: 30,

  }],
  yAxis: [{
    gridIndex: 0,
    min: 0,
    show: false,
    max: 100,
    nameLocation: 'middle',
    nameGap: 30
  }],
  series: [
    {
    type: 'scatter',
    symbol: 'circle',
    symbolSize: 120,
    label: {
      normal: {
        show: true,
        formatter: '{b}',
        color: '#FFF',
        textStyle: {
          fontSize: '12'
        }

      },
    },
    data: [
      {
        "name": "绕路",
        "value": [56, 48],
        "symbolSize": 80,
        "itemStyle": {
          "normal": {
            "color": "#ec1818"
          }
        }
      },
      {
        "name": "抽烟",
        "value": [
          30,
          70
        ],
        "symbolSize": 60,
        "itemStyle": {
          "normal": {
            "color": "#ef623e"
          }
        }
      },
      {
        "name": "拼客",
        "value": [
          0,
          43
        ],
        "symbolSize": 40,
        "itemStyle": {
          "normal": {
            "color": "#94e03c"
          }
        }
      },
      {
        "name": "甩客",
        "value": [
          83,
          30
        ],
        "symbolSize": 40,
        "itemStyle": {
          "normal": {
            "color": "#08ba79"
          }
        }
      },
      {
        "name": "玩手机",
        "value": [
          26,
          19
        ],
        "symbolSize": 55,
        "itemStyle": {
          "normal": {
            "color": "#069fc5"
          }
        }
      },
      {
        "name": "不打表",
        "value": [
          75,
          75
        ],
        "symbolSize": 45,
        "itemStyle": {
          "normal": {
            "color": "#fc7a17"
          }
        }
      }
    ]
  }],
}
// 投诉环比上升
export const IncreaseInComplaintsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {type: 'shadow'},
    formatter: function (params) {
      let company = params[0].data.orgName; // 公司名称
      let marker =  params[0].marker
      let seriesName =  params[0].seriesName
      let value = params[0].value;

      let marker1 =  params[1].marker
      let seriesName1 =  params[1].seriesName
      let value1 = params[1].value;
      return `${company}<br/>${marker}${seriesName}：${value}%<br/>${marker1}${seriesName1}：${value1}%`
    }

  },
  legend: {
    data: ['上周期', '本周期'],
    right: 0,
    top: 0,
    textStyle: {
      color: "#fff"
    },
    itemWidth: 10,
    itemHeight: 10,
    // itemGap: 35
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '15%',
    top: '20%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: ['贵州公交', '白云安达', '贵州领克公司'],
    axisLine: {show: false,},
    axisLabel: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 12
    }
  }],
  yAxis: [{
    axisLabel: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 12
    },

    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        type: "dotted"
      }
    }
  }],
  series: [
    {
      name: '上周期',
      type: 'bar',
      data:[
        {value: 30, orgName: '贵州公交'},
        {value: 8, orgName: '白云安达'},
        {value: 22, orgName: '贵州领克公司'},
      ],
      barWidth: '11px',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "#009AFD"
          }, {
            offset: 0.8,
            color: "#33DAFF"
          }], false),
          barBorderRadius: [30, 30, 30, 30],
          shadowColor: 'rgba(0,160,221,1)',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: 'rgba(255,255,255,.4)',
            fontSize: 12
          }
        },

      },

    },
    {
      name: '本周期',
      type: 'bar',
      data: [
        {value: 16, orgName: '贵州公交'},
        {value: 28, orgName: '白云安达'},
        {value: 30, orgName: '贵州领克公司'},
      ],
      barWidth: '11px',
      itemStyle: {
        normal: {
          // barBorderRadius: [10, 10, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "#4033F9"
          }, {
            offset: 0.8,
            color: "#ee870a"
          }], false),
          // shadowColor: 'rgba(0, 0, 0, 0.1)',
          barBorderRadius: [30, 30, 30, 30],
          shadowColor: 'rgba(0,160,221,1)',
          shadowBlur: 4,
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: 'rgba(255,255,255,.4)',
            fontSize: 12
          }
        }
      },
    },
  ]
}
// 投诉数量统计
export const ComplaintNumberOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {type: 'shadow'},
    formatter: "{b} : {c}条"
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '15%',
    top: '20%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: ['贵AU8669', '贵AU8854', '贵AU8359', '贵AU8549', '贵AU4270', '贵AU3654', '贵AU3325','贵AU5325','贵AU5325','贵AU5325'],
    axisLine: {show: false,},
    axisLabel: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 12
    }
  }],
  yAxis: [{
    axisLabel: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 12
    },

    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        type: "dotted"
      }
    }
  }],
  series: [{
    type: 'bar',
    data: [
      {value: 25, plateNo: '贵AU8669'},
      {value: 5, plateNo: '贵AU8854'},
      {value: 34, plateNo: '贵AU8359'},
      {value: 45, plateNo: '贵AU8549'},
      {value: 21, plateNo: '贵AU4270'},
      {value: 31, plateNo: '贵AU3654'},
      {value: 15, plateNo: '贵AU3325'},
      {value: 20, plateNo: '贵AU5325'},
      {value: 14, plateNo: '贵AU3825'},
      {value: 24, plateNo: '贵AU6375'}
    ],
    barWidth: '11px',
    itemStyle: {
      normal: {
        // barBorderRadius: [10, 10, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "#4033F9"
        }, {
          offset: 0.8,
          color: "#BA97F9"
        }], false),
        // shadowColor: 'rgba(0, 0, 0, 0.1)',
        barBorderRadius: [30, 30, 30, 30],
        shadowColor: 'rgba(0,160,221,1)',
        shadowBlur: 4,
      }
    },
    label: {
      normal: {
        show: true,
        lineHeight: 20,
        width: 50,
        height: 20,
        backgroundColor: 'rgba(0,160,221,0.1)',
        borderRadius: 200,
        position: ['-12', '-40'],
        distance: 0,
        formatter: [
          '    {d|●}',
          ' {a|{c}}     \n',
          '    {b|}'
        ].join(','),
        rich: {
          d: {
            color: '#BA97F9',
          },
          a: {
            color: '#fff',
            align: 'center',
          },
          b: {
            width: 1,
            height: 10,
            borderWidth: 1,
            borderColor: '#234e6c',
            align: 'left'
          },
        }
      }
    }
  }]
}

// 年龄分布
export const AgeOption = {
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    top: '10%',
    containLabel: true
  },
  tooltip: {
    trigger: "item",
    right: 0,
    top: 0,
    formatter: "{b} : ({d}%)"
  },
  calculable: true,
  series: [{
    name: " ",
    color: ['#ba97f9', '#a073f1', "#8277f1", '#7668f3', "#bfbaf5",],
    // color: ["#62c98d", "#2f89cf", "#4cb9cf", "#53b666", "#62c98d", "#205acf", "#c9c862", "#c98b62", "#c962b9", "#7562c9", "#c96262", "#c25775", "#00b7be"],
    type: "pie",
    radius: [15, 40],
    center: ["50%", "50%"],
    roseType: "radius",
    label: {
      normal: {
        show: true
      },
      emphasis: {
        show: true
      }
    },
    lableLine: {
      normal: {
        show: true
      },
      emphasis: {
        show: true
      }
    },
    data: [{
      value: 10,
      name: "30-39岁",
      /*label: {
        color: '##ff6535',
      },
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "#ff6535"
          }, {
            offset: 0.8,
            color: "#33DAFF"
          }], false),
          barBorderRadius: [30, 30, 30, 30],
        },
      }*/
    }, {
      value: 5,
      name: "25-29岁"
    }, {
      value: 15,
      name: "40-49岁"
    }, {
      value: 25,
      name: ">=50岁"
    }, {
      value: 20,
      name: "18-24岁"
    },]
  },]
}
// 性别分布
export const SexOption = {
  tooltip: {
    trigger: "item",
    right: 0,
    top: 0,
    formatter: "{b} : {c}(%)"
  },
  grid: {
    left: '8%',
    top: '5%',
    right: '2%',
    bottom: '2%',
    containLabel: true
  },
  xAxis: {
    show: false
  },
  yAxis: [{
    show: true,
    data: ['男', '女'],
    inverse: true,
    axisLine: {show: false},
    splitLine: {show: false},
    axisTick: {show: false},
    axisLabel: {
      textStyle: {
        color: '#fff'
      },
    },

  }, {
    show: false,
    inverse: true,
    data: [683, 234],
    axisLabel: {textStyle: {color: '#fff'}},
    axisLine: {show: false},
    splitLine: {show: false},
    axisTick: {show: false},
  }],
  series: [{
    name: '人',
    type: 'bar',
    yAxisIndex: 0,
    data: [53.6, 45.9],
    barWidth: 10,
    itemStyle: {
      normal: {
        color: function (params) {
          var colorList = ['#4591e3', '#b562e4', '#ff82e9', '#b562e4'];
          return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: colorList[params.dataIndex]
          }, {
            offset: 0.8,
            color: colorList[params.dataIndex + 1]
          }], false)

        },
        barBorderRadius: 50,

      }
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        formatter: '{c}%',
        textStyle: {color: 'rgba(255,255,255,.5)'}
      }
    },
  }]
}
