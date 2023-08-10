<template>
    <div class="header-theme">
        <IconFont type="icon-shezhi" class="header-icon"/>
    </div>
</template>

<script setup>


</script>

<style lang="scss">
    .header-theme {
        cursor: pointer;
        transition: all .2s linear;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
            color: $color-primary;
        }

        .header-icon {
            font-size: 18px;
        }

    }

</style>
