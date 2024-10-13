"use client"; // Enables client-side rendering for this component.
import React, { useState, useCallback } from "react";
import {
  Container,
  Grid,
  TextField,
  MenuItem,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import axios from "axios";
import { useAirportSearch } from "@/utils/lookups";

// Define the structure of airport data returned from the API.
interface AirportOption {
  label: string;
  value: string;
  entityId: string;
}

// Type to manage passenger counts.
interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

// Props type for the component to receive necessary state handlers from the parent.
type Props = {
  setSearchResultData: React.Dispatch<
    React.SetStateAction<SearchResultsData | null>
  >;
};

/**
 * A reusable component to select passenger count for adults, children, or infants.
 */
const PassengerSelect: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, value, onChange }) => (
  <TextField
    select
    label={label}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    fullWidth
  >
    {/* Render select options dynamically. */}
    {[0, 1, 2, 3, 4, 5].map((num) => (
      <MenuItem key={num} value={num}>
        {num}
      </MenuItem>
    ))}
  </TextField>
);

/**
 * Main Search component to allow users to search for flights.
 * Handles airport selection, date range, passenger details, and triggers the search.
 */
const Search: React.FC<Props> = ({ setSearchResultData }) => {
  const [isSearching, setSearchLoading] = useState(false);
  const [from, setFrom] = useState<string>(""); // "From" airport input.
  const [to, setTo] = useState<string>(""); // "To" airport input.
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]); // Selected date range.
  const [passengers, setPassengers] = useState<Passengers>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [tripType, setTripType] = useState<string>("round-trip"); // Type of trip.
  const [travelClass, setTravelClass] = useState<string>("economy"); // Travel class.
  const [selectedFrom, setSelectedFrom] = useState<AirportOption | null>(null); // Selected "From" airport.
  const [selectedTo, setSelectedTo] = useState<AirportOption | null>(null); // Selected "To" airport.

  // Use custom hooks to manage airport search for both "From" and "To" inputs.
  const { options: fromOptions, loading: fromLoading } = useAirportSearch(from);
  const { options: toOptions, loading: toLoading } = useAirportSearch(to);

  /**
   * Checks if the form is valid for submission.
   * Ensures that both airports are selected, departure date is provided,
   * and return date is required for round trips.
   */
  const isFormValid = useCallback(
    () =>
      selectedFrom &&
      selectedTo &&
      dateRange[0] &&
      (tripType === "one-way" || dateRange[1]),
    [selectedFrom, selectedTo, dateRange, tripType]
  );

  /**
   * Handles the flight search API call based on user input.
   */
  const handleSearch = async () => {
    if (!isFormValid()) {
      console.error("Missing required search parameters");
      return;
    }

    setSearchLoading(true); // Set loading state during the search process.

    // Prepare API parameters.
    const params = {
      originSkyId: selectedFrom!.value,
      destinationSkyId: selectedTo!.value,
      originEntityId: selectedFrom!.entityId,
      destinationEntityId: selectedTo!.entityId,
      date: dateRange[0]?.toISOString().split("T")[0],
      returnDate: dateRange[1]?.toISOString().split("T")[0] || null,
      cabinClass: travelClass,
      adults: passengers.adults,
      childrens: passengers.children,
      infants: passengers.infants,
      sortBy: "best",
      currency: "USD",
    };

    try {
      // API call to search for flights.
      const { data } = await axios.get(
        `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete`,
        {
          params,
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );
      // Update search results data state with the response.
      setSearchResultData({
        itineraries: data.data.itineraries,
        status: data.data.context.status,
      });
    } catch (error) {
      console.error("Error searching flights:", error); // Handle API errors.
    } finally {
      setSearchLoading(false); // Reset loading state.
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {/* "From" Airport Autocomplete */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={fromOptions}
            getOptionLabel={(option) => option.label}
            onInputChange={(_, value) => setFrom(value)}
            onChange={(_, value) => setSelectedFrom(value)}
            loading={fromLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {fromLoading && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* "To" Airport Autocomplete */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={toOptions}
            getOptionLabel={(option) => option.label}
            onInputChange={(_, value) => setTo(value)}
            onChange={(_, value) => setSelectedTo(value)}
            loading={toLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {toLoading && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Date Range Picker */}
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              disablePast
            />
          </LocalizationProvider>
        </Grid>

        {/* Trip Type Selector */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Trip Type"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            fullWidth
          >
            <MenuItem value="round-trip">Round Trip</MenuItem>
            <MenuItem value="one-way">One Way</MenuItem>
          </TextField>
        </Grid>

        {/* Travel Class Selector */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Class"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            fullWidth
          >
            <MenuItem value="economy">Economy</MenuItem>
            <MenuItem value="premium_economy">Premium Economy</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="first">First</MenuItem>
          </TextField>
        </Grid>

        {/* Passenger Selectors */}
        <Grid item xs={12} sm={6}>
          <PassengerSelect
            label="Adults"
            value={passengers.adults}
            onChange={(value) =>
              setPassengers({ ...passengers, adults: value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PassengerSelect
            label="Children"
            value={passengers.children}
            onChange={(value) =>
              setPassengers({ ...passengers, children: value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PassengerSelect
            label="Infants"
            value={passengers.infants}
            onChange={(value) =>
              setPassengers({ ...passengers, infants: value })
            }
          />
        </Grid>

        {/* Search Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <button
              onClick={handleSearch}
              disabled={!isFormValid()}
              className="rounded-full max-sm:w-full disabled:opacity-50 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#76c3ff] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Search Flights{" "}
              {isSearching && <CircularProgress size={20} className="!ml-5" />}
            </button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
