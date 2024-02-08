import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

import { SousTitre1 } from "@/components/typography/typography";
import { blurProps } from "@/lib/util";

export function ThreeColumnLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr_15rem]">
      {children}
      <div />
      <div className="hidden lg:block lg:min-h-100px lg:border-r lg:pb-20px" />
      <div />
    </div>
  );
}

export function FirstRow({
  type,
  image,
  alt,
  date,
}: {
  type: string;
  image: StaticImageData;
  alt: string;
  date: string;
}) {
  return (
    <>
      <div className="hidden self-center justify-self-center px-30px text-center lg:block">
        <div className="font-semibold uppercase text-retro-gray lg:text-20px lg:leading-18px">
          {type}
        </div>
      </div>
      <div className="pb-20px lg:border-r lg:pr-20px">
        <div className="lg:border-b lg:pb-20px">
          <Image
            src={image}
            alt={alt}
            className="h-auto w-full"
            {...blurProps}
          />
        </div>
      </div>
      <div className="hidden self-center justify-self-center px-30px text-center lg:block">
        <div className="font-semibold uppercase text-retro-gray lg:text-20px lg:leading-18px">
          Publié le {date}
        </div>
      </div>
    </>
  );
}

export function MiddleColumn({ children }: { children: ReactNode }) {
  return (
    <>
      <div />
      <div className="lg:border-r lg:pr-20px">
        <div className="flex flex-col">{children}</div>
      </div>
      <div />
    </>
  );
}

export function MiddleColumnImageAndRightColumnCaption({
  image,
  alt,
  caption,
}: {
  image: StaticImageData;
  alt: string;
  caption: ReactNode;
}) {
  return (
    <>
      <div />
      <div className="lg:border-r lg:pr-20px">
        <div className="pb-10px lg:pb-20px">
          <Image src={image} alt={alt} className="w-full" {...blurProps} />
        </div>
      </div>
      <div className="self-end pb-10px lg:pb-20px lg:pl-20px">
        <div className="text-center text-14px font-semibold uppercase leading-17px text-retro-gray lg:text-left lg:text-16px lg:leading-19px">
          {caption}
        </div>
      </div>
    </>
  );
}

export function MiddleColumnImageAndCaption({
  image,
  alt,
  caption,
}: {
  image: StaticImageData;
  alt: string;
  caption: ReactNode;
}) {
  return (
    <div className="lg:pb-20px">
      <div className="lg:pb-20px">
        <Image src={image} alt={alt} className="w-full" {...blurProps} />
      </div>
      <div className="flex items-center justify-center border-retro-black py-10px text-center lg:border-y lg:py-15px">
        <div className="font-semibold uppercase text-retro-gray lg:text-20px lg:leading-23px">
          {caption}
        </div>
      </div>
    </div>
  );
}

export function MiddleColumnSection({ children }: { children: ReactNode }) {
  return (
    <MiddleColumn>
      <Section>{children}</Section>
    </MiddleColumn>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return (
    <div className="lg:pb-50px">
      {children}
      <div className="pb-15px lg:hidden">
        <div className="border-b pt-15px lg:hidden"></div>
      </div>
    </div>
  );
}

export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div className="pb-15px lg:pb-20px">
      <div className="flex items-center justify-center border-y bg-retro-green py-10px text-center lg:py-20px">
        <SousTitre1>{children}</SousTitre1>
      </div>
    </div>
  );
}
