import styles from "../Profile.module.css";

// Small profile-history row for a previously checked-in place.
 export const CheckInItem = ({place, time}) => {
  return (
    <div className={styles["checkin-item"]}>
      <div className={styles['icon-box']}>
        <i class= 'fa-solid fa-location-dot'></i>
      </div>

      <div>
        <div style={{ fontWeight: "bold", fontSize: "14px"}}>
          {place}
        </div>

        <div style={{
           fontSize: "11px",
           color: "#cbc3d7",
           marginTop: "2px"
           }}>
            {time}
           </div>
      </div>
    </div>
  );
 };