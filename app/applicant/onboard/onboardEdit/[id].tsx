import Navbar from "@/components/layout/navbar";
import TabNavOnboard from "@/components/layout/TabNavOnboard";
import router from "next/router";

interface Onboard {
  id: number;
}
const Onboard: React.FC<Onboard> = ({ id }) => {
  console.log(id);
  return (
    <main>
      <div>
        <Navbar />
        <TabNavOnboard id={id} />
      </div>
    </main>
  );
};

export default Onboard;
