export type FieldGeometryNodeKind="origin"|"legacy_object"|"current"|"environment"|"encounter"

export type FieldGeometryNode={
  key:string
  kind:FieldGeometryNodeKind
  label?:string
  sourceAuthority:string
  encounterKey?:string|null
}

export type FieldGeometryRelation={
  key:string
  from:string
  to:string
  relationType:string
  sourceAuthority:string
}

export type FieldGeometryPoint={
  key:string
  x:number
  y:number
  derived:true
}

export type FieldGeometryExpression={
  expressionKey:"c3_field_expression_002_natural_geometry_v1"
  nodes:FieldGeometryNode[]
  relations:FieldGeometryRelation[]
  points:FieldGeometryPoint[]
  segments:Array<{relationKey:string;from:string;to:string}>
  derivedIntersections:Array<{key:string;x:number;y:number;kind:"orthocenter"}>
}

const EXPRESSION_KEY="c3_field_expression_002_natural_geometry_v1" as const

function hash(value:string){
  let h=2166136261
  for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0
}

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value))}

/**
 * Expression 002 is a projection, never an authority surface.
 *
 * Inputs MUST already be admitted by Registry/Persistence. This function never
 * infers a relation from proximity, symmetry, intersection, shared vocabulary,
 * or historical ordering.
 */
export function resolveExpression002(
  nodes:FieldGeometryNode[],
  relations:FieldGeometryRelation[]
):FieldGeometryExpression{
  const admitted=new Map(nodes.map(node=>[node.key,node]))
  const edges=relations.filter(edge=>admitted.has(edge.from)&&admitted.has(edge.to))

  // Origin conditions are deliberately vertices, not a permanent center.
  const originKeys=[
    "origin:stephanie_joanne_gaffney",
    "origin:chazz",
    "origin:c3_community_partners"
  ]
  const originPositions:Record<string,{x:number;y:number}>={
    [originKeys[0]]:{x:24,y:68},
    [originKeys[1]]:{x:76,y:68},
    [originKeys[2]]:{x:50,y:23}
  }

  const points:FieldGeometryPoint[]=nodes.map((node,index)=>{
    const origin=originPositions[node.key]
    if(origin)return {key:node.key,...origin,derived:true}
    const seed=hash(node.key)
    const theta=((seed%360)*Math.PI)/180
    const ring=25+((seed>>>9)%18)
    const x=clamp(50+Math.cos(theta)*ring+((index%3)-1)*2,7,93)
    const y=clamp(50+Math.sin(theta)*ring+(((index+1)%3)-1)*2,7,93)
    return {key:node.key,x,y,derived:true}
  })

  const pointByKey=new Map(points.map(point=>[point.key,point]))
  // With the registered origin triangle, the orthocenter is mathematically
  // derived. It is a visual consequence only: never a node, relation, or standing.
  const a=pointByKey.get(originKeys[0]),b=pointByKey.get(originKeys[1]),c=pointByKey.get(originKeys[2])
  const derivedIntersections:Array<{key:string;x:number;y:number;kind:"orthocenter"}>=[]
  if(a&&b&&c){
    // Symmetric registered origin layout: altitude from c is x=50. Solve the
    // altitude from a perpendicular to BC.
    const dx=b.x-c.x,dy=b.y-c.y
    if(Math.abs(dx)>1e-9){
      const slopeBC=dy/dx
      const slopeAltitude=Math.abs(slopeBC)>1e-9?-1/slopeBC:0
      const x=50
      const y=a.y+slopeAltitude*(x-a.x)
      derivedIntersections.push({key:"derived:origin_orthocenter",x:clamp(x,0,100),y:clamp(y,0,100),kind:"orthocenter"})
    }
  }

  return {
    expressionKey:EXPRESSION_KEY,
    nodes,
    relations:edges,
    points,
    segments:edges.map(edge=>({relationKey:edge.key,from:edge.from,to:edge.to})),
    derivedIntersections
  }
}

export const EXPRESSION_002_BOUNDARY={
  legacyMillionDollarMissionIncluded:false,
  derivedGeometryCreatesRelation:false,
  derivedGeometryCreatesStanding:false,
  derivedGeometryCreatesAuthority:false,
  publicReleaseAuthorized:false,
  rule:"Truth is fixed by authority. Geometry is resolved computationally."
} as const
