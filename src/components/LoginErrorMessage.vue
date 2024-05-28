<template>
    <div class="error-message">
        <div class="error-content">
            <i class="pi pi-exclamation-triangle error-icon"></i>
            <h2>所属会社が確認できないため、このシステムをご利用いただけません。</h2>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            closeError() {
                this.$router.push({ path: '/' });
            },
        },
    };
</script>

<style scoped>
    .error-message {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .error-icon {
        font-size: 60px;
        color: tomato;
        margin-bottom: 20px;
    }
    .error-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    h2 {
        font-size: 24px;
        margin-bottom: 10px;
    }
</style>