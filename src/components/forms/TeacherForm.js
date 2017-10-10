import React from 'react';
//import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const TeacherForm = ({ text }) => (
  <span style={{ color: '#ae5856' }}>{text}</span>
);

TeacherForm.propTypes = {
  text: PropTypes.string.isRequired
};

export default TeacherForm;
