export function Progress({value=0}){const safe=Math.min(100,Math.max(0,Number(value)||0));return <div className="progress" aria-label={`${safe}% complete`}><span style={{width:`${safe}%`}}/></div>}
