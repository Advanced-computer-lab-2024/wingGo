import { PopularActivity } from "@/interFace/interFace";
import ActivityImgTwentyTwo from "../../../public/assets/images/activity/activity-img-22.png";
import ActivityImgTwentyThree from "../../../public/assets/images/activity/activity-img-23.png";
import ActivityImgTwentyFour from "../../../public/assets/images/activity/activity-img-24.png";
import ActivityImgTwentyFive from "../../../public/assets/images/activity/activity-img-25.png";
import ActivityImgTwentySix from "../../../public/assets/images/activity/activity-img-26.png";
import ActivityImgTwentySeven from "../../../public/assets/images/activity/activity-img-27.png";
import clientOne from "../../../public/assets/images/client/01.png";
import clientTwo from "../../../public/assets/images/client/02.png";
import clientThree from "../../../public/assets/images/client/03.png";

export const popularActivityData: PopularActivity[] = [
  {
    id: "pills-item-one",
    title: "Tent camping",
    icon: "icon-trent",
    image: ActivityImgTwentyTwo,
    linkTitle: "Under the Stars: A Tent Camping Adventure",
    description: "Unplugged Escapes, Serene Nights, and Nature's Symphony",
    clients: [clientOne, clientTwo, clientThree],
    clientCount: "3K+",
  },
  {
    id: "pills-item-two",
    title: "Paragliding Tours",
    icon: "icon-travel-plane",
    image: ActivityImgTwentySeven,
    linkTitle: "Soar Beyond Boundaries: Paragliding Adventures",
    description: "Experience the Thrill of Flight with Expert Guides",
    clients: [clientOne, clientTwo, clientThree],
    clientCount: "3K+",
  },
  {
    id: "pills-item-three",
    title: "Adventure travel",
    icon: "icon-cycling",
    image: ActivityImgTwentyThree,
    linkTitle: "Beyond Borders: Thrilling Adventures Await",
    description:
      "Embark on Epic Journeys, Discover Untamed Landscapes, and Create Unforgettable Memories",
    clients: [clientOne, clientTwo, clientThree],
    clientCount: "3K+",
  },
  {
    id: "pills-item-four",
    title: "Explore world",
    icon: "icon-world-map",
    image: ActivityImgTwentyFour,
    linkTitle: "Global Odyssey: Explore the World's Wonders",
    description:
      "Unveiling Hidden Gems, Embracing Cultural Riches, and Embracing Boundless Adventure",
    clients: [clientOne, clientTwo, clientThree],
    clientCount: "3K+",
  },
  {
    id: "pills-item-five",
    title: "Swimming & fishing",
    icon: "icon-fishing",
    image: ActivityImgTwentyFive,
    linkTitle: "Aquatic Pursuits: The Harmony of Swimming and Fishing",
    description:
      "Dive into Tranquil Waters, Cast Your Line, and Reel in Memories",
    clients: [clientOne, clientTwo, clientThree],
    clientCount: "3K+",
  },
  {
    id: "pills-item-six",
    title: "Hiking mountain",
    icon: "icon-mountain",
    image: ActivityImgTwentySix,
    linkTitle: "Summit Seekers: A Journey Through Mountain Majesty",
    description:
      "Ascending Peaks, Embracing Solitude, and Finding Serenity in the Heights",
    clients: [clientOne, clientTwo, clientThree],
    clientCount: "3K+",
  },
];
