
"use client"

import { Switch } from "@chakra-ui/react"

import useSessionStore from "../store/sessionStore.ts";

const StreamSwitch = ()=> {


    const {shouldStream,setShouldStream} = useSessionStore();

  return (
    <Switch.Root
      checked={shouldStream}
      onCheckedChange={
                      (e) => {
                            setShouldStream(e.checked);

                      }
            }
    >
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label />
    </Switch.Root>
  )
}

export default StreamSwitch