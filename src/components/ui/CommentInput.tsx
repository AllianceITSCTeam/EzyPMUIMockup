import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
import { useStore } from "@/store/useStore";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Card } from "./Card";

export function CommentInput({ onSubmit }: { onSubmit?: (content: string) => void }) {
  const { users } = useStore();
  const [value, setValue] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [attachments, setAttachments] = useState<{name: string; size: string}[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mentionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showMentions &&
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowMentions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMentions]);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(mentionQuery));

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: formatSize(f.size)
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setValue(text);
    
    const selectionStart = e.target.selectionStart;
    setCursorPos(selectionStart);
    
    const textBeforeCursor = text.slice(0, selectionStart);
    const words = textBeforeCursor.split(/\s/);
    const currentWord = words[words.length - 1];
    
    if (currentWord.startsWith("@")) {
      const newQuery = currentWord.slice(1).toLowerCase();
      if (mentionQuery !== newQuery) {
        setSelectedIndex(0); // reset index only when query actually changes
      }
      setShowMentions(true);
      setMentionQuery(newQuery);
    } else {
      setShowMentions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentions && filteredUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredUsers.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        insertMention(filteredUsers[selectedIndex].name);
      } else if (e.key === "Escape") {
        setShowMentions(false);
      }
    }
  };

  const insertMention = (userName: string) => {
    const textBeforeCursor = value.slice(0, cursorPos);
    const textAfterCursor = value.slice(cursorPos);
    
    const wordsBefore = textBeforeCursor.split(/\s/);
    wordsBefore.pop();
    
    const newTextBefore = wordsBefore.length > 0 ? wordsBefore.join(" ") + " @" + userName + " " : "@" + userName + " ";
    
    setValue(newTextBefore + textAfterCursor);
    setShowMentions(false);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <Card className="flex flex-col relative w-full">
      <textarea 
        ref={textareaRef}
        rows={3}
        value={value}
        onChange={handleInput}
        onClick={handleInput as any}
        onKeyUp={handleInput as any}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment... (Type @ to mention someone)"
        className="w-full p-4 bg-transparent resize-none focus:outline-none text-sm text-text-primary placeholder:text-text-secondary rounded-t-lg"
      />
      
      {showMentions && filteredUsers.length > 0 && (
        <div 
          ref={mentionDropdownRef}
          className="absolute left-4 bottom-[60px] w-64 max-h-48 overflow-y-auto bg-surface/95 backdrop-blur-xl border border-primary/10 rounded-xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="p-2 text-[11px] font-bold text-text-secondary uppercase tracking-wider border-b border-primary/10 bg-page-bg/50">
            Mention Team Member
          </div>
          <div className="flex flex-col">
            {filteredUsers.map((u, idx) => (
              <button
                key={u.id}
                type="button"
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={(e) => {
                  e.preventDefault();
                  insertMention(u.name);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                  idx === selectedIndex ? "bg-page-bg text-primary" : "text-text-primary hover:bg-page-bg hover:text-primary"
                }`}
              >
                <UserAvatar user={u} size="sm" />
                <span className="truncate">{u.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pb-2 pt-1 mt-2">
          {attachments.map((file, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-surface border border-border-color px-2 py-1 rounded text-xs text-text-primary shadow-sm group">
              <span className="truncate max-w-[120px]" title={file.name}>{file.name}</span>
              <span className="text-text-secondary scale-90">{file.size}</span>
              <button 
                onClick={() => removeAttachment(i)}
                className="text-text-secondary hover:text-danger hover:bg-danger/10 rounded ml-1 transition-colors"
                title="Remove file"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center p-3 bg-page-bg rounded-b-lg mt-1">
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            multiple 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-text-secondary hover:text-primary transition-colors hover:bg-surface rounded pointer focus:outline-none"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 text-text-secondary hover:text-primary transition-colors hover:bg-surface rounded pointer text-xs font-bold focus:outline-none"
            onClick={() => {
              setValue(prev => prev + (prev.endsWith(" ") || prev === "" ? "@" : " @"));
              setShowMentions(true);
              textareaRef.current?.focus();
            }}
          >
            @
          </button>
        </div>
        <button 
          onClick={() => {
            if (value.trim() && onSubmit) {
              onSubmit(value);
              setValue("");
              setAttachments([]);
            } else if (!onSubmit) {
              setValue("");
            }
          }}
          className="bg-primary hover:bg-primary/90 text-surface px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" /> Post
        </button>
      </div>
    </Card>
  );
}
