truncate Users,
Projects,
Wordcounts;

INSERT INTO
  users (id)
VALUES
  (1),
  (2),
  (3);

INSERT INTO
  Projects (user_id, NAME)
VALUES
  (1, 'harry potter'),
  (2, 'powerless'),
  (3, 'November 9th'),
  (1, '4th Wing');

INSERT INTO
  Wordcounts (
    user_id,
    project_id,
    date_counted,
    minutes_written
  )
VALUES
  (2, 1, "December 1, 2808", 30),
  (1, 1, "november 12, 2014", 60)