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

interface ItineraryProps {
    price: {
      formatted: string;
    };
    legs: {
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
          name: string;
          logoUrl: string;
        }[];
      };
      segments: {
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
          logoUrl: string;
        };
      }[];
    }[];
  
}

interface SearchResultsData {
  status: "incomplete" | "complete" | "faliure";
  itineraries: ItineraryProps[];
}