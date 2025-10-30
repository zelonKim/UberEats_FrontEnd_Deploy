module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: `https://uber-eats-backend-701bf2fe6dd6.herokuapp.com/graphql`,
    },
  },
};
