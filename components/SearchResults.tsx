"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Itinerary from "./ItineraryCard";

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

    const observer = useRef<IntersectionObserver | null>(null);
    const lastItineraryRef = useCallback(
        (node: HTMLDivElement) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && searchResultsData && displayedItineraries.length < searchResultsData.itineraries.length) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [searchResultsData, displayedItineraries]
    );

    return searchResultsData && searchResultsData.itineraries.length > 0 ? (
        <div
            ref={searchContainerRef}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
            {displayedItineraries.map((itinerary, index) => {
                if (index === displayedItineraries.length - 1) {
                    return <Itinerary ref={lastItineraryRef} key={index} itinerary={itinerary} />;
                } else {
                    return <Itinerary key={index} itinerary={itinerary} />;
                }
            })}
        </div>
    ) : (
        <div className="flex justify-center gap-4">
            <p>No results found</p>
        </div>
    );
};

export default SearchResults;
