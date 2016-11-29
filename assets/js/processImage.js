/**
 * Created by sachin on 11/8/2016.
 */

var pixelToMeter = 0.3679;

function startProcess(polyXPoints,polyYPoints){

    var polygonPoints = [];
    for(var k=0;k<polyXPoints.length;k++){
        var poly =[];
        poly.push(polyXPoints[k]);
        poly.push(polyYPoints[k]);
        polygonPoints.push(poly);
    }

    var canvas = document.getElementById("destinationCanvas");
    var canvasContext = canvas.getContext('2d');

    var imgPixels = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    var pCount = 0;
    var neighBorPixels = [];
    neighBorPixels.push([-1,-1]);
    neighBorPixels.push([0,-1]);
    neighBorPixels.push([1,-1]);
    neighBorPixels.push([-1,1]);
    neighBorPixels.push([1,0]);
    neighBorPixels.push([-1,1]);
    neighBorPixels.push([0,1]);
    neighBorPixels.push([1,1]);

    for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
            var point = [x,y];
            if(inside(point,polygonPoints)){
                var i = (y * 4) * imgPixels.width + x * 4;
                var avg = Math.round((imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3);
                console.log(avg);
                if(avg==239){
                    var goodNeighbor = true;
                    for(var n=0;n<neighBorPixels.length;n++){
                        var newX = x+neighBorPixels[n][0];
                        var newY = y+neighBorPixels[n][1];
                        var j = (newY * 4) * imgPixels.width + newX * 4;
                        avg = Math.round((imgPixels.data[j] + imgPixels.data[j + 1] + imgPixels.data[j + 2]) / 3);
                        if(avg!=239){
                            goodNeighbor = false;
                            break;
                        }
                    }
                    if(goodNeighbor){
                        pCount++;
                    }
                }
            }
        }
    }
    $("#resultRow").show();
    displayResult(pCount*pixelToMeter);
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    $("#originalImage").attr("src",canvas.toDataURL("image/png"))
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}



function displayResult(area){
    $("#totalArea").val(area);
    $( "#slider-3" ).slider({
        range:true,
        min: 0,
        max: 100,
        slide: function( event, ui ) {
            $( "#usage" ).val(ui.values[1]);
            changeVals(area);
        }
    });
}

function changeVals(area){
    var area = area
    var use = $("#usage").val();
    var actualArea = area*(use/100);
    $("#usageAreaIs").val(actualArea.toFixed(2));
    var energy = actualArea*0.1;
    var monthWise = [4.26,5.15,6.18,6.76,6.68,5.75,4.79,4.80,4.56,5.13,4.72,4.15];
    for(var i=0;i<monthWise.length;i++){
        $("input[id='"+i+"'").val((monthWise[i]*energy).toFixed(2))
    }
}
