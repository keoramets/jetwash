export function FormMessage({state}){if(!state?.message)return null;return <div className={state.ok?'form-message success':'form-message error'}>{state.message}</div>}
