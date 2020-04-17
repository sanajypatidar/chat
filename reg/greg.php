

<?php
$num = $_POST['num'];
$name = $_POST['name'];
$admin = $_POST['admin'];
$uid = $_POST['uid'];

  include('connection.php');

$outp=array();

 
  $q="INSERT INTO `e_group` (`id`, `name`, `photo`, `userstatus`, `window_status`, `device_id`, `del`, `num`,`admin`,`uid`) VALUES (NULL, '$name', '', '', '', '', '0', '$num','$admin','$uid');";


if (mysqli_query($conn, $q)) {
    $last_id = mysqli_insert_id($conn);
$co = ','.$last_id;
//$que = "UPDATE `employee` SET `u_g`= concat(u_g, '$co') WHERE `employee`.`num` = ".$admin;
$ch = "INSERT INTO `group_chat` (`id`, `send_id`, `rcv_id`,  `message`, `isread`, `deliver`, `type`, `del`) VALUES (NULL, '0', '$last_id',  'New Group Created', '', '', 'msg', '');";
 array_push($outp,array('status'=>'Registered',
'number'=>$num,
'name'=>$name,
'g_id'=>$last_id ));
//echo $que;
mysqli_query($conn, $ch);     
$ary = explode(",",$num);
for($i=0;$i<count($ary);$i++)
{
$que = "UPDATE `employee` SET `u_g`= concat(u_g, '$co') WHERE `employee`.`num` = ".$ary[$i];
mysqli_query($conn, $que);     
}

   echo json_encode(array("result"=>$outp));

 }

else
 {
  //while($row = mysqli_fetch_assoc($result)) {
 array_push($outp,array('id'=>'',
'number'=>'',
'name'=>'',
'status'=>'invalid'
                                                
                                ));
    

                   echo json_encode(array("result"=>$outp));

}

?>

