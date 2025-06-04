import React from 'react';
import Form from 'react-bootstrap/Form';
import s from './ToggleButton.module.scss';

function ToggleButton({ isChecked, onToggle }) {
  return (
    <Form>
      <Form.Check
        type="switch"
        id="custom-switch"
        // label={isChecked ? 'YES' : 'NO'}
        checked={isChecked}
        onChange={onToggle}
      />
    </Form>
  );
}

export default ToggleButton;


