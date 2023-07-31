const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory

} = require('../Controllers/CategoryController');

// POST endpoint for creating a new category
router.post('/categories', createCategory);

// GET endpoint for retrieving all categories
router.get('/categories', getCategories);

// PUT endpoint for updating a category by its ID
router.put('/categories/:categoryId', updateCategory);

// DELETE endpoint for deleting a category by its ID
router.delete('/categories/:categoryId', deleteCategory);

module.exports = router;
