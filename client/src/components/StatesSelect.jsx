import React, { useCallback } from 'react';
import { Text, Select } from '@chakra-ui/react';
import states from '../constants/states';
import { bounds } from '../constants/map';

const StateSelect = ({ map, selectedState, onSelect }) => {
  const handleStateSelect = useCallback(
    async (stateName) => {
      const state = states.find((state) => state.name === stateName);
      console.log('stateName', stateName);
      console.log('state', state);
      await onSelect(stateName);
      if (state) {
        map.fitBounds(state.bounds);
      } else {
        map.fitBounds(bounds);
      }
    },
    [map]
  );

  return (
    <>
      <Text display='flex' alignItems='center' fontWeight={700}>
        State
      </Text>
      <Select
        placeholder='Select state'
        value={selectedState}
        onChange={(e) => handleStateSelect(e.target.value)}
        marginInlineStart={10}
        width='15%'
      >
        {states.map((state) => (
          <option key={state.name} value={state.name}>
            {state.name}
          </option>
        ))}
      </Select>
    </>
  );
};

export default StateSelect;
