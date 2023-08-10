<template>
<section style="height: 100%">
  <ul class="scroll-title">
    <li>车牌号</li>
    <li>订单数</li>
    <li>营业额</li>
    <li>平均每单营业额</li>
  </ul>
  <vue-seamless-scroll :data="listData" :class-option="classOption" class="warp">
    <ul class="item">
      <li v-for="(item, index) in listData" :key="index">
        <span class="title" v-text="item.plateNo"></span>
        <span class="date" v-text="item.plateNo"></span>
        <span class="date" v-text="item.amountDesc"></span>
        <span class="date" v-text="item.amountDesc"></span>
      </li>
    </ul>
  </vue-seamless-scroll>
</section>
</template>

<script>
export default {
  name: "revenue-scroll-card",
  data(){
    return {
      classOption: {
        direction: 0,
      },
      listData: [
        {
          "driverName": "王泽金",
          "plateNo": "贵AUC040",
          "amount": 1000,
          "amountDesc": "10.00",
          "payForTime": 1688981386000,
          "payForTimeDesc": "2023-07-10 17:29:46",
          "idCard": "510227198001168196",
          "userTel": "15185127252",
          "orgName": "贵州贵西新能源出租汽车服务有限公司"
        },
        {
          "driverName": "陈鹏刚",
          "plateNo": "贵AU8S68",
          "amount": 2000,
          "amountDesc": "20.00",
          "payForTime": 1688981363000,
          "payForTimeDesc": "2023-07-10 17:29:23",
          "idCard": "620523198802093493",
          "userTel": "13984413933",
          "orgName": "贵阳汽车客运有限公司一车队"
        },
        {
          "driverName": "荣长春",
          "plateNo": "贵AU3097",
          "amount": 1300,
          "amountDesc": "13.00",
          "payForTime": 1688981322000,
          "payForTimeDesc": "2023-07-10 17:28:42",
          "idCard": "511023197701130797",
          "userTel": "13511935513",
          "orgName": "蓝色众联九车队"
        },
        {
          "driverName": "杨诗贤",
          "plateNo": "贵AUH909",
          "amount": 1700,
          "amountDesc": "17.00",
          "payForTime": 1688981299000,
          "payForTimeDesc": "2023-07-10 17:28:19",
          "idCard": "522422197101234056",
          "userTel": "18798848122",
          "orgName": "贵州成黔天骄出租汽车服务有限公司"
        },
        {
          "driverName": "卢义",
          "plateNo": "贵AUF167",
          "amount": 1000,
          "amountDesc": "10.00",
          "payForTime": 1688981250000,
          "payForTimeDesc": "2023-07-10 17:27:30",
          "idCard": "52011219890102259X",
          "userTel": "18185022052",
          "orgName": "贵阳致远城达出租汽车有限公司"
        },
        {
          "driverName": "何庭阳",
          "plateNo": "贵AUF525",
          "amount": 4000,
          "amountDesc": "40.00",
          "payForTime": 1688981243000,
          "payForTimeDesc": "2023-07-10 17:27:23",
          "idCard": "522425197812254212",
          "userTel": "18798826897",
          "orgName": "蓝色众联五车队"
        },
        {
          "driverName": "刘锦",
          "plateNo": "贵AUL357",
          "amount": 1600,
          "amountDesc": "16.00",
          "payForTime": 1688981234000,
          "payForTimeDesc": "2023-07-10 17:27:14",
          "idCard": "522502198410094856",
          "userTel": "13678512687",
          "orgName": "贵阳市光彩客运有限公司"
        },
        {
          "driverName": "王胜",
          "plateNo": "贵AUQ577",
          "amount": 1400,
          "amountDesc": "14.00",
          "payForTime": 1688981202000,
          "payForTimeDesc": "2023-07-10 17:26:42",
          "idCard": "522401197706239018",
          "userTel": "13586942444",
          "orgName": "蓝色众联二车队"
        },
        {
          "driverName": "胡光友",
          "plateNo": "贵AUN931",
          "amount": 6200,
          "amountDesc": "62.00",
          "payForTime": 1688981171000,
          "payForTimeDesc": "2023-07-10 17:26:11",
          "idCard": "522634199003204430",
          "userTel": "13511905738",
          "orgName": "贵阳致远城达出租汽车有限公司"
        },
        {
          "driverName": "张光艳",
          "plateNo": "贵AUW770",
          "amount": 1200,
          "amountDesc": "12.00",
          "payForTime": 1688981156000,
          "payForTimeDesc": "2023-07-10 17:25:56",
          "idCard": "522522198409194222",
          "userTel": "13984186284",
          "orgName": "蓝色众联九车队"
        },
        {
          "driverName": "杨国平",
          "plateNo": "贵AUB072",
          "amount": 1200,
          "amountDesc": "12.00",
          "payForTime": 1688981124000,
          "payForTimeDesc": "2023-07-10 17:25:24",
          "idCard": "522522197212061851",
          "userTel": "13985051477",
          "orgName": "贵州吉德士出租汽车有限公司"
        },
        {
          "driverName": "殷呈文",
          "plateNo": "贵AUB844",
          "amount": 3700,
          "amountDesc": "37.00",
          "payForTime": 1688981098000,
          "payForTimeDesc": "2023-07-10 17:24:58",
          "idCard": "522502196512251710",
          "userTel": "13595113161",
          "orgName": "贵州金久通出租车有限公司"
        },
        {
          "driverName": "李洪刚",
          "plateNo": "贵AUH525",
          "amount": 2700,
          "amountDesc": "27.00",
          "payForTime": 1688981077000,
          "payForTimeDesc": "2023-07-10 17:24:37",
          "idCard": "522425198311104552",
          "userTel": "13985171417",
          "orgName": "蓝色众联九车队"
        },
        {
          "driverName": "鲁军",
          "plateNo": "贵AUG281",
          "amount": 1100,
          "amountDesc": "11.00",
          "payForTime": 1688981068000,
          "payForTimeDesc": "2023-07-10 17:24:28",
          "idCard": "522524198402204814",
          "userTel": "13595021129",
          "orgName": "贵阳汽车客运有限公司一车队"
        },
        {
          "driverName": "张凯",
          "plateNo": "贵AUK458",
          "amount": 1000,
          "amountDesc": "10.00",
          "payForTime": 1688981063000,
          "payForTimeDesc": "2023-07-10 17:24:23",
          "idCard": "522422198606266832",
          "userTel": "13378517209",
          "orgName": "贵州金久通出租车有限公司"
        },
        {
          "driverName": "罗廷银",
          "plateNo": "贵AU1159",
          "amount": 1000,
          "amountDesc": "10.00",
          "payForTime": 1688980948000,
          "payForTimeDesc": "2023-07-10 17:22:28",
          "idCard": "52252219821209421X",
          "userTel": "13765109069",
          "orgName": "贵州程呈泰达出租汽车管理服务有限公司"
        },
        {
          "driverName": "李勇",
          "plateNo": "贵AU0999",
          "amount": 1500,
          "amountDesc": "15.00",
          "payForTime": 1688980917000,
          "payForTimeDesc": "2023-07-10 17:21:57",
          "idCard": "522425196406062413",
          "userTel": "15180817308",
          "orgName": "贵阳市顺发出租汽车有限公司"
        },
        {
          "driverName": "韦刚",
          "plateNo": "贵AUB916",
          "amount": 6800,
          "amountDesc": "68.00",
          "payForTime": 1688980906000,
          "payForTimeDesc": "2023-07-10 17:21:46",
          "idCard": "522530198303071339",
          "userTel": "18984383080",
          "orgName": "贵州吉德士出租汽车有限公司"
        },
        {
          "driverName": "蹇玉祥",
          "plateNo": "贵AUC479",
          "amount": 1700,
          "amountDesc": "17.00",
          "payForTime": 1688980855000,
          "payForTimeDesc": "2023-07-10 17:20:55",
          "idCard": "51052119670626577X",
          "userTel": "18984878390",
          "orgName": "蓝色众联六车队"
        },
        {
          "driverName": "卢义",
          "plateNo": "贵AUF167",
          "amount": 1200,
          "amountDesc": "12.00",
          "payForTime": 1688980804000,
          "payForTimeDesc": "2023-07-10 17:20:04",
          "idCard": "52011219890102259X",
          "userTel": "18185022052",
          "orgName": "贵阳致远城达出租汽车有限公司"
        }
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #718ff1;
$secondary-color: #5890bb;
$background-color: #686868;
$border-color: #686868;
$font-color: #b4b3b3;

$scroll-title-height: 20px;
$scroll-title-font-size: .8rem;
$scroll-title-text-shadow: 0 0 25px $secondary-color;

$warp-height: calc(100% - #{$scroll-title-height});
$warp-font-size: .8rem;
$warp-border-color: #686868;
$warp-margin-bottom: 5px;

.scroll-title {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 10px $primary-color inset;

  li {
    width: 25%;
    height: $scroll-title-height;
    line-height: $scroll-title-height;
    font-size: $scroll-title-font-size;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #EEEEEE;
    font-weight: bold;
    font-family: "Adobe 楷体 Std R";
    text-shadow: $scroll-title-text-shadow;
  }
}

.warp {
  height: $warp-height;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  color: $background-color;

  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;

    li {
      height: 30px;
      line-height: 30px;
      display: flex;
      text-align: center;
      justify-content: space-between;
      font-size: $warp-font-size;
      border-bottom: 1px solid $warp-border-color;
      margin-bottom: $warp-margin-bottom;

      span {
        display: inline-block;
        width: 25%;
        color: $font-color;
      }
    }
  }
}

</style>
