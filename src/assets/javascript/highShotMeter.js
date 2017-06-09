/**
* 高拍仪
*/

//照片类型  2：现场照片   3：注册申请表   4：身份证  5：暂住证表  6：驾驶证申请表   7：体检表
var photosType;

//拍照控件对象
var captrue = document.getElementById("captrue");

//拍摄身份证次数，1代表已拍正面，2代表已拍反面
var idCardPhotographCount = 0;

var HIGHSHOTMETER = {
    //拍照    2：现场照片   3：注册申请表   4：身份证  5：暂住证表  6：驾驶证申请表   7：体检表
    doPhotograph: function (type) {
        photosType = type;
        //关闭正在拍照的摄像头
        var stopPlay = captrue.bStopPlay();
        //现场照片
        if (photosType == 2) {
            HIGHSHOTMETER.livePhoto();
        }
        //注册申请表
        else if (photosType == 3) {
            HIGHSHOTMETER.registApplicationForm();
        }
        //身份证
        else if (photosType == 4) {
            HIGHSHOTMETER.idCard();
        }
        //暂住证表
        else if (photosType == 5) {
            HIGHSHOTMETER.stayCardForm();
        }
        //驾驶证申请表
        else if (photosType == 6) {
            HIGHSHOTMETER.drivingLicenseApplicationForm();
        }
        //体检表
        else if (photosType == 7) {
            HIGHSHOTMETER.healthForm();
        }
    },
    //现场照片拍照
    livePhoto: function () {
        //启用副摄像头
        var startPlay = captrue.bStartPlay2(0);
        captrue.bSetMode(0);
    },
    //注册申请表
    registApplicationForm: function () {
        var startPlay = captrue.bStartPlayRotate(90);
        captrue.bSetMode(3);
    },
    //身份证拍照
    idCard: function () {
        //启用主摄像头
        var startPlay = captrue.bStartPlay();
        //设置模式
        captrue.bSetMode(4);
    },
    //暂住证表拍照
    stayCardForm: function () {
        var startPlay = captrue.bStartPlay();
        captrue.bSetMode(3);
        captrue.bSaveMergeStart("D:\\", "5", 1, 2, 5, 5);
    },
    //驾驶证申请表拍照
    drivingLicenseApplicationForm: function () {
        var startPlay = captrue.bStartPlayRotate(90);
        captrue.bSetMode(3);
    },
    //体检表拍照
    healthForm: function () {
        var startPlay = captrue.bStartPlayRotate(90);
        captrue.bSetMode(3);
    },
    //保存拍照  url:上传照片地址
    savePhoto: function (url) {
        //上传照片后返回的路径
        var photosUrl = "";
        //照片名称
        var photosName = photosType.toString();
        //身份证需正反面拍照，共拍照两次，计数已拍照次数
        if (photosType == 4) {
            idCardPhotographCount += 1;
        }
        //保存图片至本机
        if (photosType == 5) {
            var saveMergePage = captrue.bSaveMergePage();
            if (!confirm("需要再拍摄暂住证明其他页吗？")) {
                var saveMergeEnd = captrue.bSaveMergeEnd();
                var stopPlay = captrue.bStopPlay();
                photosUrl = HIGHSHOTMETER.uploadPhoto("D:\\5.JPG", url);
                return photosUrl;
            }
        }
        else {
            var str = captrue.bSaveJPG("D:\\", photosName);
            if (photosType == 4 && idCardPhotographCount == 2) {
                var stopPlay = captrue.bStopPlay();
                photosUrl = HIGHSHOTMETER.uploadPhoto("D:\\" + photosName + ".JPG", url);
                return photosUrl;
            }
            else if (photosType != 1) {
                var stopPlay = captrue.bStopPlay();
                photosUrl = HIGHSHOTMETER.uploadPhoto("D:\\" + photosName + ".JPG", url);
                return photosUrl;
            }
        }

    },
    //上传照片
    uploadPhoto: function (photoPath, url) {
        //获取上传地址信息
        var ip;
        var port;
        url = url.replace("http://", "").replace("https://", "");
        var rooturl = url.substring(0, url.indexOf("/"));
        var functionUrl = url.substring(url.indexOf("/"), url.length);
        var index = rooturl.indexOf(":");
        if (index < 0) {
            ip = rooturl;
            port = 80;
        }
        else {
            ip = rooturl.substring(0, index);
            port = rooturl.substring(index + 1);
        }
        //上传本地照片到服务器
        var photosUrl = captrue.sUpLoadImageEx2(photoPath, ip, port, functionUrl, true, true);
        return photosUrl;
    }
}