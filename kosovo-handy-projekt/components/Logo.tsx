import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Kosovo Handy - faqja kryesore">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path
            d="M24 4 41 11v11c0 10.5-6.9 18.5-17 22C13.9 40.5 7 32.5 7 22V11l17-7Z"
            fill="currentColor"
          />
          <path
            d="m18.7 24.7 3.4 3.4 7.8-8.2"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </svg>
      </span>
      <span className="brand-copy">
        <strong>Kosovo</strong>
        <span>Handy</span>
      </span>
    </Link>
  );
}
