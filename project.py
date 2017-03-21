from flask import Flask, render_template
from flask_script import Manager
from flask_bootstrap import Bootstrap
#from flask_assets import Bundle, Environment


app = Flask(__name__)

manager = Manager(app)
bootstrap = Bootstrap(app)
#bundles = {
#    'project1_js': Bundle(
#        'js/lib/d3.js'
#        'js/stream.js'
#	output='gen/project1.js')
#}

#assets = Environment(app)
#assets.register(bundles)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)

@app.route('/playerStream')
def playStream():
    return render_template('playerStream.html')

@app.route('/gameClock')
def gameClock():
    return render_template('gameClock.html')

@app.route('/courtChart')
def courtChart():
    return render_template('courtChart.html')

@app.route('/bandView')
def bandView():
    return render_template('bandView.html')

@app.route('/test')
def test():
    return render_template('test.html')

if __name__ == '__main__':
    manager.run()
