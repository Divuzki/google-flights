import axios from "axios";
import { useEffect, useState } from "react";
import { RAPIDAPI_HEADERS } from "./config";

/**
 * Custom hook to handle airport search functionality.
 * Fetches airport options based on the user input and manages loading state.
 *
 * @param query - The airport search query entered by the user.
 * @returns { options, loading } - List of airport options and loading state.
 */
export const useAirportSearch = (query: string) => {
  const [options, setOptions] = useState<AirportOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAirports = async () => {
      if (query.length < 1) return; // Fetch only if query length is >= 3.
      setLoading(true); // Set loading state to true during the API call.

      try {
        // API call to fetch airport data.
        const { data } = await axios.get(
          `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport`,
          {
            params: { query, locale: "en-US" },
            headers: RAPIDAPI_HEADERS,
          }
        );

        // Map API response to the AirportOption structure.
        const options = data.data.map((item: any) => ({
          label: item.presentation.suggestionTitle,
          value: item.navigation.relevantFlightParams.skyId,
          entityId: item.navigation.relevantFlightParams.entityId,
        }));
        setOptions(options); // Update options state with the fetched data.
      } catch (error) {
        console.error("Error fetching airports:", error); // Handle any errors.
      } finally {
        setLoading(false); // Reset loading state after completion.
      }
    };

    // Debounce the API call to prevent too many requests.
    const debounceFetch = setTimeout(fetchAirports, 300);
    return () => clearTimeout(debounceFetch); // Clean up on unmount or query change.
  }, [query]);

  return { options, loading }; // Return airport options and loading state.
};
