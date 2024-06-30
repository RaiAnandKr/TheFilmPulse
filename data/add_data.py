import os
import requests
import yaml

BASE_URL = os.environ.get("BACKEND_URL", "http://yourapiurl.com")

def read_yaml():
    with open('data.yaml', 'r') as file:
        return yaml.safe_load(file)

def get_film_id(film_title):
    response = requests.get(f"{BASE_URL}/films?film_title={film_title}")
    response.raise_for_status()
    films = response.json()
    if films:
        return films[0]["id"]
    return None

def post_film(film):
    response = requests.post(BASE_URL+"/films", json=film)
    status_code, response = response.status_code, response.json()
    print(f'Posted film: {film["title"]}, Status code: {status_code}, Response: {response}')

def post_opinion(opinion):
    film_id = get_film_id(opinion["film_title"])
    if not film_id:
        return
    opinion["film_id"] = film_id
    del opinion["film_title"]

    response = requests.post(BASE_URL+"/opinions", json=opinion)
    status_code, response = response.status_code, response.json()
    print(f'Posted opinion: {opinion["text"]}, Status code: {status_code}, Response: {response}')

def post_prediction(prediction):
    film_id = get_film_id(prediction["film_title"])
    if not film_id:
        return
    prediction["film_id"] = film_id
    del prediction["film_title"]
    response = requests.post(BASE_URL+"/predictions", json=prediction)
    status_code, response = response.status_code, response.json()
    print(f'Posted prediction: {prediction["text"]}, Status code: {status_code}, Response: {response}')

def main():
    data = read_yaml()

    for film in data['films']:
        post_film(film)

    for opinion in data['opinions']:
        post_opinion(opinion)

    for prediction in data['predictions']:
        post_prediction(prediction)

if __name__ == "__main__":
    main()
