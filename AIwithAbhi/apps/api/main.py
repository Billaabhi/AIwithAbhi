from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import generate_router, vault_router, interact_router, search_router

app = FastAPI(
    title="AIwithAbhi API",
    description="Generate, critique, and publish Claude Skills.md files.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router)
app.include_router(vault_router)
app.include_router(interact_router)
app.include_router(search_router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}
