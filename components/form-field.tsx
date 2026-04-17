type Props = {
  label: string
  placeholder?: string
  type?: string
  helper?: string
}

export function FormField({ label, placeholder, type = 'text', helper }: Props) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-lg border border-main/30 bg-white px-3 py-2 outline-none ring-main/30 focus:ring"
      />
      {helper ? <span className="text-xs text-subtext">{helper}</span> : null}
    </label>
  )
}
