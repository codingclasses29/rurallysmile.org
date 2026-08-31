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
        <div
          className="h-100 d-flex flex-column align-items-center justify-content-center p-1 text-center bg-white"
          style={{
            border: "1.5px dashed #94a3b8",
            color: "#0f766e",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f766e"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1 opacity-75"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span
            style={{
              fontSize: "8.5px",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#0f766e",
            }}
          >
            फोटो चिपकाएं
          </span>
          <span style={{ fontSize: "7.5px", color: "#64748b", lineHeight: 1 }}>
            Affix Photo
          </span>
        </div>
      )}
    </div>
  );
}
