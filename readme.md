学习百度DuerOS技能开发，并做了这样一个案例，也方便自己后续回忆，及供大家参考，如大家有时间，也可以继续把功能丰富起来。目前只会给用户推荐旅游过程中走那几个景点，另外，还没有把交通、酒店、饮食、景点详细介绍等。感谢马蜂窝旅游网提供的数据。

# 日本旅游攻略技能

本文以日本旅游攻略技能为例，从技能交互、技能CFC部署讲述如何快速搭建类似技能。


## 交互模型

当用户说出了想要了解的日本某城市旅游攻略时，技能向用户读出该知识的详细介绍。

下面以`东京3天旅游攻略`技能为例，描述指技能与用户交互过程：

>**用户**：打开日本旅游攻略
>**技能**：欢迎使用日本旅游攻略!你可以对我说：东京3天旅游攻略？
>**用户**：东京3天旅游攻略？
>**技能**：第一天：……。第二天：……

## 开发技能的流程
### 新建技能

新建技能详情请参阅[自定义技能创建](https://dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-custom/create-custom-skill_markdown)
### 配置意图

意图配置详情请参阅[意图、常用表达和槽位](https://dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-nlu/intents_markdown)

日本旅游攻略技能需要创建“询问攻略”意图。
询问攻略意图如下图所示：

![询问攻略意图](http://dbp-resource.gz.bcebos.com/29117267-ae07-aa1c-f110-e579fa6d2fb7/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190116211651.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-16T13%3A30%3A39Z%2F-1%2F%2Fdeb44be288e93800049bb54bd8642c1967fe8af120c33818245e639b581beb3c)

还有，当同一城市同一天数不只一条攻略时（如：东京3天旅游攻略，有2条推荐攻略），需要创建“下一个”意图：
![下一个攻略](http://dbp-resource.gz.bcebos.com/29117267-ae07-aa1c-f110-e579fa6d2fb7/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190116211725.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-16T13%3A30%3A39Z%2F-1%2F%2F28b792ec0c1d38fbaefd6987020de09ace7c25e8bf78429ea4438e16c2a1f224)

另外，为处理用户直接说“东京”名称的用例，技能还引用了[系统缺省意图](https://developer.dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-nlu/defaultIntent_markdown)。
![意图列表](http://dbp-resource.gz.bcebos.com/29117267-ae07-aa1c-f110-e579fa6d2fb7/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190116212136.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-16T13%3A30%3A39Z%2F-1%2F%2Fb0cea63fe453ab2f9b69fe1ec6e1effb3bfd3b86cde1ca73e250726ccb3ea2ff)

### 配置技能服务部署

日本旅游攻略技能使用CFC部署技能服务。使用CFC部署技能服务详情请参阅 [百度云CFC](https://dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-deploy/cfc-deploy_markdown)

### 修改CFC函数代码
技能使用travelData.js配置数据。开发者需要下载技能CFC函数完整zip程序包到本地进行开发，开发完成后上传函数zip包进行发布。具体流程如下：

在CFC控制台通过模板创建函数, 选择node.js DuerOS Bot SDK模板
函数生成后，在函数控制台点击点击下载完整 ZIP 程序包链接下载程序包
在本地解压程序包
将日本旅游攻略技能中的travelData.js文件拷贝到程序包文件夹中
使用日本旅游攻略技能中的index.js文件替换程序包文件夹中的index.js文件
将程序包文件夹中的所有文件重新打包成zip文件
在函数控制台上传zip程序包并保存
CFC操作说明请参阅函数计算 CFC

### 测试技能
至此，日本旅游攻略技能就开发完成了。开发者可以在技能开放平台的模拟测试页面对技能进行测试。

