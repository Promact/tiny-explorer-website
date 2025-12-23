import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Mousewheel,
  Navigation,
  Pagination,
  Thumbs,
} from "swiper/modules";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper/types";

const ProductGallery = ({ imgUrls }: { imgUrls: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>();

  return (
    <>
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {imgUrls.map((item) => (
          <SwiperSlide key={item}>
            <img src={item} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {imgUrls.map((item) => (
          <SwiperSlide key={item}>
            {/* <div className="aspect-square"> */}
            <img
              src={item}
              alt=""
              // className="max-w-none block w-full h-full object-cover rounded-2xl"
            />
            {/* </div> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ProductGallery;
