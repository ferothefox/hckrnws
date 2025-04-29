const SearchForm: React.FC = () => {
  return (
    <div className="h-[calc(100vh-56px-32px)] w-full flex flex-col">
      <p className="text-sm text-secondary">
        Third-party cookies must be enabled to load Algolia frame.
      </p>
      <object
        className="fadein-animation-algolia w-full h-full bg-transparent color-transparent relative border-0"
        data={`https://hn.algolia.com`}
      />
    </div>
  );
};

export default SearchForm;
