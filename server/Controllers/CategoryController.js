const Category = require('../Models/CategoryModel');

module.exports.createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const newCategory = await Category.create({ name, description });

        res.status(201).json({
            message: 'Category created successfully',
            success: true,
            data: newCategory,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Other category controller methods can be defined here
module.exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();

        res.status(200).json({
            data: categories,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Define other category controller methods here
module.exports.updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const { name, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
                description,
            },
            { new: true } // Return the updated category
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category updated successfully',
            success: true,
            data: updatedCategory,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category deleted successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
