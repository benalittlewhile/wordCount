CREATE TABLE Users (
  /* Not serial, matches a discord snowflake */
  id bigint PRIMARY KEY,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_on TIMESTAMP
  /*stretch goal*/
  /* TODO: settings data */
);

CREATE TABLE Projects (
  id bigserial PRIMARY KEY,
  user_id bigint REFERENCES Users(id) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NULL CHECK (
    color IS NULL
    OR color ~* '^#[a-f0-9]{6}$'
  ),
  deleted_on DATE
  /* TODO: hex value for associated color */
);

CREATE TABLE Wordcounts (
  id bigserial PRIMARY KEY,
  user_id bigint REFERENCES Users(id) NOT NULL,
  project_id INTEGER REFERENCES Projects(id) NOT NULL,
  date_counted DATE NOT NULL,
  /* time in minutes written on this day */
  minutes_written INTEGER NOT NULL,
  /* following dates need to auto-insert and update */
  created_on DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_on DATE,
  /* may not use this */
  updated_on DATE,
  constraint minutes_in_day CHECK(
    minutes_written > 0
    AND minutes_written <= 1440
  )
);

/* Don't let users add a wordcount for someone else's project */
CREATE
OR REPLACE FUNCTION check_owns_project() RETURNS TRIGGER AS $BODY$ BEGIN
  IF NOT EXISTS (
    SELECT
      1
    FROM
      Projects p
    WHERE
      p.user_id = NEW .user_id
      AND p.id = NEW .project_id
  ) THEN RAISE
  EXCEPTION
    'User with id % does not have project with id %.',
    NEW .user_id,
    NEW .project_id;

END IF;

RETURN NEW;

END;

$BODY$ LANGUAGE PLpgSQL;

CREATE
OR REPLACE TRIGGER check_me BEFORE
INSERT
  OR
UPDATE
  ON Wordcounts FOR EACH ROW EXECUTE PROCEDURE check_owns_project();