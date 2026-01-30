/**
 * API client for Resume Forge backend (AI, optional cloud).
 * Base URL can point to FastAPI server when online.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface GenerateResumeRequest {
  degree?: string;
  skills?: string[];
  internships?: Record<string, unknown>[];
  projects?: Record<string, unknown>[];
  target_role?: string;
}

export interface EnhanceSectionRequest {
  section_text: string;
  section_type?: string;
}

export interface SummarizeRequest {
  resume_text: string;
  output_type?: "one_page" | "linkedin" | "internship_application";
}

export async function aiGenerateResume(req: GenerateResumeRequest) {
  const res = await fetch(`${API_BASE}/api/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function aiEnhanceSection(req: EnhanceSectionRequest) {
  const res = await fetch(`${API_BASE}/api/ai/enhance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function aiSummarize(req: SummarizeRequest) {
  const res = await fetch(`${API_BASE}/api/ai/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function aiAtsFeedback(resumeText: string) {
  const res = await fetch(`${API_BASE}/api/ai/ats-feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
