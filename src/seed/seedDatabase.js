import * as argon2 from "argon2";
import { nanoid } from "nanoid";
import randomWords from "./randomWords.js";
import randomLatin from "./randomLatin.js";
import getRandomInt from "./getRandomInt.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seedUser = async () => {
  try {
    const hashPassword = await argon2.hash(
      `${randomWords[getRandomInt(0, randomWords.length)]}${getRandomInt(
        0,
        randomWords.length
      )}`
    );
    let userObj = {
      id: nanoid(36),
      email: `${randomWords[getRandomInt(0, randomWords.length)]}.${
        randomWords[getRandomInt(0, randomWords.length)]
      }${getRandomInt(0, randomWords.length)}@${
        randomWords[getRandomInt(0, randomWords.length)]
      }.com`,
      username: `${
        randomWords[getRandomInt(0, randomWords.length)]
      }${getRandomInt(0, randomWords.length)}`,
      password: hashPassword,
      description: randomLatin(getRandomInt(0, 25)),
    };
    let retVal = await prisma.user.create({
      data: userObj,
    });
    console.log(retVal);
  } catch (err) {
    console.error(err);
  }
};

const createVideo = async () => {
  let users = await prisma.user.findMany();
  let tags = await prisma.systemTags.findMany();
  console.log(users);
  console.log(tags);
  const userId = users[getRandomInt(0, users.length - 1)].id;
  const videoId = nanoid(36);
  const videoName = `${randomWords[getRandomInt(0, randomWords.length)]}${
    randomWords[getRandomInt(0, randomWords.length)]
  }${getRandomInt(0, randomWords.length)}`;

  var precision = 1000; // 2 decimals
  var randomnum =
    Math.floor(
      Math.random() * (30 * precision - 1 * precision) + 1 * precision
    ) /
    (1 * precision);

  let videoObj = {
    video: {
      id: videoId,
      views: getRandomInt(300, 12000),
      userId: userId,
    },
    heat: {
      id: nanoid(36),
      temperature: getRandomInt(0, 10),
      spotlight: getRandomInt(0, 1) === 1 ? true : false,
      videoId: videoId,
    },
    metadata: {
      id: nanoid(36),
      width: getRandomInt(400, 2160),
      height: getRandomInt(400, 2160),
      duration: randomnum,
      hasAudio: getRandomInt(0, 1) === 1 ? true : false,
      videoId: videoId,
    },
    paths: {
      id: nanoid(36),
      hd: `https://api.videowebsite/api/video/${videoName}.m4v`,
      thumb: `https://api.videowebsite/api/video/${videoName}-thumb.png`,
      poster: `https://api.videowebsite/api/video/${videoName}1.png`,
      videoId: videoId,
    },
    tags: {
      id: nanoid(36),
      tag1: tags[getRandomInt(0, tags.length - 1)].id,
      tag2: tags[getRandomInt(0, tags.length - 1)].id,
      tag3: tags[getRandomInt(0, tags.length - 1)].id,
      tag4: tags[getRandomInt(0, tags.length - 1)].id,
      tag5: tags[getRandomInt(0, tags.length - 1)].id,
      videoId: videoId,
    },
  };
  console.log(videoObj);

  let videoRetVal = await prisma.video.create({
    data: videoObj.video,
  });
  console.log(videoRetVal);
  let heatRetVal = await prisma.heat.create({
    data: videoObj.heat,
  });
  console.log(heatRetVal);
  let metadataRetVal = await prisma.metadata.create({
    data: videoObj.metadata,
  });
  console.log(metadataRetVal);
  let pathsRetVal = await prisma.paths.create({
    data: videoObj.paths,
  });
  console.log(pathsRetVal);
  let tagsRetVal = await prisma.tags.create({
    data: videoObj.tags,
  });
  console.log(tagsRetVal);
};

const getVideoByUser = async () => {
  let users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });
  let arr1 = [];
  for (const user of users) {
    let userVideos = await prisma.video.count({
      where: {
        userId: user.id,
      },
    });
    arr1.push({ id: user.id, username: user.username, videoCount: userVideos });
  }
  console.log(arr1);
};

const seedDatabase = async () => {
  // let userData = await seedUser();
  // let retVal = await prisma.user.create({
  //   data: userData,
  // });
  // console.log(retVal);
};

export default seedDatabase;
