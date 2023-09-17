const mongoose = require('mongoose');
const Schema = mongoose.Schema; //this is just a shortcut to mongoose.Schema

const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
// ImageSchema.set("toObject", { virtuals: true });


//the reason we use a virtual property is because we dont want to store the thumbnail in the database, we just want to create it on the fly

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({ //dont need to write mongoose.Schema because Schema is its shortcut
    title: String,
    images:
        [ImageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: { //this is the user that created the campground
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }]
}, opts); //this is an option that we pass to the schema to tell it to include virtual properties when we convert to JSON

CampgroundSchema.post('findOneAndDelete', async function (doc) { //this is a query middleware that will run after we delete a campground
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews //we delete all reviews that have an id that is in the doc.reviews array
            }
        })
    }
})

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong> <a href="/campgrounds/${this._id}">  ${this.title} </a> </strong>
    <p> ${this.description.substring(0, 30)}... </p>`;
}, opts);


module.exports = mongoose.model('Campground', CampgroundSchema)
