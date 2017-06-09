<template>
    <div class="container">
        <h1>404</h1>
        <p><strong>page not found</strong></p>
        <div class="suggestions">
            <a href="javascript:" @click="redirect('/login');">登录</a> —
            <a href="javascript:" @click="redirect('/');">产品</a>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            redirect: function (to) {
                this.$router.replace({ path: to });
            }
        }
    }

</script>

<style scoped>
    .container {
        margin: 50px auto 40px auto;
        width: 600px;
        text-align: center;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    
    .suggestions {
        margin-top: 35px;
        color: #ccc;
    }
    
    .suggestions a {
        color: #666666;
        font-weight: 200;
        font-size: 14px;
        margin: 0 10px;
    }
    
    .suggestions a:hover {
        text-decoration: underline;
    }
    
    strong {
        font-weight: bold;
    }
    
    h1 {
        width: 800px;
        position: relative;
        left: -100px;
        letter-spacing: -1px;
        line-height: 60px;
        font-size: 60px;
        font-weight: 100;
        margin: 0px 0 50px 0;
        text-shadow: 0 1px 0 #fff;
    }
    
    p {
        color: rgba(0, 0, 0, 0.5);
        margin: 20px 0;
        line-height: 1.6;
        font-size: 1.5em;
    }
</style>