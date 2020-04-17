

<?php
$did = $_POST['did'];
$num = $_POST['num'];
$name = $_POST['name'];


  include('connection.php');

$outp=array();

 
 $q="INSERT INTO `employee` (`id`, `name`, `photo`, `userstatus`, `window_status`, `device_id`, `del`, `num`) VALUES (NULL, '$name', '', '', '', '$did', '0', '$num');";


if (mysqli_query($conn, $q)) {
    $last_id = mysqli_insert_id($conn);

 array_push($outp,array('status'=>'Registered',
'number'=>$num,
'name'=>$name,
'id'=>$last_id ));

     

   echo json_encode(array("result"=>$outp));

 }

else
{
$sql = "SELECT * FROM `employee` WHERE `num`='$num'";
$result = mysqli_query($conn, $sql);
$outp=array();

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
 array_push($outp,array('id'=>$row["id"],
'number'=>$row["num"],
'name'=>$row["name"],
'status'=>'Already Registered'
                                                
                                ));
    
  

  }

                   echo json_encode(array("result"=>$outp));

}else
 {
  //while($row = mysqli_fetch_assoc($result)) {
 array_push($outp,array('id'=>'',
'number'=>'',
'name'=>'',
'status'=>'invalid'
                                                
                                ));
    

                   echo json_encode(array("result"=>$outp));

}

}
?>

