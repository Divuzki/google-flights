"use client";

import React, { useEffect, useRef, useState } from "react";
import Itinerary from "./ItineraryCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";

type Props = {
    searchResultsData: SearchResultsData | null;
};

const ITEMS_PER_PAGE = 50;

const SearchResults = ({ searchResultsData }: Props) => {
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedItineraries, setDisplayedItineraries] = useState<ItineraryProps[]>([]);

    useEffect(() => {
        if (searchContainerRef.current) {
            searchContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [searchContainerRef, searchResultsData]);

    useEffect(() => {
        if (searchResultsData) {
            const newItineraries = searchResultsData.itineraries.slice(0, currentPage * ITEMS_PER_PAGE);
            setDisplayedItineraries(newItineraries);
        }
    }, [searchResultsData, currentPage]);

    const fetchMoreData = () => {
        if (searchResultsData && displayedItineraries.length < searchResultsData.itineraries.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    return searchResultsData && searchResultsData.itineraries.length > 0 ? (
        <InfiniteScroll
            dataLength={displayedItineraries.length}
            next={fetchMoreData}
            hasMore={displayedItineraries.length < (searchResultsData?.itineraries.length || 0)}
            loader={<CircularProgress />}
            endMessage={<p style={{ textAlign: 'center' }}>No more results</p>}
            className="!w-full"
            
        >
            <div
                ref={searchContainerRef}
                className="grid gap-6 rid-cols-2 w-full mx-auto"
            >
                {displayedItineraries.map((itinerary, index) => (
                    <Itinerary key={index} itinerary={itinerary} />
                ))}
            </div>
        </InfiniteScroll>
    ) : (
        <div className="flex justify-center gap-4">
            <p></p>
        </div>
    );
};

export default SearchResults;
