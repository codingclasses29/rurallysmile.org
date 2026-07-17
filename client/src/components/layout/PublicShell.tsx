import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { WhatsAppButton } from "@/components/layout/Floating/WhatsAppButton";
import { CallNowButton } from "@/components/layout/Floating/CallNowButton";
import { BackToTop } from "@/components/layout/Floating/BackToTop";
import { AppProviders } from "@/components/layout/AppProviders";
import { OrganizationJsonLd } from "@/components/layout/OrganizationJsonLd";
import { CookieBanner } from "@/components/ui/cookie-banner/CookieBanner";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <OrganizationJsonLd />
      <div className="flex min-h-screen flex-col portal-page-bg">
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <CallNowButton />
        <BackToTop />
        <CookieBanner />
      </div>
    </AppProviders>
  );
}
