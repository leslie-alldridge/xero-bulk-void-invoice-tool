import React from 'react';
import { DatePicker } from '@material-ui/pickers';

function DatePicker2() {
  return (
    <DatePicker
      label="Basic example"
      value={new Date().toJSON().slice(0, 10).replace(/-/g, '/')}
      onChange={() => console.log('test')}
      animateYearScrolling
    />
  );
}

export default DatePicker2;
