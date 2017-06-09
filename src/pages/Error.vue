<template>
    <div class="error">
        <div class="header">
            <p class="logo"></p>
        </div>
        <p class="content">
            会话超时，需<a href="javascript:" @click="error">重新登录</a>
        </p>
    </div>

</template>

<style scoped>
    .error {
        width: 80%;
        margin: 2em auto;
        font-size: 1.2em;
        color: #333;
        text-align: center;
    }
    
    .error .header {
        width: 100%;
        height: 70px;
    }
    
    .error .header p.logo {
        background: none;
        width: 130px;
        height: 42px;
    }
    
    .error p.content {
        margin-top: 10%;
    }
    
    .error p.content a {
        color: #127abd;
        margin-left: 5px;
    }
    
    .error p.content a:hover {
        text-decoration: underline;
    }
</style>

<script>
    import { global } from "../assets/javascript/global";
    export default {
        methods: {
            error: function () {
                global.session.clear();
                this.$router.replace({ path: "/login" });
            }
        }
    }

</script>