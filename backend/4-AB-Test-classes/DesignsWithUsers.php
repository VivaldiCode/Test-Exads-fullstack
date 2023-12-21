<?php
namespace MyNamespace;

class DesignsWithUsers
{
    private $designs;
    private $users;

    public function __construct(array $designs, array $users)
    {
        $this->designs = $designs;
        $this->users = $users;
    }

    public function getDesignsWithUsers(): array
    {
        $result = [];

        foreach ($this->designs as $design) {
            $designId = $design['designId'];
            $designName = $design['designName'];
            $splitPercent = $design['splitPercent'];

            $designUsers = array_filter($this->users, function ($user) use ($designId) {
                return $user['designId'] === $designId;
            });

            $result[] = [
                'designId' => $designId,
                'designName' => $designName,
                'splitPercent' => $splitPercent,
                'users' => $designUsers,
            ];
        }

        return $result;
    }
}