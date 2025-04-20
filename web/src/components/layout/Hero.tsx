import Button from "./Button";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 mt-50">
      <h2 className="text-center text-5xl font-semibold text-white">
        Enterprise-Grade Document
        <br /> Intelligence for Modern Businesses
      </h2>
      <p className="text-center text-gray-300">
        Streamline your organization's document management with advanced search
        capabilities <br />
        and intelligent content analysis. Enhance productivity across your
        enterprise with SierraDocs.
      </p>
      <Button href="/documents">Get Started</Button>
    </div>
  );
}
