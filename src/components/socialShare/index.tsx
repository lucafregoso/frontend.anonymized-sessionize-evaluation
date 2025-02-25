import {
  BlueskyIcon,
  BlueskyShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import "./style.css";

export function SocialShare({
  shareUrl,
  title,
  twitter = { hashtags: [], related: [] },
  facebook = { hashtag: undefined },
}) {
  return (
    <div className="SocialShare__container">
      <div className="SocialShare__single-network">
        <FacebookShareButton
          url={shareUrl}
          className="SocialShare__single-network__share-button"
          hashtag={facebook.hashtag}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </div>

      <div className="SocialShare__single-network">
        <TwitterShareButton
          url={shareUrl}
          title={title}
          className="SocialShare__single-network__share-button"
          hashtags={twitter.hashtags}
          related={twitter.related}
        >
          <XIcon size={32} round />
        </TwitterShareButton>
      </div>

      <div className="SocialShare__single-network">
        <TelegramShareButton
          url={shareUrl}
          title={title}
          className="SocialShare__single-network__share-button"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </div>

      <div className="SocialShare__single-network">
        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=":: "
          className="SocialShare__single-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>

      <div className="SocialShare__single-network">
        <LinkedinShareButton
          url={shareUrl}
          className="SocialShare__single-network__share-button"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>

      <div className="SocialShare__single-network">
        <RedditShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className="SocialShare__single-network__share-button"
        >
          <RedditIcon size={32} round />
        </RedditShareButton>
      </div>

      <div className="SocialShare__single-network">
        <ThreadsShareButton
          url={shareUrl}
          title={title}
          className="SocialShare__single-network__share-button"
        >
          <ThreadsIcon size={32} round />
        </ThreadsShareButton>
      </div>

      <div className="SocialShare__single-network">
        <BlueskyShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className="SocialShare__single-network__share-button"
        >
          <BlueskyIcon size={32} round />
        </BlueskyShareButton>
      </div>
    </div>
  );
}

export default SocialShare;
