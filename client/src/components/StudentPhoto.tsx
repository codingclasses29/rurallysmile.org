"use client";

import { useState } from "react";

type Props = {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

/** Passport photo with graceful fallback when URL is missing/corrupt */
export function StudentPhoto({
  src,
  alt = "Student photo",
  width = 78,
  height = 95,
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div
      className={`border border-2 border-primary-subtle bg-light overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
          PHOTO
        </div>
      )}
    </div>
  );
}
