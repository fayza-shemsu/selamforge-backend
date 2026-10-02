export default function BrandMark() {
  return (
    <svg
      aria-label="SelamForge"
      className="h-11 w-11 shrink-0"
      fill="none"
      role="img"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="selamforge-brand" x1="4" x2="36" y1="4" y2="36">
          <stop stopColor="#0f766e" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect fill="url(#selamforge-brand)" height="40" rx="13" width="40" />
      <path
        d="M28.5 12.5c-1.8-2.1-4.2-3.2-7.4-3.2h-4a5.4 5.4 0 1 0 0 10.8h9a5.4 5.4 0 1 1 0 10.8h-4.4c-3.1 0-5.6-1.1-7.4-3.2"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
      <path
        d="m29 7.8.9 2.2 2.3.9-2.3.9-.9 2.3-.9-2.3-2.2-.9 2.2-.9.9-2.2Z"
        fill="#fdba74"
      />
    </svg>
  );
}