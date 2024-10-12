import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";

const Itinerary = ({ itinerary }: { itinerary: ItineraryProps }) => {
  return (
    <Card style={{ margin: "20px", padding: "20px" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          style={{ marginBottom: "20px" }}
        >
          Price: {itinerary.price.formatted}
        </Typography>
        {itinerary.legs.map((leg, index) => (
          <div key={index}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <Avatar
                  src={leg.carriers.marketing[0].logoUrl}
                  alt={leg.carriers.marketing[0].name}
                />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h6" component="div">
                  {leg.origin.city} ({leg.origin.displayCode}) →{" "}
                  {leg.destination.city} ({leg.destination.displayCode})
                </Typography>
                <Typography variant="body1">
                  {new Date(leg.departure).toLocaleString()} -{" "}
                  {new Date(leg.arrival).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Duration: {Math.floor(leg.durationInMinutes / 60)}h{" "}
                  {leg.durationInMinutes % 60}m, Stops: {leg.stopCount}
                </Typography>
              </Grid>
            </Grid>
            <Divider style={{ margin: "20px 0" }} />
            {leg.segments.map((segment, segIndex) => (
              <Grid container spacing={2} key={segIndex} alignItems="center">
                <Grid item xs={2}>
                  <Avatar
                    src={segment.marketingCarrier.logoUrl}
                    alt={segment.marketingCarrier.name}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body1">
                    {segment.origin.name} ({segment.origin.displayCode}) →{" "}
                    {segment.destination.name} (
                    {segment.destination.displayCode})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(segment.departure).toLocaleString()} -{" "}
                    {new Date(segment.arrival).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Flight Number: {segment.flightNumber}, Carrier:{" "}
                    {segment.marketingCarrier.name}
                  </Typography>
                </Grid>
              </Grid>
            ))}
            {index < itinerary.legs.length - 1 && (
              <Divider style={{ margin: "20px 0" }} />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Itinerary;
