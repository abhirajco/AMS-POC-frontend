import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderSection from "@/components/common/HeaderSection";
import { inviteUser } from "@/api/Users";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";


const USER_GROUP_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "executive", label: "Executive" },
  { value: "internal", label: "Internal Member" },
  { value: "external", label: "External Member" },
];

const USER_ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "exec_approver", label: "Executive Approver" },
  { value: "writer", label: "Writer" },
  { value: "reviewer", label: "Reviewer" },
  { value: "sme", label: "SME" },
];

const InviteUserPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    userGroup: "",
    userRole: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "This field is mandatory";
    if (!form.email.trim()) e.email = "This field is mandatory";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Please enter a valid email address";
    if (!form.userGroup) e.userGroup = "This field is mandatory";
    if (!form.userRole) e.userRole = "This field is mandatory";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      setLoading(true);
      await inviteUser({
        email: form.email.trim(),
        full_name: form.name.trim(),
        group: form.userGroup,
        role: form.userRole,
      });
      setForm({ name: "", email: "", userGroup: "", userRole: "" });
      setErrors({});
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (msg?: string) =>
    msg ? <p className="text-xs text-red-600 mt-1">{msg}</p> : null;

  return (
    <div className="bg-neutral-50 min-h-full flex flex-col">
      <HeaderSection />

      <div className="px-4 sm:px-6 py-6 flex justify-center">
        <Card className="bg-white border border-gray-200 w-full max-w-xl">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Name *</Label>
              <Input
                value={form.name}
                placeholder="Enter full name"
                className={`border-gray-300 ${errors.name ? "border-red-500" : ""}`}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {fieldError(errors.name)}
            </div>

            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Email Id *</Label>
              <Input
                type="email"
                value={form.email}
                placeholder="Enter email address"
                className={`border-gray-300 ${errors.email ? "border-red-500" : ""}`}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {fieldError(errors.email)}
            </div>

            <div>
              <Label className="text-sm text-gray-700 mb-2 block">User Group *</Label>
              <Select
                value={form.userGroup}
                onValueChange={(value) => handleChange("userGroup", value)}
              >
                <SelectTrigger
                  className={`w-full border-gray-300 text-sm ${errors.userGroup ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select user group" />
                </SelectTrigger>
                <SelectContent>
                  {USER_GROUP_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.userGroup)}
            </div>

            <div>
              <Label className="text-sm text-gray-700 mb-2 block">User Role *</Label>
              <Select
                value={form.userRole}
                onValueChange={(value) => handleChange("userRole", value)}
              >
                <SelectTrigger
                  className={`w-full border-gray-300 text-sm ${errors.userRole ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.userRole)}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#1a2c47] text-white hover:bg-[#2a3c57]"
              >
                {loading ? "Inviting..." : "Invite User"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InviteUserPage;
