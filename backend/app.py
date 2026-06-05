from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os

from resume_parser import extract_text_from_pdf
from ranking import calculate_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

skills_db = [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "LangChain",
    "LangGraph",
    "FAISS",
    "NLP",
    "Docker",
    "AWS",
    "Kubernetes",
    "SQL",
    "Pandas",
    "NumPy"
]


@app.post("/rank-resume")
async def rank_resume(
    jd: str = Form(...),
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(
        file_path
    )

    score = calculate_similarity(
        jd,
        resume_text
    )

    matched_skills = []
    missing_skills = []
    jd_skills = []

    # Skills found in Job Description
    for skill in skills_db:
        if skill.lower() in jd.lower():
            jd_skills.append(skill)

    # Skills found in Resume
    for skill in skills_db:

        if skill.lower() in resume_text.lower():
            matched_skills.append(skill)

        else:
            missing_skills.append(skill)

    suggestions = []

    for skill in missing_skills[:5]:
        suggestions.append(
            f"Add projects or experience related to {skill}"
        )

    return {
        "filename": file.filename,
        "match_score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "resume_words": len(resume_text.split()),
        "jd_skills": jd_skills
    }