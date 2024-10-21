import Image from "next/image";

export default function Logo() {
  return (
    <Image
        src="/assets/images/logo.webp"
        alt="Vogue Logo"
        height={100}
        width={80}
    />
  )
}