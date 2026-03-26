import { TaskStatus, ProjectStatus } from "../../types";

export function StatusBadge({ status }: { status: TaskStatus | ProjectStatus | "Available" | "Busy" | "Overloaded" }) {
  let colorClass = "bg-border-color text-text-secondary";

  switch (status) {
    case "To Do":
    case "Closed":
      colorClass = "bg-text-secondary/10 text-text-secondary";
      break;
    case "In Progress":
    case "Active":
      colorClass = "bg-primary/10 text-primary";
      break;
    case "Pending":
    case "Busy":
      colorClass = "bg-warning/20 text-warning";
      break;
    case "On Hold":
      colorClass = "bg-text-secondary/10 text-text-secondary";
      break;
    case "No Specs":
    case "Overloaded":
      colorClass = "bg-danger/10 text-danger";
      break;
    case "Completed":
    case "Available":
      colorClass = "bg-success/10 text-success";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] whitespace-nowrap transition-colors ${colorClass}`}>
      {status}
    </span>
  );
}
