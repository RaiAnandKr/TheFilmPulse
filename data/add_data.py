import os
import requests
import yaml

BASE_URL = os.environ.get("BACKEND_URL", "http://yourapiurl.com")

updated=False # Global variable to track updates

def read_yaml():
    with open('data.yaml', 'r') as file:
        return yaml.safe_load(file)

def write_yaml(data):
    with open('data.yaml', 'w') as file:
        yaml.safe_dump(data, file)

def get_film_id_and_poster_url(film_title):
    response = requests.get(f"{BASE_URL}/films?film_title={film_title}")
    response.raise_for_status()
    films = response.json()
    if films:
        return films[0]["id"], films[0]["poster_url"]
    return None, None

def post_film(film):
    response = requests.post(BASE_URL+"/films", json=film)
    status_code, response = response.status_code, response.json()
    print(f'Posted film: {film["title"]}, Status code: {status_code}, Response: {response}')

def post_opinion(opinion):
    film_id, poster_url = get_film_id_and_poster_url(opinion["film_title"])
    if not film_id:
        return

    opinion["film_id"] = film_id
    opinion["icon_url"] = poster_url

    film_title = opinion["film_title"]
    del opinion["film_title"]

    response = requests.post(BASE_URL+"/opinions", json=opinion)
    status_code, response = response.status_code, response.json()
    print(f'Posted opinion: {opinion["text"]}, Status code: {status_code}, Response: {response}')

    # Revert the fields which we set earlier for sending the POST request since we will be writing
    # the data back in yaml.
    del opinion["film_id"]
    del opinion["icon_url"]
    opinion["film_title"] = film_title

def post_prediction(prediction):
    film_id, poster_url = get_film_id_and_poster_url(prediction["film_title"])
    if not film_id:
        return

    prediction["film_id"] = film_id
    prediction["icon_url"] = poster_url

    film_title = prediction["film_title"]
    del prediction["film_title"]

    response = requests.post(BASE_URL+"/predictions", json=prediction)
    status_code, response = response.status_code, response.json()
    print(f'Posted prediction: {prediction["text"]}, Status code: {status_code}, Response: {response}')

    # Revert the fields which we set earlier for sending the POST request since we will be writing
    # the data back in yaml.
    del prediction["film_id"]
    del prediction["icon_url"]
    prediction["film_title"] = film_title

def main(data):
    global updated  # Declare the global variable

    for film in data['films']:
        if film.get('done', 0) == 1:
            continue

        post_film(film)
        film['done']=1
        updated=True

    for opinion in data['opinions']:
        if opinion.get('done',0) == 1:
            continue

        post_opinion(opinion)
        opinion['done']=1
        updated=True

    for prediction in data['predictions']:
        if prediction.get('done',0) == 1:
            continue

        post_prediction(prediction)
        prediction['done']=1
        updated=True

if __name__ == "__main__":
    data = read_yaml()
    try:
        main(data)
    finally:
        if updated:
            write_yaml(data)
