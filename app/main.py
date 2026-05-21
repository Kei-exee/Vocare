from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.routes.auth import router as auth_router
from app.routes.preguntas import router as preguntas_router
from app.routes.test import router as test_router
from app.routes.historial import router as historial_router

# APP

app = FastAPI()

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# STATIC FILES

app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static"
)

# TEMPLATES

templates = Jinja2Templates(
    directory="app/templates"
)

# PAGINA PRINCIPAL

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )

# LOGIN

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={}
    )

# ROUTERS API

app.include_router(auth_router)

app.include_router(preguntas_router)

app.include_router(test_router)

app.include_router(historial_router)