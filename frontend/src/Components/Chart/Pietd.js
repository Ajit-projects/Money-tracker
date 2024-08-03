import React, { useState } from 'react';
import Piet from './Piet';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';

function Pietd() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <InnerLayout>
      <div className="Pietd">
        <h2>Report</h2>
        <div>
          <label>Start: </label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <label>End: </label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
        <Piet startDate={startDate} endDate={endDate} />
      </div>
    </InnerLayout>
  );
}

export default Pietd;
