/** Small card showing a role's icon, name, and a coloured accent. */
export default function RoleCard({ icon, name, color, score }) {
  return (
    <div className="glass-card p-4 flex flex-col items-center text-center gap-2">
      <span className="text-3xl">{icon}</span>
      <span className="text-xs font-semibold text-slate-700 leading-tight">{name}</span>
      {score !== undefined && (
        <span className="text-xs font-bold" style={{ color }}>{score}%</span>
      )}
    </div>
  )
}
