"use client";

import { generateFilters } from "@/actions/generate-filters";
import { COUNTRIES } from "@/utils/utils";
import { RiCalculatorLine, RiSearchLine } from "@remixicon/react";
import {
  AreaChart,
  Button,
  Select,
  SelectItem,
  TextInput,
} from "@tremor/react";
import { useState } from "react";

interface GroupedItem {
  monthYear: string;
  visit: number;
}

const items = [
  { date: new Date("2024-01-01"), browser: "chrome", country: "FR", os: "mac" },
  { date: new Date("2024-01-01"), browser: "chrome", country: "JP", os: "mac" },
  { date: new Date("2024-01-01"), browser: "chrome", country: "FR", os: "mac" },
  { date: new Date("2024-02-01"), browser: "safari", country: "JP", os: "mac" },
  { date: new Date("2024-02-01"), browser: "safari", country: "FR", os: "mac" },
  { date: new Date("2024-02-01"), browser: "safari", country: "US", os: "mac" },
  { date: new Date("2024-03-01"), browser: "safari", country: "US", os: "mac" },
  { date: new Date("2024-04-01"), browser: "safari", country: "FR", os: "mac" },
  {
    date: new Date("2024-04-01"),
    browser: "firefox",
    country: "JP",
    os: "mac",
  },
  {
    date: new Date("2024-04-01"),
    browser: "firefox",
    country: "US",
    os: "mac",
  },
  {
    date: new Date("2024-04-01"),
    browser: "firefox",
    country: "FR",
    os: "mac",
  },
  {
    date: new Date("2024-10-01"),
    browser: "firefox",
    country: "US",
    os: "mac",
  },
  { date: new Date("2024-05-01"), browser: "chrome", country: "US", os: "mac" },
  { date: new Date("2024-05-01"), browser: "chrome", country: "JP", os: "mac" },
  { date: new Date("2024-05-01"), browser: "chrome", country: "FR", os: "mac" },
  { date: new Date("2024-06-01"), browser: "safari", country: "US", os: "mac" },
  { date: new Date("2024-06-01"), browser: "safari", country: "JP", os: "mac" },
  { date: new Date("2024-06-01"), browser: "safari", country: "FR", os: "mac" },
  {
    date: new Date("2024-07-01"),
    browser: "firefox",
    country: "US",
    os: "mac",
  },
  {
    date: new Date("2024-07-01"),
    browser: "firefox",
    country: "JP",
    os: "mac",
  },
  {
    date: new Date("2024-07-01"),
    browser: "firefox",
    country: "FR",
    os: "mac",
  },
];

const formatItems = (items: any[]): GroupedItem[] => {
  const groupedItems = items.reduce<Record<string, GroupedItem>>(
    (acc, item) => {
      const yearMonth = `${String(item.date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${item.date.getFullYear()}`;

      if (!acc[yearMonth]) {
        acc[yearMonth] = { monthYear: yearMonth, visit: 0 };
      }

      acc[yearMonth].visit++;

      return acc;
    },
    {}
  );

  return Object.values(groupedItems);
};

function filterItems(items: any, filters: any) {
  if (filters === undefined || filters?.length === 0) {
    return items;
  }

  return items.filter((item: any) =>
    Object.keys(filters).every((key) => item[key] === filters[key])
  );
}

const Dashboard = () => {
  const [filters, setFilters] = useState<any>({});
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredItems = filterItems(items, filters);

  const handleSubmit = async () => {
    setIsLoading(true);

    const filters = await generateFilters(prompt);

    setFilters(filters);
    setIsLoading(false);
  };

  return (
    <div className="p-10 max-w-3xl w-full">
      <div className="flex gap-2 max-w-2xl">
        <Select
          name="browser"
          placeholder="Browser"
          value={filters?.["browser"]}
          onValueChange={(v) => setFilters({ ...filters, browser: v })}
        >
          <SelectItem value="chrome" icon={RiCalculatorLine}>
            Chrome
          </SelectItem>
          <SelectItem value="firefox" icon={RiCalculatorLine}>
            Firefox
          </SelectItem>
          <SelectItem value="safari" icon={RiCalculatorLine}>
            Safari
          </SelectItem>
        </Select>
        <Select
          name="os"
          placeholder="OS"
          value={filters?.["os"]}
          onValueChange={(v) => setFilters({ ...filters, os: v })}
        >
          <SelectItem value="windows" icon={RiCalculatorLine}>
            Windows
          </SelectItem>
          <SelectItem value="mac" icon={RiCalculatorLine}>
            Mac
          </SelectItem>
          <SelectItem value="linux" icon={RiCalculatorLine}>
            Linux
          </SelectItem>
        </Select>
        <Select
          name="country"
          placeholder="Country"
          value={filters?.["country"]}
          onValueChange={(v) => setFilters({ ...filters, country: v })}
        >
          {Object.keys(COUNTRIES).map((code) => (
            <SelectItem key={code} value={code} icon={RiCalculatorLine}>
              {COUNTRIES[code]}
            </SelectItem>
          ))}
        </Select>
      </div>

      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          icon={RiSearchLine}
          placeholder="Your search..."
        />
        <Button loading={isLoading}>Ask</Button>
      </form>
      {Object.keys(filters).length > 0 && (
        <pre className="mt-2 text-sm bg-teal-50 p-4 rounded-xl text-teal-800">
          {JSON.stringify(filters)}
        </pre>
      )}
      <AreaChart
        animationDuration={800}
        showAnimation
        className="mt-4 h-72"
        data={formatItems(filteredItems)}
        index="monthYear"
        yAxisWidth={65}
        categories={["visit"]}
        xAxisLabel="Month"
        yAxisLabel="Visits"
        colors={["indigo"]}
      />
    </div>
  );
};

export default Dashboard;
