import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface Props {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  selectedValue: string;
}

export function RadioButtonGroup({ options, onChange, selectedValue }: Props) {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        onChange={(event) => onChange(event.target.value)}
        value={selectedValue}
      >
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            label={label}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
