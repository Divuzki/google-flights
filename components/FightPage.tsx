import React, { useEffect, useState } from "react";
import axios from "axios";
import { RAPIDAPI_HEADERS } from "@/utils/config";

type Props = {
  flightId: string;
  sessionId: string;
  legs: string;
};

const FlightPage: React.FC<Props> = (props) => {
  const { flightId, sessionId, legs } = props;
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!flightId) return;

    const fetchFlightData = async () => {
      try {
        const response = await axios.get(
          `https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails`,
          {
            params: { flightId, sessionId, legs },
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
  }, [flightId, legs, sessionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Flight Details</h1>
      <pre>{JSON.stringify(flightData, null, 2)}</pre>
    </div>
  );
};

export default FlightPage;
