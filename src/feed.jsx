import BottomNav from "./Components/BottomNav";
import Navbar from "./Components/NavBar";
import {StoriesFeed} from "./Components/storiesfeed"
import { PostCard } from "./Components/PostCard";
import styles from "./feed.module.css";

// Feed combines story previews with reusable post cards.
export const Feed = () => {
  const stories = [
    {
      id:1,
      image:"../images/John Doe.avif",
      title:"Live"
    },
    {
      id:2,
      image:"../images/Net Bar.jpg",
      title:"Net Bar"
    },
    {
      id:3,
      image:"../images/Crispan.avif" ,
      title:"Crispan"
    },
    {
      id:4,
      image:"../images/Shere hills party 1.jpg",
      title:"Hills"
    }
  ];

  const posts = [
  {
    userName:"Alex Rivera",
  userAvatar:"../images/Alex Rivera.avif",
  location:"THE NET RAYFIELD",
  postTime:"12m ago",
  postImage:"../images/The net bar.avif",
  postText:"Weekend vibes in Rayfield. The weather is perfect tonight. 🍹 J-Town rocks!",
  likes:"1.2k",
  comments:"48"
  },
  {
    userName:"Jordan K.",
  userAvatar:"../images/Jordan K.avif",
  location:"CRISPAN SUITES",
  postTime:"45m ago",
  postImage:"../images/Crispan Suites.avif",
  postText:" The party at Crispan is wild! Plateau state energy is unmatched. 🎧✨",
  likes:"854",
  comments:"12"
  }
  ]
  return (
    <div className={styles["feed-shell"]}>
      <Navbar title="JOS PULSE" showGear={false} />
      
      <div className={styles["stories-container"]}>
        {stories.map((story) => (
          <StoriesFeed
          key={story.id}
          {...story}
          />
        ))}
      </div>

      <div className={styles["feed-list"]}>
        {posts.map((post) => (
       <PostCard
       key={post.postImage}
       {...post}
       />
        ))}
       </div>

      <button className={styles["fab-add"]}>
        <i className="fa-solid fa-location-crosshairs"></i>
      </button>
      <BottomNav />
    </div>
  );
};

export default Feed;
