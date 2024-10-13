import React from "react";
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

const Itinerary = ({ itinerary }: { itinerary: ItineraryProps }) => {
  return (
    <div className="m-5 sm:p-5 py-5 bg-white rounded-lg border shadow-lg max-w-4xl mx-auto">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold">
          Price{" "}
          <span className="text-emerald-600">{itinerary.price.formatted}</span>
        </h2>
      </div>
      {itinerary.legs.map((leg, index) => (
        <Accordion key={index} className="mb-3 rounded-lg !shadow-none">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 mr-4">
                <Avatar
                  src={leg.carriers.marketing[0].logoUrl}
                  alt={leg.carriers.marketing[0].name}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">
                  {leg.origin.city} ({leg.origin.displayCode}) →{" "}
                  {leg.destination.city} ({leg.destination.displayCode})
                </h3>
                <p className="text-sm">
                  {new Date(leg.departure).toLocaleString()} -{" "}
                  {new Date(leg.arrival).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Duration: {Math.floor(leg.durationInMinutes / 60)}h{" "}
                  {leg.durationInMinutes % 60}m, Stops: {leg.stopCount}
                </p>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Timeline>
              {leg.segments.map((segment, segIndex) => (
                <TimelineItem key={segIndex} className="MuiTimelineItem-root">
                  <TimelineSeparator>
                    <TimelineDot />
                    {segIndex < leg.segments.length - 1 && (
                      <TimelineConnector />
                    )}
                  </TimelineSeparator>
                  <TimelineContent className="flex justify-start">
                    <div>
                      <p className="text-sm">
                        {segment.origin.name} ({segment.origin.displayCode}) →{" "}
                        {segment.destination.name} (
                        {segment.destination.displayCode})
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(segment.departure).toLocaleString()} -{" "}
                        {new Date(segment.arrival).toLocaleString()}
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
            <div className="mt-4 flex justify-end">
              <Button variant="contained" color="primary">
                Select Flight
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Itinerary;
