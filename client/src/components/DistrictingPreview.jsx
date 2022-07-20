import React from 'react';
import DistrictingCardList from './DistrictingCardList';

const DistrictingPreview = ({
  cards,
  popMeasure,
  onSelect,
  districtNumberLoading,
  loading,
}) => {
  return (
    <DistrictingCardList
      cards={cards}
      popMeasure={popMeasure}
      onSelect={onSelect}
      districtNumberLoading={districtNumberLoading}
      loading={loading}
    />
  );
};

export default DistrictingPreview;
