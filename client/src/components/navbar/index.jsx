import {
  Box,
  Flex,
  Heading,
  Select,
  Stack,
  Text,
  Button,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import Multiselect from 'multiselect-react-dropdown';
import StateSelect from '../StatesSelect';
import ReactSelect from 'react-select';
import chroma from 'chroma-js';

const Navbar = ({
  map,
  selectedState,
  boundaryType,
  setBoundaryType,
  popMeasure,
  setPopMeasure,
  onReset,
  onSelect,
}) => {
  const options = [
    { value: 'districts', label: 'Districts', color: '#0bba25' },
    { value: 'precincts', label: 'Precincts', color: '#576dff' },
    { value: 'counties', label: 'Counties', color: '#530087' },
  ];
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'white',
      width: '375px',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  };
  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        // height='9vh'
      >
        <Flex flex={1} justify={{ base: 'center', md: 'start' }}>
          <Heading
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
          >
            Randistrictr
          </Heading>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav map={map} />
          </Flex>
        </Flex>

        <Box flex={1}>
          {map ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button colorScheme='teal' onClick={onReset}>
                Reset All
              </Button>
            </div>
          ) : null}
        </Box>

        <Stack flex={10} justify={'flex-end'} direction={'row'} spacing={2}>
          <Text display='flex' alignItems='center' fontWeight={700}>
            Boundary Type
          </Text>
          <ReactSelect
            closeMenuOnSelect={false}
            defaultValue={[options[0]]}
            isMulti
            options={options}
            styles={colourStyles}
            onChange={(values) => {
              setBoundaryType(values.map((val) => val.value));
            }}
          />
          {/* <Select
            defaultValue={boundaryType}
            onChange={(e) => setBoundaryType(e.target.value)}
            width='20%'
          >
            <option value='counties'>Counties</option>
            <option value='precincts'>Precincts</option>
            <option value='districts'>Districts</option>
          </Select> */}
          <Text display='flex' alignItems='center' fontWeight={700}>
            Population Type
          </Text>
          <Select
            defaultValue={popMeasure}
            onChange={(e) => setPopMeasure(e.target.value)}
            width='10%'
          >
            <option value='TOTAL'>Total</option>
            <option value='VAP'>VAP</option>
            <option value='CVAP'>CVAP</option>
          </Select>
          <StateSelect
            map={map}
            selectedState={selectedState}
            onSelect={(state) => onSelect(state)}
          />
        </Stack>
      </Flex>
    </Box>
  );
};

const DesktopNav = ({ map }) => {
  return (
    <Stack direction={'row'} spacing={4}>
      <Box>{/* <StateSelect map={map} /> */}</Box>
    </Stack>
  );
};

export default Navbar;
