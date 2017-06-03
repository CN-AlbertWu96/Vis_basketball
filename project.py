#coding:utf-8

from flask import Flask, render_template
from flask_script import Manager
from flask_bootstrap import Bootstrap

app = Flask(__name__)

manager = Manager(app)
bootstrap = Bootstrap(app)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

#首页
@app.route('/')
def index():
    return render_template('index.html')

#用户登录
@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)

#bandView宏观界面
@app.route('/bandView')
def bandView():
    return render_template('bandView.html')

#competence细节展示界面
@app.route('/competence/<name>')
def competence(name):
    return render_template('competence.html',name=name)

if __name__ == '__main__':
    manager.run()
