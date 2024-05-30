import yaml
import requests

url = "http://yourapiurl.com/films"

# Load the YAML file
with open('data.yaml', 'r') as file:
    data = yaml.safe_load(file)

for film in data['films']:
    print("films")

for opinion in data['opinions']:
    print("opinions")

for prediction in data['predictions']:
    print("predictions")
