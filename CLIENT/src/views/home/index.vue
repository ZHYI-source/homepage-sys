<template>
  <section class="home-container" id="home">
    <Intro @mose="scrollToSection1"/>
    <section class="main-warp" id="about">
      <section class="banner">
        <!--        <img class="banner-cover"-->
        <!--             alt="banner" src="../../assets/img/banner.jpg">-->
        <div class="banner-content">
          <div class="banner-container">
            <div class="row">
              <div class="row-col-left"></div>
              <div class="row-col-right">
                <div class="banner-text"
                     :style="`transform: translateX(-${state.titleAnimation?0:50}%)`">
                  <p class="text-tip">Hi! I'm {{ setting.websiteInfo.name || 'ZHOU YI' }}</p>
                  <p class="text-main">
                    {{ setting.websiteInfo.motto || "Welcome To My Personal Homepage! Let's Go!" }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="main-container">
        <div class="container-row">
          <div class="container-left">
            <div class="sidebar" :style="`transform: translateY(-${state.titleAnimation?40:0}%)`">
              <div class="sidebar-card">
                <div class="sidebar-avatar">
                  <img class="avatar-img lazy-image "
                       :data-src="`https://www.vickyadrii.my.id/images/about-image.svg`">
                </div>
                <div class="sidebar-name">{{ setting.websiteInfo.occupation }}</div>
                <div class="sidebar-label">{{ setting.websiteInfo.occupationEn }}</div>
                <div class="c-divider c-mb-40"></div>
                <div class="sidebar-social">
                  <a :href="setting.userInfo.github" target="_blank"><i class="iconfont icon-github"></i></a>
                  <a :href="setting.userInfo.gitee" target="_blank"><i class="iconfont icon-gitee"></i></a>
                  <!--                  <a href="https://github.com/ZHYI-source" target="_blank"><i class="iconfont icon-github"></i></a>-->
                  <!--                  <a href="https://github.com/ZHYI-source" target="_blank"><i class="iconfont icon-github"></i></a>-->
                </div>
                <div class="c-divider c-mb-40 c-mt-40"></div>
                <ul class="sidebar-other">
                  <li class="other-item">
                    <span class="item-label">城市：</span>
                    <span class="item-label-light">{{ setting.userInfo.city || '-' }}</span>
                  </li>
                  <li class="other-item">
                    <span class="item-label">年龄：</span>
                    <span class="item-label-light">{{ setting.userInfo.age }}</span>
                  </li>

                  <li class="other-item">
                    <span class="item-label">微信/QQ：</span>
                  </li>
                  <div class="social">
                    <img width="80"
                         class="lazy-image"
                         :data-src="setting.userInfo.wx">
                    <img width="80"
                         class="lazy-image"
                         :data-src="setting.userInfo.qq">
                  </div>
                </ul>
                <div class="c-divider c-mb-40"></div>

                <div class="sidebar-btn" @click="scrollToSection1('contact')">
                  <span>在线留言</span>
                  <!--                  <i class="iconfont icon-github"></i>-->
                </div>
                <span class="downResume" v-if="setting.userInfo.showResumeUrl" @click="downloadResume">下载简历</span>
              </div>
            </div>
          </div>
          <div class="container-right">
            <div class="container-right-content">
              <div class="brand-card-list">
                <div class="brand-card-item">
                  <div class="card-item">
                    <h3 class="card-item-title">14+</h3>
                    <div class="c-divider"></div>
                    <div class="card-item-content">开源项目</div>
                  </div>
                </div>
                <div class="brand-card-item">
                  <div class="card-item">
                    <h3 class="card-item-title">3 +</h3>
                    <div class="c-divider"></div>
                    <div class="card-item-content">实战经验</div>
                  </div>
                </div>
                <div class="brand-card-item">
                  <div class="card-item">
                    <h3 class="card-item-title">50+</h3>
                    <div class="c-divider"></div>
                    <div class="card-item-content">项目合作</div>
                  </div>
                </div>
              </div>
              <section class="notice ">
                <div class="notice-line">
                  <span class="notice-title">📢 NOTICE：</span>
                  <div class="notice-desc">
                    {{ setting.websiteInfo.notice || '-' }}
                  </div>
                </div>
              </section>
              <section class="brand-tips">
                <ZySectionHeader title="Tips" titleNum="01"/>
                <blockquote class="my-story">
                  无趣的人想过着有趣的生活。
                  <br/>
                  每一步都是奇迹，每一天都是新的起点。
                  <img class="wx-logo lazy-image" width="120"
                       :data-src="setting.websiteInfo.wxMini">
                </blockquote>
              </section>

            </div>
          </div>
        </div>
        <section class="notice notice-temp c-mb-40">
          <div class="notice-line">
            <span class="notice-title">公告：</span>
            <div class="notice-desc">{{ setting.websiteInfo.notice || '-' }}
            </div>
          </div>
        </section>
        <img  style="display:inline-block" src="https://github-readme-stats.vercel.app/api?username=ZHYI-source&bg_color=30,e96443,904e95&title_color=fff&text_color=fff"
              alt="vuejs" />
        <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=ZHYI-source&amp;layout=compact" alt="TopLangs">
        <img src="https://github-readme-stats.vercel.app/api/pin/?username=ZHYI-source&repo=blog-node-express-mysql-vue2" alt="TopLangs">
        <img src="https://github-readme-stats.vercel.app/api/pin/?username=ZHYI-source&repo=vue3-antd-plus" alt="TopLangs">
        <section class="about">
          <ZySectionHeader title="About me" titleNum="02"/>
          <section class="animate-me">
            "<span class="me-text me-text-a">三年前</span>，我踏上了<span class="me-text me-text-b">前端开发</span>的旅程
            ，从那时起，对前端技术<span class="me-text me-text-c">充满热情</span>，
            并迫不及待地构建各种<span class="me-text me-text-d">响应式</span>设计和<span class="me-text me-text-c">移动端</span>的开发。我比较注重
            <span class="me-text me-text-e">用户体验</span>、界面设计和<span class="me-text me-text-a">代码质量</span>，并具有<span
              class="me-text me-text-c">优化性能</span>和解决兼容性问题的经验。
            热衷于<span class="me-text me-text-c">创新</span>思维，喜欢思考和
            <span class="me-text me-text-c">解决问题</span>。追求自己的兴趣和激情，让每一天都充满<span class="me-text me-text-c">活力</span>和乐趣
          </section>
        </section>
        <section class="resume c-mt-40 " id="resume">
          <ZySectionHeader title="RESUME" titleNum="03"/>
          <div class="resume-box skill-box">
            <div class="box-title">
              <span class="title-icon iconfont icon-Elephone_repair"> </span>
              <span class="text">SKILLS</span>
            </div>
            <div class="box-item">
              <ul>
                <li><i class="icon iconfont icon-icon"></i>HTML</li>
                <li><i class="icon iconfont icon-icon"></i>CSS</li>
                <li><i class="icon iconfont icon-icon"></i>SCSS/Less</li>
                <li><i class="icon iconfont icon-icon"></i>JavaScript</li>
                <li><i class="icon iconfont icon-icon"></i>TypeScript</li>
              </ul>
            </div>
            <div class="box-item">
              <ul>
                <li><i class="icon iconfont icon-icon"></i>Vue.js</li>
                <li><i class="icon iconfont icon-icon"></i>React.js</li>
                <li><i class="icon iconfont icon-icon"></i>Canvas</li>
                <li><i class="icon iconfont icon-icon"></i>WebGL</li>
                <li><i class="icon iconfont icon-icon"></i>SVG</li>
              </ul>
            </div>
            <div class="box-item">
              <ul>
                <li><i class="icon iconfont icon-icon"></i>UniApp</li>
                <li><i class="icon iconfont icon-icon"></i>Webpack/Vite</li>
                <li><i class="icon iconfont icon-icon"></i>RESTful API</li>
                <li><i class="icon iconfont icon-icon"></i>Node.js</li>
                <li><i class="icon iconfont icon-icon"></i>Mysql/MongoDB</li>
              </ul>
            </div>
            <div class="box-item">
              <ul>
                <li><i class="icon iconfont icon-icon"></i>响应式开发</li>
                <li><i class="icon iconfont icon-icon"></i>大屏可视化</li>
                <li><i class="icon iconfont icon-icon"></i>混合APP</li>
                <li><i class="icon iconfont icon-icon"></i>SpringBoot</li>
                <li><i class="icon iconfont icon-icon"></i>AI...</li>
              </ul>
            </div>
          </div>
          <div class="resume-box icon-animation" style="border: 1px solid #eee">
            <div class="box-title">
              <span class="title-icon iconfont icon-a-xingshizhexueshekebaogaohuishenpibiao"> </span>
              <span class="text">Experience</span>
            </div>
            <ExperienceStep/>
          </div>
          <div class="resume-box best-box">
            <div class="box-title">
              <span class="title-icon iconfont icon-zhuomian-diannaoxianshiqi"> </span>
              <span class="text">Like... best</span>
            </div>
            <div class="box-item">
              <i class="icon icon-b iconfont icon-a-developer_outlineI"></i>
              <div class="best-text">热爱编程工作。每一行代码都是我对未知世界的探索.每一次bug的战胜，都是一次成长的飞跃.</div>
            </div>
            <div class="box-item">
              <i class="icon icon-e iconfont icon-yingxionglianmeng"></i>
              <div class="best-text">享受在LOL中和好友默契十足的配合，无论输赢，都是锻炼意志的历练.</div>
            </div>
            <div class="box-item">
              <i class="icon icon-d iconfont icon-lvyoufabu"></i>
              <div class="best-text">旅游是我心中永不停歇的冒险！我喜欢追逐风景，感受异域文化的魅力.</div>
            </div>
          </div>
        </section>
        <section class="works c-mt-40 c-mb-40" id="work">
          <ZySectionHeader title="My Complete Projects" titleNum="04"/>
          <div class="work-box">
            <!--        <ul class="work-menu">
                          <li>ALL</li>
                          <li>VUE</li>
                          <li>REACT</li>
                          <li>移动H5</li>
                          <li>小程序</li>
                        </ul>-->
            <div class="work-list">
              <div class="work-item" :title="item.abstract" v-for="item in state.portfoliosData"
                   @click="viewWorks(item)">
                <img class="work-cover lazy-image" v-bind:data-src="item.cover"
                     alt="Lazy Loaded Image">
                <div class="work-info">
                  <div class="work-info-icon"><i class="iconfont icon-chakan2"></i></div>
                  <div class="work-info-title">{{ item.title }}</div>
                  <!--                  <div class="work-info-desc"> {{ item.abstract }}</div>-->
                </div>
              </div>
              <div class="work-item" @click="goToPage('/Portfolio')">
                <img class="work-cover lazy-image"
                     v-bind:data-src="`http://www.zhouyi.run:3089/v1/common/files/preview/img/1691545299360.png`">
                <div class="work-info work-more">
                  <div class="work-info-icon"><i class="iconfont icon-click"></i></div>
                  <div class="work-info-title">MORE</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!--        <section class="blog c-mt-40" id="blog">
                  <ZySectionHeader title="BLOG" titleNum="05"/>
                  <ul class="blog-menu">
                    <li>ALL</li>
                    <li>VUE</li>
                    <li>REACT</li>
                    <li>移动H5</li>
                    <li>小程序</li>
                  </ul>
                  <div class="blog-box">
                    <div class="blog-left">
                      <div class="new-block">
                        <div class="inner-box">
                          <div class="image">
                            <img class="lazy-image" v-bind:data-src="`https://picsum.photos/id/400/400/`"
                                 alt="Lazy Loaded Image">
                          </div>
                          <div class="over-box">
                            <div class="hvr-lower">
                              <div class="title">
                                想做一只小青蛙🐸，开心时，跳水，不开心时，也跳水。
                              </div>
                              <div class="info">
                                <div class="i-blk"><span class="icon far fa-comment"></span> 5 comments
                                </div>
                                <div class="i-blk"><span class="icon far fa-user"></span> admin</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="news-block-two" v-for="item in 4" @click="goToPage('PostDetail',{id:item})">
                        <div class="inner-box">
                          <div class="image">
                            <img class="lazy-image" v-bind:data-src="`https://picsum.photos/id/${item + 32}/600/400/`"
                                 alt="cover">
                          </div>
                          <div class="text-box">
                            <div class="title">
                              踏遍千山万水，行走在世界的怀抱。旅游是我心中永不停歇的冒险！我喜欢追逐风景，感受异域文化的魅力.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="blog-right blog-left">
                      <div class="news-block-two" v-for="item in 4" @click="goToPage('PostDetail',{id:item})">
                        <div class="inner-box">
                          <div class="image">
                            <img class="lazy-image" v-bind:data-src="`https://picsum.photos/id/${item + 20}/600/400/`"
                                 alt="cover">
                          </div>
                          <div class="text-box">
                            <div class="title">
                              踏遍千山万水，行走在世界的怀抱。旅游是我心中永不停歇的冒险！我喜欢追逐风景，感受异域文化的魅力.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="new-block"  @click="goToPage('/blog')">
                        <div class="inner-box">
                          <div class="image">
                            <img class="lazy-image" v-bind:data-src="`https://picsum.photos/id/400/400/`"
                                 alt="Lazy Loaded Image">
                          </div>
                          <div class="over-box">
                            <div class="hvr-lower blog-more">
                              <div class="work-info-icon"><i class="iconfont icon-click"></i></div>
                              <div class="work-info-title">MORE</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>-->

        <section class="blog  c-mt-40 c-mb-40" id="blog">
          <ZySectionHeader title="Selected Articles" titleNum="05"/>
          <ArticleSection/>
        </section>

        <section class="connect c-mt-40 c-mb-40" id="contact">
          <ZySectionHeader title="Contact Me" titleNum="06"/>
          <p class="message-tips">留下你的足迹，让我知道你在这里看过我的留言板。</p>
          <div class="connect-box">
            <div class="contact-form">
              <ZyForm @submitForm="submitMessage"/>
            </div>
            <ul class="contact-basic">
              <li class="basic-item" v-for="item in state.messageList" :key="item._id">
                <a-avatar
                    :size="40"
                    :src="item.userInfo[0].avatar"
                    alt="匿名"/>
                <a-avatar :size="40" v-if="!item.userInfo[0].avatar">
                  <template #icon>
                    <i style="font-size: 1.6rem" class="iconfont icon-customer-bussinessman"></i>
                  </template>
                </a-avatar>
                <div class="item-r">
                  <p class="r-t">
                    <span class="r-t-name">{{ item.userInfo[0].nickname }}</span>
                    <span class="author" v-if="item.userInfo[0].username==='admin'"></span>
                    <span class="r-t-time">{{
                        TimeUtils.formatRelativeTime(item.createdAt)
                      }}</span></p>
                  <p class="r-desc"> {{ item.content }} </p>
                </div>
              </li>
              <li class="more-msg" @click="goToPage('/contact')">
                <i class="iconfont icon-click"></i> 查看更多
              </li>
            </ul>
          </div>
        </section>
      </section>
      <WorldMap/>
      <ZyModal :minWidth="350" :show="state.show.work" title="项目详情" key="ViewUserInfo" @close="close">
        <WorkDetail :viewData="state.viewData"/>
      </ZyModal>
    </section>
  </section>
</template>


<script setup>
import {onMounted, onBeforeUnmount, nextTick, ref, watch, reactive} from 'vue';
import Intro from "./components/intro.vue";
import Zy3DCardList from "../../components/common/Zy3DCardList.vue";
import {useMenusStore} from '../../stores/menus'
import ZyModal from "../../components/common/ZyModal.vue";
import WorkDetail from "../../components/common/work-detail.vue";
import WorldMap from "./components/world-map.vue";
import ExperienceMap from "./components/experience-map.vue";
import {goToPage} from "../../libs/util.router";
import lazyLoadImages from "../../libs/util.lazyLoad";
import {useRouter} from 'vue-router'
import observeAndAnimate from "../../libs/util.viewportObserve";
import ZySectionHeader from "../../components/common/ZySectionHeader.vue";
import ZyForm from "../../components/common/ZyForm.vue";
import ArticleSection from "./components/article-section.vue";
import ExperienceStep from "./components/experience-step.vue";
import {portfoliosList} from "../../api/modules/api.portfolios";
import {messagesCreate, messagesList} from "../../api/modules/api.messages";
import {TimeUtils} from "../../libs/util.time";
import setting from "../../setting";

const router = useRouter()
const menusAction = useMenusStore()

const state = reactive({
  scrollHeight: 0,
  bannerWidth: 100,
  titleAnimation: false,
  textAnimation: false,
  show: {
    work: false
  },
  portfoliosQuery: {
    params: {
      recommended: true,
      status: true,
    },
    pagination: {
      current: 1,
      pageSize: 5,
    },
  },
  portfoliosData: [],
  viewData: {},
  messageQuery: {
    pagination: {
      current: 1,
      pageSize: 5,
    },
  },
  messageList: []
})


const onDev = () => {
  window.alert('抱歉！功能正在开发中...')
}
const close = () => {
  state.show.work = false
}
const viewWorks = (item) => {
  state.viewData = item
  state.show.work = true
}

const downloadResume = () => {
  alert('简历下载已关闭')
}
// 实现平滑滚动到锚点的方法
const scrollToSection1 = (id) => {
  const dom = document.getElementById(id)
  dom.scrollIntoView({behavior: 'smooth'});
};

const getPortfolioList = () => {
  portfoliosList(state.portfoliosQuery).then(res => {
    state.portfoliosData = res.data.result || []
  })
}

const submitMessage = (form) => {
  messagesCreate(form).then(res => {
    if (res.status) {
      let info = {
        name: form.name,
        email: form.email,
        website: form.website
      }
      localStorage.setItem('ZY-CLIENT-USERINFO', JSON.stringify(info))
      getMessageList()
    }
  })
}

const getMessageList = () => {
  messagesList(state.messageQuery).then(res => {
    state.messageList = res.data.result
  })
}

getMessageList()


watch(() => menusAction.page, (val) => {
  if (val) {
    scrollToSection1(val)
  }
})

// 数据更新后使用 nextTick 来确保在 DOM 更新后执行 lazyLoadImages 方法
watch(() => state.portfoliosData, () => {
  nextTick(() => {
    lazyLoadImages();
  })
});

const handleScroll = (e) => {
  // 滚动事件处理逻辑
  state.titleAnimation = window.scrollY - window.innerHeight / 2.2 > 0;
};


getPortfolioList()

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  observeAndAnimate('.news-block-two', (element) => {
    // 自定义动画效果
    element.style.opacity = 1;
    element.style.transform = 'translateX(0px)';
  });
  observeAndAnimate('.box-item', (element) => {
    // 自定义动画效果
    element.style.opacity = 1;
    element.style.transform = 'translateY(0px)';
  });


  // 懒加载图片
  lazyLoadImages();

})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>


<style lang="scss" scoped>
@import "style/index";


</style>
