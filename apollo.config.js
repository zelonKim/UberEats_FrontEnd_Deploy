module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url:
        process.env.NODE_ENV === "production"
          ? `https://${process.env.BACKEND_DEPLOY_URL}/graphql`
          : `http://localhost:4000/graphql`,
    },
  },
};
