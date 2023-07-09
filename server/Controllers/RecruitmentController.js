const Recruitment = require('../Models/RecruitmentModel');

// Create a new recruitment
exports.createRecruitment = async (req, res, next) => {
    try {
        const { title, description, commission, incentives } = req.body;

        const recruitment = await Recruitment.create({
            title,
            description,
            commission,
            incentives,
        });

        res.status(201).json({
            message: 'Recruitment created successfully',
            success: true,
            data: recruitment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get all recruitments
exports.getRecruitments = async (req, res, next) => {
    try {
        const recruitments = await Recruitment.find();

        res.status(200).json({
            data: recruitments,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get a single recruitment by ID
exports.getRecruitmentById = async (req, res, next) => {
    try {
        const recruitmentId = req.params.recruitmentId;
        const recruitment = await Recruitment.findById(recruitmentId);

        if (!recruitment) {
            return res.status(404).json({ error: 'Recruitment not found' });
        }

        res.status(200).json({
            data: recruitment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Update a recruitment
exports.updateRecruitment = async (req, res, next) => {
    try {
        const recruitmentId = req.params.recruitmentId;
        const { title, description, commission, incentives } = req.body;

        const updatedRecruitment = await Recruitment.findByIdAndUpdate(
            recruitmentId,
            {
                title,
                description,
                commission,
                incentives,
            },
            { new: true } // Return the updated recruitment
        );

        if (!updatedRecruitment) {
            return res.status(404).json({ error: 'Recruitment not found' });
        }

        res.status(200).json({
            message: 'Recruitment updated successfully',
            success: true,
            data: updatedRecruitment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Delete a recruitment
exports.deleteRecruitment = async (req, res, next) => {
    try {
        const recruitmentId = req.params.recruitmentId;

        const deletedRecruitment = await Recruitment.findByIdAndDelete(
            recruitmentId
        );

        if (!deletedRecruitment) {
            return res.status(404).json({ error: 'Recruitment not found' });
        }

        res.status(200).json({
            message: 'Recruitment deleted successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

