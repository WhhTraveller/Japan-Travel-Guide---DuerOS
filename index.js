/*
* 如果需要使用监控统计功能，请将PUBLIC KEY 复制到DuerOS DBP平台
* 文档参考：https://dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-deploy/authentication_markdown

-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7mM3hmH4a/TTePDUBodNCObli
oT62ew6vL+2yZ8xcOqsQOC8aF38QWFl88GmrBHYb7QPoihqnWExv5z8x9OKI1uaW
oWtyss/ylV1oHTt76o7q8TYzv5r430tekVcHtwpa0LsSfNynoCNn62KWaCEE9tv+
Lgo+KnDcbL+wd22lQQIDAQAB
-----END PUBLIC KEY-----

*/
/**
 * @file   index.js 此文件是函数入口文件，用于接收函数请求调用
 * @author dueros
 */
const Bot = require('bot-sdk');
const privateKey = require('./rsaKeys.js').privateKey;
const travelData = require("./travelData.js").travelData;
const RenderTemplate = Bot.Directive.Display.RenderTemplate;
const ListTemplate1 = Bot.Directive.Display.Template.ListTemplate1;
const ListTemplate4 = Bot.Directive.Display.Template.ListTemplate4;
const ListTemplate3 = Bot.Directive.Display.Template.ListTemplate3;
const ListTemplateItem = Bot.Directive.Display.Template.ListTemplateItem;
const Hint = Bot.Directive.Display.Hint;
const BodyTemplate1 = Bot.Directive.Display.Template.BodyTemplate1;

class InquiryBot extends Bot {
    constructor(postData) {
        super(postData);
        let bodyTemplateBg = new BodyTemplate1();
        //设置模版背景图片
        bodyTemplateBg.setBackGroundImage('http://dbp-resource.gz.bcebos.com/29117267-ae07-aa1c-f110-e579fa6d2fb7/bg.jpg?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-12T15%3A44%3A59Z%2F-1%2F%2F7c70a5bbc323ddf1b8c6ef7f692439e68cd63709756f89864bd8ac9334bf00ad');
        //设置模版标题
        bodyTemplateBg.setTitle('日本旅游攻略');

        this.addLaunchHandler(() => {
            this.waitAnswer();
            let listTemplate = new ListTemplate4();
            listTemplate.setToken('listTemplateHome');
            listTemplate.setTitle("日本旅游攻略")
            listTemplate.setBackGroundImage('http://dbp-resource.gz.bcebos.com/29117267-ae07-aa1c-f110-e579fa6d2fb7/bg.jpg?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-12T15%3A44%3A59Z%2F-1%2F%2F7c70a5bbc323ddf1b8c6ef7f692439e68cd63709756f89864bd8ac9334bf00ad');
            let cityArray = ["东京","大阪","京都","北海道","箱根","奈良","名古屋","镰仓"];
            for(let i=0;i<cityArray.length;i++){
                let listTemplateItem = new ListTemplateItem();
                listTemplateItem.setToken("cityName"+i);
                listTemplateItem.setPlainPrimaryText(cityArray[i]);
                listTemplate.addItem(listTemplateItem);
            }
            //定义RenderTemplate指令
            let renderTemplate = new RenderTemplate(listTemplate);
            let hint = new Hint(cityArray);
            return {
                directives:[renderTemplate,hint],
                outputSpeech: '欢迎使用日本旅游攻略，你可以对我说：东京3天旅游攻略'
            };
        });

        this.addSessionEndedHandler(() => {
            this.endSession();
            //设置模版token
            bodyTemplateBg.setToken('bodyTemplateEnd');
            //设置模版plain类型的文本
            bodyTemplateBg.setPlainTextContent('多谢使用日本旅游攻略！'); 
            //定义RenderTemplate指令
            let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
            return {
                directives:[renderTemplateBg],
                outputSpeech:'多谢使用日本旅游攻略!'
            };
        });

        this.addIntentHandler('AskForGuide', () => {
            this.waitAnswer();
            let city = this.getSlot('sys.foreign-city');//sys.foreign-city槽位格式为json字符串
            let days = this.getSlot("sys.number");

            if (!city) {
                bodyTemplateBg.setToken("bodyTemplateAskCity");
                bodyTemplateBg.setPlainTextContent("您想了解日本哪个城市的攻略？");
                let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
                let hint = new Hint(["东京","大阪","京都","北海道","箱根","奈良","名古屋","镰仓"]);
                this.nlu.ask('sys.foreign-city');
                return {
                    directives: [renderTemplateBg,hint],
                    outputSpeech: '您想了解日本哪个城市的攻略？'
                };
            }

            let cityName = JSON.parse(city)["foreign-city"];//获取json字条串中的指定值
            let travelDataByCity = this.findArrayFromArray(travelData,"cityName", cityName);
            if (travelDataByCity.length==0) {
                bodyTemplateBg.setToken("bodyTemplateAskCityIn");
                bodyTemplateBg.setPlainTextContent("我还不知道"+cityName+"的攻略。换一个城市试试吧。");
                let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
                let hint = new Hint(["东京","大阪","京都","北海道","箱根","奈良","名古屋","镰仓"]);
                this.nlu.ask("sys.foreign-city");
                return {
                    directives:[renderTemplateBg,hint],
                    outputSpeech: "我还不知道"+cityName+"的攻略。换一个城市试试吧。"
                };
            }

            if(!days){
                bodyTemplateBg.setToken("bodyTemplateAskDays");
                bodyTemplateBg.setPlainTextContent("您想了解"+cityName+"几天的攻略？");
                let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
                let daysArray=[];
                for(let i=0;i<travelDataByCity.length;i++){
                    if(daysArray.indexOf(travelDataByCity[i].days+"天")==-1){
                        daysArray.push(travelDataByCity[i].days+"天");
                    }
                }
                let hint = new Hint(daysArray);
                this.nlu.ask("sys.number");
                return {
                    directives:[renderTemplateBg,hint],
                    outputSpeech:"您想了解"+cityName+"几天的攻略？"
                };
            }
            let travelDataByCityAndDays = this.findArrayFromArray(travelDataByCity,"days",days);
            if(travelDataByCityAndDays.length==0){
                bodyTemplateBg.setToken("bodyTemplateAskDaysIn");
                bodyTemplateBg.setPlainTextContent("我还不知道"+cityName+days+"天的旅游攻略。换一个天数试试吧。");
                let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
                let daysArray=[];
                for(let i=0;i<travelDataByCity.length;i++){
                    if(daysArray.indexOf(travelDataByCity[i].days+"天")==-1){
                        daysArray.push(travelDataByCity[i].days+"天");
                    }
                }
                let hint = new Hint(daysArray);
                this.nlu.ask("sys.number");
                return{
                    directives:[renderTemplateBg,daysArray],
                    outputSpeech:"我还不知道"+cityName+days+"天的旅游攻略。换一个天数试试吧。"
                };
            }

            if(this.request.isDialogStateCompleted()){
                this.setSessionAttribute("travelDataByCityAndDays",travelDataByCityAndDays);
                this.setSessionAttribute("travelDataPlayIndex",1);
                this.setSessionAttribute("city",cityName);
                this.setSessionAttribute("days",days);
                let nextTxt ="下一条";
                if(!travelDataByCityAndDays[1]){
                    nextTxt = cityName+"旅游攻略"
                }

                let listTemplate = new ListTemplate1();
                listTemplate.setToken("templateTravelDetail");
                listTemplate.setTitle(cityName+days+"天旅游攻略");
                listTemplate.setBackGroundImage("http://dbp-resource.gz.bcebos.com/29117267-ae07-aa1c-f110-e579fa6d2fb7/bg.jpg?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-12T15%3A44%3A59Z%2F-1%2F%2F7c70a5bbc323ddf1b8c6ef7f692439e68cd63709756f89864bd8ac9334bf00ad");
                if(travelDataByCityAndDays[0].images && travelDataByCityAndDays[0].images.length>0){
                    for(let i=0;i<travelDataByCityAndDays[0].images.length;i++){
                        let listTemplateItem = new ListTemplateItem();
                        listTemplateItem.setToken("templateItemTravelDetail"+i);
                        listTemplateItem.setImage(travelDataByCityAndDays[0].images[i].imgUrl);
                        listTemplateItem.setPlainPrimaryText(travelDataByCityAndDays[0].images[i].imgName);
                        listTemplateItem.setPlainSecondaryText(travelDataByCityAndDays[0].images[i].dayAt);
                        listTemplate.addItem(listTemplateItem);
                    }
                }
                let renderTemplate = new RenderTemplate(listTemplate);
                let hint = new Hint([nextTxt]);
                return{
                    directives:[renderTemplate,hint],
                    outputSpeech:travelDataByCityAndDays[0].guide
                };
            }

        });

        /**
         * 获取下一条攻略的意图
         */
        this.addIntentHandler("NextGuide",()=>{
            this.waitAnswer();
            let travelDataByCityAndDays = this.getSessionAttribute("travelDataByCityAndDays");
            let travelDataPlayIndex = this.getSessionAttribute("travelDataPlayIndex");
            let city = this.getSessionAttribute("city");
            let days = this.getSessionAttribute("days");
            
            if(!travelDataByCityAndDays){
                let listTemplate = new ListTemplate4();
                listTemplate.setToken('listTemplateEmpty');
                listTemplate.setTitle("日本旅游攻略")
                listTemplate.setBackGroundImage('http://dbp-resource.gz.bcebos.com/29117267-ae07-aa1c-f110-e579fa6d2fb7/bg.jpg?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-12T15%3A44%3A59Z%2F-1%2F%2F7c70a5bbc323ddf1b8c6ef7f692439e68cd63709756f89864bd8ac9334bf00ad');
                let cityArray = ["东京","大阪","京都","北海道","箱根","奈良","名古屋","镰仓"];
                for(let i=0;i<cityArray.length;i++){
                    let listTemplateItem = new ListTemplateItem();
                    listTemplateItem.setToken("cityName"+i);
                    listTemplateItem.setPlainPrimaryText(cityArray[i]);
                    listTemplate.addItem(listTemplateItem);
                }
                //定义RenderTemplate指令
                let renderTemplate = new RenderTemplate(listTemplate);
                let hint = new Hint(["东京旅游攻略"]);
                return{
                    directives:[renderTemplate,hint],
                    outputSpeech:"要了解日本旅游攻略吗？你可以对我说：东京3天旅游攻略。"
                }
            }

            let nextTxt="下一条";
            if(!travelDataByCityAndDays[travelDataPlayIndex+1]){
                nextTxt=city+"旅游攻略";
            }
            else{
                 this.setSessionAttribute("travelDataPlayIndex",travelDataPlayIndex+1);
            }

            let listTemplate = new ListTemplate1();
                listTemplate.setToken("templateTravelDetail");
                listTemplate.setTitle(city+days+"天旅游攻略");
                if(travelDataByCityAndDays[travelDataPlayIndex].images && travelDataByCityAndDays[travelDataPlayIndex].images.length>0){
                    for(let i=0;i<travelDataByCityAndDays[travelDataPlayIndex].images.length;i++){
                        let listTemplateItem = new ListTemplateItem();
                        listTemplateItem.setToken("templateItemTravelDetail"+i);
                        listTemplateItem.setImage(travelDataByCityAndDays[travelDataPlayIndex].images[i].imgUrl);
                        listTemplateItem.setPlainPrimaryText(travelDataByCityAndDays[travelDataPlayIndex].images[i].imgName);
                        listTemplateItem.setPlainSecondaryText(travelDataByCityAndDays[travelDataPlayIndex].images[i].dayAt);
                        listTemplate.addItem(listTemplateItem);
                    }
                }
                let renderTemplate = new RenderTemplate(listTemplate);
                let hint = new Hint([nextTxt]);
            return{
                directives:[renderTemplate,hint],
                outputSpeech:travelDataByCityAndDays[travelDataPlayIndex].guide+"好了，我介绍完了。你可以跟我说："+nextTxt
            };
        });

        /*
        * 获取没有被inquiry意图解析的用户输入，并进行相关处理
        * 缺省意图 https://developer.dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-nlu/defaultIntent_markdown
        */
        this.addIntentHandler('ai.dueros.common.default_intent', () => {
            this.waitAnswer();
            let city = this.request.getQuery();

            if (!city) {
                bodyTemplateBg.setToken("defaultAnswer");
                bodyTemplateBg.setPlainTextContent("你要了解日本旅游攻略吗？你可以对我说：东京3天旅游攻略");
                let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
                let cityArray = ["东京","大阪","京都","北海道","箱根","奈良","名古屋","镰仓"];
                let hint = new Hint(cityArray);
                return {
                    directives:[renderTemplateBg,hint],
                    outputSpeech: '你要了解日本旅游攻略吗？你可以对我说：东京3天旅游攻略'
                };
            }else{
                let travelDataByCity = this.findArrayFromArray(travelData,"cityName",city);
                if(travelDataByCity.length>0){//能找到相关数据，侧把城市槽位设置为用户输入，并追问天数。当用户回复天数时，会识别为AskForGuide意图；
                    this.setSlot("sys.foreign-city","{\"foreign-city\":\""+city+"\"}");
                    this.nlu.ask("days");
                    let days=this.getSlot("days");
                    bodyTemplateBg.setToken("defaultAnswer");
                    bodyTemplateBg.setPlainTextContent("您想了解"+city+"几天的攻略？");
                    let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
                    let daysArray=[];
                    for(let i=0;i<travelDataByCity.length;i++){
                        if(daysArray.indexOf(travelDataByCity[i].days+"天")==-1){
                            daysArray.push(travelDataByCity[i].days+"天");
                        }
                    }
                    let hint = new Hint(daysArray);
                    return{
                        directives:[renderTemplateBg,hint],
                        outputSpeech:"您想了解"+city+"几天的攻略？"
                    }
                }else{
                    bodyTemplateBg.setToken("defaultAnswer");
                    bodyTemplateBg.setPlainTextContent("我还不知道"+city+"的攻略。换一个城市试试吧。");
                    let renderTemplateBg = new RenderTemplate(bodyTemplateBg);
                    let cityArray = ["东京","大阪","京都","北海道","箱根","奈良","名古屋","镰仓"];
                    let hint = new Hint(cityArray);
                    return {
                        directives:[renderTemplateBg,hint],
                        outputSpeech: "我还不知道"+city+"的攻略。换一个城市试试吧。"
                    };
                }
            }
        });
    }

    /**
     * 遍历对象数组，返回有某属性的对象数组
     * @array 对象数组
     * @key 属性的键
     * @val 属性的值
     * @return 返回找到的，有某属性的对象数组，找不到返回[]
     */
    findArrayFromArray(array,key,val){
        let targetArray =[];
        for(let i=0;i<array.length;i++){
            if(array[i][key]==val){
                targetArray.push(array[i]);
            }
        }
        return targetArray;
    }

}

exports.handler = function (event, context, callback) {
    try {
        let b = new InquiryBot(event);
        // 0: debug  1: online
        b.botMonitor.setEnvironmentInfo(privateKey, 0);
        b.run().then(function (result) {
            callback(null, result);
        }).catch(callback);
    }
    catch (e) {
        callback(e);
    }
};
