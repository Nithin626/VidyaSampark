//src\components\Layout\Header\Logo\index.tsx
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        // FIX: Use a direct absolute path starting with "/"
        src="/images/logo/logo.png"
        alt="logo"
        width={160} // It's better to provide a non-zero width/height
        height={40} // Adjust this value to your logo's aspect ratio
        style={{ width: "160px", height: "auto" }}
        priority // Add priority to the logo as it's likely LCP (Largest Contentful Paint)
      />
    </Link>
  );
};

export default Logo;