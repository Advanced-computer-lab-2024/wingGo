import { MenuType } from "@/interFace/interFace";
import homeOneImg from "../../../public/assets/images/menu/menu-home-1.jpg";
import homeTowImg from "../../../public/assets/images/menu/menu-home-2.jpg";
import homeThreeImg from "../../../public/assets/images/menu/menu-home-3.jpg";
import homeFourImg from "../../../public/assets/images/menu/menu-home-4.jpg";
import homeFiveImg from "../../../public/assets/images/menu/menu-home-5.jpg";

const menu_data: MenuType[] = [

  {
    id: 2,
    hasDropdown: true,
    active: true,
    megaMenu: true,
    children: true,
    title: "Products",
    pluseIncon: true,
    link: "/Products",
   
  },
  {
    id: 3,
    hasDropdown: true,
    children: true,
    megaMenu: true,
    active: true,
    title: "Places",
    pluseIncon: true,
    link: "/place-view",
  },
  {
    id: 4,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "Itineraries",
    pluseIncon: true,
    pageLayout: true,
    link: "/it-view-orig",
  },
  {
    id: 5,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "Activities",
    pluseIncon: true,
    pageLayout: true,
    link: "/activity-org",
  },
  {
    id: 6,
    hasDropdown: true,
    children: true,
    megaMenu: true,
    active: true,
    title: "History",
    pluseIncon: true,
    lastDropdown: true,
    link: "#",
    submenus: [
      { title: "Booking History", link: "/it-act-history" },
      { title: "Products History", link: "/product-history"},
    ],
  },
  {
    id: 7,
    hasDropdown: true,
    children: true,
    megaMenu: true,
    active: true,
    title: "Complaints",
    pluseIncon: true,
    lastDropdown: true,
    link: "#",
    submenus: [
      { title: "Add Complaint", link: "/fileComplaint" },
      { title: "View Complaints", link: "/complaints-view-tourist" },
    ],
  },
  {
    id: 8, // Unique ID for the currency selector
    hasDropdown: true,
    children: true,
    active: true,
    title: "Booking", // Label for the selector
    pluseIncon: true,
    link: "#", // No link since it’s a selector
    submenus: [
      { title: "Transports", link: "/transports" },
      { title: "Hotel", link: "/search-hotels" },
      { title: "Flight", link: "/search-flights" },
    ],
  },
  {
    id: 9, // Unique ID for the currency selector
    hasDropdown: true,
    children: true,
    active: true,
    title: "Currency", // Label for the selector
    pluseIncon: true,
    link: "#", // No link since it’s a selector
    submenus: [
      { title: "USD", link: "#", currency: "USD" },
      { title: "EUR", link: "#", currency: "EUR" },
      { title: "EGP", link: "#", currency: "EGP" },
      // Add more currencies as needed
    ],
  },
 
  {
    id: 10,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "My Profile",
    pluseIncon: true,
    pageLayout: true,
    link: "/my-profile",
  },
  
];

export default menu_data;
