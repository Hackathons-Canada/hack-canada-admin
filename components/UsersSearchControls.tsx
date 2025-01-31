import { UserSearch } from "@/components/search/UserSearch";
import DownloadOptions from "@/components/DownloadOptions";

export const UsersSearchControls = () => {
  return (
    <section aria-label="Search and Download Controls">
      <div className="flex items-start justify-between gap-8 max-2xl:flex-col-reverse">
        <div className="w-full flex-1">
          <UserSearch />
        </div>
        <div className="w-full shrink-0 lg:w-auto">
          <DownloadOptions entity="users" />
        </div>
      </div>
    </section>
  );
};
