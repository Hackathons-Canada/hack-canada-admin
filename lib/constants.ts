export const RESULTS_PER_PAGE = 25;

type NavigationLink = {
  name: string;
  href: string;
  adminOnly?: boolean;
};

export const navLinks: NavigationLink[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Users",
    href: "/users",
    adminOnly: true,
  },
  {
    name: "Applications",
    href: "/applications",
    adminOnly: true,
  },
  // {
  //   name: "Statistics",
  //   href: "/statistics",
  // },
  {
    name: "Review Applications",
    href: "/review-applications",
  },
  {
    name: "Reviewer Leaderboards",
    href: "/reviewers/leaderboards",
  },
  {
    name: "Role Management",
    href: "/role-management",
    adminOnly: true,
  },
  {
    name: "Logs",
    href: "/logs",
    adminOnly: true,
  },
];
