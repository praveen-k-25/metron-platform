import dashboard from "@/assets/svgs/dashboard.svg";
import dashboard_dark from "@/assets/svgs/dashboard-dark.svg";
import analytics from "@/assets/svgs/analytics.svg";
import analytics_dark from "@/assets/svgs/analytics-dark.svg";
import reports from "@/assets/svgs/reports.svg";
import reports_dark from "@/assets/svgs/reports-dark.svg";
import settings from "@/assets/svgs/settings.svg";
import settings_dark from "@/assets/svgs/settings-dark.svg";
import tracking from "@/assets/svgs/map.svg";
import tracking_dark from "@/assets/svgs/map-dark.svg";
import logout from "@/assets/svgs/logout.svg";
import logout_dark from "@/assets/svgs/logout-dark.svg";

export const sidebarMain = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: dashboard,
    darkIcon: dashboard_dark,
    submenu: false,
    submenuList: [],
    activeList: ["dashboard"],
  },
  {
    title: "analytics",
    path: "/analytics",
    icon: analytics,
    darkIcon: analytics_dark,
    submenu: false,
    submenuList: [],
    activeList: ["/analytics"],
  },
  {
    title: "reports",
    path: "/reports",
    icon: reports,
    darkIcon: reports_dark,
    submenu: true,
    submenuList: [
      {
        title: "Trip",
        path: "/tripReport",
        submenu: false,
        activeList: ["tripReport"],
      },
      {
        title: "Idle",
        path: "/idleReport",
        submenu: false,
        activeList: ["idleReport"],
      },
      {
        title: "Inactive",
        path: "/inactiveReport",
        submenu: false,
        activeList: ["inactiveReport"],
      },
      {
        title: "Playback",
        path: "/playbackReport",
        submenu: false,
        activeList: ["playbackReport"],
      },
    ],
    activeList: [
      "/tripReport",
      "/idleReport",
      "/inactiveReport",
      "/playbackReport",
    ],
  },
  /* {
    title: "tracking",
    path: "/tracking",
    icon: tracking,
    darkIcon: tracking_dark,
    submenu: false,
    submenuList: [],
    activeList: ["tracking"],
  },
  {
    title: "support",
    path: "/support",
    icon: reports,
    darkIcon: reports_dark,
    submenu: true,
    submenuList: [
      {
        title: "call",
        path: "/call",
        submenu: false,
        activeList: ["call"],
      },
      {
        title: "mail",
        path: "/mail",
        submenu: false,
        activeList: ["mail"],
      },
      {
        title: "message",
        path: "/message",
        submenu: false,
        activeList: ["message"],
      },
    ],
    activeList: ["/call", "/mail", "/message"],
  }, */
];

export const sidebarFooter = [
  {
    title: "settings",
    path: "/settings",
    icon: settings,
    darkIcon: settings_dark,
    submenu: false,
    submenuList: [],
    activeList: ["settings"],
  },
  {
    title: "logout",
    path: "/logout",
    icon: logout,
    darkIcon: logout_dark,
    submenu: false,
    submenuList: [],
    activeList: ["logout"],
  },
];
