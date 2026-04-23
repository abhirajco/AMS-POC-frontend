import HeaderSection from "@/components/common/HeaderSection"
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { handleGenerateContent } from "../utils/helpers";
import TextEditor from '@/components/ui/TextEditor';
import VersionSidebar from "@/components/ui/VersionSidebar";
import { BASE_URL } from "@/utils/BASE_URL";
import { useLocation } from "react-router-dom";
const GenerateContentPage = () => {

  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('');
  const [tone, setTone] = useState('');
  const [title, setTitle] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [contentId, setContentId] = useState("");
  const [editorContent, setEditorContent] = useState('');
  const [contents, setContents] = useState<any[]>([]);
  const [contentBody, setContentBody] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [allContent, setAllContent] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedBody, setSelectedBody] = useState("");
  const [refreshVersionsKey, setRefreshVersionsKey] = useState(0);
  const location = useLocation();


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      setUploadedFile(f);
      toast.success('Document attached. Ready to extract.');
    }
  };

  const handleSubmitContent = async () => {
    const token = localStorage.getItem("accessToken");

    if (!contentId) {
      toast.error("No content selected");
      return;
    }

    try {
      // STEP 1: SAVE
      const saveRes = await fetch(`${BASE_URL}/content/contents/save/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
          title: selectedTitle,
          body: selectedBody,
        }),
      });
      console.log(contentId, selectedTitle, selectedBody);

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.message || "Save failed");
      }

      console.log("SAVE SUCCESS");

      //  STEP 2: SUBMIT (only if save success)
      const submitRes = await fetch(`${BASE_URL}/content/contents/submit/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
        }),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok) {
        throw new Error(submitData.message || "Submit failed");
      }

      console.log("SUBMIT SUCCESS");
      setDescription("");
      setTitle("");
      setContentBody("");
      setContentTitle("");
      toast.success("Content submitted successfully");

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleSaveVersion = async () => {
    const token = localStorage.getItem("accessToken");

    if (!contentId) {
      toast.error("No content selected");
      return;
    }

    try {
      // SAVE
      const res = await fetch(`${BASE_URL}/content/contents/save/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
          title: selectedTitle,
          body: selectedBody,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Save failed");
      }
      console.log("SAVE SUCCESS:", data);


      toast.success("Saved successfully");
      setRefreshVersionsKey(prev => prev + 1);
      fetchVersionDetails(contentId);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const unlockContent = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken"); //get token

      await fetch(`http://127.0.0.1:8000/api/content/contents/${id}/lock/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Unlocked");
    } catch (err) {
      console.error("Unlock failed");
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      handleGenerateContent(title, description, tone, contentType, setGeneratedContent);
      setIsGenerating(false);
    }, 2000);
  };

  const fetchVersionDetails = async (contentId: string, versionId?: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      let url = "";

      if (versionId) {
        url = `${BASE_URL}/content/contents/${contentId}/versions/${versionId}/`;
      } else {
        url = `${BASE_URL}/content/contents/${contentId}/`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      console.log("DETAIL DATA:", data);

      setSelectedTitle(data.title);
      setSelectedBody(data.body);
      setContentId(data.content_id);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchParticularContent = async (contentId:any) => {
    //setContentId(id);
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${BASE_URL}/content/contents/${contentId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        })
      const data = await res.json();
      setContentTitle(data.title);
      setContentBody(data.body);
      setAllContent(data)
     // console.log(data);
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (location.state) {
      const { contentId, title, brief, contentType } = location.state;

      setContentId(contentId);
      setTitle(title);
      setDescription(brief);

      setSelectedTitle(title);
      setSelectedBody(brief);

      setContentType(contentType);
      fetchParticularContent(contentId);
    }
  }, [location.state]);

  // useEffect(() => {
  //   //fetchAllContent();
  //   //fetchParticularContent();
  // }, []);

  return (
    <div>
      <HeaderSection />
      <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-medium text-black">
            Generate a New Content
          </h1>
          <p className="text-[12px] sm:text-[14px] text-gray-600">
            AI Powered
          </p>
        </div>
      </div>
      <div className="flex mb-3">
        <Card className="bg-white border border-gray-300 w-2/3">
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">
              Content Details
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex-1">
                <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">
                  Content Type
                </Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="border-gray-300 text-sm">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="social">Social Media Post</SelectItem>
                    <SelectItem value="whitepaper">Whitepaper</SelectItem>
                    <SelectItem value="email">Email Newsletter</SelectItem>
                    <SelectItem value="landing-page">Landing Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">
                  Tone
                </Label>
                <Input
                  placeholder="Enter tone of the content"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="border-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">
                Title
              </Label>
              <Input
                placeholder="Enter content title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 text-sm"
              />
            </div>

            <div>
              <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">
                Description
              </Label>
              <Textarea
                placeholder="Brief description of what you want to create..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-gray-300 text-sm min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 ml-5 bg-white border border-gray-300 lg:top-4">
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-2">
              Upload Document
            </h3>

            <p className="text-[11px] sm:text-[12px] text-gray-600 mb-3">
              Attach a pre-written document to extract its content into the editor.
            </p>

            <div className="border border-dashed border-gray-300 rounded-md p-4 text-center bg-neutral-50">
              <input
                id="doc-upload"
                type="file"
                accept=".doc,.docx,.pdf,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />

              <label
                htmlFor="doc-upload"
                className="inline-flex items-center justify-center px-3 py-2 rounded-md cursor-pointer border border-gray-300 bg-white text-sm hover:bg-gray-50"
              >
                Choose File
              </label>

              <div className="mt-2 text-[11px] sm:text-[12px] text-gray-600">
                Supported: .doc, .docx, .pdf, .txt, .md
              </div>
            </div>

            {uploadedFile && (
              <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded">
                <div className="text-[12px] text-black truncate">
                  {uploadedFile.name}
                </div>
                <div className="text-[11px] text-gray-600">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <Button
                className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm flex-1"
                disabled={!uploadedFile}
                onClick={() => toast("Extraction in progress (UI only).")}
              >
                Extract to Content
              </Button>

              <Button
                variant="outline"
                className="text-sm border-gray-300"
                onClick={() => {
                  setUploadedFile(null);
                }}
                disabled={!uploadedFile}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="bg-[#f7fafe] border border-gray-300 mb-3">
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">
              AI Content Generation
            </h3>

            <div className="mb-3 sm:mb-4">
              <Label className="text-[13px] sm:text-[14px] text-gray-600 mb-1 block">
                Content Generation Prompt
              </Label>
              <Textarea
                placeholder="Describe what content you want to generate. Be specific about tone, length, key points, and target audience..."
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                className="border-gray-300 text-sm min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !title || !description}
              className="bg-[#1a2c47] text-white rounded-md hover:bg-[#2a3c57] text-sm px-3"
            >
              <Plus className="w-4 h-4 mr-1 inline" />
              {isGenerating ? "Generating..." : "Generate Content"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="flex">
        <Card className="bg-white">
          <CardContent>
            <TextEditor
              contentTitle={selectedTitle}
              contentBody={selectedBody}
              contentId={contentId}
              onChange={(html) => setSelectedBody(html)}
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleSaveVersion}
                className="px-2 py-1 text-white bg-blue-950 rounded-sm"
              >
                Save Version
              </button>
              <button className="px-2 py-1 text-white bg-blue-950 rounded-sm"
                onClick={handleSubmitContent}>Send For Approval</button>
            </div>
          </CardContent>
        </Card>
        <VersionSidebar
          allContent={allContent}
          onSelect={fetchVersionDetails}
          refreshKey={refreshVersionsKey}
        />
      </div>
    </div>
  )
}

export default GenerateContentPage;

