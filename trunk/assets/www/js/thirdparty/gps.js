/**
 * Constructor
 */
function GpsDetaction() {
};

/**
 * Starts the gps intent
 *
 * @param url           The url to play
 */
GpsDetaction.prototype.checkGPS = function(suc,fail) {
    
 return PhoneGap.exec(suc, fail, "GpsDetaction", "gpsDetect", [null]);
};

/**
 * gps checker load
 */
PhoneGap.addConstructor(function() {
    PhoneGap.addPlugin("gpsDetaction", new GpsDetaction());

});