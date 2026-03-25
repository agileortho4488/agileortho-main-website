import { useState, useEffect, useRef, useCallback } from "react";
import {
  bulkCatalogUpload, getBulkJobs, getBulkJob, getBulkJobFiles,
  startBulkProcessing, approveBulkProducts, deleteBulkJob,
} from "../lib/api";
import { toast } from "sonner";
import {
  Upload, FolderUp, Play, CheckCircle2, XCircle, Clock, FileText,
  Image, Film, Loader2, Trash2, ChevronDown, ChevronRight, RefreshCw,
  AlertTriangle, Check, X, File,
} from "lucide-react";

const FILE_TYPE_ICONS = {
  pdf: FileText,
  image: Image,
  video: Film,
  presentation: FileText,
  other: File,
};

const STATUS_STYLES = {
  uploading: { color: "text-blue-600", bg: "bg-blue-50", label: "Uploading" },
  processing: { color: "text-amber-600", bg: "bg-amber-50", label: "Processing" },
  completed: { color: "text-emerald-600", bg: "bg-emerald-50", label: "Completed" },
  failed: { color: "text-red-600", bg: "bg-red-50", label: "Failed" },
  uploaded: { color: "text-slate-600", bg: "bg-slate-50", label: "Uploaded" },
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}

export default function AdminBulkUpload() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [jobFiles, setJobFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, filename: "" });
  const [polling, setPolling] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState(new Set());
  const fileInputRef = useRef(null);
  const abortRef = useRef(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await getBulkJobs();
      setJobs(res.data.jobs || []);
    } catch {}
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Poll active job during processing
  useEffect(() => {
    if (!activeJob || activeJob.status !== "processing") {
      setPolling(false);
      return;
    }
    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const res = await getBulkJob(activeJob.id);
        setActiveJob(res.data);
        const filesRes = await getBulkJobFiles(activeJob.id);
        setJobFiles(filesRes.data.files || []);
        if (res.data.status !== "processing") {
          clearInterval(interval);
          setPolling(false);
          toast.success("Processing complete!");
          fetchJobs();
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status, fetchJobs]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    abortRef.current = false;
    let jobId = "";
    let uploaded = 0;
    const total = files.length;

    for (const file of files) {
      if (abortRef.current) break;
      setUploadProgress({ current: uploaded + 1, total, filename: file.name });

      try {
        const res = await bulkCatalogUpload(file, jobId);
        if (!jobId) {
          jobId = res.data.job_id;
        }
        uploaded++;
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        toast.error(`Failed: ${file.name}`);
      }
    }

    setUploading(false);
    setUploadProgress({ current: 0, total: 0, filename: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (jobId) {
      toast.success(`${uploaded}/${total} files uploaded`);
      // Load the new job
      try {
        const jobRes = await getBulkJob(jobId);
        setActiveJob(jobRes.data);
        const filesRes = await getBulkJobFiles(jobId);
        setJobFiles(filesRes.data.files || []);
      } catch {}
      fetchJobs();
    }
  };

  const handleStartProcessing = async () => {
    if (!activeJob) return;
    try {
      await startBulkProcessing(activeJob.id);
      setActiveJob({ ...activeJob, status: "processing" });
      toast.success("Processing started — PDFs are being analyzed by AI");
    } catch (err) {
      toast.error("Failed to start processing");
    }
  };

  const handleApproveAll = async () => {
    if (!activeJob) return;
    try {
      const res = await approveBulkProducts(activeJob.id);
      toast.success(`${res.data.added} products added to catalog, ${res.data.skipped_duplicates} duplicates skipped`);
      // Refresh
      const jobRes = await getBulkJob(activeJob.id);
      setActiveJob(jobRes.data);
      const filesRes = await getBulkJobFiles(activeJob.id);
      setJobFiles(filesRes.data.files || []);
    } catch {
      toast.error("Failed to approve products");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this upload job and all its data?")) return;
    try {
      await deleteBulkJob(jobId);
      toast.success("Job deleted");
      if (activeJob?.id === jobId) {
        setActiveJob(null);
        setJobFiles([]);
      }
      fetchJobs();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const loadJob = async (job) => {
    setActiveJob(job);
    try {
      const filesRes = await getBulkJobFiles(job.id);
      setJobFiles(filesRes.data.files || []);
    } catch {}
  };

  const toggleFileExpand = (fileId) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };

  const pdfCount = jobFiles.filter((f) => f.file_type === "pdf").length;
  const processedCount = jobFiles.filter((f) => f.status === "completed" || f.status === "failed").length;
  const totalExtracted = jobFiles.reduce((sum, f) => sum + (f.extracted_products?.length || 0), 0);
  const totalNew = jobFiles.reduce(
    (sum, f) => sum + (f.extracted_products || []).filter((p) => p._dup_status === "new" && !p.approved).length,
    0
  );

  return (
    <div className="p-6" data-testid="admin-bulk-upload">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>
            Bulk Catalog Upload
          </h1>
          <p className="text-sm text-slate-500">Upload all product brochures — AI extracts product data automatically</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchJobs()}
            className="p-2 border border-slate-200 rounded-sm text-slate-500 hover:text-slate-700"
            data-testid="refresh-jobs-btn"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 mb-6 text-center hover:border-emerald-400 transition-colors" data-testid="upload-zone">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.mp4,.mov,.avi,.pptx,.ppt,.doc,.docx"
          hidden
          data-testid="bulk-file-input"
        />
        {uploading ? (
          <div className="space-y-3">
            <Loader2 size={32} className="mx-auto text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">
              Uploading {uploadProgress.current} of {uploadProgress.total}...
            </p>
            <p className="text-xs text-slate-500 truncate max-w-md mx-auto">{uploadProgress.filename}</p>
            <div className="w-64 mx-auto bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
            <button
              onClick={() => { abortRef.current = true; }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Cancel remaining
            </button>
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <FolderUp size={40} className="mx-auto text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Click to select files or drag & drop
            </p>
            <p className="text-xs text-slate-400">
              PDFs, Images, Videos, Presentations — up to 200MB each. Select all 250+ files at once.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Job History Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Upload Jobs</h3>
          {jobs.length === 0 ? (
            <p className="text-xs text-slate-400">No upload jobs yet</p>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => {
                const s = STATUS_STYLES[job.status] || STATUS_STYLES.uploaded;
                const isActive = activeJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => loadJob(job)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      isActive
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                    data-testid={`job-card-${job.id}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${s.bg} ${s.color}`}>
                        {s.label}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteJob(job.id); }}
                        className="p-0.5 text-slate-300 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{job.total_files} files</p>
                    <p className="text-[10px] text-slate-400">
                      {job.total_products_found} products found
                      {job.approved_products > 0 && ` · ${job.approved_products} approved`}
                    </p>
                    <p className="text-[10px] text-slate-400">{new Date(job.created_at).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {!activeJob ? (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
              <Upload size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Upload files above or select a previous job from the sidebar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Job Summary */}
              <div className="bg-white border border-slate-200 rounded-lg p-4" data-testid="job-summary">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900" style={{ fontFamily: "Chivo" }}>
                      Job Summary
                    </h3>
                    {polling && <Loader2 size={14} className="text-amber-500 animate-spin" />}
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    (STATUS_STYLES[activeJob.status] || STATUS_STYLES.uploaded).bg
                  } ${(STATUS_STYLES[activeJob.status] || STATUS_STYLES.uploaded).color}`}>
                    {(STATUS_STYLES[activeJob.status] || STATUS_STYLES.uploaded).label}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-lg font-bold text-slate-900">{activeJob.total_files}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Total Files</p>
                  </div>
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-lg font-bold text-slate-900">{pdfCount}</p>
                    <p className="text-[10px] text-slate-500 uppercase">PDFs</p>
                  </div>
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-lg font-bold text-emerald-600">{totalExtracted}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Products Found</p>
                  </div>
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-lg font-bold text-blue-600">{totalNew}</p>
                    <p className="text-[10px] text-slate-500 uppercase">New (Ready)</p>
                  </div>
                </div>

                {/* Progress bar for processing */}
                {activeJob.status === "processing" && pdfCount > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Processing PDFs...</span>
                      <span>{activeJob.processed_files || 0} / {pdfCount}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{ width: `${((activeJob.processed_files || 0) / pdfCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4">
                  {(activeJob.status === "uploading" || activeJob.status === "completed") && pdfCount > 0 && (
                    <button
                      onClick={handleStartProcessing}
                      disabled={activeJob.status === "processing"}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-sm hover:bg-amber-600 disabled:opacity-50"
                      data-testid="start-processing-btn"
                    >
                      <Play size={14} /> {activeJob.status === "completed" ? "Re-process PDFs" : "Start AI Processing"}
                    </button>
                  )}
                  {totalNew > 0 && (
                    <button
                      onClick={handleApproveAll}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-sm hover:bg-emerald-700"
                      data-testid="approve-all-btn"
                    >
                      <CheckCircle2 size={14} /> Approve {totalNew} New Products
                    </button>
                  )}
                </div>
              </div>

              {/* File List */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden" data-testid="files-list">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
                    Uploaded Files ({jobFiles.length})
                  </h3>
                </div>
                <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
                  {jobFiles.map((f) => {
                    const IconComp = FILE_TYPE_ICONS[f.file_type] || File;
                    const s = STATUS_STYLES[f.status] || STATUS_STYLES.uploaded;
                    const hasProducts = (f.extracted_products || []).length > 0;
                    const isExpanded = expandedFiles.has(f.id);

                    return (
                      <div key={f.id} data-testid={`file-row-${f.id}`}>
                        <div
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer"
                          onClick={() => hasProducts && toggleFileExpand(f.id)}
                        >
                          <IconComp size={16} className="text-slate-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-800 truncate">{f.filename}</p>
                            <p className="text-[10px] text-slate-400">
                              {formatSize(f.size)} · {f.file_type}
                              {hasProducts && ` · ${f.extracted_products.length} products`}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${s.bg} ${s.color}`}>
                            {s.label}
                          </span>
                          {f.status === "processing" && <Loader2 size={14} className="text-amber-500 animate-spin shrink-0" />}
                          {f.error && (
                            <span className="text-[10px] text-red-500 truncate max-w-[200px]" title={f.error}>
                              {f.error}
                            </span>
                          )}
                          {hasProducts && (
                            isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
                          )}
                        </div>
                        {/* Expanded: show extracted products */}
                        {isExpanded && hasProducts && (
                          <div className="bg-slate-50 px-4 py-2 border-t border-slate-100">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-left text-slate-500">
                                  <th className="py-1 pr-2">Product</th>
                                  <th className="py-1 pr-2">Division</th>
                                  <th className="py-1 pr-2">Category</th>
                                  <th className="py-1 pr-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {f.extracted_products.map((p, idx) => (
                                  <tr key={p._temp_id || idx} className="border-t border-slate-200">
                                    <td className="py-1.5 pr-2 font-medium text-slate-800">
                                      {p.product_name}
                                      {p.sku_code && <span className="ml-1 text-slate-400">({p.sku_code})</span>}
                                    </td>
                                    <td className="py-1.5 pr-2 text-emerald-600">{p.division}</td>
                                    <td className="py-1.5 pr-2 text-slate-500">{p.category}</td>
                                    <td className="py-1.5 pr-2">
                                      {p.approved ? (
                                        <span className="inline-flex items-center gap-0.5 text-emerald-600">
                                          <Check size={10} /> Approved
                                        </span>
                                      ) : p._dup_status === "duplicate" ? (
                                        <span className="inline-flex items-center gap-0.5 text-amber-600" title={p._dup_match}>
                                          <AlertTriangle size={10} /> Duplicate
                                        </span>
                                      ) : (
                                        <span className="text-blue-600 font-medium">New</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {jobFiles.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-8">No files in this job yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
