import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as argon2 from "argon2";
import { nanoid } from "nanoid";

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

const FeedVideos = {
  // 'trending' is defined by videoes that have a 'temperature' of 7 or greater
  trending: [
    {
      id: "4VwZedQaqoM4hFOl3K2aE5uq9Cp5jjgqthmd",
      views: 3288,
      created: "1673111482116",
      paths: {
        hd: "https://api.videowebsite/api/video/hollowcast602.m4v",
        thumb: "https://api.videowebsite/api/video/hollowcast602-thumb.png",
        poster: "https://api.videowebsite/api/video/hollowcast6021.png",
      },
      tags: ["House", "Holiday", "Landscape", "Car", "Holiday"],
      metadata: {
        width: 552,
        height: 1666,
        duration: 25.708,
        hasAudio: true,
      },
    },
  ],
  // 'latest' is defined by videos that have been created in the last 24 hours
  latest: [
    {
      id: "nSKREsZXZxAvL20o64lGZqp3shrhxDun2vbf",
      views: 3188,
      created: "1673111383945",
      paths: {
        hd: "https://api.videowebsite/api/video/probablysense125.m4v",
        thumb: "https://api.videowebsite/api/video/probablysense125-thumb.png",
        poster: "https://api.videowebsite/api/video/probablysense1251.png",
      },
      tags: ["Landscape", "Fashion", "Dance", "Trending", "Landscape"],
      metadata: {
        width: 816,
        height: 1192,
        duration: 24.866,
        hasAudio: true,
      },
    },
  ],
  // 'spotlight' is defined by videos that have mainted a 'temperature' of 7 or greater
  // for more than 7 days
  spotlight: [
    {
      id: "edbzDKw3iSFAHE2NsJHbVugA8ywZL4xuXqDy",
      views: 7301,
      created: "1673111428288",
      paths: {
        hd: "https://api.videowebsite/api/video/industryfield375.m4v",
        thumb: "https://api.videowebsite/api/video/industryfield375-thumb.png",
        poster: "https://api.videowebsite/api/video/industryfield3751.png",
      },
      tags: ["Holiday", "Car", "Holiday", "Art", "Landscape"],
      metadata: {
        width: 1762,
        height: 786,
        duration: 18.93,
        hasAudio: false,
      },
    },
  ],
  // 'creators' is defined by user accounts that have been created in the last 3 days
  creators: [
    {
      id: "4G4K-C7THFL4mX-2QPHuYX3Zx4c94VBdoHpi",
      username: "purpose1900",
      description: "dolor",
      created: "1673111101089",
      paths: {
        thumb: "https://api.videowebsite/api/user/purpose1900-thumb.png",
        poster: "https://api.videowebsite/api/user/purpose1900.png",
      },
      videos: 10,
    },
  ],
};

// Schema definition
const typeDefs = `#graphql

  type Video {
    id: String
    views: Int
    created: String
    paths: Paths
    tags: [String]
    metadata: Metadata
  }

  type Paths {
    hd: String
    thumb: String
    poster: String
  }

  type Tags {
    tag: String
  }

  type Metadata {
    width: Int
    height: Int
    duration: Float
    hasAudio: Boolean
  }

  type User {
    id: String
    username: String
    description: String
    created: String
    videos: Int
    paths: UserPaths
  }

  type UserPaths {
    thumb: String
    poster: String
  }

  type FeedData {
    # trending: [Video]
    latest: [Video]
    # spotlight: [Video]
    creators: [User]
  }

  # Queries can fetch a list of libraries
  type Query {
    feedData: FeedData!
  }
`;

// Resolver map
const resolvers = {
  Query: {
    async feedData() {
      let latest = await prisma.video.findMany({
        take: 4,
        orderBy: {
          created: "desc",
        },
        select: {
          id: true,
          views: true,
          created: true,
          paths: true,
          tags: true,
          metadata: true,
        },
      });
      for await (const video of latest) {
        let tags = await getTagsFromJSON(video);
        video.tags = tags;
      }
      let creators = await prisma.user.findMany({
        take: 4,
        orderBy: {
          created: "desc",
        },
        select: {
          id: true,
          username: true,
          description: true,
          created: true,
          _count: {
            select: {
              video: true,
            },
          },
          paths: true,
        },
      });
      creators.forEach((creator) => {
        creator.videos = creator._count.video;
      });
      console.log(creators);
      return {
        latest: latest,
        creators: creators,
      };
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
