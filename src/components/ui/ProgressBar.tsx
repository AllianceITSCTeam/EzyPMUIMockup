export function ProgressBar({
  percentage,
  isOverrun = false,
}: {
  percentage: number;
  isOverrun?: boolean;
}) {
  const cappedPercentage = Math.min(percentage, 100);
  const barColor = isOverrun ? "bg-warning" : "bg-primary";

  return (
    <div className="w-full bg-border-color rounded-full h-2 mb-1">
      <div
        className={`${barColor} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${cappedPercentage}%` }}
      ></div>
    </div>
  );
}
