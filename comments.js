//create web server
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('./models/comment');
const cors = require('cors');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true, useUnifiedTopology: true });

//set up cors for cross origin resource sharing
app.use(cors());

//use body parser to parse json
app.use(bodyParser.json());

//get all comments
router.get('/comments', (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(comments);
        }
    });
});

//get comment by id
router.get('/comments/:id', (req, res) => {
    Comment.findById(req.params.id, (err, comment) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(comment);
        }
    });
});

//post a comment
router.post('/comments', (req, res) => {
    let comment = new Comment(req.body);
    comment.save()
        .then(comment => {
            res.status(200).json({ 'comment': 'comment added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new comment failed');
        });
});

//update a comment by id
router.put('/comments/:id', (req, res) => {
    Comment.findById(req.params.id, (err, comment) => {
        if (!comment) {
            res.status(404).send('data is not found');
        }
        else {
            comment.comment_name = req.body.comment_name;
            comment.comment_content = req.body.comment_content;
            comment.comment_date = req.body.comment_date;
            comment.comment_time = req.body.comment_time;
            comment.save().then(comment => {
                res.json('Comment updated!');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    });
});

//delete a comment by id
router.delete('/comments/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id, (err, comment) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json('Comment removed successfully');
        }
    });
});