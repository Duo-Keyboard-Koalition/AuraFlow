# make sample flask app in development mode
# run with: FLASK_APP=app.py FLASK_ENV=development flask run
# or: FLASK_APP=app.py FLASK_ENV=development python -m flask run
# or: FLASK_APP=app.py FLASK_ENV=development python3 -m flask run
# or: FLASK_APP=app.py FLASK_ENV=development python3.7 -m flask run
from flask import Flask
from flask.views import MethodView

app = Flask(__name__)

class HelloWorldView(MethodView):
    def get(self):
        # make a dictionary
        my_dict = {'name': 'John', 'age': 31, 'city': 'New York'}
        return my_dict

# Register the view with the app
app.add_url_rule('/', view_func=HelloWorldView.as_view('hello_world'))

if __name__ == "__main__":
    app.run(debug=True)