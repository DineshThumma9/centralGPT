"use client"

import { Portal, Select, createListCollection } from "@chakra-ui/react"
import { useState } from "react"


interface Props {
  value : string[]
  setValue: (value: string[]) => void
}
const SelectOptions = ({value,setValue}:Props) => {

  return (
    <Select.Root
      collection={include_exclude}
      width="320px"

      value={value}
      onValueChange={(e) => setValue(e.value)}
    >
      <Select.HiddenSelect />
      <Select.Label>Include/Exclude</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Include/Exclude" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {include_exclude.items.map((options) => (
              <Select.Item item={options} key={options.value}>
                {options.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

const include_exclude = createListCollection({
  items: [
    { label: "Include", value: "Include" },
    { label: "Exclude", value: "Exclude" }
  ],
})


export default SelectOptions;