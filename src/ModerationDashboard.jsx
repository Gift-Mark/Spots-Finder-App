import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./ModerationDashboard.module.css";

// Static moderation workspace layout; action wiring can be added independently later.
const ModerationDashboard = () => {
  return (
    <div className={styles.container}>
      {/* Left Column: Moderation Queue */}
      <section className={styles.leftColumn}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.titlePurple}>Moderation Queue</h1>
            <p className={styles.subtitle}>
              Review 'What the word?' and Vibe checks
            </p>
          </div>
          <button className={styles.filterBtn}>Filter</button>
        </div>

        {/* Card 1: Spam Report */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.userInfo}>
              <div className={styles.avatarPlaceholder} />
              <div>
                <strong className={styles.username}>@NightRider99</strong>
                <span className={styles.flagReason}>Reported for: Spam</span>
              </div>
            </div>
            <span className={`${styles.statusBadge} ${styles.badgeHigh}`}>
              High Priority
            </span>
          </div>

          <p className={styles.postText}>
            "Check out my new soundcloud link guys!!! Best tekno beats in town,
            ignoring the vibe here completely, #ad"
          </p>

          <div className={styles.actionRow}>
            <button className={styles.btnSecondary}>
              <FontAwesomeIcon icon={faEye} /> View Context
            </button>
            <button className={styles.btnDangerLight}>
              <FontAwesomeIcon icon={faBan} /> Ban User
            </button>
            <button className={styles.btnPurple}>
              <FontAwesomeIcon icon={faCheck} /> Dismiss
            </button>
          </div>
        </div>

        {/* Card 2: Image Moderation */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.userInfo}>
              <div className={styles.avatarPlaceholder} />
              <div>
                <strong className={styles.username}>@vibecheck_queen</strong>
                <span className={styles.flagReason}>
                  Flagged: Inappropriate Image
                </span>
              </div>
            </div>
            <span className={`${styles.statusBadge} ${styles.badgeReview}`}>
              Review Needed
            </span>
          </div>

          <div className={styles.imageOverlayContainer}>
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"
              alt="Flagged content"
              className={styles.blurImage}
            />
            <div className={styles.hiddenIcon}>
              <FontAwesomeIcon icon={faEyeSlash} />
            </div>
          </div>

          <div className={styles.actionRowGrid}>
            <button className={styles.btnSecondary}>
              <FontAwesomeIcon icon={faTriangleExclamation} /> Warn
            </button>
            <button className={styles.btnDangerSolid}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        </div>
      </section>

      {/* Right Column: Elite Explorers */}
      <section className={styles.rightColumn}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.titleCyan}>Elite Explorers</h1>
            <p className={styles.subtitleLight}>
              Top Users & Reward Management
            </p>
          </div>
          <button className={styles.awardPointsBtn}>⊕ Award Points</button>
        </div>

        {/* Leaderboard Item 1 */}
        <div className={`${styles.leaderboardCard} ${styles.borderCyan}`}>
          <span className={`${styles.rankNumber} ${styles.rankCyan}`}>1</span>
          <div className={styles.avatarPlaceholder} />
          <div className={styles.leaderboardInfo}>
            <div className={styles.userBadgeRow}>
              <strong>@neon_nomad</strong>
              <span className={styles.verifiedCheck}>
                <FontAwesomeIcon icon={faCircleCheck} />
              </span>
            </div>
            <span className={styles.userLevel}>Lvl 42 • Vibe Master</span>
          </div>
          <div className={styles.xpMeta}>
            <strong>12,450 XP</strong>
            <span>850 Rewards</span>
          </div>
          <button className={styles.moreOptions}>⋮</button>
        </div>

        {/* Leaderboard Item 2 */}
        <div className={styles.leaderboardCard}>
          <span className={styles.rankNumber}>2</span>
          <div className={styles.avatarPlaceholder} />
          <div className={styles.leaderboardInfo}>
            <strong>@arcade_phantom</strong>
            <span className={styles.userLevel}>Lvl 38 • Explorer</span>
          </div>
          <div className={styles.xpMeta}>
            <strong>11,200 XP</strong>
            <span>600 Rewards</span>
          </div>
          <button className={styles.moreOptions}>⋮</button>
        </div>

        {/* Manual Reward Form */}
        <div className={styles.formCard}>
          <h2>Manual Reward Action</h2>

          <div className={styles.fieldGroup}>
            <label>Target User</label>
            <input type="text" placeholder="Enter username..." />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Reward Type</label>
              <div className={styles.selectWrapper}>
                <select>
                  <option>Jos Pulse Points</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Amount</label>
              <input type="number" defaultValue={0} />
            </div>
          </div>
          <button className={styles.btnGrantReward}>Grant Reward</button>
        </div>
      </section>
    </div>
  );
};

export default ModerationDashboard;
