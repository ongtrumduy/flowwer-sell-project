import { Typography } from '@mui/material';

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { useMemo } from 'react';
import { InterfaceProcessTimeline } from '@services/api/order/type';

import dayjs from 'dayjs';

import 'dayjs/locale/vi'; // Import ngôn ngữ tiếng Việt

// Đặt ngôn ngữ mặc định là tiếng Việt
dayjs.locale('vi');

const TimelineCustom = ({
  processTimeline,
}: {
  processTimeline: InterfaceProcessTimeline[] | undefined;
}) => {
  const orderTimeline = useMemo(() => {
    return processTimeline
      ? processTimeline.map((event) => ({
          label: event.event,
          date: dayjs(event.currentTime).format('HH:mm:ss [ngày] DD/MM/YYYY'),
        }))
      : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(processTimeline)]);

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
