"use client";

import { usePrevious } from "@uidotdev/usehooks";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, ReactNode, useCallback, useEffect } from "react";

import { useCalendrierStore } from "@/lib/calendrier-store";
import { closeMenu } from "@/lib/menu-store";

import logoCarre from "../../assets/logo-carre.gif";
import FooterLinks from "../layout/footer-links";

const menu: [JSX.Element, string][] = [
  [<>calendrier</>, "/"],
  [<>actualités</>, "/actualites"],
  [<>coups de cœur</>, "/coeur"],
  [<>à propos</>, "/a-propos"],
  [<>recherche</>, "/recherche"],
];

export default function Menu() {
  const pathName = usePathname();
  const oldPathName = usePrevious(pathName);

  useEffect(() => {
    if (oldPathName != null && oldPathName !== pathName) {
      closeMenu();
    }
  }, [oldPathName, pathName]);

  const closeMenuIfOnSamePathname = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      useCalendrierStore.getState().reset();
      let anchor: EventTarget | null = e.target;
      while (
        anchor != null &&
        anchor instanceof Node &&
        !(anchor instanceof HTMLAnchorElement)
      ) {
        anchor = anchor.parentElement;
      }

      if (
        anchor != null &&
        (anchor as HTMLAnchorElement).href != null &&
        (anchor as HTMLAnchorElement).href.endsWith(pathName)
      ) {
        closeMenu();
      }
    },
    [pathName],
  );

  const onClickLogo = useCallback(() => {
    useCalendrierStore.getState().reset();
    closeMenu();
  }, []);

  return (
    <div className="flex grow flex-col px-10px sm:px-15px lg:justify-between lg:border-r lg:pl-0 lg:pr-20px">
      <div className="flex grow flex-col lg:grow-0">
        <div className="flex justify-center py-18px lg:hidden">
          <div className="cursor-pointer" onClick={closeMenu}>
            <CloseIcon />
          </div>
        </div>
        <div className="justify-center pb-10px">
          <Link href="/" onClick={onClickLogo}>
            <div className="flex justify-center pb-18px lg:pb-0">
              <Image
                src={logoCarre}
                alt="logo"
                className="h-auto w-250px lg:w-207px"
              />
            </div>
            <div className="flex justify-center">
              <div className="w-min grow whitespace-break-spaces pb-10px text-center font-degular text-44px font-extrabold uppercase leading-29px tracking-[0.01em] text-retro-gray lg:py-5px lg:text-35px lg:leading-25px">
                le rétro
                <br />
                projecteur
              </div>
            </div>
            <div className="hidden" />
          </Link>
          <div className="flex justify-center">
            <div className="w-250px whitespace-break-spaces border border-retro-red py-5px text-center text-20px font-medium uppercase leading-21px text-retro-red lg:w-207px">
              L&apos;actualité des
              <br />
              vieux films à Paris
            </div>
          </div>
        </div>
        <div className="flex flex-col border-t">
          {menu.map(([section, path]) => (
            <Link key={path} href={path} onClick={closeMenuIfOnSamePathname}>
              <MenuLink key={path} path={path} className="py-16px">
                <div className="font-degular text-44px font-extrabold uppercase leading-29px text-retro-gray lg:text-32px lg:leading-25px">
                  {section}
                </div>
              </MenuLink>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex pb-28px pt-15px lg:pb-0">
        <FooterLinks color="black" />
      </div>
    </div>
  );
}

function MenuLink({
  children,
  path,
  className,
}: {
  children: ReactNode;
  path?: string;
  className?: string;
}) {
  const route = usePathname();
  return (
    <div
      className={clsx(className, "flex border-b lg:py-12px", {
        "bg-retro-green":
          (path === "/" && route === "/") ||
          (path != null && path !== "/" && route.startsWith(path)),
      })}
    >
      <div className="w-min grow whitespace-break-spaces text-center">
        {children}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 38 38" className="h-38px w-38px stroke-retro-gray">
      <line
        y1="-1"
        x2="49.3883"
        y2="-1"
        transform="matrix(0.708302 -0.705909 0.708302 0.705909 2.18164 37.1544)"
        strokeWidth="2"
      />
      <line
        y1="-1"
        x2="49.3883"
        y2="-1"
        transform="matrix(-0.708302 -0.705909 0.708302 -0.705909 37.1636 35.9091)"
        strokeWidth="2"
      />
    </svg>
  );
}
