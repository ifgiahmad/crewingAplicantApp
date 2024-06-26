"use client";
import Navbar from "@/components/layout/navbar";
import TabNavOnboard from "@/components/layout/TabNavOnboard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

/* type ParamsProps = {
  param1: string;
  param2: string;
  param3: string;
}; */

const Onboard = (/* { param1, param2, param3 }: ParamsProps */) => {
  const params = useParams();
  const [numId, setNumId] = useState<number>(0);
  const [idPelaut, setIdPelaut] = useState<string>("");
  const [nik, setNik] = useState<string>("");
  const [decodedParam, setDecodedParam] = useState<number | null>(null);

  /* useEffect(() => {
    const id = params["id"];
    if (id) {
      setDecodedParam(Number(decodeURIComponent(id as string)));
    }

    setNumId(Number(decodedParam));
  }, [decodedParam, numId, params]);
 */

  useEffect(() => {
    const id = params["id"];
    const idPelaut = params["idPelaut"];
    const nik = params["nik"];
    if (id && idPelaut && nik) {
      const decoded = Number(decodeURIComponent(id as string));
      setDecodedParam(decoded);
      setNumId(decoded);
      setIdPelaut(idPelaut.toString());
      setNik(nik.toString());
    }
  }, [params]);

  if (!numId || !idPelaut || !nik) {
    return {
      notFound: true, // This will trigger a 404 page
    };
  }

  return (
    <main>
      <div>
        <Navbar />
        <TabNavOnboard id={numId} />
      </div>
    </main>
  );
};

export default Onboard;
