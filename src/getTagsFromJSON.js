const getTagsFromJSON = async (retVal) => {
  if (retVal.tags) {
    let arr1 = [];
    // Create iterable array of object keys and map
    Object.keys(retVal.tags).map((el, index) => {
      // If the object key starts with tag
      // then push the value (tagId) from the original object (retVal.tags) into arr1
      if (el.toLowerCase().startsWith("tag")) {
        arr1.push(Object.values(retVal.tags)[index]);
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
    // Set the arr2 array onto the original JSON retVal object
    retVal.tags = arr2;
  } else {
    retVal = retVal;
  }
};
