<?php

namespace MyNamespace;
require __DIR__ . '/vendor/autoload.php';

include('4-AB-Test-classes/Users.php');
include('4-AB-Test-classes/DesignsWithUsers.php');

use Exads\ABTestData;


class ABTest
{
    private $designs;

    public function getData(int $promoId): array
    {
        $abTest = new ABTestData($promoId);
        $designs = $abTest->getAllDesigns();
        return $designs;
    }

    public function userRedirects()
    {
        $promoId = 1;
        $designs = $this->getData($promoId);
        $this->designs = $designs;
        $usersInstance = new Users($designs);

        for ($i = 0; $i < 100; $i++) {
            $usersInstance->addUser($i);
        }

        return $usersInstance->getUsers();
    }

    public function userPerDesign()
    {
        $assignedUsers = $this->userRedirects();

        $designsWithUsersInstance = new DesignsWithUsers($this->designs, $assignedUsers);

        // Get the array of designs with associated users
        $designsWithUsers = $designsWithUsersInstance->getDesignsWithUsers();

        // Output the result
        return $designsWithUsers;
    }
}

// Create an instance of MyClass
$myClassInstance = new ABTest;

$userRedirects = $myClassInstance->userPerDesign();

echo json_encode($userRedirects);
