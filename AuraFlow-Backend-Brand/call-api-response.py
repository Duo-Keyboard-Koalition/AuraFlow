# have python call an API and return the response
import requests
r = requests.get('http://127.0.0.1:5000')
print(r)
print(r.text)
print(r.json())