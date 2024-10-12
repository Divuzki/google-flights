"use client";
import Itinerary from "@/components/ItineraryCard";
import Search from "@/components/Search";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [searchResultsData, setSearchResultsData] = useState<SearchResultsData>(
    {}
  );
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/images/flights.svg"
          alt=""
          width={1248}
          height={272}
          priority
        />
        <Search setSearchResultData={setSearchResultsData} />

        {searchResultsData.itineraries && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {searchResultsData.itineraries.map((itinerary, index) => (
              <Itinerary key={index} itinerary={itinerary} />
            ))}
          </div>
        )}
        
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
