import { TaskStatus, ProjectStatus } from "../../types";

export function StatusBadge({ status }: { status: TaskStatus | ProjectStatus | "Available" | "Busy" | "Overloaded" }) {
  let colorClass = "bg-border-color text-text-secondary";

  switch (status) {
    case "To Do":
    case "Closed":
      colorClass = "bg-slate-500 text-white";
      break;
    case "In Progress":
    case "Active":
      colorClass = "bg-primary text-white";
      break;
    case "Pending":
    case "Busy":
      colorClass = "bg-warning text-amber-950 font-black";
      break;
    case "On Hold":
      colorClass = "bg-slate-500 text-white";
      break;
    case "No Specs":
    case "Overloaded":
      colorClass = "bg-danger text-white";
      break;
    case "Completed":
    case "Available":
      colorClass = "bg-success text-white";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] whitespace-nowrap transition-colors ${colorClass}`}>
      {status}
    </span>
  );
}
