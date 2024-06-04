import math

from app import app
from extensions import db
from models import Prediction

from sqlalchemy import or_

def compute_prediction_results():
    predictions = Prediction.query.filter(
        Prediction.correct_answer.isnot(None),
        or_(Prediction.finished == 0, Prediction.finished.is_(None))
    ).all()

    for prediction in predictions:
        # Calculate user predictions for this prediction
        user_predictions = prediction.user_predictions

        # If there are no user predictions, continue to the next prediction
        if not user_predictions:
            continue

        # Calculate the absolute difference between user answers and the correct answer
        for user_prediction in user_predictions:
            user_prediction.diff = abs(user_prediction.answer - prediction.correct_answer)

        # Sort user predictions based on the calculated difference
        user_predictions.sort(key=lambda x: x.diff)

        # Calculate ranks and set coins_won
        total_users = len(user_predictions)
        top_2_percent_index = math.floor(total_users * 0.02) if total_users >= 50 else 1
        top_10_percent_index = math.floor(total_users * 0.10) if total_users >=20 else 2
        top_25_percent_index = math.floor(total_users * 0.25) if total_users >= 10 else 3

        for i, user_prediction in enumerate(user_predictions):
            user_prediction.rank = i + 1
            if i < top_2_percent_index:
                user_prediction.coins_won = 25
            elif i < top_10_percent_index:
                user_prediction.coins_won = 15
            elif i < top_25_percent_index:
                user_prediction.coins_won = 10
            else:
                user_prediction.coins_won = 0

            # Update the user's earned_coins directly
            user = user_prediction.user
            user.earned_coins += user_prediction.coins_won

        # Set finished = 1 in the Prediction table
        prediction.finished = 1

    # Commit changes to the database
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        compute_prediction_results()
