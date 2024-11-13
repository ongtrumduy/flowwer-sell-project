import { Typography } from '@mui/material';

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';

const orderTimeline = [
  { label: 'Order Placed', date: '2024-10-28' },
  { label: 'Shipped', date: '2024-10-29' },
  { label: 'Out for Delivery', date: '2024-11-01' },
  { label: 'Delivered', date: '2024-11-02' },
];

const TimelineCustom = () => {
  return (
    <Timeline position="alternate">
      {orderTimeline.map((event, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot
              color={index === orderTimeline.length - 1 ? 'success' : 'primary'}
            />
            {index < orderTimeline.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography>{event.label}</Typography>
            <Typography color="textSecondary" variant="caption">
              {event.date}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default TimelineCustom;
