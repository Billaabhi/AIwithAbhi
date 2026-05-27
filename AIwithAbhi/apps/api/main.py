from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AIwithAbhi API",
    description="Generate, critique, and publish Claude Skills.md files.",
    version="0.1.0",
)

# Allow all origins for now (will restrict later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}


# Lazy import routes only when needed
@app.on_event("startup")
async def startup_event():
    try:
        from config import settings
        from routes import generate_router, vault_router, interact_router, search_router
        app.include_router(generate_router)
        app.include_router(vault_router)
        app.include_router(interact_router)
        app.include_router(search_router)
        print("✅ Routes loaded successfully")
    except Exception as e:
        print(f"⚠️ Warning: Could not load routes: {e}")
        # App still runs with just /health endpoint
