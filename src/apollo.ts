import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
  // split, // WebSocket 비활성화로 인해 사용하지 않음
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import { WebSocketLink } from "@apollo/client/link/ws"; // WebSocket 비활성화
// import { getMainDefinition } from "@apollo/client/utilities"; // WebSocket 비활성화
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

// WebSocket 완전 비활성화 - 배포 환경에서 타임아웃 및 연결 문제 해결
// const wsLink = new WebSocketLink({
//   uri:
//     process.env.NODE_ENV === "production"
//       ? `wss://${process.env.REACT_APP_BACKEND_DEPLOY_URL}/graphql`
//       : `ws://localhost:4000/graphql`,
//   options: {
//     reconnect: true,
//     connectionParams: {
//       "x-jwt": authTokenVar() || "",
//     },
//   },
// });

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? `https://${process.env.REACT_APP_BACKEND_DEPLOY_URL}/graphql`
      : `http://localhost:4000/graphql`,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

// WebSocket 비활성화 - HTTP만 사용
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   authLink.concat(httpLink)
// );

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
