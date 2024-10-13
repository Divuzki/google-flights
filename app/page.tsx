"use client";
import Search from "@/components/Search";
import SearchResults from "@/components/SearchResults";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId");
  const sessionId = searchParams.get("sessionId");
  const legs = searchParams.get("legs");
  console.log(flightId, sessionId, legs);
  const [searchResultsData, setSearchResultsData] =
    useState<SearchResultsData | null>(null);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full justify-center">
        <Image
          className="dark:invert rounded-lg"
          src="/images/flights.svg"
          alt=""
          width={1248}
          height={272}
          priority
        />
        <h1 className="text-4xl font-semibold mx-auto">Flights</h1>
        <Search setSearchResultData={setSearchResultsData} />

        <SearchResults searchResultsData={searchResultsData} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
