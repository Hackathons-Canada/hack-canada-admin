interface UsersStatsProps {
  totalUsers: number;
  start: number;
  displayedUsers: number;
}

export const UsersStats = ({
  totalUsers,
  start,
  displayedUsers,
}: UsersStatsProps) => {
  if (!displayedUsers) {
    return (
      <p className="text-sm font-medium text-muted-foreground max-md:text-center">
        No users match the search criteria.
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-muted-foreground max-md:text-center">
      Displaying users {start + 1} - {start + displayedUsers} from{" "}
      <span className="text-foreground">{totalUsers}</span> users
    </p>
  );
};
