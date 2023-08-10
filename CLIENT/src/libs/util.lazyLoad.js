// lazyLoad.js

/**
 * 图片懒加载函数
 *
 * 此函数使用 IntersectionObserver 实现图片懒加载。它观察页面中的图片元素是否进入可视区域，
 * 当图片元素进入可视区域时，将真实的图片URL加载到src属性，从而触发图片加载。
 * 一旦图片加载完成，观察器将移除对该图片元素的观察。
 */

/*
* 使用示例
* <img class="lazy-image" v-bind:data-src="图片地址">
* onMounted(() => {
  // 懒加载图片
  lazyLoadImages();
})
* */

const lazyLoadImages = (nodeList) => {

    // 创建一个 IntersectionObserver 对象
    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                // 当目标元素进入可视区域时，加载图片
                const targetElement = entry.target;
                const imageSrc = targetElement.dataset.src;

                if (imageSrc) {
                    // 设置真实图片URL到src属性
                    targetElement.src = imageSrc;

                    // 图片加载完成后，移除观察器，避免重复加载
                    targetElement.onload = () => {
                        observer.unobserve(targetElement);
                    };
                }
            }
        });
    });

    // console.log(nodeList)
    // 获取所有需要懒加载的图片元素
    const lazyImages = nodeList ? nodeList : document.querySelectorAll('.lazy-image');
    // 开始观察每个图片元素
    lazyImages.forEach((image) => {
        observer.observe(image);
    });
};


export default lazyLoadImages;
