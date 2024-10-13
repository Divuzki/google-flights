import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { RAPIDAPI_HEADERS } from "@/utils/config";

const FlightDetails: React.FC = () => {
  const router = useRouter();
  const { itineraryId } = router.query; // e.g. /flight/12345
  // get ?sessionId=12345 from the URL query parameters
  const { sessionId, legs } = router.query;
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itineraryId) return;

    const fetchFlightData = async () => {
      try {
        const response = await axios.get(
          `https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails`,
          {
            params: { itineraryId, sessionId, legs },
            headers: RAPIDAPI_HEADERS,
          }
        );
        setFlightData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightData();
  }, [itineraryId, legs, sessionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Flight Details</h1>
      <pre>{JSON.stringify(flightData, null, 2)}</pre>
    </div>
  );
};

export default FlightDetails;
