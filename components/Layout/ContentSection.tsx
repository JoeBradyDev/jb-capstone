import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "../../utils/SessionProvider.client";
import { pageNames } from "../../utils/pageNames.client";

export interface IContentSectionProps {
  children: React.ReactNode;
}

export const ContentSection: React.FC<IContentSectionProps> = ({
  children,
}) => {
  const { pathname } = useRouter();
  const [protectedContentReady, setProtectedContentReady] =
    useState<boolean>(false);
  const { loggedIn } = useSession();
  const fullscreenLayoutClasses = "inset-0 overflow-auto";
  const defaultLayoutClasses = "left-96 top-20 right-0 bottom-0";
  const fullscreen = !pageNames.includes(pathname) && !loggedIn;

  useEffect(() => {
    if (loggedIn && !protectedContentReady) {
      setTimeout(() => {
        setProtectedContentReady(true);
      }, 0);
    }
  }, [loggedIn, protectedContentReady]);

  return (
    <>
      <div
        className={`fixed bg-gradient-to-tl from-sky-100 to-white ${
          !!fullscreen ? fullscreenLayoutClasses : defaultLayoutClasses
        }`}
      />
      <div
        className={`absolute flex justify-center ${
          !!fullscreen ? fullscreenLayoutClasses : defaultLayoutClasses
        }`}
      >
        <div className="flex flex-col w-full h-full">{children}</div>
      </div>
    </>
  );
};
