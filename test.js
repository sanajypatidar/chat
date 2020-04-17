var str = "https://udtalks.sgp1.digitaloceanspaces.com/IMG_20190403_231229.jpg";
var string_parts = str.split("/");
var thumb = string_parts[0]+"//"+string_parts[2]+"/t_"+string_parts[3];

console.log(thumb);
