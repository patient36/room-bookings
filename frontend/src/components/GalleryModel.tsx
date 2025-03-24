import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageModalProps {
  images: string[];
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, onClose }) => {
  const [visibleImages, setVisibleImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const imagesPerPage = 21;

  // Calculate the number of rows needed based on the grid template
  const numRows = Math.ceil(visibleImages.length / 6) * 2; // Adjust based on your layout

  // Handle closing the modal on 'Escape' key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Load images for the current page
  useEffect(() => {
    const startIndex = (page - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    setVisibleImages(images.slice(startIndex, endIndex));
  }, [images, page]);

  const gridTemplate = [
    "col-span-2 row-span-2", // 1 (2x2 square)
    "col-start-3 row-span-1", // 2 (1x1 square)
    "col-start-3 row-start-2 row-span-1", // 3 (1x1 square)
    "col-span-2 row-span-2 col-start-4 row-start-1", // 4 (2x2 square)
    "col-start-6 row-span-1", // 5 (1x1 square)
    "col-start-6 row-start-2 row-span-1", // 6 (1x1 square)
    "row-start-3 row-span-1", // 7 (1x1 square)
    "row-start-3 row-span-1", // 8 (1x1 square)
    "col-start-1 row-start-4 row-span-1", // 9 (1x1 square)
    "col-start-2 row-start-4 row-span-1", // 10 (1x1 square)
    "col-span-2 row-span-2 col-start-3 row-start-3", // 11 (2x2 square)
    "col-start-5 row-start-3 row-span-1", // 12 (1x1 square)
    "col-start-6 row-start-3 row-span-1", // 13 (1x1 square)
    "col-start-5 row-start-4 row-span-1", // 14 (1x1 square)
    "col-start-6 row-start-4 row-span-1", // 15 (1x1 square)
    "col-span-2 row-span-2 row-start-5", // 16 (2x2 square)
    "col-start-3 row-start-5 row-span-1", // 17 (1x1 square)
    "col-start-4 row-start-5 row-span-1", // 18 (1x1 square)
    "col-start-3 row-start-6 row-span-1", // 19 (1x1 square)
    "col-start-4 row-start-6 row-span-1", // 20 (1x1 square)
    "col-span-2 row-span-2 col-start-5 row-start-5", // 21 (2x2 square)
  ];

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
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
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg w-full max-w-[90vw] max-h-[90vh] overflow-y-auto p-6">
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          Image Gallery
        </h2>
        <div
          className="grid grid-cols-6 gap-4 p-4 overflow-y-auto"
          style={{
            gridTemplateRows: `repeat(${numRows}, auto)`, // Use `auto` for row height
          }}
        >
          {visibleImages.map((image, index) => (
            <div
              key={index}
              className={`relative ${gridTemplate[index % gridTemplate.length]} aspect-square overflow-hidden`}
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill // Use `fill` to make the image fill the container
                className="object-cover rounded-lg" // Ensure the image covers the container
                onError={(e) => {
                  console.error("Failed to load image:", image);
                  e.currentTarget.src = "/path/to/fallback/image.jpg"; // Fallback image
                }}
              />
              <p className="absolute bottom-2 left-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Image {index + 1}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4"> {/* Reduced margin-top */}
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            Close
          </button>
          <button
            onClick={handleNextPage}
            disabled={page * imagesPerPage >= images.length}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;