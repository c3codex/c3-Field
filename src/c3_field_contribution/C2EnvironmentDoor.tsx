import C2EnvironmentShell from "./C2EnvironmentShell"
import C247PctEncounter from "./C247PctEncounter"
import C2PacEncounter from "./C2PacEncounter"

export default function C2EnvironmentDoor(){
  const params=new URLSearchParams(window.location.search)
  const pac=params.get("pac")
  const mode=params.get("mode")
  const initiative=params.get("initiative")
  if(pac||mode==="pacs") return <C2PacEncounter/>
  if(initiative==="47pct") return <C247PctEncounter/>
  return <C2EnvironmentShell/>
}
