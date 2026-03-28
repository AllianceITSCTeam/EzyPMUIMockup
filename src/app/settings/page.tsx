"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/store/useStore";
import { Settings, Users, Shield, Plus, Edit, Trash2, Building2, Briefcase, Server, Gem, HelpCircle } from "lucide-react";

export default function SettingsPage() {
  const { 
    systemStakeholders, stakeholderRoles, taskStatuses, taskPriorities, companies,
    addSystemStakeholder, updateSystemStakeholder, deleteSystemStakeholder,
    addStakeholderRole, updateStakeholderRole, deleteStakeholderRole,
    addTaskStatus, updateTaskStatusConfig, deleteTaskStatus,
    addTaskPriority, updateTaskPriority, deleteTaskPriority,
    addCompany, updateCompany, deleteCompany,
    addToast, logActivity
  } = useStore();

  const [activeTab, setActiveTab] = useState<"stakeholders" | "roles" | "task-statuses" | "task-priorities" | "companies">("stakeholders");

  // Multi-purpose Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields - Stakeholder
  const [shName, setShName] = useState("");
  const [shEmail, setShEmail] = useState("");
  const [shPhone, setShPhone] = useState("");
  const [shOrg, setShOrg] = useState("");

  // Form Fields - Generic KeyValue
  const [genericName, setGenericName] = useState("");
  const [genericDesc, setGenericDesc] = useState("");
  const [genericColor, setGenericColor] = useState("#3b82f6");

  // Form Fields - Company
  const [compAddress, setCompAddress] = useState("");
  const [compPhone, setCompPhone] = useState("");
  const [compEmail, setCompEmail] = useState("");
  const [compTaxCode, setCompTaxCode] = useState("");
  const [compWebsite, setCompWebsite] = useState("");

  const getRoleIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "client": return <Building2 className="w-4 h-4 text-blue-500" />;
      case "vendor": return <Briefcase className="w-4 h-4 text-orange-500" />;
      case "it service": return <Server className="w-4 h-4 text-indigo-500" />;
      case "sponsor": return <Gem className="w-4 h-4 text-emerald-500" />;
      case "business owner": return <Users className="w-4 h-4 text-violet-500" />;
      default: return <HelpCircle className="w-4 h-4 text-text-secondary" />;
    }
  };

  const openModal = (mode: "add" | "edit", id?: string) => {
    setModalMode(mode);
    setEditingId(id || null);

    if (activeTab === "stakeholders") {
      if (mode === "edit" && id) {
        const target = systemStakeholders.find(s => s.id === id);
        if (target) {
          setShName(target.name);
          setShEmail(target.email);
          setShPhone(target.phone || "");
          setShOrg(target.organization || "");
        }
      } else {
        setShName(""); setShEmail(""); setShPhone(""); setShOrg("");
      }
    } else if (activeTab === "roles") {
      if (mode === "edit" && id) {
        const target = stakeholderRoles.find(r => r.id === id);
        if (target) {
          setGenericName(target.name);
          setGenericDesc(target.description || "");
        }
      } else {
        setGenericName(""); setGenericDesc("");
      }
    } else if (activeTab === "task-statuses") {
      if (mode === "edit" && id) {
        const target = taskStatuses.find(s => s.id === id);
        if (target) {
          setGenericName(target.name);
          setGenericDesc(target.description || "");
          setGenericColor(target.color || "#3b82f6");
        }
      } else {
        setGenericName(""); setGenericDesc(""); setGenericColor("#3b82f6");
      }
    } else if (activeTab === "task-priorities") {
      if (mode === "edit" && id) {
        const target = taskPriorities.find(p => p.id === id);
        if (target) {
          setGenericName(target.name);
          setGenericDesc(target.description || "");
          setGenericColor(target.color || "#3b82f6");
        }
      } else {
        setGenericName(""); setGenericDesc(""); setGenericColor("#3b82f6");
      }
    } else if (activeTab === "companies") {
      if (mode === "edit" && id) {
        const target = companies.find(c => c.id === id);
        if (target) {
          setGenericName(target.name);
          setCompAddress(target.address || "");
          setCompPhone(target.phone || "");
          setCompEmail(target.email || "");
          setCompTaxCode(target.taxCode || "");
          setCompWebsite(target.website || "");
        }
      } else {
        setGenericName(""); setCompAddress(""); setCompPhone(""); setCompEmail(""); setCompTaxCode(""); setCompWebsite("");
      }
    }
    setIsModalOpen(true);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "stakeholders") {
      if (!shName || !shEmail) return;
      if (modalMode === "add") {
        addSystemStakeholder({ id: `sh-${Date.now()}`, name: shName, email: shEmail, phone: shPhone, organization: shOrg });
        addToast("success", `Stakeholder ${shName} created`);
        logActivity(`Created system stakeholder: ${shName}`);
      } else if (editingId) {
        updateSystemStakeholder(editingId, { name: shName, email: shEmail, phone: shPhone, organization: shOrg });
        addToast("success", `Stakeholder ${shName} updated`);
        logActivity(`Updated system stakeholder: ${shName}`);
      }
    } else if (activeTab === "roles") {
      if (!genericName) return;
      if (modalMode === "add") {
        addStakeholderRole({ id: `r-${Date.now()}`, name: genericName, description: genericDesc });
        addToast("success", `Role ${genericName} created`);
        logActivity(`Created stakeholder role: ${genericName}`);
      } else if (editingId) {
        updateStakeholderRole(editingId, { name: genericName, description: genericDesc });
        addToast("success", `Role ${genericName} updated`);
        logActivity(`Updated stakeholder role: ${genericName}`);
      }
    } else if (activeTab === "task-statuses") {
      if (!genericName) return;
      if (modalMode === "add") {
        addTaskStatus({ id: `ts-${Date.now()}`, name: genericName, description: genericDesc, color: genericColor });
        addToast("success", `Task Status ${genericName} created`);
        logActivity(`Created task status: ${genericName}`);
      } else if (editingId) {
        updateTaskStatusConfig(editingId, { name: genericName, description: genericDesc, color: genericColor });
        addToast("success", `Task Status ${genericName} updated`);
      }
    } else if (activeTab === "task-priorities") {
      if (!genericName) return;
      if (modalMode === "add") {
        addTaskPriority({ id: `tp-${Date.now()}`, name: genericName, description: genericDesc, color: genericColor });
        addToast("success", `Task Priority ${genericName} created`);
        logActivity(`Created task priority: ${genericName}`);
      } else if (editingId) {
        updateTaskPriority(editingId, { name: genericName, description: genericDesc, color: genericColor });
        addToast("success", `Task Priority ${genericName} updated`);
      }
    } else if (activeTab === "companies") {
      if (!genericName) return;
      if (modalMode === "add") {
        addCompany({ id: `comp-${Date.now()}`, name: genericName, address: compAddress, phone: compPhone, email: compEmail, taxCode: compTaxCode, website: compWebsite });
        addToast("success", `Company ${genericName} created`);
        logActivity(`Created company configuration: ${genericName}`);
      } else if (editingId) {
        updateCompany(editingId, { name: genericName, address: compAddress, phone: compPhone, email: compEmail, taxCode: compTaxCode, website: compWebsite });
        addToast("success", `Company ${genericName} updated`);
        logActivity(`Updated company configuration: ${genericName}`);
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    if (activeTab === "stakeholders") {
      deleteSystemStakeholder(id);
      addToast("info", `Stakeholder ${name} deleted`);
      logActivity(`Deleted system stakeholder: ${name}`);
    } else if (activeTab === "roles") {
      deleteStakeholderRole(id);
      addToast("info", `Role ${name} deleted`);
      logActivity(`Deleted stakeholder role: ${name}`);
    } else if (activeTab === "task-statuses") {
      deleteTaskStatus(id);
      addToast("info", `Task status ${name} deleted`);
      logActivity(`Deleted task status: ${name}`);
    } else if (activeTab === "task-priorities") {
      deleteTaskPriority(id);
      addToast("info", `Task priority ${name} deleted`);
      logActivity(`Deleted task priority: ${name}`);
    } else if (activeTab === "companies") {
      deleteCompany(id);
      addToast("info", `Company ${name} deleted`);
      logActivity(`Deleted company configuration: ${name}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          System Configuration
        </h2>
        <button 
          onClick={() => openModal("add")}
          className="bg-primary hover:bg-primary/90 text-surface px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === "stakeholders" ? "Stakeholder" : activeTab === "roles" ? "Role" : activeTab === "task-statuses" ? "Status" : activeTab === "companies" ? "Company" : "Priority"}
        </button>
      </div>

      <div className="flex gap-1 pb-0 mb-2">
        <button
          onClick={() => setActiveTab("stakeholders")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "stakeholders" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <Users className="w-4 h-4" />
          Stakeholders Catalog
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "roles" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <Shield className="w-4 h-4" />
          Stakeholder Roles
        </button>
        <button
          onClick={() => setActiveTab("task-statuses")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "task-statuses" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          Task Statuses
        </button>
        <button
          onClick={() => setActiveTab("task-priorities")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "task-priorities" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          Task Priorities
        </button>
        <button
          onClick={() => setActiveTab("companies")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "companies" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Companies Profile
        </button>
      </div>

      <Card className="flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="sticky top-0 z-10 bg-page-bg text-text-secondary text-xs uppercase shadow-sm">
              {activeTab === "stakeholders" ? (
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Organization</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium text-right w-24">Actions</th>
                </tr>
              ) : activeTab === "roles" ? (
                <tr>
                  <th className="px-6 py-3 font-medium w-1/4">Role Name</th>
                  <th className="px-6 py-3 font-medium w-2/3">Description</th>
                  <th className="px-6 py-3 font-medium text-right w-24">Actions</th>
                </tr>
              ) : activeTab === "companies" ? (
                <tr>
                  <th className="px-6 py-3 font-medium w-64">Company Name & Website</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Tax Code</th>
                  <th className="px-6 py-3 font-medium text-right w-24">Actions</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-3 font-medium w-64">Configuration Name</th>
                  <th className="px-6 py-3 font-medium w-24 text-center">Color</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium text-right w-24">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="text-sm text-text-primary">
              {activeTab === "stakeholders" && systemStakeholders.map(sh => (
                <tr key={sh.id} className="hover:bg-page-bg/50 transition-colors group">
                <td className="px-6 py-4 font-medium">{sh.name}</td>
                <td className="px-6 py-4">{sh.email}</td>
                <td className="px-6 py-4">{sh.organization || "-"}</td>
                <td className="px-6 py-4">{sh.phone || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal("edit", sh.id)} className="p-1.5 text-text-secondary hover:text-primary transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(sh.id, sh.name)} className="p-1.5 text-text-secondary hover:text-danger transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === "roles" && stakeholderRoles.map(role => (
              <tr key={role.id} className="hover:bg-page-bg/50 transition-colors group">
                <td className="px-6 py-4 font-medium flex items-center gap-2">
                  {getRoleIcon(role.name)}
                  {role.name}
                </td>
                <td className="px-6 py-4 text-text-secondary whitespace-normal min-w-[300px]">{role.description || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal("edit", role.id)} className="p-1.5 text-text-secondary hover:text-primary transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(role.id, role.name)} className="p-1.5 text-text-secondary hover:text-danger transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === "task-statuses" && taskStatuses.map(status => (
              <tr key={status.id} className="hover:bg-page-bg/50 transition-colors group">
                <td className="px-6 py-4 font-medium">{status.name}</td>
                <td className="px-6 py-4 text-center">
                  <div className="w-6 h-6 rounded-md shadow-sm border mx-auto" style={{ backgroundColor: status.color || "#64748b" }} title={status.color} />
                </td>
                <td className="px-6 py-4 text-text-secondary whitespace-normal">{status.description || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal("edit", status.id)} className="p-1.5 text-text-secondary hover:text-primary transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(status.id, status.name)} className="p-1.5 text-text-secondary hover:text-danger transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === "task-priorities" && taskPriorities.map(priority => (
              <tr key={priority.id} className="hover:bg-page-bg/50 transition-colors group">
                <td className="px-6 py-4 font-medium">{priority.name}</td>
                <td className="px-6 py-4 text-center">
                  <div className="w-6 h-6 rounded-md shadow-sm border mx-auto" style={{ backgroundColor: priority.color || "#ef4444" }} title={priority.color} />
                </td>
                <td className="px-6 py-4 text-text-secondary whitespace-normal">{priority.description || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal("edit", priority.id)} className="p-1.5 text-text-secondary hover:text-primary transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(priority.id, priority.name)} className="p-1.5 text-text-secondary hover:text-danger transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === "companies" && companies.map(comp => (
              <tr key={comp.id} className="hover:bg-page-bg/50 transition-colors group">
                <td className="px-6 py-4 font-medium flex flex-col">
                  <span>{comp.name}</span>
                  {comp.website && <span className="text-xs text-text-secondary mt-0.5">{comp.website}</span>}
                </td>
                <td className="px-6 py-4">
                  <div>{comp.email || "-"}</div>
                  {comp.phone && <div className="text-xs text-text-secondary mt-0.5">{comp.phone}</div>}
                </td>
                <td className="px-6 py-4 text-text-secondary">{comp.taxCode || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal("edit", comp.id)} className="p-1.5 text-text-secondary hover:text-primary transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(comp.id, comp.name)} className="p-1.5 text-text-secondary hover:text-danger transition-colors bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Empty States */}
            {activeTab === "stakeholders" && systemStakeholders.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-text-secondary">No stakeholders found. Add one to get started.</td></tr>
            )}
            {activeTab === "roles" && stakeholderRoles.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-text-secondary">No stakeholder roles found.</td></tr>
            )}
            {activeTab === "task-statuses" && taskStatuses.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-text-secondary">No task statuses found.</td></tr>
            )}
            {activeTab === "task-priorities" && taskPriorities.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-text-secondary">No task priorities found.</td></tr>
            )}
            {activeTab === "companies" && companies.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-text-secondary">No companies configured. Add a company profile to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "add" ? `Add to Catalog` : `Edit Catalog Item`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {activeTab === "stakeholders" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Name *</label>
                <input type="text" required value={shName} onChange={e => setShName(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Email *</label>
                <input type="email" required value={shEmail} onChange={e => setShEmail(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Phone</label>
                <input type="tel" value={shPhone} onChange={e => setShPhone(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Organization</label>
                <input type="text" value={shOrg} onChange={e => setShOrg(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                />
              </div>
            </>
          ) : activeTab === "companies" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Company Name *</label>
                <input type="text" required value={genericName} onChange={e => setGenericName(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Email</label>
                  <input type="email" value={compEmail} onChange={e => setCompEmail(e.target.value)}
                    className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Phone</label>
                  <input type="tel" value={compPhone} onChange={e => setCompPhone(e.target.value)}
                    className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Address</label>
                <input type="text" value={compAddress} onChange={e => setCompAddress(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Tax Code</label>
                  <input type="text" value={compTaxCode} onChange={e => setCompTaxCode(e.target.value)}
                    className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Website</label>
                  <input type="url" value={compWebsite} onChange={e => setCompWebsite(e.target.value)}
                    className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Name *</label>
                <input type="text" required value={genericName} onChange={e => setGenericName(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Description</label>
                <textarea rows={3} value={genericDesc} onChange={e => setGenericDesc(e.target.value)}
                  className="px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] resize-none"
                />
              </div>
              {(activeTab === "task-statuses" || activeTab === "task-priorities") && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Color Hex Code</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={genericColor} onChange={e => setGenericColor(e.target.value)}
                      className="w-10 h-10 p-1 bg-surface border-transparent rounded cursor-pointer"
                    />
                    <input type="text" value={genericColor} onChange={e => setGenericColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors">
              {modalMode === "add" ? "Create" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
