CREATE TABLE Users (
  /* Not serial, matches a discord snowflake */
  id bigint PRIMARY KEY,
  created_on timestamp NOT NULL default CURRENT_TIMESTAMP,
  deleted_on timestamp
  /*stretch goal*/
,
  /* TODO: settings data */
);

CREATE TABLE Projects (
  id bigserial PRIMARY KEY,
  /* needs to link to Users.id */
  user bigint NOT NULL,
  name varchar(255) NOT NULL,
  color varchar(7) NULL,
  /* TODO: hex value for associated color */
);

CREATE TABLE Wordcounts (
  /* needs to auto-increment */
  id bigserial PRIMARY KEY,
  /* needs to link to Users.id */
  user bigint NOT NULL,
  /* needs to reference projects table */
  project integer NOT NULL,
  date_counted date NOT NULL,
  /* time in minutes written on this day */
  count_for_day integer NOT NULL,
  /* following dates need to auto-insert and update */
  created_on date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_on date,
);

ALTER TABLE
  projects
ADD
  CONSTRAINT color_hex_constraint CHECK (
    color is null
    or color ~* '^#[a-f0-9]{6}$'
  );

/* general TODO: next I need to add constraints linking the ids (user, project,
 etc) together */