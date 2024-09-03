"Can't ship without"

- login with discord oauth
- initial login flow (if no projects for user id) should prompt user to create a
  project (giving it a name)
- page to track time on a project (add a new word count entry)
  - if tracking multiple times on the same day, ask if the new value should be
    set as the total for that day or added to the existing total
- basic status view showing word count for a single project
- sign out button

stretch goals

- calendar view that shows word counts per-day for all projects
  - week/month/year views
    - drill-down could have cute animations
  - columns of the color specified by the user for each project
    - cells could be tinted based on the relative effort to the maximum for the
      given period
  - column height set where the greatest count for the period is 100% tall, rest
    are fractional
    - try this then see if it needs to change
- ui customization (user settings page allows setting ui colors and project
  colors)
  - settings page should show the user id (only on button press so no stream
    leak) so that they can provide it for deletion if that's ever a thing I need
    to do
- color customization for projects
  - https://svelte-awesome-color-picker.vercel.app/

pages:

- onboard /app/onboard
  - form and flow for user to create first project
    - occurs to me this could be reused any time they want to create a project,
      but that's probably better as a modal
  - redirect here if user provides a user id with no associated projects
  - redirect here when setting user id cookie for the first time
- dashboard /app
  - including calendar
  - including sidebar with overall stats
- specific project /app/project/(id)
  - milestone stats per-project
    - day, week, month, year
      - weeks start on monday :3
    - \[stretch] goals
  - these should be public-workable
- user page /app/usersettings
  - settings etc.
