const topselling = await Product.aggregate([
  {
    $group: {
      _id: "$product",
      avgRating: { $avg: "$rating" }
    }
  },
  { $sort: { avgRating: -1 } },
  {
    $lookup: {
      from: "products", // update your actual product collection name
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      name: "$product.name",
      avgRating: 1
    }
  }
]).exec();






// top 5 selling product 
exports.top5 = async ()=> {

  const topselling = await Product.aggregate([
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" }
      }
    },
    { $sort: { avgRating: -1 } },
    {
      $project: {
        name: "$product.name",
        avgRating: 1
      }
    },
    {
      $limit: 5
    }
  ]).exec();

  console.log(topselling);

}



// to get all products with the highest rating
