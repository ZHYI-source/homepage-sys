<template>
    <div>
        <section class="error-page">
            <div class="info">
                <img src="https://storytale-public2.b-cdn.net/2021/08/16/79ea3d66-1f76-4b28-ae87-a77aa9a7dbb0-Sailor.png?height=348"/>
                <h2 class="error-title"> 404 ERROR</h2>
                <p>您所访问的页面不存在，它或已被移动，删除或者重命名。</p>
                <p>请访问其他页面</p>
                <nav>
                    <RouterLink :to="{ path: '/', replace: true }">Back To Home</RouterLink>
                </nav>

            </div>
        </section>
    </div>

</template>

<style lang="scss" scoped>
    .error-page {

        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        box-sizing: border-box;
        text-align: center;

        .error-title {
            font-size: 35px;
            padding-bottom: 3px;
            font-weight: bold;
        }

        p {
            font-size: 13px;
            padding: 5px 0;
        }

        img {
            width: 100%;
        }

    }
</style>
