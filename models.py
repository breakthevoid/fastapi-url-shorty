from datetime import datetime
from typing import Annotated

from fastapi import Depends
from sqlmodel import SQLModel, Field, create_engine, Session


# A SQLModel model
class Link(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    fullname: str = Field(index=True)
    shortname: str = Field(index=True)
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
