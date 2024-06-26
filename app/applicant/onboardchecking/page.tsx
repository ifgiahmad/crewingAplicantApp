import CheckingOnboard from "@/components/checking-onboard-form";
import Navbar from "@/components/layout/navbar";
import Footbar from "@/components/layout/footbar";

const OnboardChecking = () => {
  return (
    <div>
      <Navbar />
      <div className="w-50">
        <CheckingOnboard />
      </div>
      <Footbar />
    </div>
    //<div className="max-w-screen-lg mx-auto">

    //</div>
  );
};

export default OnboardChecking;
