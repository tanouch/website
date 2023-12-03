"use client";

import { usePrevious } from "@uidotdev/usehooks";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { closeMenu } from "@/lib/menu-store";

import logoCarre from "../../assets/logo-carre.png";
import FooterLinks from "../layout/footer-links";

export default function Menu() {
  const pathName = usePathname();
  const oldPathName = usePrevious(pathName);

  useEffect(() => {
    if (oldPathName != null && oldPathName !== pathName) {
      closeMenu();
    }
  }, [oldPathName, pathName]);

  return (
    <div className="flex grow flex-col gap-5 pb-7 lg:justify-between">
      <div className="flex grow flex-col lg:h-[1000px] lg:grow-0 lg:border-r lg:pr-5">
        <div className="flex justify-center pb-3 pt-12 lg:hidden">
          <div className="cursor-pointer" onClick={closeMenu}>
            <CloseIcon />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[245px]">
            <Image src={logoCarre} alt="logo" className="w-full" />
          </div>
        </div>
        <MenuLink largeTopPadding>le rétro projecteur</MenuLink>
        <div className="flex flex-col">
          {[
            ["calendrier", "/"],
            ["chroniques", "/chroniques"],
            ["coups de coeur", "/coeur"],
            ["à propos", "/a-propos"],
            ["recherche", "/recherche"],
          ].map(([section, path]) => (
            <MenuLink key={section} path={path}>
              <Link href={path}>{section}</Link>
            </MenuLink>
          ))}
        </div>
      </div>
      <div className="flex lg:pr-5">
        <FooterLinks bigLineHeight={true} color="black" />
      </div>
    </div>
  );
}

function MenuLink({
  children,
  path,
  largeTopPadding,
}: {
  children: ReactNode;
  path?: string;
  largeTopPadding?: boolean;
}) {
  const route = usePathname();
  return (
    <div
      className={clsx("flex justify-center border-b ", {
        "bg-retro-green": path === route,
        "py-4 lg:py-3": !(largeTopPadding ?? false),
        "py-5 lg:py-4": largeTopPadding ?? false,
      })}
    >
      <div className="grow whitespace-break-spaces text-center font-degular text-5xl/8 font-extrabold uppercase text-retro-gray lg:text-4xl/7">
        {children}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-[29px] w-[28px] stroke-retro-gray"
      viewBox="0 0 28 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1.29289"
        y1="27.2216"
        x2="27.2929"
        y2="1.2216"
        strokeWidth="2"
      />
      <line
        x1="27.2929"
        y1="27.7071"
        x2="1.29289"
        y2="1.70711"
        strokeWidth="2"
      />
    </svg>
  );
}
