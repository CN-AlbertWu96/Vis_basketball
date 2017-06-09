# -*- coding:utf-8 -*-

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

# index
@app.route('/')
def index():
    return render_template('index.html')

# login
@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)

# team level - band view
@app.route('/bandview')
def bandView():
    return render_template('band-view.html')

# game level - game view
@app.route('/gameview/<name>')
def competence(name):
    return render_template('game-view.html', name=name)

if __name__ == '__main__':
    manager.run()
