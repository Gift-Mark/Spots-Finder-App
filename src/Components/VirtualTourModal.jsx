import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "../CSS/HeritageGrid.module.css";

export function VirtualTourModal({ spot, onClose }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    // 1. Copy the current ref value to a local variable inside the effect
    const container = viewerRef.current;

    // 2. Load Pannellum CSS dynamically if missing
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }

    // 3. Initialize Pannellum viewer
    const initViewer = () => {
      if (window.pannellum && container) {
        window.pannellum.viewer(container, {
          type: "equirectangular",
          panorama: spot.panoramaUrl || "https://pannellum.org/images/alma.jpg",
          autoLoad: true,
          autoRotate: -2,
          compass: true,
          title: spot.title,
          author: "MOTNA 360° Heritage Tour",
          showZoomCtrl: true,
          showFullscreenCtrl: true,
        });
      }
    };

    // 4. Load Pannellum JS script if needed
    if (!window.pannellum) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.async = true;
      script.onload = initViewer;
      document.body.appendChild(script);
    } else {
      initViewer();
    }

    // 5. Cleanup function using the captured variable
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [spot]);

  return (
    <div className={styles.tourModalOverlay} onClick={onClose}>
      <div className={styles.tourModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.tourHeader}>
          <div>
            <h3>🌐 360° Virtual Tour: {spot.title}</h3>
            <p>Click & drag to explore around • Scroll to zoom</p>
          </div>
          <button type="button" className={styles.closeTourBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Pannellum Container */}
        <div ref={viewerRef} className={styles.pannellumViewer}></div>
      </div>
    </div>
  );
}