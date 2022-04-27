const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Anomaly_Detection = new Schema({
    uuid: String,
    type_of_activity: String,
    permission: Boolean
});

module.exports = mongoose.model('Anomaly_Detection', Anomaly_Detection, "anomaly_detection");
