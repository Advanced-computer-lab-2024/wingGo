const Attraction = require('../models/attraction');

const addTag = async (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        attraction.tags.push(tag);
        await attraction.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTags = async (req, res) => {
    const { id } = req.params;

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        res.status(200).json(attraction.tags);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTag = async (req, res) => {
    const { id, tagId } = req.params;
    const { newTag } = req.body;

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        const tagIndex = attraction.tags.indexOf(tagId);
        if (tagIndex === -1) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        attraction.tags[tagIndex] = newTag;
        await attraction.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTag = async (req, res) => {
    const { id, tagId } = req.params;

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        attraction.tags = attraction.tags.filter(tag => tag !== tagId);
        await attraction.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addTag,
    getTags,
    updateTag,
    deleteTag
};