<?php

namespace MyNamespace;
class Users
{
    private $designs;
    private $users;
    private $usersPerDesign;

    public function __construct(array $designs)
    {
        $this->designs = $designs;
        $this->users = [];
        $this->usersPerDesign = [];
    }

    public function addUser($userId)
    {
        // Assign each user to a design based on the split percentages
        $designId = $this->chooseDesign();

        // Check if the maximum number of users for this design has been reached
        $maxUsers = $this->designs[$designId - 1]['splitPercent'];
        $currentUsers = isset($this->usersPerDesign[$designId]) ? $this->usersPerDesign[$designId] : 0;

        if ($currentUsers < $maxUsers) {
            $this->users[] = ['userId' => $userId, 'designId' => $designId];
            $this->usersPerDesign[$designId] = $currentUsers + 1;
        } else {
            // Retry assignment for users exceeding the maximum limit
            $this->addUser($userId);
        }
    }

    private function chooseDesign(): int
    {
        $randomNumber = mt_rand(1, 100);
        $cumulativePercent = 0;

        foreach ($this->designs as $design) {
            $cumulativePercent += $design['splitPercent'];
            if ($randomNumber <= $cumulativePercent) {
                return $design['designId'];
            }
        }

        // Fallback: return the first design if none are selected
        return $this->designs[0]['designId'];
    }

    public function getUsers(): array
    {
        return $this->users;
    }
}