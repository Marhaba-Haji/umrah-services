import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SERVICE_TYPES = [
  { key: "flights", label: "Flights" },
  { key: "hotels", label: "Hotels" },
  { key: "visa", label: "Visa" },
  { key: "transport", label: "Transport" },
  { key: "umrah", label: "Umrah Packages" },
  { key: "hajj", label: "Hajj Packages" },
  { key: "activities", label: "Activities" },
  { key: "guide", label: "Guide Services" },
];

const initialMarkupState = SERVICE_TYPES.reduce(
  (acc, service) => {
    acc[service.key] = {
      type: "percentage", // or "fixed"
      value: "",
      fixedType: "per_person", // or "per_invoice" (only for fixed)
    };
    return acc;
  },
  {} as Record<string, { type: string; value: string; fixedType: string }>,
);

const MarkupManagement: React.FC = () => {
  const [markups, setMarkups] = useState(initialMarkupState);
  const [saved, setSaved] = useState(false);

  const handleTypeChange = (serviceKey: string, type: string) => {
    setMarkups((prev) => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        type,
      },
    }));
  };

  const handleValueChange = (serviceKey: string, value: string) => {
    setMarkups((prev) => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        value,
      },
    }));
  };

  const handleFixedTypeChange = (serviceKey: string, fixedType: string) => {
    setMarkups((prev) => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        fixedType,
      },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="shadow-lg border border-gray-200 w-full">
      <CardHeader>
        <CardTitle>Markup Management</CardTitle>
        <CardDescription>
          Configure markups for each service. You can set a percentage or a
          fixed price (per person or per invoice). These settings are local
          only.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="py-2 px-3 font-semibold">Service</th>
                <th className="py-2 px-3 font-semibold">Markup Type</th>
                <th className="py-2 px-3 font-semibold">Value</th>
                <th className="py-2 px-3 font-semibold">Fixed Type</th>
              </tr>
            </thead>
            <tbody>
              {SERVICE_TYPES.map((service) => (
                <tr
                  key={service.key}
                  className="bg-white hover:bg-gray-50 rounded-lg shadow-sm"
                >
                  <td className="py-3 px-3 align-middle">
                    <Label className="font-medium text-base">
                      {service.label}
                    </Label>
                  </td>
                  <td className="py-3 px-3 align-middle">
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`type-${service.key}`}
                          value="percentage"
                          checked={markups[service.key].type === "percentage"}
                          onChange={() =>
                            handleTypeChange(service.key, "percentage")
                          }
                          className="accent-blue-600 focus:ring-2 focus:ring-blue-400"
                        />
                        <span>Percentage (%)</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`type-${service.key}`}
                          value="fixed"
                          checked={markups[service.key].type === "fixed"}
                          onChange={() =>
                            handleTypeChange(service.key, "fixed")
                          }
                          className="accent-blue-600 focus:ring-2 focus:ring-blue-400"
                        />
                        <span>Fixed Price</span>
                      </label>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder={
                          markups[service.key].type === "percentage"
                            ? "Enter %"
                            : "Enter amount"
                        }
                        value={markups[service.key].value}
                        onChange={(e) =>
                          handleValueChange(service.key, e.target.value)
                        }
                        className="w-28 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="text-gray-500">
                        {markups[service.key].type === "percentage"
                          ? "%"
                          : "SAR"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-middle">
                    {markups[service.key].type === "fixed" ? (
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`fixedType-${service.key}`}
                            value="per_person"
                            checked={
                              markups[service.key].fixedType === "per_person"
                            }
                            onChange={() =>
                              handleFixedTypeChange(service.key, "per_person")
                            }
                            className="accent-blue-600 focus:ring-2 focus:ring-blue-400"
                          />
                          <span>Per Person</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`fixedType-${service.key}`}
                            value="per_invoice"
                            checked={
                              markups[service.key].fixedType === "per_invoice"
                            }
                            onChange={() =>
                              handleFixedTypeChange(service.key, "per_invoice")
                            }
                            className="accent-blue-600 focus:ring-2 focus:ring-blue-400"
                          />
                          <span>Per Invoice</span>
                        </label>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <Button
            size="lg"
            className="px-8 py-2 text-base font-semibold shadow-md"
            onClick={handleSave}
          >
            Save Markups
          </Button>
        </div>
        {saved && (
          <div className="text-green-600 mt-4 text-center font-medium">
            Markups saved (local state only)
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarkupManagement;
