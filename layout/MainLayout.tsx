"use client";
import { ReactNode, useEffect, useState } from "react";
import NoInternet from "../components/custom/NoInternet";
import AppLayout from "./AppLayout";
import HttpHelpers from "@/services/helpers";
import StorageService from "@/services/storage";
import localeService from "@/services/locale";
import localStorageProvider from "@/services/storage/localStorageProvider";
import localeResolver from "@/services/locale/localeResolver";
import i18n from "@/i18n";
import { useAuth } from "@/hooks/useAuth";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: Readonly<MainLayoutProps>) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { logout } = useAuth();

   /** Handle network status */
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    updateOnlineStatus(); 

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  /** Initialize global services */
  useEffect(() => {
    StorageService.setStorageProvider(localStorageProvider);
    localeService.setLocaleResolver(localeResolver);

    HttpHelpers.setBaseUrl(
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
    );
  }, []);

  /** Auto-logout after 6h */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (!token || !loginTime) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - parseInt(loginTime, 10);
    const remainingTime = 6 * 60 * 60 * 1000 - elapsedTime;

    if (remainingTime <= 0) {
      logout();
      return;
    }

    const logoutTimer = setTimeout(logout, remainingTime);

    return () => clearTimeout(logoutTimer);
  }, [logout]);

  /** Initialize locale */
  useEffect(() => {
    (async () => {
      const storedLocale = await localStorageProvider.get("locale");
      const locale = storedLocale || "en";

      if (!storedLocale) {
        await localStorageProvider.set("locale", locale);
      }

      i18n.changeLanguage(locale);
      document.documentElement.dir = i18n.dir();
      document.documentElement.lang = locale;
    })();
  }, []);

  return isOnline ? <AppLayout>{children}</AppLayout> : <NoInternet />;
}

export default MainLayout;
