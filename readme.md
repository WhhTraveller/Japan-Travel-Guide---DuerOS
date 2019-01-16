学习百度DuerOS技能开发，并做了这样一个案例，也方便自己后续回忆，及供大家参考，如大家有时间，也可以继续把功能丰富起来。目前只会给用户推荐旅游过程中走那几个景点。另外，还没有把交通、酒店、饮食、景点详细介绍等。感谢马蜂窝旅游网提供的数据。

# 学习资源

1、官网学习视频（自行观看技能开放平台部分视频）：
(https://dueros.baidu.com/didp/news/technicalclass)

2、要看更详细的介绍，可查看官网介绍文档（自行查看技能开放平台部分文档）：
https://dueros.baidu.com/didp/doc/index

3、介绍文档只有java SDK，node.js的SDK在这：
https://github.com/dueros/bot-sdk-node.js

4、官网案例列表：
https://dueros.baidu.com/forum/topic/show/296403

# 遇到的坑：
1、在通过函数CFC控制台，选择模板创建函数时，注意左上角的地区选项，现在只有“华北-北京”地区才有模板可选。
2、函数编辑好后，一定要在CFC控制台的触发器里，开启DuerOS触发器，技能开放平台才能调用到函数。
3、技能开发控制台的模拟测试真心不完善，有些显示功能跟真机不一样，只能呵呵了。以下是我遇到的两个展示问题：
    https://dueros.baidu.com/forum/topic/show/299109
    https://dueros.baidu.com/forum/topic/show/299107

# 遇到的问题

1、多轮对话里，怎样获取上轮对话的信息？
	  通过session存取；
    
2、常用表达里，是否需把不含槽位的常用表达也填入？
	  必须的，可把不含槽位的常用表达填入，再通过函数追问槽位。另外，因无法预知用户的可能表达，建议增加使用系统意图中的“缺省意图”处理。例如，用户直接说出槽位信息“东京”时，自定义意图无法回复时，会交给“缺省意图”处理。
    
4、怎样在技能回答用户时，根据回答的内容，显示图片？例如，回复的一段文字里包含“景点A"、"景点B"，当读到景点A名字时显示景点A的图片，当读到景点B时显示景点B的图片？
    无找到方法，每次技能回答用户时，都要把相关图片全部展示出来。	
    
7、什么时候使用this.nul.ask()，其执行操作是什么？
	  当需追问其它槽位时使用使用。使用后，会把该轮的所有槽位值都带到下一轮意图处理，并把用户回复作为被追问槽位的值。 
    
    
********** # 下面实操 # *********************************************************

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

