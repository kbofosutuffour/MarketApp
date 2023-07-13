<?php
    $username = $_POST['username'];
    $pass = $_POST['password'];

    //Database connection
    $conn = new mysqli('localhost', 'root', '', 'h2h');
    if ($conn->connect_error) {
        die('Connection Failed ');
    } else {
        $smst = $conn->prepare("INSERT INTO registration(username, password) VALUES (?,?)");
        $smst->bind_param("ss", $username, $pass);
        $smst->execute();
        echo "Registration Successful!";
        $smst->close();
        $conn->close();
    }
?>