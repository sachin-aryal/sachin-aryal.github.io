function writeResult(){
    let result = jQuery("#schema-code");
    result.val("");
    let buildTA = "<script type='application/ld+json'>\n{\n  \"@context\": \"http://www.schema.org\",";

    if(jQuery("#type").val() != ""){
        buildTA += "\n  \"@type\": \""+jQuery("#type").val().replace(/ /g,"")+"\",";
    }

    if(jQuery("#name").val() !== ""){
        buildTA += "\n  \"name\": \""+jQuery("#name").val()+"\",";
    }

    if(jQuery("#description").val() != ""){
        buildTA += "\n  \"description\": \""+jQuery("#description").val()+"\",";
    }

    if(jQuery("#telephone").val() != ""){
        buildTA += "\n  \"telephone\": \""+jQuery("#telephone").val()+"\",";
    }
    if(jQuery("#url").val() != ""){
        buildTA += "\n  \"url\": \""+jQuery("#url").val()+"\",";
    }

    if(jQuery("#pricerange").val() != ""){
        buildTA += "\n  \"pricerange\": \""+jQuery("#pricerange").val()+"\",";
    }

    if(jQuery("#image").val() != ""){
        buildTA += "\n  \"image\": \""+jQuery("#image").val()+"\",";
    }
    //address
    if(jQuery("#addressLocality").val() != "" || jQuery("#addressRegion").val() != "" || jQuery("#postalCode").val() != "" || jQuery("#streetAddress").val() != ""){


        buildTA += "\n  \"address\": {\n     \"@type\": \"PostalAddress\",";
        addressFields = "";
        if(jQuery("#streetAddress").val() != ""){
            addressFields += "\n     \"streetAddress\": \""+jQuery("#streetAddress").val()+"\",";
        }
        if(jQuery("#addressLocality") && jQuery("#addressLocality").val() != ""){
            addressFields += "\n     \"addressLocality\": \""+jQuery("#addressLocality").val()+"\",";
        }
        if(jQuery("#addressRegion").val() != ""){
            addressFields += "\n     \"addressRegion\": \""+jQuery("#addressRegion").val()+"\",";
        }
        if(jQuery("#postalCode").val() != ""){
            addressFields += "\n     \"postalCode\": \""+jQuery("#postalCode").val()+"\",";
        }
        buildTA += addressFields.substring(0, addressFields.length-1)+"\n  },";
    }//end address
    //longitude, latitude
    if(jQuery("#longitude").val() != "" || jQuery("#latitude").val() != ""){
        buildTA += "\n  \"geo\": {\n     \"@type\": \"GeoCoordinates\",";
        geoFields = "";
        if(jQuery("#latitude").val() != ""){
            geoFields += "\n     \"latitude\": \""+jQuery("#latitude").val()+"\",";
        }
        if(jQuery("#longitude").val() != ""){
            geoFields += "\n     \"longitude\": \""+jQuery("#longitude").val()+"\",";
        }
        buildTA += geoFields.substring(0, geoFields.length-1)+"\n  },";
    }//end longitude, latitude

    //same URL fields
    if(jQuery("#sameAs").val() != ""){
        buildTA += "\n  \"sameAs\": [";
        sameAsFields = "";
        let sameAsVal = jQuery("#sameAs").val().split("\n");
        jQuery.each(sameAsVal, function(){
            sameAsFields += "\n     \""+this+"\",";
        });
        buildTA += sameAsFields.substring(0, sameAsFields.length-1)+"\n  ],";
    }//end same URL fields

    // Has Google Map Link
    if(jQuery("#hasMap").val() != ""){
        buildTA += "\n  \"hasMap\": \""+jQuery("#hasMap").val()+"\",";
    }


    // OpeningHours Specification
    if(jQuery("#openingHours").val() != ""){
        try{
            let tempbuildTA = "";
            let openingHoursVal = jQuery("#openingHours").val();
            openingHoursVal = openingHoursVal.split("\n");
            tempbuildTA += "\n  \"openingHoursSpecification\": [\n";
            let openingHoursData = new Map();
            for(let i=0;i<openingHoursVal.length;i++){
                let str = openingHoursVal[i].split(':');
                let dayName = str.shift();
                let openingHoursStr = str.join(':').trim();
                if(openingHoursData.has(openingHoursStr)){
                    let previousData = openingHoursData.get(openingHoursStr);
                    previousData.push(dayName);
                    openingHoursData.set(openingHoursStr, previousData);
                }else{
                    openingHoursData.set(openingHoursStr, [dayName]);
                }
            }
            let openingHoursFields = "";
            for (const [time, dayList] of openingHoursData.entries()) {
                openingHoursFields += '\t{\n\t"@type": "OpeningHoursSpecification",';
                openingHoursFields += "\n\t\"dayOfWeek\": [\n";
                $.each(dayList, function () {
                    openingHoursFields += '\t\t"'+this+'",\n';
                });
                openingHoursFields = openingHoursFields.substring(0, openingHoursFields.length-2)+"\n";
                openingHoursFields += "\t],";
                let splitTime = time.split("–");
                openingHoursFields += '\n\t"opens": "'+splitTime[0].trim()+'",';
                openingHoursFields+= '\n\t"closes": "'+splitTime[1].trim()+'"';
                openingHoursFields += "\n\t},\n";
            }
            tempbuildTA += openingHoursFields.substring(0, openingHoursFields.length-2)+"\n  ],";
            buildTA += tempbuildTA;
        }catch (e) {

        }
    }
    buildTA = buildCustomFieldsCode(buildTA);
    buildTA = buildTA.substring(0, buildTA.length-1);
    buildTA += "\n}\n<\/script>";
    result.val(buildTA);
}

function buildCustomFieldsCode(buildTA) {
    $.each($(".code-field-custom"), function () {
        if($(this).val() !== "")
            buildTA += "\n  \""+$(this).attr('name')+"\": \""+$(this).val()+"\",";
    });
    return buildTA;
}

function copyToClipBoard() {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val($("#schema-code").val()).select();
    document.execCommand("copy");
    $temp.remove();
}

function removeField(id) {
    if($("#"+id).length !== 0){
        $("#"+id).remove();
    }
    $("#name").click();
}

function createNewField(){
    let val = $("#fieldName").val();
    if(val && val !== ""){
        if($("#"+val).length !== 0){
            alert("Field Already Exist.");
            return;
        }
        let newField = $("<div class='row' id='"+val+"_dynamic_div'>" +
            "<div class=\"form-group col-8\">\n" +
            "                        <label for=\""+val+"\">"+val.toUpperCase()+"</label>\n" +
            "                        <input name=\""+val+"\" id=\""+val+"\" class=\"form-control code-fields code-field-custom\"/>\n" +
            "                    </div>" +
            "<div class='col-4 form-group'>" +
            "<label style='visibility: hidden'>Remove Button</label>" +
            '<button id="remove-button" class=\'btn btn-danger form-control\' onclick=\'removeField("'+val+'_dynamic_div")\'>Remove</button>' +
            "</div></div>");
        $(".field-div").append(newField);
        $("#"+val).focus();
        $("#fieldName").val("")
    }
}

function clearAllData(){
    $.each($(".code-fields"), function () {
        $(this).val("");
    });
    $("#autocomplete").val("");
    $("#name").click();
    $("#type").val("Dentist");
}

$(function () {
    let toolTip = $("button.my-tool-tip");
    toolTip.tooltip();
    toolTip.click(function(){
        toolTip.attr('data-original-title', 'Copied');
        toolTip.tooltip('show');
    });
    toolTip.mouseleave(function() {
        toolTip.attr('data-original-title', 'Copy to Clipboard');
        toolTip.tooltip('hide');
    });
});

function writeToField(id, value) {
    if(value && value !== ""){
        if($("#"+id)){
            try{
                $("#"+id).val(value.replace(/undefined/g,""));
            }catch (e) {
                $("#"+id).val(value);
            }
        }
    }
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    try{
        writeToField("name", place.name);
        // Get each component of the address from the place details,
        // and then fill-in the corresponding field on the form.
        let addressData = {};
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                addressData[addressType] = val;
            }
        }
        writeToField("addressLocality",  addressData["locality"]);
        writeToField("addressRegion",  addressData["administrative_area_level_1"]);
        writeToField("postalCode",  addressData["postal_code"]);
        writeToField("streetAddress",  addressData["street_number"] +" "+ addressData["route"]+ " "+addressData["subpremise"]);
        writeToField("telephone",  place.international_phone_number);
        writeToField("url",  place.website);
        // let photos = place.photos;
        // if(photos){
        //     writeToField("image",  photos[0].getUrl());
        // }
        writeToField("latitude",  place.geometry.location.lat());
        writeToField("longitude",  place.geometry.location.lng());
        writeToField("hasMap",  place.url);
        let openingHours = place.opening_hours;
        if(openingHours){
            openingHours = openingHours.weekday_text;
            let openingHoursText = openingHours.filter(function(el) {
                return el.indexOf("Closed") === -1;
            }).join('\n');
            writeToField("openingHours",  openingHoursText);
        }
    }catch (e) {

    }
    $("#name").click();

}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle(
                {center: geolocation, radius: position.coords.accuracy});
            autocomplete.setBounds(circle.getBounds());
        });
    }
}