import React, { FC } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Button,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

// Helper function to format date strings
const formatDate = (date: string) => new Date(date).toLocaleString();

const FlightLeg: FC<{ leg: Leg; sessionId: string }> = ({ leg, sessionId }) => (
  <Accordion className="mb-3 rounded-lg !shadow-none">
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`panel${leg.origin.displayCode}-content`}
      id={`panel${leg.origin.displayCode}-header`}
    >
      <div className="flex items-center w-full">
        <Avatar
          src={leg.carriers.marketing[0]?.logoUrl}
          alt={leg.carriers.marketing[0]?.name || "Carrier"}
          className="flex-shrink-0 mr-4"
        />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">
            {leg.origin.city} ({leg.origin.displayCode}) →{" "}
            {leg.destination.city} ({leg.destination.displayCode})
          </h3>
          <p className="text-sm">
            {formatDate(leg.departure)} - {formatDate(leg.arrival)}
          </p>
          <p className="text-xs text-gray-500">
            Duration: {Math.floor(leg.durationInMinutes / 60)}h{" "}
            {leg.durationInMinutes % 60}m, Stops: {leg.stopCount}
          </p>
        </div>
      </div>
    </AccordionSummary>
    <AccordionDetails>
      <FlightTimeline segments={leg.segments} />
      <Link
        href={`/?flightId=${
          leg.id
        }&sessionid=${sessionId}&legs=${JSON.stringify(leg.segments)}`}
        className="mt-4 flex justify-end"
      >
        <Button variant="contained" color="primary">
          Select Flight
        </Button>
      </Link>
    </AccordionDetails>
  </Accordion>
);

// FlightTimeline component
const FlightTimeline: FC<{ segments: Segment[] }> = ({ segments }) => (
  <Timeline>
    {segments.map((segment, index) => (
      <TimelineItem key={index}>
        <TimelineSeparator>
          <TimelineDot />
          {index < segments.length - 1 && <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <div>
            <p className="text-sm">
              {segment.origin.name} ({segment.origin.displayCode}) →{" "}
              {segment.destination.name} ({segment.destination.displayCode})
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(segment.departure)} - {formatDate(segment.arrival)}
            </p>
            <p className="text-xs text-gray-500">
              Flight Number: {segment.flightNumber}, Carrier:{" "}
              {segment.marketingCarrier.name}
            </p>
          </div>
        </TimelineContent>
      </TimelineItem>
    ))}
  </Timeline>
);

// Main Itinerary component
const Itinerary: FC<{ itinerary: ItineraryProps; sessionId: string }> = ({
  itinerary,
  sessionId,
}) => (
  <div className="m-5 sm:p-5 py-5 bg-white rounded-lg border shadow-lg max-w-4xl mx-auto">
    <div className="mb-5 text-center">
      <h2 className="text-2xl font-bold">
        Price{" "}
        <span className="text-emerald-600">{itinerary.price.formatted}</span>
      </h2>
    </div>
    {itinerary.legs.map((leg, index) => (
      <FlightLeg key={index} leg={leg} sessionId={sessionId} />
    ))}
  </div>
);

export default Itinerary;
