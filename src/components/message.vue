<template>
    <div id="messagepage">
        <h1>This is the messages page</h1>
        <div id="nav">
            <router-link to="/messages/chat/1">User 1</router-link> |
            <router-link to="/messages/chat/2">User 2</router-link> |
            <router-link to="/messages/chat/3">User 3</router-link> |
            <router-link to="/messages/chat/4">User 4</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
</script>

<style scoped>
</style>