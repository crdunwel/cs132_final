/**
 * Check out http://www.sequelizejs.com/ for more advanced functionality
 */

var Sequelize = require("sequelize");

// our global sequelize object
var sequelize = new Sequelize('database', null, null,
    {
        // the sql dialect of the database
        dialect: 'sqlite',
        // the storage engine for sqlite - default ':memory:'
        storage: './temp.db'
    });

////////////////////////
// DEFINE MODELS HERE //
////////////////////////
var Song = sequelize.define('Song', 
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true },
       	artist: Sequelize.STRING,
	title: Sequelize.STRING,
	album: Sequelize.STRING,
        playlength: Sequelize.FLOAT
    }
);

var Location = sequelize.define('Location',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true },
        client_id: { type: Sequelize.INTEGER, autoIncrement: true },
        longitude: Sequelize.FLOAT,
        latitude: Sequelize.FLOAT
    }
);

var FeedFire = sequelize.define('FeedFire',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true },
        feed: Sequelize.BOOLEAN
    },
    {
        timestamps: false
    }).belongsTo(Location);


var Volume = sequelize.define('Volume',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true },
        dir: Sequelize.INTEGER
    },
    {
        timestamps: false
    }).belongsTo(Location);

var Speaker = sequelize.define('Speaker',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true },
        volumeUp: Sequelize.INTEGER,
	    volumeDown: Sequelize.INTEGER,
	    latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT
    },
    {
        timestamps: false
    });

var Fire = sequelize.define('Fire',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true },
        needsFed: Sequelize.INTEGER,
	    latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT
    },
    {
        timestamps: false
    });

// resets database and syncs models defined above into SQL
sequelize.sync({force: true}).success(function()
{
    var i,len;

    // sync fire locations into database
    var firesJSON = '[{"id":8,"needsFed":50,"latitude":41.8267987227608,"longitude":-71.41366481781006},{"id":9,"needsFed":50,"latitude":41.82672099206882,"longitude":-71.41356155276299},{"id":10,"needsFed":50,"latitude":41.826749257785906,"longitude":-71.41347169876099},{"id":11,"needsFed":50,"latitude":41.82677187035059,"longitude":-71.41339391469955},{"id":12,"needsFed":50,"latitude":41.826824161875834,"longitude":-71.41325443983078},{"id":13,"needsFed":50,"latitude":41.826866560378484,"longitude":-71.41315385699272},{"id":14,"needsFed":50,"latitude":41.826907545570975,"longitude":-71.41303583979607},{"id":15,"needsFed":50,"latitude":41.82694287761245,"longitude":-71.41294464468956},{"id":16,"needsFed":50,"latitude":41.826971143231575,"longitude":-71.41283199191093},{"id":17,"needsFed":50,"latitude":41.82700788851776,"longitude":-71.41270726919174},{"id":18,"needsFed":50,"latitude":41.82704322050384,"longitude":-71.41259327530861},{"id":19,"needsFed":50,"latitude":41.82706441968614,"longitude":-71.412483304739},{"id":20,"needsFed":50,"latitude":41.82713932336417,"longitude":-71.41208902001381},{"id":21,"needsFed":50,"latitude":41.827154869408524,"longitude":-71.41159012913704},{"id":22,"needsFed":50,"latitude":41.827154869408524,"longitude":-71.41149625182152},{"id":23,"needsFed":50,"latitude":41.82713649681027,"longitude":-71.41136884689331},{"id":24,"needsFed":50,"latitude":41.827125190593314,"longitude":-71.41125351190567},{"id":25,"needsFed":50,"latitude":41.827106817986504,"longitude":-71.41113013029099},{"id":26,"needsFed":50,"latitude":41.8270912719305,"longitude":-71.41100943088531},{"id":27,"needsFed":50,"latitude":41.82707007275708,"longitude":-71.41088604927063},{"id":28,"needsFed":50,"latitude":41.82703756734425,"longitude":-71.41078278422356},{"id":29,"needsFed":50,"latitude":41.82692874479821,"longitude":-71.41002237796783},{"id":30,"needsFed":50,"latitude":41.8268849330542,"longitude":-71.40997275710106},{"id":32,"needsFed":50,"latitude":41.82682274859194,"longitude":-71.4099271595478},{"id":33,"needsFed":50,"latitude":41.826749257785906,"longitude":-71.40986949205399},{"id":34,"needsFed":50,"latitude":41.82670120605946,"longitude":-71.40984132885933},{"id":35,"needsFed":50,"latitude":41.82611186287656,"longitude":-71.40938803553581},{"id":36,"needsFed":50,"latitude":41.825856055135596,"longitude":-71.40904873609543},{"id":37,"needsFed":50,"latitude":41.82559176650654,"longitude":-71.40872955322266},{"id":38,"needsFed":50,"latitude":41.82566397614512,"longitude":-71.40881487037416},{"id":39,"needsFed":50,"latitude":41.82571994032161,"longitude":-71.4088869414851},{"id":40,"needsFed":50,"latitude":41.82578190060281,"longitude":-71.40897039224512},{"id":41,"needsFed":50,"latitude":41.825915814554094,"longitude":-71.4091524666307},{"id":42,"needsFed":50,"latitude":41.82598377078044,"longitude":-71.40922074452533},{"id":43,"needsFed":50,"latitude":41.82604573080631,"longitude":-71.4092890224199},{"id":44,"needsFed":50,"latitude":41.82617164938379,"longitude":-71.40945971715638},{"id":45,"needsFed":50,"latitude":41.826229611820345,"longitude":-71.40954696113278},{"id":46,"needsFed":50,"latitude":41.82629556901192,"longitude":-71.40962282546008},{"id":47,"needsFed":50,"latitude":41.826961133233475,"longitude":-71.41065078721101},{"id":48,"needsFed":50,"latitude":41.825054363196855,"longitude":-71.40835209797388},{"id":49,"needsFed":50,"latitude":41.82494842986308,"longitude":-71.40829140651203},{"id":50,"needsFed":50,"latitude":41.824846493848106,"longitude":-71.40824588791565},{"id":51,"needsFed":50,"latitude":41.82474255892065,"longitude":-71.4081586439392},{"id":52,"needsFed":50,"latitude":41.824642621331286,"longitude":-71.40810933212646},{"id":53,"needsFed":50,"latitude":41.82453268980282,"longitude":-71.40806381353008},{"id":54,"needsFed":50,"latitude":41.82672728713328,"longitude":-71.41368561300743},{"id":55,"needsFed":50,"latitude":41.8268751898942,"longitude":-71.4136457842356},{"id":56,"needsFed":50,"latitude":41.826940147079874,"longitude":-71.41367423335834},{"id":57,"needsFed":50,"latitude":41.82685520305458,"longitude":-71.41390751616484},{"id":58,"needsFed":50,"latitude":41.82664134348008,"longitude":-71.4138297552293},{"id":59,"needsFed":50,"latitude":41.82662235591325,"longitude":-71.41391510259757},{"id":60,"needsFed":50,"latitude":41.826633348715774,"longitude":-71.41400613979033},{"id":61,"needsFed":50,"latitude":41.8266553343152,"longitude":-71.41409907359133},{"id":62,"needsFed":50,"latitude":41.82669430876835,"longitude":-71.41417304131045},{"id":63,"needsFed":50,"latitude":41.82675626810658,"longitude":-71.4142318361641},{"id":64,"needsFed":50,"latitude":41.82681423001386,"longitude":-71.41426597511139},{"id":65,"needsFed":50,"latitude":41.82687019318489,"longitude":-71.41426976832776},{"id":66,"needsFed":50,"latitude":41.82695113982787,"longitude":-71.41420907686592},{"id":67,"needsFed":50,"latitude":41.827005104199664,"longitude":-71.41414459218771},{"id":68,"needsFed":50,"latitude":41.82704907513562,"longitude":-71.41407631429308},{"id":69,"needsFed":50,"latitude":41.82706706323708,"longitude":-71.41399665674942},{"id":70,"needsFed":50,"latitude":41.82707289931394,"longitude":-71.41389816999435},{"id":71,"needsFed":50,"latitude":41.82704604701877,"longitude":-71.41380965709686},{"id":72,"needsFed":50,"latitude":41.82700082207508,"longitude":-71.41373589634895},{"id":73,"needsFed":50,"latitude":41.82640196547092,"longitude":-71.40972599387169},{"id":74,"needsFed":50,"latitude":41.82717220567953,"longitude":-71.41173496842384},{"id":75,"needsFed":50,"latitude":41.82716937912705,"longitude":-71.4118529856205},{"id":76,"needsFed":50,"latitude":41.827160899468886,"longitude":-71.41199111938477}]';
    var firesObj = JSON.parse(firesJSON);
    for (i=0, len=firesObj.length; i<len; i++)
    {
        Fire.create({needsFed:0,latitude:firesObj[i].latitude,longitude:firesObj[i].longitude});
    }

    // test data for speakers uses same location as fires
    var speakerJSON = '[{"id":8,"needsFed":50,"latitude":41.8267987227608,"longitude":-71.41366481781006},{"id":9,"needsFed":50,"latitude":41.82672099206882,"longitude":-71.41356155276299},{"id":10,"needsFed":50,"latitude":41.826749257785906,"longitude":-71.41347169876099},{"id":11,"needsFed":50,"latitude":41.82677187035059,"longitude":-71.41339391469955},{"id":12,"needsFed":50,"latitude":41.826824161875834,"longitude":-71.41325443983078},{"id":13,"needsFed":50,"latitude":41.826866560378484,"longitude":-71.41315385699272},{"id":14,"needsFed":50,"latitude":41.826907545570975,"longitude":-71.41303583979607},{"id":15,"needsFed":50,"latitude":41.82694287761245,"longitude":-71.41294464468956},{"id":16,"needsFed":50,"latitude":41.826971143231575,"longitude":-71.41283199191093},{"id":17,"needsFed":50,"latitude":41.82700788851776,"longitude":-71.41270726919174},{"id":18,"needsFed":50,"latitude":41.82704322050384,"longitude":-71.41259327530861},{"id":19,"needsFed":50,"latitude":41.82706441968614,"longitude":-71.412483304739},{"id":20,"needsFed":50,"latitude":41.82713932336417,"longitude":-71.41208902001381},{"id":21,"needsFed":50,"latitude":41.827154869408524,"longitude":-71.41159012913704},{"id":22,"needsFed":50,"latitude":41.827154869408524,"longitude":-71.41149625182152},{"id":23,"needsFed":50,"latitude":41.82713649681027,"longitude":-71.41136884689331},{"id":24,"needsFed":50,"latitude":41.827125190593314,"longitude":-71.41125351190567},{"id":25,"needsFed":50,"latitude":41.827106817986504,"longitude":-71.41113013029099},{"id":26,"needsFed":50,"latitude":41.8270912719305,"longitude":-71.41100943088531},{"id":27,"needsFed":50,"latitude":41.82707007275708,"longitude":-71.41088604927063},{"id":28,"needsFed":50,"latitude":41.82703756734425,"longitude":-71.41078278422356},{"id":29,"needsFed":50,"latitude":41.82692874479821,"longitude":-71.41002237796783},{"id":30,"needsFed":50,"latitude":41.8268849330542,"longitude":-71.40997275710106},{"id":32,"needsFed":50,"latitude":41.82682274859194,"longitude":-71.4099271595478},{"id":33,"needsFed":50,"latitude":41.826749257785906,"longitude":-71.40986949205399},{"id":34,"needsFed":50,"latitude":41.82670120605946,"longitude":-71.40984132885933},{"id":35,"needsFed":50,"latitude":41.82611186287656,"longitude":-71.40938803553581},{"id":36,"needsFed":50,"latitude":41.825856055135596,"longitude":-71.40904873609543},{"id":37,"needsFed":50,"latitude":41.82559176650654,"longitude":-71.40872955322266},{"id":38,"needsFed":50,"latitude":41.82566397614512,"longitude":-71.40881487037416},{"id":39,"needsFed":50,"latitude":41.82571994032161,"longitude":-71.4088869414851},{"id":40,"needsFed":50,"latitude":41.82578190060281,"longitude":-71.40897039224512},{"id":41,"needsFed":50,"latitude":41.825915814554094,"longitude":-71.4091524666307},{"id":42,"needsFed":50,"latitude":41.82598377078044,"longitude":-71.40922074452533},{"id":43,"needsFed":50,"latitude":41.82604573080631,"longitude":-71.4092890224199},{"id":44,"needsFed":50,"latitude":41.82617164938379,"longitude":-71.40945971715638},{"id":45,"needsFed":50,"latitude":41.826229611820345,"longitude":-71.40954696113278},{"id":46,"needsFed":50,"latitude":41.82629556901192,"longitude":-71.40962282546008},{"id":47,"needsFed":50,"latitude":41.826961133233475,"longitude":-71.41065078721101},{"id":48,"needsFed":50,"latitude":41.825054363196855,"longitude":-71.40835209797388},{"id":49,"needsFed":50,"latitude":41.82494842986308,"longitude":-71.40829140651203},{"id":50,"needsFed":50,"latitude":41.824846493848106,"longitude":-71.40824588791565},{"id":51,"needsFed":50,"latitude":41.82474255892065,"longitude":-71.4081586439392},{"id":52,"needsFed":50,"latitude":41.824642621331286,"longitude":-71.40810933212646},{"id":53,"needsFed":50,"latitude":41.82453268980282,"longitude":-71.40806381353008},{"id":54,"needsFed":50,"latitude":41.82672728713328,"longitude":-71.41368561300743},{"id":55,"needsFed":50,"latitude":41.8268751898942,"longitude":-71.4136457842356},{"id":56,"needsFed":50,"latitude":41.826940147079874,"longitude":-71.41367423335834},{"id":57,"needsFed":50,"latitude":41.82685520305458,"longitude":-71.41390751616484},{"id":58,"needsFed":50,"latitude":41.82664134348008,"longitude":-71.4138297552293},{"id":59,"needsFed":50,"latitude":41.82662235591325,"longitude":-71.41391510259757},{"id":60,"needsFed":50,"latitude":41.826633348715774,"longitude":-71.41400613979033},{"id":61,"needsFed":50,"latitude":41.8266553343152,"longitude":-71.41409907359133},{"id":62,"needsFed":50,"latitude":41.82669430876835,"longitude":-71.41417304131045},{"id":63,"needsFed":50,"latitude":41.82675626810658,"longitude":-71.4142318361641},{"id":64,"needsFed":50,"latitude":41.82681423001386,"longitude":-71.41426597511139},{"id":65,"needsFed":50,"latitude":41.82687019318489,"longitude":-71.41426976832776},{"id":66,"needsFed":50,"latitude":41.82695113982787,"longitude":-71.41420907686592},{"id":67,"needsFed":50,"latitude":41.827005104199664,"longitude":-71.41414459218771},{"id":68,"needsFed":50,"latitude":41.82704907513562,"longitude":-71.41407631429308},{"id":69,"needsFed":50,"latitude":41.82706706323708,"longitude":-71.41399665674942},{"id":70,"needsFed":50,"latitude":41.82707289931394,"longitude":-71.41389816999435},{"id":71,"needsFed":50,"latitude":41.82704604701877,"longitude":-71.41380965709686},{"id":72,"needsFed":50,"latitude":41.82700082207508,"longitude":-71.41373589634895},{"id":73,"needsFed":50,"latitude":41.82640196547092,"longitude":-71.40972599387169},{"id":74,"needsFed":50,"latitude":41.82717220567953,"longitude":-71.41173496842384},{"id":75,"needsFed":50,"latitude":41.82716937912705,"longitude":-71.4118529856205},{"id":76,"needsFed":50,"latitude":41.827160899468886,"longitude":-71.41199111938477}]';
    var speakerObj = JSON.parse(speakerJSON);
    for (i=0, len=speakerObj.length; i<len; i++)
    {
        Speaker.create({volumeUp:0,volumeDown:0,latitude:speakerObj[i].latitude,longitude:speakerObj[i].longitude});
    }

	Song.create({title: "Thrift Shop", artist: "Macklemore", playlength:"4.0", album : "who knows"});
});

// export for use in other modules
exports.Song = Song;
exports.Location = Location;
exports.FeedFire = FeedFire;
exports.Volume = Volume;
exports.Speaker = Speaker;
exports.Fire = Fire;
