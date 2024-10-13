interface AirportOption {
  label: string;
  value: string;
  entityId: string;
}

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface SearchData {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: Passengers;
  tripType: string;
  travelClass: string;
}

type Segment = {
  origin: {
    name: string;
    displayCode: string;
  };
  destination: {
    name: string;
    displayCode: string;
  };
  departure: string;
  arrival: string;
  flightNumber: string;
  marketingCarrier: {
    name: string;
  };
};

type Leg = {
  id: string;
  origin: {
    city: string;
    displayCode: string;
  };
  destination: {
    city: string;
    displayCode: string;
  };
  departure: string;
  arrival: string;
  durationInMinutes: number;
  stopCount: number;
  carriers: {
    marketing: {
      logoUrl: string;
      name: string;
    }[];
  };
  segments: Segment[];
};

interface ItineraryProps {
  id: string;
  price: {
    formatted: string;
  };
  legs: Leg[];
}

interface SearchResultsData {
  sessionId: string;
  status: "incomplete" | "complete" | "faliure";
  itineraries: ItineraryProps[];
}
