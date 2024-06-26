// components/JabatanDropdown.tsx
"use client";
import React, { useEffect, useState } from "react";
import KodeMaster from "@/app/models/KodeMaster";
import api from "@/app/lib/api";
import Currency from "@/app/models/Currencies";

interface DropdownPops {
  elementId: string;
  labelValue: string;
  constantApi: string;
  required: boolean;
  defaultValue: string;
  onSelect: (value: string) => void;
}

const DropdownKodeMaster: React.FC<DropdownPops> = ({
  elementId,
  labelValue,
  constantApi,
  required,
  defaultValue,
  onSelect,
}) => {
  const [kodes, setKodes] = useState<KodeMaster[]>([]);
  const [currency, setCurrency] = useState<Currency[]>([]);
  const [selectedDropdown, setSelectedDropdown] = useState<string>("");
  const [showOptionMasterType, setShowOptionMasterType] =
    useState<boolean>(false);
  const [showOptionCurrency, setShowOptionCurrency] = useState<boolean>(false);

  useEffect(() => {
    const fetchKodes = async () => {
      try {
        if (elementId === "currency") {
          setShowOptionCurrency(true);
          if (currency.length === 0) {
            const data = await api.getMasterCurrencyNonAuth();
            const currency = data.map(
              (item: any) =>
                new Currency(
                  item.id,
                  item.bank,
                  item.currency,
                  item.currencyDate,
                  item.currencyRate,
                  item.createdBy,
                  item.createdDate,
                  item.updatedBy,
                  item.updatedDate
                )
            );
            setCurrency(currency);
          }
        } else {
          setShowOptionMasterType(true);
          if (kodes.length === 0) {
            const data = await api.getMasterByTypeNonAuth(constantApi);

            const kodes = data.map(
              (item: any) =>
                new KodeMaster(
                  item.id,
                  item.kodeMaster,
                  item.tipeMaster,
                  item.textMaster
                )
            );
            setKodes(kodes);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchKodes();
  }, [constantApi, currency.length, elementId, kodes]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDropdown(event.target.value);
    const selectedValue = event.target.value;
    onSelect(selectedValue);
  };

  return (
    <div>
      <label
        htmlFor={elementId}
        className="block text-xs font-small text-gray-900 mb-1"
      >
        {required ? <sup>* </sup> : <></>}
        {labelValue}
      </label>
      {showOptionMasterType && (
        <select
          name={elementId}
          id={elementId}
          value={selectedDropdown || defaultValue}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 rounded"
          required={required}
        >
          <option value="">--{labelValue}--</option>
          {kodes.map((kode) => (
            <option key={kode.id} value={kode.textMaster}>
              {kode.textMaster}
            </option>
          ))}
        </select>
      )}
      {showOptionCurrency && (
        <select
          name={elementId}
          id={elementId}
          value={selectedDropdown || defaultValue}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 rounded"
          required={required}
        >
          <option value="">--{labelValue}--</option>
          {currency.map((kode) => (
            <option key={kode.id} value={kode.currency}>
              {kode.currency}
            </option>
          ))}
        </select>
      )}
      {/* <select
        name={elementId}
        id={elementId}
        value={selectedDropdown || defaultValue}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 rounded"
        required={required}
      >
        <option value="">--{labelValue}--</option>
        {kodes.map((kode) => (
          <option key={kode.id} value={kode.textMaster}>
            {kode.textMaster}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default DropdownKodeMaster;
