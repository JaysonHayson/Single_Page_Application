<?php

    /**
    * createNewSession
    * Creates New Session Token for current Logged in User.
    * 
    * @param  string   $UserName     Username to create a session for.
    * @return string   new USER Session Token
    */
    function createNewSessionToken($UserName){
        $magicString = base64_encode(
            $UserName.
            time().
            random_bytes(10)
        );
        return $magicString;

    }

?>