import React, { useState } from "react";
import {
  X,
  History,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Clock,
  Copy,
  Check,
  Search,
  Linkedin,
  Twitter,
  Instagram,
  Image as ImageIcon,
  Palette,
  ExternalLink,
} from "lucide-react";
import { GenerationResult, Platform } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationResult[];
  onSelectResult: (result: GenerationResult) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  onDeleteItem,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.topic.toLowerCase().includes(q) ||
      item.tone.toLowerCase().includes(q) ||
      item.linkedin.headline.toLowerCase().includes(q) ||
      item.twitter.tweet.toLowerCase().includes(q)
    );
  });

  const handleCopyPlatform = async (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      id="history-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="history-modal"
        className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Generation History
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                  {history.length} of 10 saved
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                The last 10 generations with posts & tailored visuals are saved in your local storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              type="button"
              id="btn-close-history"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {history.length > 1 && (
          <div className="px-4 sm:px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history by topic, headline, or tone..."
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  No Saved Generations Yet
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  When you generate campaigns in the Studio, your last 10 generations with posts and images will automatically appear here.
                </p>
              </div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-xs text-zinc-500">
              No results found for "{searchQuery}".
            </div>
          ) : (
            filteredHistory.map((item) => {
              const formattedDate = new Date(item.timestamp).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-indigo-500/40 transition-all overflow-hidden"
                >
                  {/* Item Main Row */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {item.tone}
                        </span>
                        {item.brandKit?.enabled && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            <Palette className="w-2.5 h-2.5 text-indigo-500" />
                            {item.brandKit.brandName || "Brand Kit"}
                          </span>
                        )}
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 ml-1">
                          {formattedDate}
                        </span>
                      </div>

                      {/* Original Idea */}
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {item.topic}
                      </h3>

                      {item.targetAudience && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <strong>Audience:</strong> {item.targetAudience}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectResult(item);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95 transition-all"
                      >
                        <span>Load in Studio</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {isExpanded ? "Collapse" : "Preview"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete this entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Thumbnails Bar */}
                  <div className="px-4 pb-3.5 pt-1 grid grid-cols-3 gap-2">
                    {/* LinkedIn Preview Pill */}
                    <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2.5">
                      <div className="relative w-10 h-7 rounded-md bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.linkedin.imageUrl ? (
                          <img
                            src={item.linkedin.imageUrl}
                            alt="LinkedIn Visual"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <Linkedin className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 truncate">
                            LinkedIn
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate">
                          {item.linkedin.headline}
                        </p>
                      </div>
                    </div>

                    {/* Twitter Preview Pill */}
                    <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2.5">
                      <div className="relative w-10 h-7 rounded-md bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.twitter.imageUrl ? (
                          <img
                            src={item.twitter.imageUrl}
                            alt="Twitter Visual"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Twitter className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <Twitter className="w-3 h-3 text-zinc-900 dark:text-white shrink-0" />
                          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 truncate">
                            Twitter/X
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate">
                          {item.twitter.tweet}
                        </p>
                      </div>
                    </div>

                    {/* Instagram Preview Pill */}
                    <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.instagram.imageUrl ? (
                          <img
                            src={item.instagram.imageUrl}
                            alt="Instagram Visual"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Instagram className="w-3.5 h-3.5 text-pink-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <Instagram className="w-3 h-3 text-pink-600 shrink-0" />
                          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 truncate">
                            Instagram
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate">
                          {item.instagram.caption}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Full Preview */}
                  {isExpanded && (
                    <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 animate-in fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {/* LinkedIn Column */}
                        <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1 text-blue-600">
                              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                            </span>
                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopyPlatform(
                                  e,
                                  `${item.linkedin.headline}\n\n${item.linkedin.content}`,
                                  `${item.id}-li`
                                )
                              }
                              className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-white flex items-center gap-1"
                            >
                              {copiedId === `${item.id}-li` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                          {item.linkedin.imageUrl && (
                            <img
                              src={item.linkedin.imageUrl}
                              alt="LinkedIn"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          )}
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {item.linkedin.headline}
                          </p>
                          <p className="text-zinc-600 dark:text-zinc-400 line-clamp-4 leading-relaxed">
                            {item.linkedin.content}
                          </p>
                        </div>

                        {/* Twitter Column */}
                        <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1 text-zinc-900 dark:text-white">
                              <Twitter className="w-3.5 h-3.5" /> Twitter/X
                            </span>
                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopyPlatform(e, item.twitter.tweet, `${item.id}-tw`)
                              }
                              className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-white flex items-center gap-1"
                            >
                              {copiedId === `${item.id}-tw` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                          {item.twitter.imageUrl && (
                            <img
                              src={item.twitter.imageUrl}
                              alt="Twitter"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          )}
                          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {item.twitter.tweet}
                          </p>
                        </div>

                        {/* Instagram Column */}
                        <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1 text-pink-600">
                              <Instagram className="w-3.5 h-3.5" /> Instagram
                            </span>
                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopyPlatform(
                                  e,
                                  `${item.instagram.caption}\n\n${item.instagram.hashtags?.map((t) => `#${t}`).join(" ")}`,
                                  `${item.id}-ig`
                                )
                              }
                              className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-white flex items-center gap-1"
                            >
                              {copiedId === `${item.id}-ig` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                          {item.instagram.imageUrl && (
                            <img
                              src={item.instagram.imageUrl}
                              alt="Instagram"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          )}
                          <p className="text-zinc-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                            {item.instagram.caption}
                          </p>
                          <p className="text-indigo-600 dark:text-indigo-400 text-[11px] line-clamp-2">
                            {item.instagram.hashtags?.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
