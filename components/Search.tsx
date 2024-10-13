/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";

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

type Props = {
  setSearchResultData: React.Dispatch<
    React.SetStateAction<SearchResultsData | null>
  >;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Search: React.FC<Props> = ({ setSearchResultData, setSearchLoading }) => {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
  const [passengers, setPassengers] = useState<Passengers>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [tripType, setTripType] = useState<string>("round-trip");
  const [travelClass, setTravelClass] = useState<string>("economy");
  const [fromOptions, setFromOptions] = useState<AirportOption[]>([]);
  const [toOptions, setToOptions] = useState<AirportOption[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<AirportOption | null>(null);
  const [selectedTo, setSelectedTo] = useState<AirportOption | null>(null);
  const [loading, setLoading] = useState({
    from: false,
    to: false,
  });

  const fetchAirports = async (
    query: string,
    setOptions: React.Dispatch<React.SetStateAction<AirportOption[]>>
  ) => {
    if (!query || query.length < 3 || query === "") return;
    setLoading(
      query === from ? { ...loading, from: true } : { ...loading, to: true }
    );
    try {
      const response = await axios.get(
        `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport`,
        {
          params: { query, locale: "en-US" },
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );
      const options = response.data.data.map(
        (item: {
          presentation: { suggestionTitle: string };
          navigation: {
            relevantFlightParams: { skyId: string; entityId: string };
          };
        }) => ({
          label: item.presentation.suggestionTitle,
          value: item.navigation.relevantFlightParams.skyId,
          entityId: item.navigation.relevantFlightParams.entityId,
        })
      );
      setOptions(options);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(
        query === from ? { ...loading, from: false } : { ...loading, to: false }
      );
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAirports(from, setFromOptions);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [from]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAirports(to, setToOptions);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [to]);

  const handleSearch = async () => {
    const originSkyId = selectedFrom?.value;
    const destinationSkyId = selectedTo?.value;
    const originEntityId = selectedFrom?.entityId;
    const destinationEntityId = selectedTo?.entityId;
    const departureDate = dateRange[0]?.toISOString().split("T")[0];
    const returnDate = dateRange[1]?.toISOString().split("T")[0];
    
    if (!originSkyId || !destinationSkyId || !departureDate) {
      console.error("Missing required search parameters");
      return;
    }
    setSearchLoading(true);

    const params = {
      originSkyId,
      destinationSkyId,
      originEntityId,
      destinationEntityId,
      date: departureDate,
      returnDate,
      cabinClass: travelClass,
      adults: passengers.adults,
      childrens: passengers.children,
      infants: passengers.infants,
      sortBy: "best",
      currency: "USD",
    };

    try {
      const response = await axios.get(
        `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete`,
        {
          params,
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );
      const searchData = response.data.data;
      const { itineraries, context } = searchData;
      setSearchResultData({ itineraries, status: context.status });
      setSearchLoading(false);
    } catch (error) {
      console.error("Error searching flights:", error);
      setSearchLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      selectedFrom &&
      selectedTo &&
      dateRange[0] &&
      (tripType === "one-way" || dateRange[1])
    );
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={fromOptions}
            getOptionLabel={(option) => option.label}
            onInputChange={(_, newInputValue) => setFrom(newInputValue)}
            onChange={(_, newValue) => setSelectedFrom(newValue)}
            loading={loading.from}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading.from ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={toOptions}
            getOptionLabel={(option) => option.label}
            onInputChange={(_, newInputValue) => setTo(newInputValue)}
            onChange={(_, newValue) => setSelectedTo(newValue)}
            loading={loading.to}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading.to ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

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
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Adults"
            value={passengers.adults}
            onChange={(e) =>
              setPassengers({ ...passengers, adults: Number(e.target.value) })
            }
            fullWidth
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Children"
            value={passengers.children}
            onChange={(e) =>
              setPassengers({ ...passengers, children: Number(e.target.value) })
            }
            fullWidth
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Infants"
            value={passengers.infants}
            onChange={(e) =>
              setPassengers({ ...passengers, infants: Number(e.target.value) })
            }
            fullWidth
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <button
              onClick={handleSearch}
              disabled={!isFormValid()}
              className="rounded-full max-sm:w-full disabled:opacity-50 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#76c3ff] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Search Flights
            </button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
