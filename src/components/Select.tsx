"use client"

import { Portal, Select, createListCollection } from "@chakra-ui/react"

interface Props {
  value: string[]
  setValue: (value: string[]) => void
}

const SelectOptions = ({ value, setValue }: Props) => {
  return (
    <Select.Root
      collection={include_exclude}
      width="200px"
      value={value}
      onValueChange={(details) => setValue(details.value)}
    >
      <Select.HiddenSelect />
      <Select.Label
        color="white"
        fontSize="sm"
        fontWeight="medium"
      >
        Include/Exclude
      </Select.Label>
      <Select.Control>
        <Select.Trigger

          bg="rgba(139, 92, 246, 0.1)"
          border="2px solid"
          borderColor="rgba(139, 92, 246, 0.3)"
          borderRadius="xl"
          color="white"
          _hover={{
            borderColor: "rgba(139, 92, 246, 0.5)",
            bg: "rgba(139, 92, 246, 0.15)"
          }}
          _focus={{
            borderColor: "rgba(139, 92, 246, 0.6)",
            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)"
          }}
          transition="all 0.2s ease"
        >
          <Select.ValueText
            placeholder="Select option"
            color="white"
            _placeholder={{ color: "rgba(255, 255, 255, 0.6)" }}
          />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator color="white" />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content
            bg="rgba(30, 30, 40, 0.95)"
            backdropFilter="blur(10px)"
            border="2px solid"
            borderColor="rgba(139, 92, 246, 0.3)"
            borderRadius="xl"
            boxShadow="0 10px 40px rgba(0, 0, 0, 0.3)"
          >
            {include_exclude.items.map((options) => (
              <Select.Item
                item={options}
                key={options.value}
                color="white"
                _hover={{
                  bg: "rgba(139, 92, 246, 0.2)"
                }}
                _selected={{
                  bg: "rgba(139, 92, 246, 0.3)"
                }}
                transition="all 0.2s ease"
              >
                {options.label}
                <Select.ItemIndicator color="rgba(139, 92, 246, 0.8)" />
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