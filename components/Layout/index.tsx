import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ContentSection } from "./ContentSection";
import { useSession, ProtectedPage } from "../../utils/SessionProvider.client";
import { pageNames } from "../../utils/pageNames.client";

export interface ILayoutProps {
  children: React.ReactNode;
  pathname: string;
}

export const Layout: React.FC<ILayoutProps> = ({ children, pathname }) => {
  const { loggedIn } = useSession();

  if (!pageNames.includes(pathname) && !loggedIn) {
    return <ContentSection>{children}</ContentSection>;
  }

  return (
    <ProtectedPage>
      <Header />
      <Sidebar pathname={pathname} />
      <ContentSection>{children}</ContentSection>
    </ProtectedPage>
  );
};
