import {
  GlobeIcon,
  MailIcon,
  Video,
  Github,
  Linkedin,
  Twitter,
  Youtube
} from "lucide-react";

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  globe: (props: IconProps) => <GlobeIcon {...props} />,
  email: (props: IconProps) => <MailIcon {...props} />,
  video: (props: IconProps) => <Video {...props} />,
  linkedin: (props: IconProps) => <Linkedin {...props} />,
  x: (props: IconProps) => <Twitter {...props} />,
  youtube: (props: IconProps) => <Youtube {...props} />,
  github: (props: IconProps) => <Github {...props} />,
};
