const Category = require('../models/category')

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if (err || !cate) {
            return res.status(400).json({
                err: "category not found in database",
            })
        }
        req.category = cate
        next()
    });
};

exports.createCategory = (req, res) => {
    new Category(req.body).save((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                err: "category not saved in database"
            })
        }
        return res.status(200).json(category)
    })
}

exports.getCategory = (req, res) => {
    return res.status(200).json(req.category)
}

exports.getAllCategories = (req, res) => {
    Category.find({}).exec((err, categorys) => {
        if (err || !categorys) {
            return res.status(400).json({
                err: "category not found in database"
            })
        }
        return res.status(200).json(categorys)
    })
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if (err || !updatedCategory) return res.status(400).json({ err: "category not updated !!" })
        return res.status(200).json(updatedCategory)
    })

}

exports.deleteCategories = (req, res) => {
    Category.find({ _id: req.category._id }).remove((err, deletedCategory) => {
        if (err) return res.status(400).json({ err: "err occured" })
        res.json({ msg: "Cat delted" })
    })
}