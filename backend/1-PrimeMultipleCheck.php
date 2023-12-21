<?php

function checkPrime($num)
{
    if ($num == 1)
        return false;
    for ($i = 2; $i <= $num / 2; $i++) {
        if ($num % $i == 0)
            return false;
    }
    return true;
}

for ($i = 1; $i <= 100; $i++) {
    echo $i . " [";


    if (checkPrime($i)) {
        echo "PRIME";
    }else{
        $multiples = array();
        for ($j = 1; $j <= $i; $j++) {
            if ($i % $j == 0) {
                $multiples[] = $j;
            }
        }
        echo implode(", ", $multiples);
    }

    echo "]\n";
}

?>
