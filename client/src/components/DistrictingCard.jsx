import React, { useRef } from 'react';
import {
  Box,
  Text,
  Image,
  Popover,
  Button,
  ButtonGroup,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
} from '@chakra-ui/react';

const DistrictingCardPopover = ({
  card,
  popMeasure,
  onSelect,
  districtNumberLoading,
  loading,
}) => {
  const initialFocusRef = useRef();
  const {
    redistrictNumber,
    efficiencyGap,
    numDemocraticCongressionalDistricts,
    numRepublicanCongressionalDistricts,
  } = card;
  const populationScore = card[`${popMeasure.toLowerCase()}PopulationScore`];

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement='right'
      offset={[5, 0]} //i hate styling
      trigger='hover'
      // isOpen={false}
    >
      <PopoverTrigger>
        <Box d='flex' justifyContent='center' w='95%'>
          <DistrictingCard
            property={card}
            popMeasure={popMeasure}
            onSelect={onSelect}
            districtNumberLoading={districtNumberLoading}
            loading={loading}
          />
        </Box>
      </PopoverTrigger>
      <PopoverContent
        bg='rgba(35, 55, 75, 0.8)'
        color='white'
        borderColor='rgba(35, 55, 75, 0.8)'
      >
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Districting {redistrictNumber}
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody fontSize='sm'>
          <Text>Population Score: {(populationScore * 100).toFixed(4)}%</Text>
          <Text>
            Efficiency Gap Measure: {(efficiencyGap * 100).toFixed(4)}%
          </Text>
          <Text>
            # of Democratic Congressional Districts:{' '}
            {numDemocraticCongressionalDistricts}
          </Text>
          <Text>
            # of Republican Congressional Districts:{' '}
            {numRepublicanCongressionalDistricts}
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const DistrictingCard = ({
  property,
  popMeasure,
  onSelect,
  districtNumberLoading,
  loading,
}) => {
  const populationScore =
    property[`${popMeasure.toLowerCase()}PopulationScore`];
  const {
    redistrictNumber,
    efficiencyGap,
    numDemocraticCongressionalDistricts,
    numRepublicanCongressionalDistricts,
  } = property;

  return (
    <Box
      shadow='md'
      borderWidth='1px'
      borderRadius='1g'
      overflow='hidden'
      w='100%'
    >
      <Image src={property.imageUrl} alt={property.imageAlt}></Image>

      <Box px={2}>
        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          isTruncated='true'
        >
          Districting {property.redistrictNumber}
        </Box>
        <Box>
          <Text>Population Score: {(populationScore * 100).toFixed(4)}%</Text>
        </Box>
        <Box
          border='0'
          d='flex'
          alignItems='center'
          justifyContent='flex-end'
          pt={1}
          pb={2}
        >
          <ButtonGroup size='sm'>
            <Button
              colorScheme='green'
              onClick={() => onSelect(property.redistrictNumber)}
              isLoading={districtNumberLoading === property.redistrictNumber}
              disabled={loading}
            >
              Use!
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default DistrictingCardPopover;
