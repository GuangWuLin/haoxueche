import Mock from "mockjs";

const LoginUsers = [
    {
        id: 1,
        userName: "18981947813",
        password: "zl15198275928",
        avatar: "https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png",
        name: "好学车"
    }
]

const Users = [];

for (let i = 0; i < 86; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        phone: Mock.Random.natural(10, 100),
        addr: Mock.mock("@county(true)"),
        "age|18-60": 1,
        birth: Mock.Random.date(),
        cashType: Mock.Random.integer(0, 1),
        trainingType: Mock.Random.integer(0, 1),
        appointNumber:Mock.Random.integer(0, 1),
        carType:Mock.Random.integer(0, 1),
        stage2: Mock.Random.natural(10, 100),
        stage3: Mock.Random.natural(10, 100),
        school: Mock.Random.natural(10, 100),
    }));
}

export { LoginUsers, Users };