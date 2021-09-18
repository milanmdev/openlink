## NOTE: This is no longer maintained

# openlink
Open-sourced URL shortener. Built with JavaScript, powered by Node.js.

## Live Instance
Currently, there is no live instance of OpenLink. If you would like to add your own version of OpenLink for everyone to see, email me at [milanmdev@gmail.com](mailto:milanmdev@gmail.com) and I would be happy to give your project a shout-out!

## Understanding the API
### `POST /api/create`
This endpoint requires 2 queries: `link` and `slug`. Link represents the link to redirect to and slug represents the short link URL (e.g. `mywebsite.com/slug_here`).

Example: `mywebsite.com/api/create?link=https://github.com/milanmdev/openlink&slug=openlink`
### `GET /api/ban`
This endpoint requires 2 queries: `ip` and `staffkey`. IP represents the IP to ban and staffkey represents the staffkey. Staffkey is defined in the `config.json`.

Example: `mywebsite.com/api/ban?ip=127.0.0.1&staffkey=abcdefghijklmnopqrstuvwxyz123456789`
### `GET /api/:id`
This endpoint requires 1 parameter: `id`. ID represends the slug of the link to search. Slugs can be created with the `/api/create` endpoint.

Example: `mywebsite.com/api/openlink`

## Hosting OpenLink
Hosting OpenLink is quick and easy! Follow the directions below to run an instance of OpenLink.

 1. Clone the repository by either clicking `Download` or run `git clone https://github.com/milanmdev/openlink.git` in your console.
 2. Open the folder and run `npm i`. This will install the dependencies needed.
 3. In any text/code editor, open the `config.example.json` and change the values to what's needed. Staffkey can be any random string of text and/or numbers. When done, rename the file to `config.json`
 4. Run `npm start` in your console.
 5. Visit your running app at `localhost:80`.

## Reporting Issues
Report bugs using the built in "Issues" feature. Simple click on the "Issues" tab (on GitHub) and click "New Issue". Then type out your issue and click "Open Issue".
