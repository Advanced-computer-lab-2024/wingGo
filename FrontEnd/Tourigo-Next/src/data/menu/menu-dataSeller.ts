import { MenuType } from "@/interFace/interFace";
import homeOneImg from "../../../public/assets/images/menu/menu-home-1.jpg";
import homeTowImg from "../../../public/assets/images/menu/menu-home-2.jpg";
import homeThreeImg from "../../../public/assets/images/menu/menu-home-3.jpg";
import homeFourImg from "../../../public/assets/images/menu/menu-home-4.jpg";
import homeFiveImg from "../../../public/assets/images/menu/menu-home-5.jpg";

const menu_data: MenuType[] = [
  {
    id: 1,
    hasDropdown: true,
    children: false,
    active: true,
    title: "Home",
    pluseIncon: true,
    link: "#",
    previewImg: true,
    submenus: [
      { title: "Home One", link: "/home", prviewIMg: homeOneImg },
      { title: "Home Two", link: "/home-two", prviewIMg: homeTowImg },
      { title: "Home Three", link: "/home-three", prviewIMg: homeThreeImg },
      { title: "Home Four", link: "/home-four", prviewIMg: homeFourImg },
      { title: "Home Five", link: "/home-five", prviewIMg: homeFiveImg },
    ],
  },

  {
    id: 2,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "Products",
    pluseIncon: true,
    pageLayout: true,
    link: "/Products-seller",
  },
  {
    id: 3,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "Add Product",
    pluseIncon: true,
    pageLayout: true,
    link: "/add-product-copy",
    
  },
  {
    id: 4,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "Archived Products",
    pluseIncon: true,
    pageLayout: true,
    link: "/Products-sellerArch",
    
  },
  {
    id: 5,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "My profile",
    pluseIncon: true,
    pageLayout: true,
    link: "/seller/my-profile",
    
  },
];

export default menu_data;
