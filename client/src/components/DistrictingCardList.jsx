import React from 'react';
import { Heading, Stack, SimpleGrid, Box } from '@chakra-ui/react';
import DistrictingCard from './DistrictingCard';

function DistrictingCardList({
  cards,
  popMeasure,
  onSelect,
  districtNumberLoading,
  loading,
}) {
  return (
    <SimpleGrid columns={2} spacing={4}>
      {cards.map((card) => (
        // <GridBoxItem>
        <DistrictingCard
          key={card.title}
          popMeasure={popMeasure}
          card={card}
          onSelect={onSelect}
          districtNumberLoading={districtNumberLoading}
          loading={loading}
        />
        // </GridItem>
      ))}
    </SimpleGrid>
  );
}

export default DistrictingCardList;
