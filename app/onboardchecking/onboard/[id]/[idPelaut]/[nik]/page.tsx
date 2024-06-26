"use client";
import CrewRekrutmen from "@/app/models/CrewRekrutmen";
import Navbar from "@/components/layout/navbar";
import TabNavOnboard from "@/components/layout/TabNavOnboard";
import { id } from "date-fns/locale/id";
import { GetServerSideProps } from "next";
//import { useRouter } from "next/navigation";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
//import { useRouter } from "next/router";

const Onboard = () => {
  const params = useParams();
  const [numId, setNumId] = useState<number>(0);
  const [decodedParam, setDecodedParam] = useState<number | null>(null);
  const [rekrutmen, setCrewRekrutmen] = useState<CrewRekrutmen>(
    new CrewRekrutmen()
  );

  useEffect(() => {
    const id = params["id"];
    const idPelaut = params["idPelaut"];
    const nik = params["nik"];

    if (id) {
      setDecodedParam(Number(decodeURIComponent(id as string)));
    }

    setNumId(Number(decodedParam));
  }, [decodedParam, numId, params]);

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
