import React, { Component }         from 'react';
import PropTypes                    from 'prop-types';
import { Row, Col }                 from 'antd';
import ClassificatorMenu            from './menu';
import ClassificatorAttributesList  from './attributesList';

const ClassificatorLayout = ({ isLoading, items, selectedClass, dispatch }) => (
  <Row>
    <Col span={8}>
      <ClassificatorMenu isLoading      = { isLoading }
                         items          = { items }
                         selectedClass  = { selectedClass }
                         dispatch       = { dispatch } />
    </Col>
    <Col span={16}>
      <ClassificatorAttributesList isLoading      = { isLoading }
                                   items          = { items }
                                   selectedClass  = { selectedClass }
                                   dispatch       = { dispatch } />
    </Col>
  </Row>
);

ClassificatorLayout.propTypes = {
  isLoading:      PropTypes.bool.isRequired,
  items:          PropTypes.array.isRequired,
  selectedClass:  PropTypes.number.isRequired,
  dispatch:       PropTypes.func.isRequired,
}

export default ClassificatorLayout;