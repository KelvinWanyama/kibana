/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  history,
  fromQuery,
  toQuery,
  legacyEncodeURIComponent
} from '../../../utils/url';
import { debounce } from 'lodash';
import { Typeahead } from '../Typeahead';
import { getAPMIndexPattern } from '../../../services/rest';
import { convertKueryToEsQuery, getSuggestions } from '../../../services/kuery';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 10px;
`;

class KueryBarView extends Component {
  state = {
    indexPattern: null,
    selectionStart: 0,
    suggestions: []
  };

  componentDidMount() {
    getAPMIndexPattern().then(indexPattern => {
      this.setState({ indexPattern });
    });
  }

  onChange = debounce((inputValue, selectionStart) => {
    const { indexPattern } = this.state;

    if (!indexPattern) {
      return;
    }

    getSuggestions(inputValue, selectionStart, indexPattern).then(
      suggestions => {
        this.setState({ suggestions });
      }
    );
  }, 200);

  onSubmit = inputValue => {
    const { indexPattern } = this.state;
    const { location } = this.props;
    try {
      const res = convertKueryToEsQuery(inputValue, indexPattern);
      if (!res) {
        return;
      }

      history.replace({
        ...location,
        search: fromQuery({
          ...toQuery(this.props.location.search),
          kuery: legacyEncodeURIComponent(inputValue)
        })
      });
    } catch (e) {
      console.log('Invalid kuery syntax'); // eslint-disable-line no-console
    }
  };

  render() {
    return (
      <Container>
        <Typeahead
          initialValue={this.props.urlParams.kuery}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          suggestions={this.state.suggestions}
        />
      </Container>
    );
  }
}

KueryBarView.propTypes = {
  location: PropTypes.object.isRequired,
  urlParams: PropTypes.object.isRequired
};

export default KueryBarView;
