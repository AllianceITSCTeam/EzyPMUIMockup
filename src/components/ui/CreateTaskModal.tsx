import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DateInput } from "@/components/ui/DateInput";
import { useStore } from "@/store/useStore";
import { Task, TaskStatus, TaskPriority } from "@/types";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  defaultAssigneeId?: string;
}

export function CreateTaskModal({ isOpen, onClose, defaultProjectId, defaultAssigneeId }: CreateTaskModalProps) {
  const { tasks, projects, users, addTask, logActivity, addToast, taskStatuses, taskPriorities } = useStore();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("Medium");
  const [newTaskEst, setNewTaskEst] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("To Do");
  const [newTaskStartDate, setNewTaskStartDate] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskOneDeskId, setNewTaskOneDeskId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewTaskProject(defaultProjectId || (projects[0]?.id || "p1"));
      setNewTaskAssignee(defaultAssigneeId || "");
      
      setNewTaskTitle(""); 
      setNewTaskDesc(""); 
      setNewTaskEst("");
      setNewTaskStatus("To Do");
      setNewTaskPriority("Medium");
      setNewTaskStartDate(new Date().toISOString().split("T")[0]);
      setNewTaskDueDate("");
      setNewTaskOneDeskId("");
    }
  }, [isOpen, defaultProjectId, defaultAssigneeId, projects]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: `t-${Date.now()}`,
      projectId: newTaskProject,
      title: newTaskTitle,
      description: newTaskDesc,
      status: newTaskStatus,
      priority: newTaskPriority,
      assigneeId: newTaskAssignee || null,
      estimateHours: Number(newTaskEst) || 0,
      actualHours: 0,
      startDate: newTaskStartDate,
      dueDate: newTaskDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      oneDeskId: newTaskOneDeskId || undefined,
    };

    addTask(newTask);
    logActivity(`Created new task: ${newTaskTitle}`);
    addToast("success", `Task "${newTaskTitle}" created successfully`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form data-testid="create-task-form" onSubmit={handleCreateTask} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Task Title <span className="text-danger">*</span></label>
          <input 
            type="text" required value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
            data-testid="task-title-input"
            className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
            placeholder="e.g. Design Login Screen"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Description</label>
          <textarea 
            rows={3} value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)}
            className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary resize-none"
            placeholder="Brief overview of the task requirements"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Project <span className="text-danger">*</span></label>
            <CustomSelect 
              value={newTaskProject} 
              testId="task-project-select"
              onChange={(val: any) => setNewTaskProject(val)}
              options={[
                { value: "", label: "Select project..." },
                ...projects.map(p => ({ value: p.id, label: p.name }))
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Status <span className="text-danger">*</span></label>
            <CustomSelect 
              value={newTaskStatus} 
              testId="task-status-select"
              onChange={(val: any) => setNewTaskStatus(val)}
              options={taskStatuses.map(s => ({ value: s.name, label: s.name }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Priority</label>
            <CustomSelect 
              value={newTaskPriority} 
              testId="task-priority-select"
              onChange={(val: any) => setNewTaskPriority(val as TaskPriority)}
              options={taskPriorities.map(p => ({ value: p.name, label: p.name }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Estimate (Hours)</label>
            <input 
              type="number" min="0" value={newTaskEst} onChange={e => setNewTaskEst(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              placeholder="e.g. 8"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Start Date *</label>
            <DateInput
              required value={newTaskStartDate} onChange={setNewTaskStartDate}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Due Date</label>
            <DateInput
              value={newTaskDueDate} onChange={setNewTaskDueDate}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">One Desk #</label>
            <input 
              type="text" value={newTaskOneDeskId} onChange={e => setNewTaskOneDeskId(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary h-[38px]"
              placeholder="e.g. OND-1234"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Assignee</label>
            <CustomSelect 
              value={newTaskAssignee} 
              testId="task-assignee-select"
              onChange={(val: any) => setNewTaskAssignee(val)}
              options={[
                { value: "", label: "Unassigned" },
                ...users.map(u => ({ value: u.id, label: u.name }))
              ]}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
            Cancel
          </button>
          <button type="submit" data-testid="submit-create-task" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors">
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
