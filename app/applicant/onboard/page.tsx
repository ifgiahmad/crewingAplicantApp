import Navbar from "@/components/layout/navbar";
import TabNavOnboard from "@/components/layout/TabNavOnboard";

const Onboard = () => {
  return (
    <main>
      <div>
        <Navbar />
        <TabNavOnboard id={0} />
      </div>
    </main>
  );
};

export default Onboard;
