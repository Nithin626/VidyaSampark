import { HeaderItem } from "@/types/menu";
//import useUser from "@/hooks/useUser";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  {
    label: "Colleges",
    href: "#", // Parent link won't navigate
    submenu: [
      { label: "Cambridge Institute of Technology", href: "/apply" },
      { label: "Lisa School of Design", href: "/apply" },
      { label: "Yenopoya University", href: "/apply" },
      { label: "MNR university", href: "/apply" },
      { label: "Amet university", href: "/apply" }

    ],
  },
  { label: "Courses", 
    href: "#", // Parent link won't navigate
    submenu: [
      { label: "B.Tech AI & ML", href: "/apply" },
      { label: "B.Tech Cyber Security", href: "/apply" },
      { label: "BCA", href: "/apply" },
      { label: "MBA", href: "/apply" },
    ],
   },
  { label: "Latest News", href: "/#news" },

  
];
