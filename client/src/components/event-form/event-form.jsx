import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { useMutation, gql } from '@apollo/client';

import EventTypes from '../../models/event-types';
import TitleInput from './title-input';
import TimeInput, { getTimeOptions } from './time-input';
import EventTypeInput from './event-type-input';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../../stylesheets/modal.css';
import { TIMEBLOCKS_QUERY } from '../../queries';

dayjs.extend(LocalizedFormat);
dayjs.extend(CustomParseFormat);

const CREATE_TIME_BLOCK_MUTATION = gql`
  mutation CreateTimeBlock(
    $title: String!
    $type: String!
    $startTime: String!
    $startDate: String!
    $endTime: String!
    $endDate: String!
    $isAllDay: Boolean!
  ) {
    createTimeBlock(
      title: $title
      type: $type
      startTime: $startTime
      startDate: $startDate
      endTime: $endTime
      endDate: $endDate
      isAllDay: $isAllDay
    ) {
      id
    }
  }
`;

function EventForm(props) {
  const { isAllDay, date, hideForm } = props;
  const [newTitle, setNewTitle] = useState('');
  const [eventType, setEventType] = useState(EventTypes.MEETING.id);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    setStartTime(date);
    const endDate = dayjs(date).add(1, 'hour');
    setEndTime(endDate.toDate());
  }, [date]);

  const onCancel = () => {
    setNewTitle('');
    setEventType(EventTypes.MEETING.id);
    hideForm();
  };

  const [createTimeBlock] = useMutation(
    CREATE_TIME_BLOCK_MUTATION,
    {
      refetchQueries: [TIMEBLOCKS_QUERY],
    },
  );

  const onSave = () => {
    createTimeBlock({
      variables: {
        title: newTitle,
        type: eventType,
        startTime: dayjs(startTime).format('HH:mm'),
        startDate: dayjs(startTime).format('YYYY-MM-DD'),
        endTime: dayjs(endTime).format('HH:mm'),
        endDate: dayjs(endTime).format('YYYY-MM-DD'),
        isAllDay,
      },
    });

    setNewTitle('');
    setEventType(EventTypes.MEETING.id);
    hideForm();
  };

  const titleInput = useRef(null);
  useEffect(() => {
    titleInput.current.focus();
  }, []);

  const timeOptions = getTimeOptions(date);

  return (
    <Modal show onHide={hideForm}>
      <Modal.Header closeButton />
      <Modal.Body>
        <TitleInput
          titleInput={titleInput}
          newTitle={newTitle}
          setTitle={setNewTitle}
        />
        <EventTypeInput
          eventType={eventType}
          setEventType={setEventType}
        />
        <div>
          <TimeInput
            time={startTime ?? new Date()}
            setTime={setStartTime}
            options={timeOptions}
          />
          <span className="time-inputs-text">to</span>
          <TimeInput
            time={endTime ?? new Date()}
            setTime={setEndTime}
            options={timeOptions}
          />
          <span className="time-inputs-text">
            {dayjs(endTime).diff(dayjs(startTime), 'minute')}
            m
          </span>
        </div>
        <button className="btn-cancel" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="btn-save" onClick={onSave} type="submit">
          Save
        </button>
      </Modal.Body>
    </Modal>
  );
}

EventForm.propTypes = {
  isAllDay: PropTypes.string,
  date: PropTypes.string,
  hideForm: PropTypes.func,
};

EventForm.defaultProps = {
  isAllDay: false,
  date: '',
  hideForm: () => {},
};

export default EventForm;