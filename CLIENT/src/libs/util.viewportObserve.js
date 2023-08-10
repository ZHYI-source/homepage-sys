/**
 * 创建一个观察器并触发动画
 * @param {string} targetSelector - 目标元素的选择器，用于指定要观察的元素。
 * @param {Function} animateCallback - 执行动画效果的回调函数。
 */

/* Todo 使用示例
observeAndAnimate('.animate-me', (element) => {
    // 自定义动画效果
    element.style.opacity = 1;
    element.style.backgroundColor = 'green';
    element.style.height = '500px';
    // 添加动画类
    targetElement.classList.add(animationClass);
});
*/
const observeAndAnimate = (targetSelector, animateCallback) => {
    const targetElements = document.querySelectorAll(targetSelector);
    if (!targetElements || targetElements.length === 0) {
        console.warn(`目标元素未找到: ${targetSelector}`);
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 执行传入的动画回调函数
                animateCallback(entry.target);

                // 动画执行后，不再观察该元素
                observer.unobserve(entry.target);
            }
        });
    });

    // 开始观察每个目标元素
    targetElements.forEach((targetElement) => {
        observer.observe(targetElement);
    });
};


export default observeAndAnimate;
