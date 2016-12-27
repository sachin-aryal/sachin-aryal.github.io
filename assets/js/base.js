/**
 * Created by iam on 12/6/16.
 */

var polyXPoints = [],polyYPoints=[];

var styles = [

    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color:  'rgb(12, 231, 216)',
            width: 1
        })
    }),
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 2,
            fill: new ol.style.Fill({
                color: 'orange'
            })
        })
    })
];

var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM({
                "url" : "http://tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
            })
        }),
        new ol.layer.Vector({
            source: new ol.source.Vector({
                url: 'data/geojson/countries.geojson',
                format: new ol.format.GeoJSON()
            })
        })
    ],
    target: 'basicMap',
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }),
    view: new ol.View({
       //center: ol.proj.transform([85.32247, 27.68248], 'EPSG:4326', 'EPSG:900913'),//default
		 center: ol.proj.transform([85.3398418, 27.7095784], 'EPSG:4326', 'EPSG:900913'),//DEERWALK
        zoom: 18,
        projection: 'EPSG:3857'
    })

});

var vectorSource = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
    source:vectorSource,
    style: styles
});
map.addLayer(vectorLayer);


var startDraw = document.getElementById('drawPoly');
var resetDraw = document.getElementById('resetMap');
startDraw.addEventListener('click', function(e) {
    
    var first=0;
    map.once('postcompose', function(event) {
        var canvas = event.context.canvas;
        var destiCanvas = document.getElementById("destinationCanvas");
        destiCanvas.width = canvas.width;
        destiCanvas.height = canvas.height;
        var destiContext = destiCanvas.getContext("2d");
        destiContext.drawImage(canvas, 0, 0);

        $(".ol-unselectable").attr("id","sourceCanvas");
        $("#sourceCanvas").addClass("hide");
        $("#destinationCanvas").removeClass("hide");

        $("#destinationCanvas").on("mousedown",function(e){
            if(first==0){
                destiContext.clearRect(0, 0, canvas.width, canvas.height);
                destiContext.drawImage(canvas, 0, 0);
                first++;
            }
            var offset = $(this).offset();
            var x =e.pageX - offset.left;
            var y = e.pageY - offset.top;
            destiContext.fillStyle = "#000000";
            destiContext.beginPath();
            destiContext.arc( x, y, 2, 0, 2*Math.PI);
            destiContext.fill();
            polyXPoints.push(Math.round(x));
            polyYPoints.push(Math.round(y));
            var polyLength = polyXPoints.length;
            if(polyXPoints.length>=2){
                destiContext.beginPath();
                destiContext.moveTo(polyXPoints[polyLength-2],polyYPoints[polyLength-2]);
                destiContext.lineTo(polyXPoints[polyLength-1],polyYPoints[polyLength-1]);
                destiContext.stroke();
            }
        });

    });
    map.renderSync();
}, false);

resetDraw.addEventListener('click', function(e) {
    $("#destinationCanvas").addClass("hide");
    $("#sourceCanvas").removeClass("hide");
    polyXPoints=[];
    polyYPoints=[];
});


function uploadImageData(){
    startProcess(polyXPoints,polyYPoints);
    disposeAllVariable();
    polyXPoints = [];
    polyYPoints=[];
}