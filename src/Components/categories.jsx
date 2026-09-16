import styles from "../discover.module.css";

// Category filter button; active styling is derived from the parent's state.
export const Categories = ({
  title,
  active = false,
  onClick
}) => {

  return (
    <button
      className={
        active
          ? styles["hot-active"]
          : styles["hot"]
      }
      onClick={onClick}
    >

      {active && (
        <i className="fa fa-bolt"></i>
      )}

      {title}

    </button>
  );
};