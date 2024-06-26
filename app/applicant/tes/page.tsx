"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import TabNavigation from "@/components/tes/TabNavigation";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TabNavigation />
    </div>
  );
};

export default Home;
