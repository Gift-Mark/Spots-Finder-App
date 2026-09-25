import Navbar from "./Components/NavBar";
import ProfileHeader from "./Components/ProfileHeader";
import { useState } from "react";
import styles from "./Profile.module.css";
import BottomNav from "./Components/BottomNav";
import TabButton from "./Components/TabButton";
import { SaveCard } from "./Components/SaveCard";
import { CheckInItem } from "./Components/CheckInItem";
import { PodiumCard } from "./Components/PodiumCard";
import { LeaderboardRow } from "./Components/LeaderboardRow";

// Profile keeps tab selection local while each tab delegates rendering to shared cards.
export const Profile = () => {
  const [activeTab, setActiveTab] = useState("saves");

  const saves = [
    {
      image: "/images/The net bar.avif",
      title: "The Net Bar"
    },
    {
      image: "/images/plateau room.avif",
      title: "Plateau Room"
    }
  ];

  const checks = [
    {
      place: "Plateau Room",
      time: "2 hours ago"
    },
    {
      place: "The Net Bar",
      time: "Yesterday"
    }
  ];

  const podiums = [
    {
      rank: 2,
      badge: "RANK 2",
      name: "NaijaVibes",
      score: "12.4k",
      icon: "fa-solid fa-bolt-lightning",
      image: "/images/Naija Vibes.avif",
      className: styles["rank-2"]
    },
    {
      rank: 1,
      badge: "VIBE MASTER",
      name: "TinCityQ...",
      score: "15.8k",
      icon: "fa-solid fa-fire",
      image: "/images/TinCityQ.avif",
      className: styles["rank-1"]
    },
    {
      rank: 3,
      badge: "RANK 3",
      name: "Zion_Flow",
      score: "10.1k",
      icon: "fa-solid fa-water",
      image: "/images/Zion Flow.avif",
      className: styles["rank-3"]
    }
  ];

  const leaders = [
    {
      rank: "04",
      image: "/images/StreetPulse.avif",
      name: "StreetPulse",
      level: "LVL 42 KINETIC MASTER",
      score: "8,940",
      badgeIcon: "fa-solid fa-circle-check",
      currentUser: false
    },
    {
      rank: "05",
      image: "/images/John Doe.avif",
      name: "John Doe",
      level: "LVL 42 URBAN EXPLORER",
      score: "2,450",
      badgeIcon: "fa-solid fa-shield-halved",
      currentUser: true
    }
  ];

  return (
    <div className={styles["profile-container"]}>
      <Navbar title="JOS PULSE" />
      <ProfileHeader
        avatarUrl="/images/John Doe.avif"
        level={5}
        name="John Doe"
        subtext="Software Engineer"
      />

      <div className={styles["tabs-container"]}>
        <TabButton 
        active={activeTab === "saves"}
        onClick={() => setActiveTab("saves")}
        >
          MY SAVES
        </TabButton>
        <TabButton 
        active={activeTab === "checkins"}
        onClick={() => setActiveTab("checkins")}
        >
          CHECK-INS
        </TabButton>
        <TabButton 
        active={activeTab === "vibe-masters"}
        onClick={() => setActiveTab("vibe-masters")}
        >
         VIBE MASTERS
        </TabButton>
      </div>

      <div className={styles["tab-content"]}>
        <section
          id="saves"
          style={{ display: activeTab === "saves" ? "block" : "none" }}
          className={styles["content-section"]}
        >
          <div className={styles["saves-grid"]}>
            {saves.map((save) => (
              <SaveCard 
                key={save.image}
                {...save}
              />
            ))}
          </div>
        </section>
        
        <section
          id="checkins"
          style={{ display: activeTab === "checkins" ? "block" : "none" }}
          className={styles["content-section"]}
        >
          <div className={styles["checkin-list"]}>
            {checks.map((check) => (
              <CheckInItem
                key={check.place}
                {...check}
              />
            ))}
          </div>
        </section>

        <section
          id="vibe-masters"
          style={{ display: activeTab === "vibe-masters" ? "block" : "none" }}
          className={`${styles["content-section"]} ${styles["vibe-section"]}`}
        >
          <div className={styles["podium-container"]}>
            {podiums.map((podium) => (
              <PodiumCard 
                key={podium.rank}
                {...podium}
              />
            ))}
          </div>

          <div className={styles["list-header-row"]}>
            <span className={styles["list-header-title"]}>RANK & USER</span>
            <span className={styles["list-header-title"]}>HEAT LEVEL</span>
          </div>

          <div className={styles["leaderboard-list"]}>
            {leaders.map((leader) => (
              <LeaderboardRow
                key={leader.rank}
                {...leader}
              />
            ))}
            
            <div className={styles["cta-container"]}>
            <button className={styles["btn-boost"]}>
              <i className="fa-solid fa-rocket"></i> BOOST YOUR VIBE
            </button>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};
