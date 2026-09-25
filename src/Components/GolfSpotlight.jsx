import styles from '../CSS/GolfSpotlight.module.css'
export const GolfSpotlight = () => {
  return(
    <section className={styles.contentSection}>
      <div className={styles.golfBanner}>
        <img src="/images/Golf Main view.webp" alt="Golf Banner" className={styles.golfBannerImage} />
        <div className={styles.golfOverlay}>
          <span className={styles.spotlightLabel}>Heritage Spotlight</span>

            <h2>Rayfield Gold Club</h2>

            <p>Tee off at Africa's oldest golf course, established in 1913. Experience the perfect blend of rich history and premium sporting facilities set against stunning landscapes.</p>

            <div className={styles.golfButton}>
              <button className={styles.orangeBtn}>Book a Tee Time</button>
              <button className={styles.outlineBtn}>Learn More</button>
          </div>
        </div>

        <div clasName={styles.golfStats}>
          <div>
            <strong>18</strong>
            <span>HOLE COURSE</span>
          </div>

          <div>
            <strong>1913</strong>
            <span>ESTABLISHED</span>
          </div>
        </div>
      </div>
    </section>
  );
}