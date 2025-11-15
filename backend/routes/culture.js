const router = require('express').Router();
let Culture = require('../models/culture.model');
const { generateCultureContent } = require('../services/gemini');

// Get a culture
router.route('/:name').get((req, res) => {
    Culture.findOne({ name: req.params.name })
        .then(culture => {
            if (culture) {
                res.json(culture);
            } else {
                generateCultureContent(req.params.name)
                    .then(content => {
                        const newCulture = new Culture({
                            name: req.params.name,
                            content
                        });

                        newCulture.save()
                            .then(() => res.json(newCulture))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(500).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Fact-check a culture
router.route('/fact-check/:name').post((req, res) => {
    generateCultureContent(req.params.name)
        .then(newContent => {
            Culture.findOneAndUpdate({ name: req.params.name }, { content: newContent }, { new: true })
                .then(updatedCulture => res.json(updatedCulture))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(500).json('Error: ' + err));
});

module.exports = router;
