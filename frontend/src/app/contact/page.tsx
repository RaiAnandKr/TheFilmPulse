import { Image } from "@nextui-org/react";
import TelegramLogo from "~/res/images/TelegramLogo.png";
import GmailLogo from "~/res/images/GmailLogo.png";
import InstagramLogo from "~/res/images/InstagramLogo.png";
import FacebookLogo from "~/res/images/FacebookLogo.png";
import TwitterLogo from "~/res/images/TwitterLogo.png";

const ContactPage = () => (
  <div className="flex h-full flex-col gap-6 p-4">
    <ContactChannel
      altText="Telegram logo"
      imgSrc={TelegramLogo.src}
      href="https://t.me/thefilmpulse"
      text="t.me/thefilmpulse"
      subText="Join our community on Telegram."
    />
    <ContactChannel
      altText="Email logo "
      imgSrc={GmailLogo.src}
      href="mailto:thefilmpulse345@gmail.com"
      text="thefilmpulse345@gmail.com"
      subText="Email us."
    />
    <ContactChannel
      altText="Instagram logo"
      imgSrc={InstagramLogo.src}
      href="https://www.instagram.com/thefilmpulse/"
      text="instagram.com/thefilmpulse"
      subText="Follow us on Instagram."
    />
    <ContactChannel
      altText="Facebook logo"
      imgSrc={FacebookLogo.src}
      href="https://www.facebook.com/people/The-Film-Pulse/61559787562719/"
      text="facebook.com/people/The-Film-Pulse/61559787562719"
      subText="Follow us on Facebook."
    />
    <ContactChannel
      altText="Twitter logo"
      imgSrc={TwitterLogo.src}
      href="https://x.com/The_FilmPulse"
      text="x.com/The_FilmPulse"
      subText="Follow us on Twitter (now X)."
    />
  </div>
);

const ContactChannel: React.FC<{
  altText: string;
  imgSrc: string;
  href: string;
  text: string;
  subText?: string;
}> = (props) => {
  const { altText, imgSrc, href, text, subText } = props;
  return (
    <div className="flex items-center gap-4">
      <a href={href} target="_blank">
        <Image
          alt={altText}
          height={60}
          width={60}
          src={
            imgSrc ??
            "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          }
          removeWrapper
          className="flex flex-none"
        />
      </a>
      <div className="flex w-full flex-col overflow-hidden">
        <a href={href} target="_blank">
          <h2 className="overflow-hidden text-ellipsis text-nowrap text-lg font-semibold text-primary underline">
            {text}
          </h2>
          <p className="overflow-hidden text-ellipsis text-nowrap text-medium">
            {subText}
          </p>
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
