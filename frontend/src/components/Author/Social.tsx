import { FaTwitter, FaWeibo, FaYoutube } from 'react-icons/fa'
import { FaPixiv } from 'react-icons/fa6'
import { RiGlobalLine } from 'react-icons/ri'
import { SiNiconico, SiTumblr } from 'react-icons/si'

export interface ISocial {
  twitter?: string | null
  pixiv?: string | null
  melonBook?: string | null
  fanBox?: string | null
  nicoVideo?: string | null
  fantia?: string | null
  tumblr?: string | null
  youtube?: string | null
  weibo?: string | null
  website?: string | null
}

type Props = {
  social: ISocial
}
const Social: React.FC<Props> = ({ social }: Props): JSX.Element => {
  const renderSocialLinks = () => {
    const socialIcons = {
      twitter: <FaTwitter />,
      pixiv: <FaPixiv />,
      nicoVideo: <SiNiconico />,
      tumblr: <SiTumblr />,
      youtube: <FaYoutube />,
      weibo: <FaWeibo />,
      website: <RiGlobalLine />,
    }

    return Object.entries(social)
      .filter(([el, link]) => link && el !== '__typename')
      .map(([platform, link]) => {
        const social = socialIcons[platform as keyof typeof socialIcons]
        return (
          <a
            key={platform}
            href={link as string}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-secondary-900 px-4 py-1 text-xl transition-colors duration-200 hover:bg-secondary-800"
            aria-label={platform}
          >
            {social && social}
            <span className="capitalize">{platform}</span>
          </a>
        )
      })
  }

  return <div className="my-2 flex flex-wrap gap-4">{renderSocialLinks()}</div>
}

export default Social
