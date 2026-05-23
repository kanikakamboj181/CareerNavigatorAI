/**
 * SliderField — reusable range slider with live value display.
 * Used on the Dashboard for all 7 skill inputs.
 */
export default function SliderField({ id, label, description, min, max, step, value, onChange, disabled }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
        <span className="text-brand-500 dark:text-brand-400 font-bold text-sm w-12 text-right tabular-nums">
          {typeof value === 'number' && id === 'cgpa' ? value.toFixed(1) : value}
        </span>
      </div>
      {description && <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{description}</p>}
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={e => onChange(id, id === 'aptitude' ? parseInt(e.target.value) : parseFloat(e.target.value))}
        className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none transition-colors ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      />
      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
        <span>{min}{id === 'cgpa' ? '.0' : ''}</span>
        <span>{max}{id === 'cgpa' ? '.0' : ''}</span>
      </div>
    </div>
  )
}
