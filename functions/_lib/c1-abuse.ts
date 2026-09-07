import {json} from "./c1-passage"
// Edge abuse control belongs to the zone WAF; database challenge controls bound semantic attempts.
export const unable = (status=409) => json({standing:"unable_to_process",saved:false,message:"We could not process this request. Please try again later."},status)
