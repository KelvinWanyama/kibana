/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Suggestion from './Suggestion';

const List = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

function Suggestions(props) {
  if (!props.show) {
    return null;
  }

  const suggestions = props.suggestions.map((suggestion, index) => {
    const key = suggestion + '_' + index;
    return (
      <Suggestion
        selected={index === props.index}
        suggestion={suggestion}
        onClick={props.onClick}
        onMouseOver={() => props.onMouseOver(index)}
        key={key}
      />
    );
  });

  return <List>{suggestions}</List>;
}

Suggestions.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  show: PropTypes.bool,
  suggestions: PropTypes.array.isRequired
};

export default Suggestions;
