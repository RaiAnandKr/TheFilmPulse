import { Divider } from "@nextui-org/react";

const HelpPage = () => (
  <div className="flex flex-col gap-4 p-4">
    <p>
      Our aim is to promote upcoming films and tv shows and increase awareness
      about them by engaging users in fantasy games around those films and
      shows.
    </p>
    <p>
      We have predictions and opinions as the two fantasy games today and soon
      we&lsquo;ll be adding more.
    </p>
    <Section
      id="signup"
      title="Signup and Login"
      items={[
        "When you sign up for the first time, you get 100 bonus coins.",
        "You can use those coins to participate in opinions and earn more coins if you win.",
        "You can participate in predictions for free and earn coins if you win.",
        "Bonus coins aren’t redeemable. Only earned coins are.",
      ]}
    />
    <Section
      id="predictions"
      title="What are Predictions?"
      items={[
        "You can participate in them for free i.e you don't need to spend your coins.",
        "Based on your analysis and film insights, predict the value of the questions. For this, just move the slider to pick your answer and then click on ‘Predict’ and Confirm your answer to submit.",
        "The card shows the time of the contest and once the time ends, a leaderboard is generated based on whose answer is closer to the actual answer.",
        "The winner and top 3 are awarded as many coins as they need to redeem a voucher immediately.",
        "The top 10% users on the leaderboard will win coins as well.",
      ]}
    />
    <Section
      id="opinions"
      title="What are Opinions?"
      items={[
        "Opinions are questions with ‘Yes’ and ‘No’ answers.",
        "You can play using your coins and vote on either one of the two.",
        "Select the coins that you would like to place behind your answer and submit.",
        "The chance of winning more coins is proportional to the coins that you place. You can see that in the UI as well.",
        "At the end of the validity, if your answer is correct, you are on the winning side, otherwise on the losing side.",
        "The total coins wagered by the losing side is distributed proportionally among the players on the winning side.",
        "So losing players end up with 0 coins while winning players end up with the coins they wagered plus the extra coins they won.",
      ]}
    />
    <Section
      id="result"
      title="Source of result"
      items={[
        <li key="0">
          The film business collection is taken from &nbsp;
          <a
            href="https://www.sacnilk.com/"
            target="_blank"
            className="text-primary underline"
          >
            sacnilk.com.
          </a>
        </li>,
        <li key="1">
          The IMDB and film ratings are taken from &nbsp;
          <a
            href="https://www.imdb.com/"
            target="_blank"
            className="text-primary underline"
          >
            imdb.com.
          </a>
        </li>,
        "Other games around the plot of the movie are decided after watching the movie.",
      ]}
    />

    <Section
      id="vouchers"
      title="Vouchers and gift cards"
      items={[
        "You can redeem a wide variety of coupons and gift cards once you have enough coins.",
        "The Terms & Conditions as well as how to use the coupons will be shown to you when you redeem it.",
      ]}
    />
    <p className="font-semibold">
      You can reach out to us at: &nbsp;
      <a
        href="mailto:thefilmpulse345@gmail.com"
        target="_blank"
        className="text-primary underline"
      >
        thefilmpulse345@gmail.com
      </a>
    </p>

    <p className="font-semibold">
      For discussions, please join our community on Telegram: &nbsp;
      <a
        href="https://t.me/thefilmpulse"
        target="_blank"
        className="text-primary underline"
      >
        t.me/thefilmpulse
      </a>
    </p>
  </div>
);

const Section: React.FC<{
  id: string;
  title: string;
  items: (string | JSX.Element)[];
}> = (props) => {
  const { title, items, id } = props;
  return (
    <section className="flex flex-col gap-2" id={id}>
      <h2 className="font-bold">{title}</h2>
      <ul className="list-inside list-disc space-y-2">
        {items.map((item, idx) =>
          typeof item === "string" ? <li key={idx}>{item}</li> : item,
        )}
      </ul>
      <Divider />
    </section>
  );
};

export default HelpPage;
