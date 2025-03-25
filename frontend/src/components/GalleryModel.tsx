import Image from "next/image";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaChevronLeft, FaChevronRight, FaTimes, FaTh, FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ImageModalProps {
  images: string[];
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, onClose }) => {
  const [visibleImages, setVisibleImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const imagesPerPage = 21;

  // Calculate the number of rows needed based on the grid template
  const numRows = Math.ceil(visibleImages.length / 6) * 2;

  // Handle closing the modal on 'Escape' key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const startIndex = (page - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    setVisibleImages(images.slice(startIndex, endIndex));
  }, [images, page]);

  const gridTemplate = [
    "col-span-2 row-span-2",
    "col-start-3 row-span-1",
    "col-start-3 row-start-2 row-span-1",
    "col-span-2 row-span-2 col-start-4 row-start-1",
    "col-start-6 row-span-1",
    "col-start-6 row-start-2 row-span-1",
    "row-start-3 row-span-1",
    "row-start-3 row-span-1",
    "col-start-1 row-start-4 row-span-1",
    "col-start-2 row-start-4 row-span-1",
    "col-span-2 row-span-2 col-start-3 row-start-3",
    "col-start-5 row-start-3 row-span-1",
    "col-start-6 row-start-3 row-span-1",
    "col-start-5 row-start-4 row-span-1",
    "col-start-6 row-start-4 row-span-1",
    "col-span-2 row-span-2 row-start-5",
    "col-start-3 row-start-5 row-span-1",
    "col-start-4 row-start-5 row-span-1",
    "col-start-3 row-start-6 row-span-1",
    "col-start-4 row-start-6 row-span-1",
    "col-span-2 row-span-2 col-start-5 row-start-5",
  ];

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleImageClick = (index: number) => {
    setIsCarouselView(true);
    setCarouselStartIndex(index);
  };

  const handleCloseCarousel = () => {
    setIsCarouselView(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-[90vw] max-h-[90vh] overflow-y-auto p-6 text-center">
          <p>No images to display.</p>
          <button
            onClick={onClose}
            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 h-screen w-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg w-full max-w-[90vw] h-[95vh] overflow-y-auto p-6">
        <h2 id="modal-title" className="text-xl font-bold mb-4 text-blue-900">
          Room pictures
        </h2>

        {/* Carousel View (Always visible on small screens, optional on large screens) */}
        <div className={`${isCarouselView ? "block" : "hidden"}`}>
          <div className="relative">
            {/* Close Button for Small Screens */}
            <button
              onClick={onClose}
              className="lg:hidden absolute top-2 right-2 cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 z-50"
            >
              <FaTimes className="w-5 h-5 max-sm:h-3 max-sm:w-3" />
            </button>

            <Carousel
              selectedItem={carouselStartIndex}
              showThumbs={false}
              infiniteLoop
              showStatus={false}
              showIndicators={false}
              renderArrowPrev={(onClickHandler, hasPrev) =>
                hasPrev && (
                  <button
                    onClick={onClickHandler}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronLeft className="w-5 h-5 max-sm:h-3 max-sm:w-3" />
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext) =>
                hasNext && (
                  <button
                    onClick={onClickHandler}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronRight className="w-5 h-5 max-sm:h-3 max-sm:w-3" />
                  </button>
                )
              }
              className="w-full max-w-[800px] mx-auto"
            >
              {images.map((image, index) => (
                <div key={index} className="relative aspect-3/2 max-sm:aspect-square">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    quality={100}
                    className="object-cover rounded-lg"
                  />
                  <p className="absolute z-40 bottom-2 left-2 text-pink-500 p-2 rounded-md bg-black/40 text-xs">{index + 1} of {images.length}</p>
                </div>
              ))}
            </Carousel>


            <button
              onClick={handleCloseCarousel}
              className="hidden lg:block absolute top-2 right-2 bg-pink-600 cursor-pointer text-white p-3 rounded-full hover:bg-pink-700 transition-colors duration-200 "
            >
              <FaTh className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid View (Only visible on large screens when isCarouselView is false) */}
        <div className={`${isCarouselView ? "hidden" : "block"}`}>
          <div
            className="grid grid-cols-6 gap-4 p-4 overflow-y-auto"
            style={{
              gridTemplateRows: `repeat(${numRows}, auto)`,
            }}
          >
            {visibleImages.map((image, index) => (
              <div
                key={index}
                className={`relative ${gridTemplate[index % gridTemplate.length]} aspect-square overflow-hidden cursor-pointer`}
                onClick={() => handleImageClick(index + (page - 1) * imagesPerPage)}
              >
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                />
                <p className="absolute bottom-2 left-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  {index + 1}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 text-white p-4 cursor-pointer rounded-full hover:bg-red-700 transition-colors duration-200"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={page * imagesPerPage >= images.length}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <FaArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;