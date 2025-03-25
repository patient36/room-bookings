import React, { useState, useRef, useEffect } from 'react';
import { FaExpand, FaRedo } from 'react-icons/fa';

interface RoomDescriptionProps {
  description: string;
}

export const RoomDescription: React.FC<RoomDescriptionProps> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descriptionRef.current && description) {
      setNeedsExpand(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
    }
  }, [description]);

  return (
    <div className="relative">
      <p
        ref={descriptionRef}
        className={`text-gray-600 leading-relaxed ${!expanded ? 'line-clamp-4' : ''}`}
      >
        {description}
      </p>
      {needsExpand && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 flex items-center"
        >
          {expanded ? (
            <>
              <FaRedo className="mr-1" /> Show less
            </>
          ) : (
            <>
              <FaExpand className="mr-1" /> Read more
            </>
          )}
        </button>
      )}
    </div>
  );
};