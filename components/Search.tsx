"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { DateRange } from "@mui/x-date-pickers-pro/DateRangePicker";

const Search: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);
  const [passengers, setPassengers] = useState(1);
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);

  const fetchAirports = async (query: string, setOptions: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport`,
        {
          params: { query, locale: "en-US" },
          headers: {
            "X-RapidAPI-Key":
              "1226195aa3msh53999e2139a7588p1bb782jsn786f5a272281",
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );
      const options = response.data.data.map((item: any) => ({
        label: item.presentation.suggestionTitle,
        value: item.navigation.relevantFlightParams.skyId,
      }));
      setOptions(options);
    } catch (error) {
      console.error("Error fetching airports:", error);
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

  const handleSearch = () => {
    console.log({ from, to, departureDate: dateRange[0], returnDate: dateRange[1], passengers });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={fromOptions}
            getOptionLabel={(option) => option.label}
            onInputChange={(event, newInputValue) => setFrom(newInputValue)}
            renderInput={(params) => (
              <TextField {...params} label="From" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={toOptions}
            getOptionLabel={(option) => option.label}
            onInputChange={(event, newInputValue) => setTo(newInputValue)}
            renderInput={(params) => (
              <TextField {...params} label="To" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText="Departure Date"
              endText="Return Date"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Passengers"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            fullWidth
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;