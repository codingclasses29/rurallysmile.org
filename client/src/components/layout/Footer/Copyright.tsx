import { SITE } from "@/constants/site";

export function Copyright() {
  return (
    <div className="border-t border-white/10 py-4">
      <div className="container-page flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
        <p>
          © {SITE.year} {SITE.org}. All Rights Reserved.
        </p>
        <p>
          Designed & Developed by{" "}
          <a
            href="https://sachin-net.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 underline-offset-2 hover:text-white hover:underline"
          >
            Sachin.net
          </a>
        </p>
      </div>
    </div>
  );
}
