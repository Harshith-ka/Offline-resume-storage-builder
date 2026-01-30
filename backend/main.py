"""
Resume Forge API — AI services, auth, licensing.
Run: uvicorn main:app --reload
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="Resume Forge API",
    description="AI resume generation, enhancement, summarization. Optional cloud backup.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request/Response models ---

class GenerateResumeRequest(BaseModel):
    degree: Optional[str] = None
    skills: list[str] = []
    internships: list[dict] = []
    projects: list[dict] = []
    target_role: Optional[str] = None  # e.g. "Frontend", "Backend", "Data"


class EnhanceSectionRequest(BaseModel):
    section_text: str
    section_type: Optional[str] = None  # "experience", "education", "skills"


class SummarizeRequest(BaseModel):
    resume_text: str
    output_type: Optional[str] = "one_page"  # "one_page", "linkedin", "internship_application"


class ATSFeedbackRequest(BaseModel):
    resume_text: str


# --- Stub endpoints (wire to OpenAI / local LLM later) ---

@app.get("/health")
def health():
    return {"status": "ok", "service": "resume-forge-api"}


@app.post("/api/ai/generate")
async def ai_generate_resume(req: GenerateResumeRequest):
    """Generate ATS-optimized bullet points and role-specific content."""
    # TODO: Call OpenAI / local LLM with structured prompt
    return {
        "bullets": [],
        "summary": "",
        "message": "AI generation not configured. Set OPENAI_API_KEY and implement handler.",
    }


@app.post("/api/ai/enhance")
async def ai_enhance_section(req: EnhanceSectionRequest):
    """Rewrite weak bullets, add metrics, convert paragraphs to impact bullets."""
    # TODO: OpenAI completion
    return {
        "enhanced_text": req.section_text,
        "message": "AI enhancement not configured.",
    }


@app.post("/api/ai/summarize")
async def ai_summarize(req: SummarizeRequest):
    """One-page summary, LinkedIn bio, or internship application summary."""
    # TODO: OpenAI completion
    return {
        "summary": "",
        "message": "AI summarization not configured.",
    }


@app.post("/api/ai/ats-feedback")
async def ai_ats_feedback(req: ATSFeedbackRequest):
    """ATS score, grammar check, impact score, section suggestions."""
    # TODO: OpenAI + rule-based ATS checks
    return {
        "ats_score": 0,
        "grammar_ok": True,
        "impact_score": 0,
        "suggestions": [],
        "message": "ATS feedback not configured.",
    }
