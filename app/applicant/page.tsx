import ApplicantTable from "@/components/applicant-table";
import Search from "@/components/search";
import { CreateButton } from "@/components/buttons";
const applicant = () => {
  return (
    <div className="max-w-screen-md mx-auto mt-5">
      <div className="flex items-center justify-between gap-1 mb-5">
        <Search />
        <CreateButton />
      </div>
      <ApplicantTable />
    </div>
  );
};

export default applicant;
