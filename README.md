# Vis_basketball

## 目录说明
```
Vis_basketball
│   README.md
│   project.py
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
>Python 3.3 通过 venv 模块原生支持虚拟环境,命令为 pyvenv 。 pyvenv 可以替代 virtualenv 。不过要注意,在 Python 3.3 中使用 pyvenv 命令创建的虚拟环境不包含 pip ,你需要进行手动安装。Python 3.4 改进了这一缺陷, pyvenv 完全可以代替virtualenv 。

大多数 Linux 发行版都提供了 virtualenv 包。例如,Ubuntu 用户可以使用下述命令安装它:

`sudo apt-get install python-virtualenv`

现在你要新建一个文件夹,用来保存示例代码(示例代码可从 GitHub 库中获取)。我们在前言的“如何使用示例代码”一节中说过,获取示例代码最简便的方式是使用 Git 客户端直接从 GitHub 下载。下述命令从 GitHub 下载示例代码,并把程序文件夹切换到“1a”版本,即程序的初始版本:

`$ git clone https://github.com/miguelgrinberg/flasky.git`
`$ cd flasky`
`$ git checkout 1a`

下一步是使用 virtualenv 命令在 flasky 文件夹中创建 Python 虚拟环境。这个命令只有一个必需的参数,即虚拟环境的名字。创建虚拟环境后,当前文件夹中会出现一个子文件夹,名字就是上述命令中指定的参数,与虚拟环境相关的文件都保存在这个子文件夹中。按照惯例,一般虚拟环境会被命名为 venv :

`$ virtualenv venv`

现在,flasky 文件夹中就有了一个名为 venv 的子文件夹,它保存一个全新的虚拟环境,其中有一个私有的 Python 解释器。在使用这个虚拟环境之前,你需要先将其“激活”。如果你使用 bash 命令行(Linux 和 Mac OS X 用户),可以通过下面的命令激活这个虚拟环境:

`$ source venv/bin/activate`

虚拟环境被激活后,其中 Python 解释器的路径就被添加进 PATH 中,但这种改变不是永久性的,它只会影响当前的命令行会话。为了提醒你已经激活了虚拟环境,激活虚拟环境的命令会修改命令行提示符,加入环境名:`(venv) $`

当虚拟环境中的工作完成后,如果你想回到全局 Python 解释器中,可以在命令行提示符下输入 deactivate 。
