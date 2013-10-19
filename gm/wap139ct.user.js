// ==UserScript==
// @name        移动疯狂猜图
// @namespace   wap139ct
// @include     http://wap.139sz.cn/szyd/rdlb/guess.php
// @grant       89415119@qq.com
// ==/UserScript==
var answers = ['chrome','facebook','ipad','KFC','LG','MOTOROLA','nike','P6','smart','TOM猫','UC浏览器','阿里旺旺','爱国者','爱奇艺','安全出口','安卓','奥林巴斯','澳门','白马涧','百花洲公园','百事','保卫萝卜','北寺塔','必胜客','彪马','出租车','大众点评','戴尔','当心爆炸','当心触电','当心中毒','迪奥','东方之门','东风标致','动感地带','二维码','飞信','愤怒的小鸟','富春山居图','高达','工商银行','观前街','轨道交通','桂花公园','国徽','哈根达斯','海宝','海尔','海洋馆','海洋宣传日','海贼王','寒山寺','荷塘月色湿地公园','黑人','红牛','红丝带','红塔山','宏基','葫芦丝','虎丘','花花公子','华硕','华为','欢欢','环境组织','惠普','苏州火车站','火狐浏览器','佳能','家乐福','建设银行','江苏银行','交通银行','金利来','禁止超车','禁止鸣喇叭','禁止攀登','禁止吸烟','京东商城','考拉','科比','可口可乐','匡威','蓝精灵','雷克萨斯','雷蛇','李宁','立顿','联邦快递','联合国粮食及农业组织','留园','轮滑','麦当劳','盲探','毛主席','魅族','咪咕','米其林','灭火器','摩天轮','墨迹天气','尼康','诺基亚','苹果','浦发银行','乔丹','请带安全帽','屈臣氏','全民健身日','全球通','人人','三星','三叶草','扫雷','沙家浜','上方山','申通快递','神庙逃亡','神州行','圣迪奥','狮子林','石湖','时代广场','世博会','世界贸易组织','世界自然基金会','手机电视','双塔','水上乐园','顺丰快递','丝绸','斯巴达','死飞','死亡笔记','苏宁易购','苏绣','苏州博物馆','苏州大学','苏州电视台','苏州科技城','苏州科技文化艺术中心','苏州乐园','苏州桥','苏州生活','苏州石路','苏州银行','印象城','索尼','索尼爱立信','太湖','体育中心','天猫','天平山','拙政园','天天动听','同里','万达','网师园','微博','微信','文庙','我查查','沃尔沃','西山','吸烟区','喜羊羊与灰太狼','相门','香港','小时代','苏州新区','熊猫','玄妙观','雪弗兰','姚明','一线天','移动梦网','意大利','引领3G生活','与狼共舞','圆通快递','月光码头','轧神仙','找你妹','支付宝','植物大战僵尸','志愿者组织','中国福利彩票','中国好声音','中国人寿','中国石油','中国体育彩票','中国铁通','中国移动','中国银行','中国邮政','中信银行','中兴','忠王府','周庄','山塘街','G3','LG','TVB','爱玛电动车','爱婴医院','安徽卫视','澳门澳亚卫视台','百安居','邦德电动车','保健食品','北京','北京怡园动物医院','背靠背','比德文电动车','必胜客','必须带安全带','长城汽车','大润发','稻香村','德国大众','地球科技星标志','帝豪','第一汽车','东方货运','东方卫视','东风标致','东风雪铁龙','东海航空','东南汽车','东南卫视','法国雷诺','法拉利','丰田','福田汽车','富士达电动车','甘肃电视台','格力','古驰','广东发展银行','广亚医药','广州','广州电视台','广州银行','贵阳电视台','桂林电视台','国美电器','杭州','河北卫视','黑龙江电视台','红旗','湖南电视台','华普','华泰汽车','华泰证券','华为','黄岩医药','姬芮','吉利汽车','家乐福','江淮汽车','江苏电视台','江苏银行','交通银行','洁丽雅','金锣火腿','九牛一品','君都大酒店','凯迪拉克','肯德基','蓝镖快递','蓝山咖啡','力加啤酒','莲花','辽宁卫视','绿色食品','绿源电动车','麦当劳','曼秀雷敦','美通快递','灭火器','男童装标志','南京','女童装标志','欧尚','朋友咖啡','七匹狼服饰','洽洽','千岛湖啤酒','乔丹体育','青岛啤酒','青海卫视','请勿吸烟','全球加工制造业','雀巢','三环汽车','三九企业集团','沙宣','上海电视台','上海银行','申通快递','双拥标志','顺丰快递','四川卫视','苏州广播电视总台','速尔物流','索尼','太极八卦','太平人寿','天津','天猫','万基房地产','我的咖啡','五星电器','香格里拉酒店','小刀电动车','小鸟电动车','小天鹅','小心碰头','新日电动车','徐州儿童医院','炫动卡通','雪花啤酒','雅鹿','亚虹医药','燕京啤酒','野马汽车','伊卡璐','伊丽莎白咖啡','英伦汽车','英雄联盟勋章','永和豆浆','优度咖啡','玉兰花','圆通快递','云南电视台','枣庄','质量安全','中国大地保险','中国江苏','中国教育电视台','中国人民保险公司','中国人寿保险公司','中国烟台','中国银行','中通快递','转角咖啡厅','最.咖啡'];
var id = document.querySelector('.guess_question_num').textContent;
setTimeout(function () {
    var $ = unsafeWindow.$;
    $.post('ajax_guess.php', {'answer':answers[id-1], 'act':'submit'}, function(data){
    	var jsonData = $.parseJSON(data);
    	console.log(jsonData.message);
    	if ("1" == jsonData.result) {
    		window.location.reload();
    	} else {
    		alert('error');
    	}
    }); 
}, 3000);