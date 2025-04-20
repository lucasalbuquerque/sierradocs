import Button from "./Button";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-8 h-[calc(100vh-120px)] px-4 md:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h2 className="text-center text-3xl md:text-5xl font-semibold text-white w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
          Enterprise-Grade Document Intelligence for Modern Businesses
        </h2>
        <p className="text-center text-sm md:text-base text-gray-300 w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl mt-4 md:mt-8">
          Streamline your organization's document management with advanced
          search capabilities and intelligent content analysis. Enhance
          productivity across your enterprise with SierraDocs.
        </p>
        <div className="mt-8">
          <Button href="/documents">Get Started</Button>
        </div>
      </div>
    </div>
  );
}
