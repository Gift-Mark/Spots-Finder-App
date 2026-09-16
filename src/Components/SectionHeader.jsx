import styles from "../discover.module.css";

// Section headers support either an icon or one optional action button.
export const SectionHeader = ({ title, buttonLabel, buttonStyle, icon, whiteTitle }) => {
  return (
    <div className={styles["section-title-wrapper"]}>
      <p className={`${styles["section-title"]} ${whiteTitle ? styles["section-title-white"] : ""}`.trim()}>
        {title}
      </p>
      {icon ? (
        <i className={icon}></i>
      ) : buttonLabel ? (
        <button className={styles["see-all"]} style={buttonStyle}>
          {buttonLabel}
        </button>
      ) : null}
    </div>
  );
};
