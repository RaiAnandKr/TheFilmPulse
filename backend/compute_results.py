import math

from app import app
from extensions import db
from models import Prediction, Opinion

from sqlalchemy import or_

def compute_prediction_results():
    predictions = Prediction.query.filter(
        Prediction.correct_answer.isnot(None),
        or_(Prediction.finished == 0, Prediction.finished.is_(None))
    ).all()

    processed_ids = []
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
        # The winner will always get a voucher worthy coins irrespective of how few participants
        # are there. It's expensive when have we fewer users.
        top_1 = 1
        top_3 = 3 if total_users >= 300 else 1
        top_1_percent_index = math.floor(total_users * 0.01)
        top_2point5_percent_index = math.floor(total_users * 0.025)
        top_10_percent_index = math.floor(total_users * 0.1)

        for i, user_prediction in enumerate(user_predictions):
            user_prediction.rank = i + 1
            if i < top_1:
                user_prediction.coins_won = 200
            elif i < top_3:
                user_prediction.coins_won = 100
            elif i < top_1_percent_index:
                user_prediction.coins_won = 50
            elif i < top_2point5_percent_index:
                user_prediction.coins_won = 20
            elif i < top_10_percent_index:
                user_prediction.coins_won = 10
            else:
                user_prediction.coins_won = 0

            # Update the user's earned_coins directly
            user = user_prediction.user
            user.earned_coins += user_prediction.coins_won

        # Set finished = 1 in the Prediction table
        prediction.finished = 1
        processed_ids.append(prediction.id)

    # Commit changes to the database
    db.session.commit()
    print("Finished computing result for prediction Ids: ", processed_ids)

def compute_opinion_results():
    opinions = Opinion.query.filter(
        Opinion.correct_answer.isnot(None),
        or_(Opinion.finished == 0, Opinion.finished.is_(None))
    ).all()

    processed_ids = []
    for opinion in opinions:
        user_opinions = opinion.user_opinions
        correct_answer = opinion.correct_answer

        correct_coins = opinion.yes_coins if correct_answer == 'yes' else opinion.no_coins
        incorrect_coins = opinion.no_coins if correct_answer == 'yes' else opinion.yes_coins

        correct_user_opinions = [uo for uo in user_opinions if uo.answer == correct_answer]
        incorrect_user_opinions = [uo for uo in user_opinions if uo.answer != correct_answer]

        for uo in incorrect_user_opinions:
            # If there are no correct_coins (meaning no one ended up on the correct side), just return whatever
            # the user wagered otherwise coins won for them would be 0.
            uo.coins_won = uo.coins if not correct_coins else 0
            user = uo.user
            user.earned_coins += uo.coins_won

        # Distribute incorrect_coins among correct opinions based on their coins proportion
        for uo in correct_user_opinions:
            # If there are no incorrect_coins (meaning no one ended up on the incorrect side), the winners won't
            # get any extra coin and will simply get back the coins they wagered.
            extra_coins_won = ((uo.coins / correct_coins) * incorrect_coins) if incorrect_coins else 0
            uo.coins_won = uo.coins + extra_coins_won
            user = uo.user
            user.earned_coins += uo.coins_won

        opinion.finished = 1
        processed_ids.append(opinion.id)

    db.session.commit()
    print("Finished computing result for opinion Ids: ", processed_ids)

if __name__ == "__main__":
    with app.app_context():
        compute_prediction_results()
        compute_opinion_results()
