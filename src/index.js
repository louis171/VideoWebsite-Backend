import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const prismax = prisma.$extends({
  client: {
    $log: (s) => console.log(s),
    async $totalQueries() {
      const index_prisma_client_queries_total = 0;
      // Prisma.getExtensionContext(this) in the following block
      // returns the current client instance
      const metricsCounters = await (
        await Prisma.getExtensionContext(this).$metrics.json()
      ).counters;
      return metricsCounters[index_prisma_client_queries_total].value;
    },
  },
});

async function main() {
  // https://www.prisma.io/docs/concepts/components/prisma-client/metrics
  const totalQueries = await prismax.$totalQueries();
  console.log(`Total queries: ${totalQueries}`);
  const metrics = await prismax.$metrics.json();
  console.log(metrics.histograms);
}

// prisma.$on("query", (e) => {
//   console.log("Query: " + e.query);
//   console.log("Params: " + e.params);
//   console.log("Duration: " + e.duration + "ms");
// });

// import seedDatabase from "./seed/seedDatabase.js";
// seedDatabase();

// const typeDefs = `#graphql

//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "User" type defines the queryable fields for every user in our data source.
//   type User {
//     id: String
//     email: String
//     username: String
//     password: String
//     description: String
//     created: String
//     updated: String
//     videos: [Video]
//   }

//   type Video {
//     id: String
//     views: Int
//     created: String
//     updated: String
//     paths: Paths
//     tags: [String]
//     heat: Heat
//     metadata: Metadata
//   }

//   type Paths {
//     id: String
//     hd: String
//     thumb: String
//     poster: String
//     created: String
//     updated: String
//     videoId: String
//   }

//   # type Tags {
//   #   id: String
//   #   tag1: String
//   #   tag2: String
//   #   tag3: String
//   #   tag4: String
//   #   tag5: String
//   #   created: String
//   #   updated: String
//   #   videoId: String
//   # }

//   type Tags {
//     tag: String
//   }

// type Heat {
//   id: String
//   temperature: Int
//   spotlight: Boolean
//   created: String
//   updated: String
//   videoId: String
// }

// type Metadata {
//   id: String
//   width: Int
//   height: Int
//   duration: Float
//   hasAudio: Boolean
//   created: String
//   updated: String
//   videoId: String
// }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     getUser(id: ID!): User
//     getUserVideos(id: ID!): User
//   }

//   type Query {
//     getVideo(id: ID!): Video
//   }
// `;

// // Resolvers define how to fetch the types defined in your schema.
// // This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     getUser: async (parent, args, contextValue, info) => {
//       let retVal = await prisma.user.findUnique({
//         where: {
//           id: args.id,
//         },
//         include: {
//           video: {
//             include: {
//               heat: true,
//               metadata: true,
//               paths: true,
//               tags: true,
//             },
//           },
//         },
//       });
//       for (const video of retVal.video.filter((n) => n)) {
//         await getTagsFromJSON(video);
//       }
//       return retVal;
//     },
//     // Gets video by id. Includes:
//     // video, paths, tags, heat and metadata
//     // tags are converted from id to name
//     getVideo: async (parent, args, contextValue, info) => {
//       let retVal = await prisma.video.findUnique({
//         where: {
//           id: args.id,
//         },
//         include: {
//           paths: true,
//           tags: true,
//           heat: true,
//           metadata: true,
//         },
//       });
//       await getTagsFromJSON(retVal);
//       return retVal;
//     },
//   },
// };

// Schema definition
const typeDefs = `#graphql
  # A library has a branch and books
  type User {
    id: String
    email: String
    username: String
    password: String
    description: String
    created: String
    updated: String
    videos: [Video!]
  }

  # A book has a title and author
  type Video {
    id: String
    views: Int
    created: String
    updated: String
    paths: Paths
    tags: [String]
    heat: Heat
    metadata: Metadata
  }

  # An author has a name
  type Paths {
    id: String
    hd: String
    thumb: String
    poster: String
    created: String
    updated: String
    videoId: String
  }

  type Tags {
    tag: String
  }

  type Heat {
    id: String
    temperature: Int
    spotlight: Boolean
    created: String
    updated: String
    videoId: String
  }

  type Metadata {
    id: String
    width: Int
    height: Int
    duration: Float
    hasAudio: Boolean
    created: String
    updated: String
    videoId: String
  }

  # Queries can fetch a list of libraries
  type Query {
    getVideoByUser(id: ID!): User
    getVideoById(id: ID!): Video
  }
`;

// Resolver map
const resolvers = {
  Query: {
    getVideoByUser: async (parent, args, contextValue, info) => {
      // Returns a User object that matches the ID supplied on args.id
      let retVal = await prisma.user.findUnique({
        where: {
          id: args.id,
        },
        include: {
          video: {
            include: {
              heat: true,
              metadata: true,
              paths: true,
              tags: true,
            },
          },
        },
      });
      return retVal;
    },
  },
  User: {
    videos(parent, args, contextValue, info) {
      // Filters the videos to only return the videos that are created by that user
      return parent.video;
    },
  },
  Video: {
    // Additional resolvers to return paths, tags, heat and metadata related to the video
    // objects that are resolved above
    paths(parent, args, contextValue, info) {
      return parent.paths;
    },
    // Tags are initially returned from database as IDs e.g.
    // tags: {
    //   id: "qiV-FUqxkpiHRBOcuhoo_TaBmO7B9gLt-R8j",
    //   tag1: "4xiS5EzOiUQv_zjU1LF8wM4V3hpH6JEEWllo",
    //   tag2: "l1jm1pxHEELfnYAU7FGICIRn9BD2ogA-HEbK",
    //   tag3: "zi9ZDQps4LosDc8JIdlmAnAl1r0s0oD1HyJD",
    //   tag4: "u7AlqYdJzoJFlD-s2kH5k6eLUlDKXiRCm7Jy",
    //   tag5: "fSFrKETwZ2ih357lVbQ97mB4sT8PDNWJ-K4N",
    //   videoId: "_7SJSPfvbk-uEle0P4RRbnx2ZUVWOimMBgr4",
    //   created: "1673111092730",
    //   updated: "1673111092730",
    // },
    // getTagsFromJSON is used to return the user friendly names
    // of the tags
    tags: async (parent, args, contextValue, info) => {
      // Apollo caches resolvers so the if statement below checks if the
      // array has already been created adn returns it
      if (!Array.isArray(parent.tags)) {
        let tags = await getTagsFromJSON(parent);
        parent.tags = tags;
        return parent.tags;
      } else {
        return parent.tags;
      }
    },
    heat(parent, args, contextValue, info) {
      return parent.heat;
    },
    metadata(parent, args, contextValue, info) {
      return parent.metadata;
    },
  },

  Query: {
    getVideoById: async (parent, args, contextValue, info) => {
      let retVal = await prisma.video.findUnique({
        where: {
          id: args.id,
        },
        include: {
          heat: true,
          metadata: true,
          paths: true,
          tags: true,
        },
      });
      return retVal;
    },
  },
};

const getTagsFromJSON = async (obj) => {
  let arr1 = [];
  // Create iterable array of object keys and map
  Object.keys(obj.tags).map((el, index) => {
    // If the object key starts with tag
    // then push the value (tagId) from the original object (obj.tags) into arr1
    if (el.toLowerCase().startsWith("tag")) {
      arr1.push(Object.values(obj.tags)[index]);
    }
  });
  let arr2 = [];
  // Filter removes nulls from array
  for (const el of arr1.filter((n) => n)) {
    // Query database for the tag id and return the name string
    let retTagArr = await prisma.systemTags.findFirst({
      where: {
        id: el,
      },
    });
    // Push each string into the arr2 array
    arr2.push(retTagArr.name);
  }
  // Set the arr2 array onto the original JSON obj object
  return arr2;
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);