

<?php
$id = $_POST['id'];
//$name = $_POST['name'];
//$admin = $_POST['admin'];

  include('connection.php');

$outp=array();

 
  $q="SELECT * FROM `employee` WHERE id = ".$id;

$result = mysqli_query($conn, $q);
 if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
               
$groups= $row["u_g"];

//echo $groups;
$ary = explode(",",$groups);

for($i=1;$i<count($ary);$i++)
{
$que = "SELECT * FROM `e_group` WHERE id = ".$ary[$i];

//echo $que;
$res =  mysqli_query($conn, $que);     
 if (mysqli_num_rows($res) > 0) {
            while($grp = mysqli_fetch_assoc($res)) {
//echo $grp["name"];
 array_push($outp,array('id'=>$ary[$i],

'name'=>$grp["name"]
 ));


}

}

}



            }
         }

////////////////////////////////////////////////////////////






                   echo json_encode(array("result"=>$outp));


?>

