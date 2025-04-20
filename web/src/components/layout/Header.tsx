import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center container mx-auto mt-10 px-4 md:px-0 gap-4 md:gap-0">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="https://cdn.prod.website-files.com/662b316c8b82b058df121f76/66663ade08d68f71f7819e1c_sierra-logo.svg"
          alt="Sierra Logo"
          width={50}
          height={50}
        />
        <h1 className="text-white text-xl md:text-2xl font-bold">SierraDocs</h1>
      </Link>
      <nav className="flex items-center">
        <ul className="flex gap-4">
          <li className="font-extralight text-sm md:text-base text-white hover:text-gray-300 transition-colors duration-300">
            <Link href="/documents">Documents</Link>
          </li>
          <li className="font-extralight text-sm md:text-base text-white hover:text-gray-300 transition-colors duration-300">
            <Link href="/ai-assistant">AI Assistant</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
