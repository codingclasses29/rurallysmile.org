"use client";

import { PRIZES } from "@/constants/site";
import { SectionReveal } from "@/components/home/SectionReveal";

function PrizeIcon({ rank }: { rank?: string }) {
  if (rank === "1" || rank === "2" || rank === "3") {
    const medalColor =
      rank === "1" ? "#f59e0b" : rank === "2" ? "#cbd5e1" : "#d97706";
    const medalStroke =
      rank === "1" ? "#b45309" : rank === "2" ? "#64748b" : "#92400e";
    const ribbonLeft =
      rank === "1" ? "#3b82f6" : rank === "2" ? "#6366f1" : "#0284c7";
    const ribbonRight =
      rank === "1" ? "#2563eb" : rank === "2" ? "#4f46e5" : "#0369a1";

    return (
      <div className="d-inline-flex align-items-center justify-content-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ribbon */}
          <path d="M16 2L24 22L12 22L8 2H16Z" fill={ribbonLeft} />
          <path d="M32 2L24 22L36 22L40 2H32Z" fill={ribbonRight} />
          <path d="M20 2L24 16L28 2H20Z" fill="#93c5fd" opacity="0.9" />
          {/* Medal */}
          <circle
            cx="24"
            cy="30"
            r="15"
            fill={medalColor}
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="30"
            r="12"
            fill={medalColor}
            stroke={medalStroke}
            strokeWidth="1"
          />
          <text
            x="24"
            y="35"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="14"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {rank}
          </text>
        </svg>
      </div>
    );
  }

  if (rank === "30") {
    return (
      <div className="d-inline-flex align-items-center justify-content-center" style={{ height: 48 }}>
        <span style={{ fontSize: "2rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
          🏆
        </span>
      </div>
    );
  }

  return (
    <div className="d-inline-flex align-items-center justify-content-center" style={{ height: 48 }}>
      <span style={{ fontSize: "2rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
        🎖️
      </span>
    </div>
  );
}

export function PrizeSection() {
  return (
    <section className="portal-section-pad portal-prize-section" id="prizes">
      <div className="container-page">
        <SectionReveal>
          <div className="text-center mx-auto mb-4" style={{ maxWidth: 640 }}>
            <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3">
              Awards &amp; Cash Prizes · पुरस्कार एवं सम्मान
            </span>
            <h2 className="display-6 fw-bold text-dark mb-2">Awards &amp; Recognition</h2>
            <p className="text-muted mb-0">
              Cash prizes, medals, trophies &amp; certificates for top performing students
            </p>
          </div>
        </SectionReveal>

        <div className="row g-3 g-md-4 justify-content-center mt-2">
          {PRIZES.map((prize, i) => (
            <div key={prize.title} className="col-6 col-md-4 col-lg-4 col-xl">
              <SectionReveal delay={i * 0.05}>
                <div
                  className={`card portal-prize-card h-100 text-center ${
                    prize.highlight ? "is-highlight" : ""
                  }`}
                >
                  <div className={`card-header ${prize.headerClass}`}>
                    <PrizeIcon rank={prize.rank} />
                  </div>
                  <div className="card-body d-flex flex-column p-3 p-md-4">
                    <h3 className="h6 fw-bold text-dark mb-1">{prize.titleHindi}</h3>
                    <p className="small text-muted mb-2">{prize.titleEn}</p>
                    <p className="portal-prize-amount mb-3">{prize.amount}</p>
                    <ul className="list-unstyled mb-0 mt-auto">
                      {prize.extras.map((e) => (
                        <li key={e} className="small text-muted">
                          + {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
