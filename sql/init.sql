CREATE EXTENSION IF NOT EXISTS vector;

create table search (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  embedString varchar(300) not null, 
  embedding vector(768) null
);
