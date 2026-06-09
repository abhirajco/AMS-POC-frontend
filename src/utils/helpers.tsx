import { Badge } from "@/components/ui/badge";
import { Check, Image, FileVideo, FileText, Palette } from 'lucide-react';
import { createElement, type ReactNode } from "react";

// Tailwind's preflight strips default tag styling, so each supported tag gets
// explicit classes to recreate how it would look in a rich-text editor.
const HTML_TAG_CLASS: Record<string, string> = {
  h1: "text-xl font-bold",
  h2: "text-lg font-bold",
  h3: "text-base font-semibold",
  h4: "text-sm font-semibold",
  h5: "text-sm font-semibold",
  h6: "text-xs font-semibold uppercase tracking-wide",
  p: "",
  ul: "list-disc pl-5",
  ol: "list-decimal pl-5",
  li: "",
  blockquote: "border-l-2 border-gray-300 pl-2 italic text-gray-600",
  strong: "font-semibold",
  b: "font-semibold",
  em: "italic",
  i: "italic",
  u: "underline",
  a: "text-blue-600 underline",
  code: "bg-gray-100 px-1 rounded font-mono text-[0.9em]",
};

const SKIP_TAGS = new Set(["script", "style"]);

const htmlNodeToReact = (node: ChildNode, key: number): ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (SKIP_TAGS.has(tag)) return null;

  if (tag === "br") return createElement("br", { key });
  if (tag === "hr") return createElement("hr", { key, className: "my-1 border-gray-200" });

  const children = Array.from(el.childNodes).map((child, i) => htmlNodeToReact(child, i));
  const className = HTML_TAG_CLASS[tag];

  if (tag === "a") {
    return createElement(
      "a",
      { key, href: el.getAttribute("href") ?? undefined, target: "_blank", rel: "noreferrer", className },
      children
    );
  }

  // Render known tags as themselves; anything unrecognised falls back to a
  // plain span so its text still shows without odd block spacing.
  const renderTag = className !== undefined ? tag : "span";
  return createElement(renderTag, { key, className }, children);
};


export const renderHtmlContent = (html?: string | null): ReactNode => {
  if (!html) return null;
  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    // No DOM available — strip tags so at least the text shows.
    return html.replace(/<[^>]*>/g, "");
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return Array.from(doc.body.childNodes).map((node, i) => htmlNodeToReact(node, i));
};

export const normalizeStatus = (status: string): string => 
{
  if (!status) return "";
  return status.trim().toLowerCase().replace(/\s+/g, "-");
};

export const getStatusBadge = (item: any) => {
        const normalizedStatus = normalizeStatus(item?.status);
        switch (normalizedStatus) {
            case 'draft':
                return <Badge variant="secondary" className="bg-gray-100 text-black">Draft</Badge>;
            case 'in_review':
                return <Badge className="bg-blue-600 text-white">In review</Badge>;
            case 'published':
                return <Badge variant="secondary" className="bg-green-500 text-white">Published</Badge>;
            case 'approved':
                return <Badge variant="secondary" className="bg-yellow-400 text-black">Approved</Badge>;
            case 'rejected':
                return <Badge variant="secondary" className="bg-red-600 text-white">Rejected</Badge>;
            default:
                return <Badge variant="outline">{item?.status}</Badge>;
        }
    };

export const getProofPointStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <div className="bg-[#1a2c47] flex items-center gap-2.5 px-1 py-0 rounded">
          <div className="w-4 h-4">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-white text-[12px] font-medium">pending</span>
        </div>
      );
    case 'approved':
      return (
        <div className="bg-gray-100 bg-opacity-10 flex items-center gap-2.5 px-1 py-0 rounded">
          <div className="w-4 h-4">
            <Check className="w-4 h-4 text-black" />
          </div>
          <span className="text-black text-[12px] font-medium">Approved</span>
        </div>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getLeadStatusBadge = (status: string) => {
  switch (status) {
    case 'qualified':
      return (
        <div className="bg-gray-100 bg-opacity-10 flex items-center gap-2.5 px-1 py-0 rounded">
          <div className="w-4 h-4">
            <Check className="w-4 h-4 text-black" />
          </div>
          <span className="text-black text-[12px] font-medium">qualified</span>
        </div>
      );
    case 'new':
      return (
        <div className="bg-gray-100 bg-opacity-10 flex items-center gap-2.5 px-1 py-0 rounded">
          <div className="w-4 h-4">
            <Check className="w-4 h-4 text-black" />
          </div>
          <span className="text-black text-[12px] font-medium">new</span>
        </div>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getCEStatusBadge = (status: string) => {
  const normalized = normalizeStatus(status).replace(/-/g, "_");
  switch (normalized) {
    case 'completed':
      return <Badge className="text-xs" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Completed</Badge>;
    case 'in_progress':
      return <Badge className="text-xs" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>In Progress</Badge>;
    case 'upcoming':
      return <Badge className="text-xs" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>Upcoming</Badge>;
    case 'planning':
      return <Badge className="text-xs" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>Planning</Badge>;
    default:
      return <Badge variant="outline" className="text-xs capitalize">{status}</Badge>;
  }
};

export const getPriorityBadge = (priority: string) => {
  const normalized = (priority || '').toLowerCase();
  switch (normalized) {
    case 'high':
      return <Badge className="bg-[#C33142] text-white text-xs">High</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="text-xs">Low</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{priority}</Badge>;
  }
};


 export const getAssetTypeIcon = (type: string) => {
  switch (type) {
    case 'Image':
      return <Image className="w-4 h-4" />;
    case 'Video':
      return <FileVideo className="w-4 h-4" />;
    case 'Document':
      return <FileText className="w-4 h-4" />;
    case 'Graphics':
      return <Palette className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export const getAssetTypeBadge = (type: string) => {
  const colors = {
    'Image': 'bg-green-100 text-green-800',
    'Video': 'bg-red-100 text-red-800',
    'Document': 'bg-blue-100 text-blue-800',
    'Graphics': 'bg-purple-100 text-purple-800'
  };

  return (
    <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'} text-xs`}>
      {type}
    </Badge>
  );
};

// Handler functions
export const handleGenerateContent = (
  title: string,
  description: string,
  tone: string,
  contentType: string,
  setGeneratedContent: (content: string) => void
) => {
  setGeneratedContent(`# ${title}\n\n${description}\n\nThis is AI-generated content based on your inputs. The content has been optimized for ${tone} tone and ${contentType} format.\n\n## Key Points\n- Professional delivery approach\n- Cost-effective solutions\n- Mission-critical applications\n\n### Implementation Strategy\nDetailed implementation approach with specific examples and case studies that demonstrate practical application of the concepts discussed.`);
};

export const handleAddComment = (newComment: string, setNewComment: (comment: string) => void) => {
  if (newComment.trim()) {
    console.log('Adding comment:', newComment);
    setNewComment('');
  }
};

export const handleApproveProofPoint = (proofPointId: number, setIsProofPointDialogOpen: (open: boolean) => void) => {
  console.log('Approving proof point:', proofPointId);
  // Lazy import to keep helpers tree-shake friendly
  import('sonner').then(({ toast }) => toast.success('Proof point approved.'));
  setIsProofPointDialogOpen(false);
};

export const handleRejectProofPoint = (proofPointId: number, setIsProofPointDialogOpen: (open: boolean) => void) => {
  console.log('Rejecting proof point:', proofPointId);
  import('sonner').then(({ toast }) => toast('Proof point rejected.'));
  setIsProofPointDialogOpen(false);
};

export const handleDisapproveProofPoint = (
  proofPointId: number,
  setIsProofPointDialogOpen: (open: boolean) => void
) => {
  console.log('Disapproving proof point:', proofPointId);
  import('sonner').then(({ toast }) => toast('Proof point disapproved.'));
  setIsProofPointDialogOpen(false);
};

export const handleSendMQL = (leadId: number, setIsLeadDialogOpen: (open: boolean) => void) => {
  console.log('Sending MQL to marketing:', leadId);
  import('sonner').then(({ toast }) => toast.success('MQL sent to marketing team.'));
  setIsLeadDialogOpen(false);
};

export const handleSendSQL = (leadId: number, setIsLeadDialogOpen: (open: boolean) => void) => {
  console.log('Sending SQL to sales team:', leadId);
  import('sonner').then(({ toast }) => toast.success('SQL sent to sales team.'));
  setIsLeadDialogOpen(false);
};

export const handleDownloadAsset = (assetId: number) => {
  console.log('Downloading asset:', assetId);
  import('sonner').then(({ toast }) => toast('Download started.'));
};

export const handleShareAsset = (assetId: number) => {
  console.log('Sharing asset:', assetId);
  import('sonner').then(({ toast }) => toast.success('Share link copied.'));
};

export const handleDeleteAsset = (assetId: number, setIsAssetDialogOpen: (open: boolean) => void) => {
  console.log('Deleting asset:', assetId);
  if (confirm('Are you sure you want to delete this asset?')) {
    import('sonner').then(({ toast }) => toast.success('Asset deleted.'));
    setIsAssetDialogOpen(false);
  }
};