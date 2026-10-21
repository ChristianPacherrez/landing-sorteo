import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-center py-4 px-6 bg-white">
      <Image
        src="/icons/logo.svg"
        alt="DAIKIN SAEG"
        width={280}
        height={28}
        priority
      />
    </header>
  );
}
