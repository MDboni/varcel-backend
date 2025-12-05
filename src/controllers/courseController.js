import CourseModel from "../models/CourseModel.js";

// Create Course (Admin / Instructor)
export const createCourse = async (req, res) => {
  try {
    const reqBody = req.body;

    //  Validate required fields
    if (!reqBody.title || !reqBody.instructor || !reqBody.price) {
      return res.status(400).json({
        status: "fail",
        message: "Title, Instructor and Price are required"
      });
    }

    const course = await CourseModel.create(reqBody);

    res.status(201).json({ status: "success", message: "Course created successfully",course });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get All Courses (Public, 12 per page, Pagination)
export const getAllCourses = async (req, res) => {
  try {
    let { page, search, category, sort } = req.query;

    page = parseInt(page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;

    // Sorting
    let sortBy = {};
    if (sort === "price_asc") sortBy.price = 1;
    else if (sort === "price_desc") sortBy.price = -1;
    else sortBy.createDate = -1;

    const totalCourses = await CourseModel.countDocuments(query);
    const courses = await CourseModel.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses,
      courses
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


export const getCourseDetails = async(req,res) =>{
    try {
        const { id } = req.params;

        // Validate ID 
       if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({ status: "fail", message: "Invalid course ID" });
       }

       const course = await CourseModel.findById(id)
       if(!course){
            return res.status(404).json({ status: "fail", message: "Course not found" });
       }

       res.status(200).json({status: "success", course });


    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}