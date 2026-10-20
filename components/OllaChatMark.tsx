export default function OllaChatMark({ className = "h-7 w-8" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 52" className={`shrink-0 drop-shadow-sm ${className}`} fill="none">
      <path d="M27.4 8.4C23.5 3.6 15.7 2.4 9.1 5.8 1.4 9.8 1 20.8 6.6 26.8l-3 7.8 10-2.2c5.7 2.4 12.3.6 15.8-4.2" stroke="#f1d7ab" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32.6 8.4c4.1-4.8 12.2-6 18.7-2.5 7.4 4 7.9 14.7 2.3 20.7l3.1 8-10.2-2.2c-5.8 2.4-12.6.5-16-4.4" stroke="#f1d7ab" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13.2c2.4-5.4 9.7-7.2 15-4.1 5.6 3.3 6.1 11.1 2 15.5l-2.2 4.3-6.5-.2-5 1.1 1.4-4C7.3 23.1 4.9 18.3 7 13.2Z" fill="#f0822d" stroke="#f1d7ab" strokeWidth="1.4" />
      <path d="M12 17.5h10l-.9 7.2h-8.2l-.9-7.2ZM10.4 18h2M21.6 18h2M14.7 15.1c0-1.1 1-1.1 1-2.2M18 15.1c0-1.1 1-1.1 1-2.2" stroke="#fff0d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="37" cy="16.5" r="2.1" fill="#f0822d" />
      <circle cx="44" cy="16.5" r="2.1" fill="#f0822d" />
      <circle cx="51" cy="16.5" r="2.1" fill="#f0822d" />
    </svg>
  );
}
