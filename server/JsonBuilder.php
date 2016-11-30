<?php
/**
 * Created by IntelliJ IDEA.
 * User: iam
 * Date: 11/26/16
 * Time: 3:09 PM
 */
$fData = json_decode(file_get_contents("rtse.json"),true);

$lat = $_POST["lat"];
$lng = $_POST["lng"];
$area = $_POST["area"];

if($lat && $lng && $area){
    end($fData);
    $key = key($fData);
    $fData[++$key] = array("lat"=>$lat,"lng"=>$lng,"area"=>$area);
    file_put_contents("rtse.json",json_encode($fData));
}



