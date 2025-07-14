import { getImagePrefix } from "@/utils/util";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
<Link href="/">
  <Image
    src={`${getImagePrefix()}images/logo/logo.png`}
    alt="logo"
    width={0}
    height={0}
    sizes="(max-width: 768px) 120px, 160px"
    style={{ width: "160px", height: "auto" }}
    quality={100}
  />
</Link>

  );
};

export default Logo;
