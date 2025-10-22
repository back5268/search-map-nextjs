export const Cardz = ({ className = "", children }) => {
  return (
    <div className={`p-4 shadow-2xl rounded-md ${className}`}>{children}</div>
  )
}
