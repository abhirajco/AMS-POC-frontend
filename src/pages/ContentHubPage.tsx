import HeaderSection from "@/components/common/HeaderSection";
import { Button } from "@/components/ui/button";
import { Plus, Star, Search } from 'lucide-react';
import AllContent from "@/components/ui/AllContent";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/BASE_URL";
import CreateContent from "@/components/ui/ContentHub/CreateContent";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";


const ContentHubPage = () => {

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    in_review: 0,
    published: 0,
    approved: 0
  });
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [quarter, setQuarter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

 const fetchNumberOfDifferentContent = async () => {
  try {
    const res = await fetch(`${BASE_URL}/content/contents/stats/`, {
      credentials: "include",
    });

    console.log("stats status", res.status);
console.log("stats url", res.url);

    // if (res.status === 401) {
    //   navigate("/login");
    //   return;
    // }

    const data = await res.json();
    console.log(data);
    setStats(data);
  } catch (err) {
    console.error(err);
  }
};

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchNumberOfDifferentContent();
  }, []);

  return (
    <>
      <HeaderSection />

      <div className="mt-8 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl">Content Hub</h1>
            <p className="text-gray-600 mt-2">
              Manage all your marketing content at one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-sm whitespace-nowrap"
            >
              <Star className="w-4 h-4 mr-2" />
              Contents by AI
            </Button>

            <Button
              className="bg-[#1a2c47] text-white rounded-full px-4 py-2"
              onClick={handleOpen}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Total Content</h1>
          <h1 className="text-4xl">{stats.total}</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Drafts</h1>
          <h1 className="text-4xl">{stats.draft}</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">In Review</h1>
          <h1 className="text-4xl">{stats.in_review}</h1>
        </div>

         <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Approved</h1>
          <h1 className="text-4xl">{stats.approved}</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Published</h1>
          <h1 className="text-4xl">{stats.published}</h1>
        </div>    
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Input
            placeholder="Search Content"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full border-gray-300 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-32 shrink-0 rounded-full border border-gray-300 px-4 text-sm">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={quarter} onValueChange={setQuarter}>
          <SelectTrigger className="h-10 w-32 shrink-0 rounded-full border border-gray-300 px-4 text-sm">
            <SelectValue placeholder="All Quarters" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Quarters</SelectItem>
            <SelectItem value="1">Q1</SelectItem>
            <SelectItem value="2">Q2</SelectItem>
            <SelectItem value="3">Q3</SelectItem>
            <SelectItem value="4">Q4</SelectItem>
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-10 w-32 shrink-0 rounded-full border border-gray-300 px-4 text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="case_study">Case Study</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="white_paper">White Paper</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <AllContent status={status} type={type} quarter={quarter} search={searchQuery} />
      </div>
      <CreateContent
        open={open}
        onClose={setOpen}
      />
    </>
  );
};

export default ContentHubPage;