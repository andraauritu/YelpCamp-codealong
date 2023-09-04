
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
/*The require('./seedHelpers') statement imports the seedHelpers.js module and returns an object that contains two 
properties: descriptors and places. Each property holds an array of strings, as defined in the seedHelpers.js module.
The destructuring assignment in the code allows you to directly extract the descriptors and places arrays from the
imported object and assign them to separate variables with the same names (descriptors and places). This way, you 
can use these arrays directly without having to access them through the original object.*/
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch(err => {
        console.log('mongo conn Error')
        console.log(err)
    });
//easy way to pick a random element from an array: array[Math.floor(Math.random() * array.length)]
const sample = array => array[Math.floor(Math.random() * array.length)]; //this is a function that takes in an array 
/////////////////////////////////////////////////////////////////////////and returns a random element from that array
const seedDB = async () => {
    await Campground.deleteMany({}); //this will delete all the campgrounds in the database 
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000); //this will give us a random number between 0 and 1000
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64eb44d2a53582c12cd9a4af', //this is the id of the user that created the campground
            location: `${cities[random1000].city}, ${cities[random1000].state}`, //this will give us a random city and state
            title: `${sample(descriptors)} ${sample(places)}`,
            description: '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt accusantium quaerat hic unde nemo, eos ratione earum repellendus odit expedita quod mollitia! Perferendis reprehenderit, beatae obcaecati repellendus deleniti est ipsum?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude, //this will give us a random longitude
                    cities[random1000].latitude //this will give us a random latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dlx9ufwpz/image/upload/v1693258056/YelpCamp/muafqnezh9oyt1ckvfuz.avif',
                    filename: 'YelpCamp/muafqnezh9oyt1ckvfuz',
                },
                {
                    url: 'https://res.cloudinary.com/dlx9ufwpz/image/upload/v1693258057/YelpCamp/vhbl9fn000pp97uj24fw.avif',
                    filename: 'YelpCamp/vhbl9fn000pp97uj24fw',
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => { //this will run the seedDB function and then close the connection to the database
    mongoose.connection.close();
})
