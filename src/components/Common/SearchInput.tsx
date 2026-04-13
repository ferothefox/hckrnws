export default function SearchForm() {
  return (
    <div className="flex h-[calc(100vh-56px-32px)] w-full flex-col">
      <p className="text-secondary text-sm">
        Third-party cookies must be enabled to load Algolia frame.
      </p>
      <iframe
        className="fadein-animation-algolia relative h-full w-full border-0 bg-transparent"
        src="https://hn.algolia.com"
        title="Hacker News search"
        loading="lazy"
      />
    </div>
  );
}
