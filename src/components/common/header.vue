<template>
	<div class="top-header">
		<div class="left">
			
		</div>
		<div class="right mr40">
			
		</div>
	</div>
</template>

<script>
	import { global } from "../../assets/javascript/global";
	export default {
		data() {
			return {
				loginUser: "",
				environment: global.localstorage.get("environment"),
				userType:""
			}
		},
		methods: {
			handleSelect(key, keyPath) {
				if (keyPath.length > 1) {
					if (keyPath[1] === "2-1") {
						global.session.clear();
						this.$router.replace({ path: "/login" });
					}
				}
				else {
					this.$router.replace({ path: "/merchant/workOrder" });
				}
			},
			handleCommand: function (cmd) {
				global.localstorage.add("environment", cmd);
				this.environment = cmd;
				this.$router.go({ path: this.$route.path });
			}
		},
		mounted() {
			var user = global.user.get().user;
			if (user) {
				this.loginUser = user.email || "";
				this.userType = global.user.get().type;
				console.log(this.userType);
			}
		}
	}

</script>

<style>
	.top-header {
		background: #FFF;
		width: 100%;
		height: 70px;
		box-shadow: 0 2px 4px rgba(4, 0, 0, 0.1);
		/*position: absolute;
		top: 0;
		z-index: 999;*/
	}
	
	.top-header .el-dropdown {
		color: #999;
		font-size: 12px;
		position: absolute;
		top: 12px;
		left: 165px;
		border: 1px solid rgb(192, 204, 218);
		border-radius: 4px;
		padding: 0 5px;
	}
	
	.el-dropdown-menu {
		min-width: 80px;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(4, 0, 0, 0.1);
	}
	
	.el-dropdown-menu__item {
		list-style: none;
		line-height: 22px;
		cursor: pointer;
		color: #333;
	}
	
	.top-header>div:first-child {
		margin-left: 36px;
	}
	
	.top-header>div:first-child>a.logo {
		background: none;
		width: 125px;
		height: 40px;
		display: inline-block;
		margin-top: 15px;
	}
	
	.peanut-switch-inner {
		width: 100px;
		color: #999;
		position: absolute;
		left: 232px;
		top: 28px;
		cursor: pointer;
	}
	
	.peanut-switch {
		display: none;
	}
	
	.peanut-switch+label {
		cursor: pointer;
		background-color: #b6b6b6;
		border-radius: 100px;
		display: inline-block;
		position: relative;
		top: 0;
		-webkit-transition: all 0.1s ease-in;
		transition: all 0.1s ease-in;
		width: 32px;
		height: 10px;
	}
	
	.el-menu {
		background: #FFF;
	}
	
	.el-menu--horizontal .el-menu-item,
	.el-menu--horizontal>.el-menu-item:hover,
	.el-submenu .el-menu-item:hover,
	.el-submenu__title:hover,
	.el-menu--horizontal>.el-submenu.is-active .el-submenu__title,
	.el-menu--horizontal>.el-submenu:hover .el-submenu__title {
		border: 0;
		background: #FFF;
	}
	
	.el-menu-item,
	.el-submenu__title {
		color: #333;
		text-align: center;
	}
	
	.el-menu--horizontal .el-submenu .el-submenu__title,
	.el-menu--horizontal .el-menu-item {
		height: 70px;
		line-height: 70px;
		border: 0;
	}
	
	.el-menu-item.is-active {
		color: #333;
	}
	
	.el-icon-customer {
		background: none;
		width: 20px;
		height: 16px;
		display: inline-block;
		position: relative;
		top: 3px;
		left: 10px;
	}
	
	.el-icon-customer.workOrder {
		background-position: -23px 0;
	}
</style>