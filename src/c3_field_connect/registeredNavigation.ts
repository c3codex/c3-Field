/** Match the registered route path while retaining its exact projected destination. */
export function navigationAtPaths<T extends {route:string}>(navigation:T[], paths:readonly string[]):T[] {
  return navigation.filter(item=>{
    try {return paths.includes(new URL(item.route,"https://c3field.online").pathname)}
    catch {return false}
  })
}
