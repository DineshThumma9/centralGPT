
"use client"

import {Portal, Select, createListCollection, type ListCollection, useSlotRecipe} from "@chakra-ui/react"



interface Props{
    frameworks:ListCollection

}
const SelectExp = ({frameworks}:Props) => {



        const recipe = useSlotRecipe({key: "menuHelper"});
    const styles = recipe();



  return (
    <Select.Root collection={frameworks} size="sm" width="320px" >
      <Select.HiddenSelect />
      <Select.Label>Select framework</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select framework" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content css={styles.content}>
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value} css={styles.item}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}



export default SelectExp;