import {Component,type ReactNode} from "react"
import {C3_TREE_BACKDROP} from "./dnrPresentation"
/** Presentation only. The resolver retains its original decision and standing. */
export function DnrBackdrop() {
  return <main style={{position:"fixed",inset:0,zIndex:2147483647,margin:0,padding:0,width:"100%",height:"100svh",background:"#000"}}><img src={C3_TREE_BACKDROP} alt="c3 Tree" style={{display:"block",width:"100%",height:"100%",objectFit:"contain"}}/></main>
}
export class DnrBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<DnrBackdrop/>:this.props.children}
}
