import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

interface Props {
  items: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
}

export function CheckboxButtons({ items, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked ?? []);

  function handleChecked(checkedItem: string) {
    const newCheckedItems = checkedItems.includes(checkedItem)
      ? checkedItems.filter((item) => item !== checkedItem)
      : [...checkedItems, checkedItem];
    setCheckedItems(newCheckedItems);
    onChange(newCheckedItems);
  }

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={checkedItems.includes(item)}
              onClick={() => handleChecked(item)}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  );
}
