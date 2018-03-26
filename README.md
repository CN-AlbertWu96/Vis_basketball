# Vis_basketball

## 目录说明
```
Vis_basketball
│   README.md
│   project.py
|   requirements.txt
│
└───template
│   |   playerStream.html
│   |   gameClock.html
|   |   bandView.html
|   |   courtChart.html
|   └   ...
|
└───static
    |   js
    |   css
    |   img
    └   data
```

## 环境配置(ubuntu 16.04)
- **Python** ：本框架使用python2.7；
- **Python包下载** ：利用pip安装flask,flask_script,flask_bootstrap；
- **虚拟环境搭建(可供选择)** ：假如你的主机安装的是python3.x，若只想在该文件夹下使用python2.x，可选择搭建虚拟环境。

### 虚拟环境搭建说明(参考[狗书](http://pan.baidu.com/s/1misgQbI))
虚拟环境使用第三方实用工具 **virtualenv** 创建。输入以下命令可以检查系统是否安装了virtualenv :
`$ virtualenv --version`
如果结果显示错误,你就需要安装这个工具。
接下来我们假设已经安装了virtualenv，那么接下来是`安装虚拟环境`并clone项目文件

```bash
$ virtualenv basketball
$ git clone https://github.com/CN-AlbertWu96/Vis_basketball.git
```

激活虚拟环境，`安装依赖包`并运行项目，设置监听端口为12333

```bash
$ source basketball/bin/activate
(basketball)$ pip install -r requirements.txt
(basketball)$ cd Vis_basketball
(basketball)$ python project.py runserver -h 0.0.0.0 -p 12333
```

### 项目重启说明
现在我已经将项目部署在了12333端口，并开启了screen-basketball运行项目。
假如宕机，则用账号密码进入服务器后打开screen并重启项目
```bash
$ screen -ls
$ screen -r basketball
$ source basketball/bin/activate
(basketball)$ python project.py runserver -h 0.0.0.0 -p 12333
```
