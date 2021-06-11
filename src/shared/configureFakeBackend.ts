// array in local storage for registered users
let allChannelsListsNames = [];
for (let i = 0; i < 23; i++) {
  allChannelsListsNames.push({
    id: i,
    name: `UX/UI ${i}`,
  });
}

export function configureFakeBackend() {
  let realFetch = window.fetch;
  window.fetch = function (url: any, opts: any) {
    const { method, headers } = opts;
    const body = opts.body && JSON.parse(opts.body);

    return new Promise((resolve, reject) => {
      // wrap in timeout to simulate server api call
      setTimeout(handleRoute, 500);

      function handleRoute() {
        switch (true) {
          // case url.endsWith("/users/authenticate") && method === "POST":
          //   return authenticate();
          // case url.endsWith("/users/register") && method === "POST":
          //   return register();
          case url.endsWith("/channelsJustNamesAndIDs") && method === "GET":
            return getChannelsJustNamesAndIDs();
          // case url.match(/\/users\/\d+$/) && method === "DELETE":
          //   return deleteUser();
          default:
            // pass through any requests not handled above
            return realFetch(url, opts)
              .then((response) => resolve(response))
              .catch((error) => reject(error));
        }
      }

      // route functions

      function authenticate() {
        const { username, password } = body;
        const user = allChannelsListsNames.find(
          (x) => x.username === username && x.password === password
        );
        if (!user) return error("Username or password is incorrect");
        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          token: "fake-jwt-token",
        });
      }

      function register() {
        const user = body;

        if (allChannelsListsNames.find((x) => x.username === user.username)) {
          return error(`Username  ${user.username} is already taken`);
        }

        // assign user id and a few other properties then save
        user.id = allChannelsListsNames.length ? Math.max(...allChannelsListsNames.map((x) => x.id)) + 1 : 1;
        allChannelsListsNames.push(user);
        localStorage.setItem("users", JSON.stringify(allChannelsListsNames));

        return ok(null);
      }

      function getChannelsJustNamesAndIDs() {
        if (!isLoggedIn()) return unauthorized();

        return ok(allChannelsListsNames);
      }

      function deleteUser() {
        if (!isLoggedIn()) return unauthorized();

        allChannelsListsNames = allChannelsListsNames.filter((x) => x.id !== idFromUrl());
        localStorage.setItem("users", JSON.stringify(allChannelsListsNames));
        return ok(null);
      }

      // helper functions

      function ok(body) {
        resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(body)),
          headers: null,
          redirected: null,
          status: null,
          statusText: null,
          trailer: null,
          type: null,
          url,
          clone: null,
          body: null,
          bodyUsed: null,
          arrayBuffer: null,
          blob: null,
          formData: null,
          json: null,
        });
      }

      function unauthorized() {
        resolve({
          status: 401,
          text: () =>
            Promise.resolve(JSON.stringify({ message: "Unauthorized" })),
          headers: null,
          redirected: null,
          ok: null,
          statusText: null,
          trailer: null,
          type: null,
          url,
          clone: null,
          body: null,
          bodyUsed: null,
          arrayBuffer: null,
          blob: null,
          formData: null,
          json: null,
        });
      }

      function error(message) {
        resolve({
          status: 400,
          text: () => Promise.resolve(JSON.stringify({ message })),
          headers: null,
          redirected: null,
          ok: null,
          statusText: null,
          trailer: null,
          type: null,
          url,
          clone: null,
          body: null,
          bodyUsed: null,
          arrayBuffer: null,
          blob: null,
          formData: null,
          json: null,
        });
      }

      function isLoggedIn() {
        return headers["Authorization"] === "Bearer fake-jwt-token";
      }

      function idFromUrl() {
        const urlParts = url.split("/");
        return parseInt(urlParts[urlParts.length - 1]);
      }
    });
  };
}
