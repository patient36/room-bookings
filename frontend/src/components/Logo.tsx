import Image from "next/image";

const Logo = () => {
    return (
        <div className="rounded-full overflow-hidden w-8 h-8 flex items-center justify-center">
            <Image src='/logo.webp' alt="logo" width={50} height={50} />
        </div>
    );
}

export default Logo;