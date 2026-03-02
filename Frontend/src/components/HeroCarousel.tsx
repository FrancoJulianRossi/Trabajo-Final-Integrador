import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { PlayCircle, Info } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./HeroCarousel.module.css";

export interface IHeroCarouselItem {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  trailerLink: string;
  infoLink: string;
}

interface HeroCarouselProps {
  items: IHeroCarouselItem[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className={styles.emptyCarousel}>
        Próximamente grandes estrenos...
      </div>
    );
  }

  return (
    <div className={styles.heroCarouselContainer}>
      <Swiper
        effect={"fade"}
        speed={1000} // Transición suave entre imágenes
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true} // Permite que el carrusel sea infinito
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        className={styles.mySwiper}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className={styles.swiperSlide}>
            {/* Usamos el render prop para detectar qué slide está activo */}
            {({ isActive }) => (
              <>
                <div
                  className={styles.slideBackground}
                  style={{ backgroundImage: `url(${item.backgroundImage})` }}
                ></div>
                <div className={styles.gradientOverlay}></div>

                <div className={styles.content}>
                  <motion.h1
                    initial={{ y: 40, opacity: 0 }}
                    animate={
                      isActive ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }
                    }
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="display-3 fw-bold text-white mb-3"
                  >
                    {item.title}
                  </motion.h1>

                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={
                      isActive ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }
                    }
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className="lead text-white-50 mb-4"
                  >
                    {item.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={
                      isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                    }
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="d-flex justify-content-center gap-3 flex-wrap"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      href={item.trailerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center gap-2 px-4"
                    >
                      <PlayCircle size={24} /> Ver Trailer
                    </Button>
                    <Button
                      variant="outline-light"
                      size="lg"
                      href={item.infoLink}
                      className="d-flex align-items-center gap-2 px-4"
                    >
                      <Info size={24} /> Más Info
                    </Button>
                  </motion.div>
                </div>
              </>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
