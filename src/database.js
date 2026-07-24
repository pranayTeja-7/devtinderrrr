const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://pranaytejais7_db_user:hIcKEBecxiorA3Hw@cluster0.c2gpwza.mongodb.net/newDB?appName=Cluster0");
}

module.exports = {connectDB};