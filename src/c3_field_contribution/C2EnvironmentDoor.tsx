import C2EnvironmentShell from "./C2EnvironmentShell"
import C247PctEncounter from "./C247PctEncounter"

export default function C2EnvironmentDoor(){
  const initiative=new URLSearchParams(window.location.search).get("initiative")
  if(initiative==="47pct") return <C247PctEncounter/>
  return <C2EnvironmentShell/>
}
