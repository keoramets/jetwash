export function DataTable({columns,children}){return <div className="table-shell"><table><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{children}</tbody></table></div>}
