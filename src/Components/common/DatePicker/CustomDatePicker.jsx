import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import s from "./CustomDatePicker.module.scss";

const CustomDatePicker = ({ selectedDate, onChange }) => {
  const [startDate, setStartDate] = useState(selectedDate);


  useEffect(() => {
    setStartDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = date => {
    setStartDate(date); 
    onChange(date); 
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      className={s.customDatepicker}
      placeholderText="Select Date"
      maxDate={new Date()}
    />
  );
};

export default CustomDatePicker;
