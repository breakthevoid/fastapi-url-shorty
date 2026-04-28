import os
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI,  Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select
from dotenv import load_dotenv
from starlette.responses import RedirectResponse

from models import SessionDep, Link, create_db_and_tables
from shorty import shorten_url

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield create_db_and_tables()

app = FastAPI(lifespan=lifespan)

# Define the origins that are allowed to make requests to your API
origins = [
    f"{os.getenv('HOST')}:3000",   # Standard React dev port
    f"{os.getenv('HOST')}:5173",   # Standard Vite (React) dev port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # List of allowed origins
    allow_credentials=True,      # Allow cookies/auth headers
    allow_methods=["*"],         # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # Allow all headers
)


@app.get("/links/")
async def get_links(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Link]:
    links = session.exec(select(Link).order_by(Link.created_at).offset(offset).limit(limit)).all()
    links.reverse()
    for link in links:
        link.shortname = f'{os.getenv('HOST')}:{os.getenv('PORT')}/{link.shortname}'
    return links


@app.post("/links/")
def create_link(link: Link, session: SessionDep) -> Link:
    print(link)
    link.shortname = f'{shorten_url(link.fullname)}'
    print(shorten_url(link.fullname))
    session.add(link)
    session.commit()
    session.refresh(link)
    link.shortname = f'{os.getenv('HOST')}:{os.getenv('PORT')}/{link.shortname}'
    return link


@app.get("/{hash}")
async def get_link(hash: str, session: SessionDep) -> RedirectResponse:
    link = session.exec(select(Link).where(Link.shortname == hash)).first()
    print(link)
    return RedirectResponse(link.fullname, status_code=307, headers=None, background=None)
