// const paginate = (model) => async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const pageSize = parseInt(req.query.pageSize) || 10;
  
//       const skip = (page - 1) * pageSize;
  
//       const items = await model.find()
//         .skip(skip)
//         .limit(pageSize)
//         .sort([['updatedAt', 'descending']])
//         .exec();
  
//       const totalItems = await model.countDocuments();
//       const totalPages = Math.ceil(totalItems / pageSize);
  
//       const nextPage = page < totalPages ? page + 1 : null;
//       const prevPage = page > 1 ? page - 1 : null;
  
//       res.status(200).json({
//         success: true,
//         total: totalItems,
//         items,
//         pageInfo: {
//           page,
//           pageSize,
//           totalPages,
//           nextPage,
//           prevPage,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// };

const paginate = (model) => async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchTerm = req.query.q || '';
    const skip = (page - 1) * pageSize;

    const searchString = decodeURIComponent(searchTerm);
    const searchTerms = searchString.split(/\s+/);

    const orConditions = searchTerms.map((term) => ({ post: new RegExp(term, 'i') }));
    const baseQuery = searchTerm ? model.find({ $or: orConditions }) : model.find();

    const totalItemsQuery = searchTerm ? model.find({ $or: orConditions }) : model.find();

    const items = await baseQuery
      .skip(skip)
      .limit(pageSize)
      .sort([['createdAt', 'descending']])
      .exec();

    const totalItems = await totalItemsQuery.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    // Fetch items for the requested page
    res.status(200).json({
      success: true,
      total: totalItems,
      items,
      pageInfo: {
        page,
        pageSize,
        totalPages,
        nextPage,
        prevPage,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = paginate;
