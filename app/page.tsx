"use client";
import Search from "@/components/Search";
import SearchResults from "@/components/SearchResults";
import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [searchResultsData, setSearchResultsData] =
    useState<SearchResultsData | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert rounded-lg"
          src="/images/flights.svg"
          alt=""
          width={1248}
          height={272}
          priority
        />
        <Search
          setSearchResultData={setSearchResultsData}
          setSearchLoading={setLoading}
        />

        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress color="inherit" size={50} />
          </Box>
        )}
        <SearchResults searchResultsData={searchResultsData} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
